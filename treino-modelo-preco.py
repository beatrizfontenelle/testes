# Treino do modelo de preço do PokeIdle (monitor 2.11.37+). Roda toda noite.
# Uso: python3 treino-modelo-preco.py HISTORICO.txt ESPECIES.csv MODELO_ANTERIOR.json SAIDA.json
# 1) lê as vendas guardadas (seção "Vendas guardadas" do historico.txt da principal)
# 2) limpa a base: marca como "suja" a venda muito fora das parecidas (menos de 1/4 ou mais de 4x a mediana de 5+ vizinhas)
#    e, sem vizinhas, muito fora do que o modelo prevê sem ver a própria venda (5 dobras)
# 3) treina o LightGBM (log do preço; nível, nota, P, qualidade, IV, TM, espécie, forma base, linha de evolução, estágio, geração, lendário)
# 4) confere a estabilidade contra o modelo de ontem; se mudou demais, mantém o de ontem e só registra
# 5) grava o JSON que o monitor lê (árvores + tabelas por espécie + ids das vendas sujas)
import sys, json, math, re, datetime, warnings
import numpy as np, pandas as pd, lightgbm as lgb
warnings.filterwarnings('ignore')

HIST, ESPECIES, ANTERIOR, SAIDA = sys.argv[1:5]
MIN_ESPECIE = 40          # o bot só usa o modelo para espécie com 40+ vendas limpas
ESTAVEL_TIPICO = 0.15     # mudança típica aceita de um dia para o outro (15%)
ESTAVEL_2X = 0.03         # no máximo 3% dos preços mudando mais de 2x

# ---------- 1) vendas ----------
H = open(HIST, encoding='utf-8').read().split('\n')
i = [k for k, l in enumerate(H) if l.startswith('## Vendas guardadas')][0]
rows = []
for l in H[i + 1:]:
    if l.startswith('## '): break
    r = l.strip().split(',')
    if len(r) >= 13: rows.append(r[:13])
df = pd.DataFrame(rows, columns=['id', 'min', 'esp', 'lv', 'nota', 'iv', 'q', 'p', 'shiny', 'tm', 'g', 'transf', 'pid'])
for c in ['id', 'min', 'lv', 'nota', 'iv', 'q', 'p', 'shiny', 'tm', 'g', 'transf']: df[c] = pd.to_numeric(df[c], errors='coerce')
df = df.dropna(subset=['id', 'min', 'lv', 'g'])
df['nota'] /= 1000; df['q'] /= 1000; df['g'] /= 100
PREF = r'^(Brave|Furious|Enraged|Toxic|Tribal|Freezing|Psy|Magma|Brute|Hard|Mega|Alolan|Galarian|Hisuian|Shadow|Dark|Ancient|Royal|Crystal|Golden|Frozen|Burning|Electric|Wild|Savage|Mighty|Charged)\s+'
df['base'] = df['esp'].str.replace(PREF, '', regex=True).str.replace(r'\s+[XY]$', '', regex=True)
df['variante'] = df['esp'] != df['base']
d = df[(df.transf == 0) & (df.g > 0) & (df.shiny == 0)].copy().sort_values('min').reset_index(drop=True)
d['lp'] = np.log(d.g); d['llv'] = np.log(d.lv.clip(lower=1)); d['grp'] = np.where(d.p >= 4, d.p, 0)

# ---------- linha de evolução (PokeAPI) ----------
sp = pd.read_csv(ESPECIES)
norm = lambda s: re.sub(r'[^a-z0-9]', '', str(s).lower().replace('♀', 'f').replace('♂', 'm'))
sp['k'] = sp.identifier.map(norm); mapa = dict(zip(sp.k, sp.id)); info = sp.set_index('id')
def achar(nome):
    if norm(nome) in mapa: return mapa[norm(nome)]
    for w in re.split(r'[\s\-]+', nome)[::-1]:
        if norm(w) in mapa: return mapa[norm(w)]
    return None
def estagio(i):
    s = 1
    while not pd.isna(info.loc[i, 'evolves_from_species_id']): i = int(info.loc[i, 'evolves_from_species_id']); s += 1
    return s
evo = {}
for b in d.base.unique():
    s = achar(b)
    if s is None: evo[b] = (-1, 0, 0, 0)
    else: evo[b] = (int(info.loc[s, 'evolution_chain_id']), estagio(int(s)), int(info.loc[s, 'generation_id']), int(bool(info.loc[s, 'is_legendary']) or bool(info.loc[s, 'is_mythical'])))
d['cadeia'] = d.base.map(lambda b: evo[b][0]); d['estagio'] = d.base.map(lambda b: evo[b][1])
d['geracao'] = d.base.map(lambda b: evo[b][2]); d['lendario'] = d.base.map(lambda b: evo[b][3]); d['cad_c'] = d.cadeia.astype(str)

# ---------- preparação e treino ----------
FEAT = ['llv', 'nota', 'p', 'q', 'iv', 'tm', 'var', 'esp_med', 'esp_n', 'base_med', 'esp_c', 'base_c', 'cad_med', 'cad_n', 'estagio', 'geracao', 'lendario', 'cad_c']
MONO = [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
CATS = ['esp_c', 'base_c', 'cad_c']
def tabelas(tr):
    g = tr.lp.median()
    def suav(col, k=10):
        s = tr.groupby(col).lp.agg(['median', 'count']); return ((s['median'] * s['count'] + g * k) / (s['count'] + k)), s['count']
    em, en = suav('esp'); bm, bn = suav('base'); cm, cn = suav('cadeia')
    return dict(g=g, em=em, en=en, bm=bm, cm=cm, cn=cn, ce=sorted(tr.esp.unique()), cb=sorted(tr.base.unique()), cc=sorted(tr.cad_c.unique()))
def matriz(t, T):
    g = T['g']
    return pd.DataFrame({'llv': t.llv, 'nota': t.nota, 'p': t.p, 'q': t.q, 'iv': t.iv, 'tm': (t.tm > 0) * 1, 'var': t.variante * 1,
        'esp_med': t.esp.map(T['em']).fillna(t.base.map(T['bm'])).fillna(t.cadeia.map(T['cm'])).fillna(g), 'esp_n': t.esp.map(T['en']).fillna(0),
        'base_med': t.base.map(T['bm']).fillna(t.cadeia.map(T['cm'])).fillna(g),
        'esp_c': t.esp.astype(pd.CategoricalDtype(T['ce'])), 'base_c': t.base.astype(pd.CategoricalDtype(T['cb'])),
        'cad_med': t.cadeia.map(T['cm']).fillna(g), 'cad_n': t.cadeia.map(T['cn']).fillna(0), 'estagio': t.estagio, 'geracao': t.geracao, 'lendario': t.lendario,
        'cad_c': t.cad_c.astype(pd.CategoricalDtype(T['cc']))})[FEAT]
def treinar(tr, n=600):
    T = tabelas(tr)
    m = lgb.LGBMRegressor(objective='huber', alpha=0.7, n_estimators=n, learning_rate=0.05, num_leaves=31, min_child_samples=10, monotone_constraints=MONO,
        monotone_constraints_method='advanced', subsample=0.8, subsample_freq=1, colsample_bytree=0.9, verbose=-1, cat_smooth=10, min_data_per_group=5, random_state=7)
    m.fit(matriz(tr, T), tr.lp.values, categorical_feature=CATS)
    return m, T

# ---------- 2) limpeza ----------
ref = np.full(len(d), np.nan)
for esp, t in d.groupby('esp'):
    L = t.llv.values; N = t.nota.values; G = t.grp.values; TM = (t.tm.values > 0); P = t.lp.values; idx = t.index.values
    for k in range(len(t)):
        m = (G == G[k]) & (np.abs(L - L[k]) <= 0.3) & (np.abs(N - N[k]) <= 0.3) & (TM == TM[k]); m[k] = False
        if m.sum() >= 5: ref[idx[k]] = np.median(P[m])
d['ref'] = ref
r = d.lp - d.ref
d['suja'] = (r < math.log(0.25)) | (r > math.log(4))
semviz = d.ref.isna()
pred = np.full(len(d), np.nan); dob = np.arange(len(d)) % 5
for k in range(5):
    tr = d[(dob != k) & ~d.suja]; te = d[dob == k]
    m, T = treinar(tr, 300); pred[te.index] = m.predict(matriz(te, T))
res = d.lp - pred
d['suja'] = d.suja | (semviz & ((res > math.log(4)) | (res < math.log(0.25))))
limpo = d[~d.suja]

# ---------- 3) modelo final ----------
m, T = treinar(limpo)
dump = m.booster_.dump_model()
def achatar(no, F, TH, DL, MT, L, R, LV):
    if 'leaf_value' in no: LV.append(no['leaf_value']); return -len(LV)
    k = len(F); F.append(no['split_feature']); DL.append(1 if no['default_left'] else 0)
    MT.append({'None': 0, 'Zero': 1, 'NaN': 2}[no['missing_type']])
    TH.append([int(x) for x in str(no['threshold']).split('||')] if no['decision_type'] == '==' else float(no['threshold']))
    L.append(None); R.append(None)
    L[k] = achatar(no['left_child'], F, TH, DL, MT, L, R, LV); R[k] = achatar(no['right_child'], F, TH, DL, MT, L, R, LV)
    return k
arv = []
for t in dump['tree_info']:
    F, TH, DL, MT, L, R, LV = [], [], [], [], [], [], []
    raiz = achatar(t['tree_structure'], F, TH, DL, MT, L, R, LV)
    arv.append({'f': F, 't': TH, 'd': DL, 'm': MT, 'l': L, 'r': R, 'v': [round(x, 7) for x in LV], 'raiz': raiz})
ce = {e: i for i, e in enumerate(T['ce'])}; cb = {e: i for i, e in enumerate(T['cb'])}; cc = {e: i for i, e in enumerate(T['cc'])}
esp = {}
for e, t in limpo.groupby('esp'):
    b = t.base.iloc[0]; c = t.cadeia.iloc[0]
    esp[e] = {'n': int(len(t)), 'v': int(bool(t.variante.iloc[0])), 'x': [int(bool(t.variante.iloc[0])), round(float(T['em'][e]), 6), int(T['en'][e]), round(float(T['bm'][b]), 6), ce[e], cb[b],
        round(float(T['cm'][c]), 6), int(T['cn'][c]), int(t.estagio.iloc[0]), int(t.geracao.iloc[0]), int(t.lendario.iloc[0]), cc[str(c)]]}
agora = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3)))
M = {'versao': agora.strftime('%Y-%m-%d %H:%M'), 'feats': FEAT, 'minEspecie': MIN_ESPECIE, 'vendas': int(len(d)), 'limpas': int(len(limpo)), 'sujas': [int(x) for x in d[d.suja].id],
     'ultimaVenda': int(d['min'].max()), 'especies40': int(sum(1 for e in esp.values() if e['n'] >= MIN_ESPECIE)), 'esp': esp, 'arvores': arv}

# ---------- avaliador do JSON (o mesmo que o monitor usa) ----------
def avaliar(M, linhas):
    out = []
    for xv in linhas:
        s = 0.0
        for t in M['arvores']:
            k = t['raiz']
            while k >= 0:
                x = xv[t['f'][k]]; th = t['t'][k]
                if isinstance(th, list): esq = int(x) in th
                elif t['m'][k] == 1 and abs(x) <= 1e-35: esq = t['d'][k] == 1
                elif t['m'][k] == 2 and x != x: esq = t['d'][k] == 1
                else: esq = x <= th
                k = t['l'][k] if esq else t['r'][k]
            s += t['v'][-1 - k]
        out.append(s)
    return np.array(out)
def linhas_de(M, t):
    L = []
    for _, r in t.iterrows():
        e = M['esp'].get(r.esp)
        if not e: L.append(None); continue
        L.append([math.log(max(1, r.lv)), r.nota, r.p, r.q, r.iv, 1 if r.tm > 0 else 0] + e['x'])
    return L
amostra = limpo.sample(min(400, len(limpo)), random_state=1)
Lm = linhas_de(M, amostra)
ok = [k for k, x in enumerate(Lm) if x is not None]
dif = np.abs(avaliar(M, [Lm[k] for k in ok]) - m.predict(matriz(amostra.iloc[ok], T)))
assert dif.max() < 1e-4, 'o avaliador do JSON não bate com o LightGBM: %g' % dif.max()

# ---------- 4) estabilidade ----------
nota = ''
try: A = json.load(open(ANTERIOR, encoding='utf-8'))
except Exception: A = None
usar = M
if A and A.get('arvores'):
    rf = limpo[limpo['min'] >= limpo['min'].max() - 2 * 1440]
    rf = rf[rf.esp.map(lambda e: e in A['esp'] and A['esp'][e]['n'] >= MIN_ESPECIE and e in esp and esp[e]['n'] >= MIN_ESPECIE)]
    if len(rf) >= 50:
        pa = avaliar(A, linhas_de(A, rf)); pn = avaliar(M, linhas_de(M, rf)); dd = np.abs(pn - pa)
        tip = math.exp(np.median(dd)) - 1; x2 = float((dd > math.log(2)).mean())
        M['estabilidade'] = {'comparadas': int(len(rf)), 'tipica': round(tip, 4), 'mais2x': round(x2, 4), 'anterior': A.get('versao')}
        if tip > ESTAVEL_TIPICO or x2 > ESTAVEL_2X:
            usar = A; A.setdefault('recusados', []).append({'em': M['versao'], 'tipica': round(tip, 4), 'mais2x': round(x2, 4)})
            A['recusados'] = A['recusados'][-10:]
            nota = 'modelo novo recusado: mudou %.0f%% típico, %.1f%% acima de 2x (limites %d%% e %d%%); mantido o de %s' % (100 * tip, 100 * x2, 100 * ESTAVEL_TIPICO, 100 * ESTAVEL_2X, A.get('versao'))
json.dump(usar, open(SAIDA, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(json.dumps({'versao': M['versao'], 'vendas': M['vendas'], 'limpas': M['limpas'], 'sujas': len(M['sujas']), 'especies40': M['especies40'], 'arvores': len(arv),
                  'estabilidade': M.get('estabilidade'), 'gravado': usar['versao'], 'nota': nota}, ensure_ascii=False))
