# Modelo de preço só de shiny e arquivo de apoio do dossiê da IA (monitor 2.12.81+). Roda toda noite, depois do treino-modelo-preco.py.
# Uso: python3 treino-shiny-e-apoio.py HISTORICO.txt SHINYS-SERVIDOR.txt FAIXAS-PVP.txt BASES-ESPECIES.json SAIDA-MODELO.json SAIDA-APOIO.json
# 1) modelo: LightGBM no log do preço das vendas de shiny (sem transferências, 50+ Gemas, sem as que fogem 6x da mediana da espécie).
#    Entra: log do nível, nota, qualidade, potência, IV somado, TM ou refino, Mega, mediana suavizada da espécie, nº de vendas da espécie e dias até a venda mais nova (0 na hora de prever).
#    Teste de 25/11 (1 dia à frente, 8 dias, 1.334 vendas): erro típico de 31%; comprando por metade do estimado, prejuízo em 9% a 15% dos casos.
# 2) apoio: bases e tipos por espécie, raiz da linha evolutiva, Megas da linha, times do PvP que usam a linha e oferta de shiny por espécie (censo).
import sys, json, math, re, datetime, collections, warnings
import numpy as np, pandas as pd, lightgbm as lgb
warnings.filterwarnings('ignore')
HIST, CENSO, FAIXAS, BASES, SAIDA_M, SAIDA_A = sys.argv[1:7]
H = open(HIST, encoding='utf-8').read().split('\n')
i = [k for k, l in enumerate(H) if l.startswith('## Vendas guardadas')][0]
rows = []
for l in H[i + 1:]:
    if l.startswith('## '): break
    r = l.split(',')
    if len(r) >= 13 and r[8] == '1' and int(r[10]) > 0 and r[11] == '0':
        rows.append(dict(min=int(r[1]), esp=r[2], lv=int(r[3]), nota=int(r[4]) / 1000, iv=int(r[5] or 0), q=int(r[6]) / 1000, p=int(r[7]), tm=1 if int(r[9]) > 0 else 0, g=int(r[10]) / 100))
S = pd.DataFrame(rows); S = S[S.g >= 50].copy()
S['lp'] = np.log(S.g); S['llv'] = np.log(S.lv.clip(lower=1)); S['mega'] = S.esp.str.startswith('Mega').astype(int)
med = S.groupby('esp').lp.transform('median'); S = S[(S.lp - med).abs() < math.log(6)].copy()
mx = int(S['min'].max()); g = float(S.lp.median())
s = S.groupby('esp').lp.agg(['median', 'count']); em = (s['median'] * s['count'] + g * 5) / (s['count'] + 5)
S['em'] = S.esp.map(em); S['en'] = S.esp.map(s['count']); S['dias'] = (S['min'] - mx) / 1440
FE = ['llv', 'nota', 'q', 'p', 'iv', 'tm', 'mega', 'em', 'en', 'dias']
m = lgb.LGBMRegressor(objective='huber', alpha=0.7, n_estimators=300, learning_rate=0.05, num_leaves=15, min_child_samples=8, subsample=0.8, subsample_freq=1,
                      colsample_bytree=0.9, verbose=-1, random_state=7, monotone_constraints=[0, 1, 1, 1, 0, 0, 0, 1, 0, 0])
m.fit(S[FE], S.lp)
def achatar(no, F, TH, DL, MT, L, R, LV):
    if 'leaf_value' in no: LV.append(no['leaf_value']); return -len(LV)
    k = len(F); F.append(no['split_feature']); DL.append(1 if no['default_left'] else 0); MT.append({'None': 0, 'Zero': 1, 'NaN': 2}[no['missing_type']]); TH.append(float(no['threshold'])); L.append(None); R.append(None)
    L[k] = achatar(no['left_child'], F, TH, DL, MT, L, R, LV); R[k] = achatar(no['right_child'], F, TH, DL, MT, L, R, LV)
    return k
arv = []
for t in m.booster_.dump_model()['tree_info']:
    F, TH, DL, MT, L, R, LV = [], [], [], [], [], [], []
    raiz = achatar(t['tree_structure'], F, TH, DL, MT, L, R, LV)
    arv.append({'f': F, 't': TH, 'd': DL, 'm': MT, 'l': L, 'r': R, 'v': [round(x, 7) for x in LV], 'raiz': raiz})
def avaliar(x):
    tot = 0.0
    for t in arv:
        k = t['raiz']
        while k >= 0:
            v = x[t['f'][k]]; th = t['t'][k]
            if t['m'][k] == 1 and abs(v) <= 1e-35: esq = t['d'][k] == 1
            elif t['m'][k] == 2 and v != v: esq = t['d'][k] == 1
            else: esq = v <= th
            k = t['l'][k] if esq else t['r'][k]
        tot += t['v'][-1 - k]
    return tot
am = S.sample(min(300, len(S)), random_state=1)
dif = np.abs(np.array([avaliar(list(r)) for r in am[FE].values]) - m.predict(am[FE]))
assert dif.max() < 1e-4, 'o avaliador do JSON não bate com o LightGBM: %g' % dif.max()
agora = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3)))
M = {'versao': agora.strftime('%Y-%m-%d %H:%M'), 'feats': FE, 'vendas': int(len(S)), 'global': round(g, 6), 'ultimaVenda': mx,
     'esp': {e: [round(float(em[e]), 6), int(s['count'][e])] for e in s.index}, 'arvores': arv}
json.dump(M, open(SAIDA_M, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

# ---------- apoio do dossiê ----------
BA = json.load(open(BASES, encoding='utf-8')); E = BA['especies']
PREF = re.compile(r'^(Brave|Furious|Enraged|Toxic|Tribal|Freezing|Psy|Magma|Brute|Hard|Ancient|Royal|Crystal|Golden|Frozen|Burning|Electric|Wild|Savage|Mighty|Charged|Trickmaster|Shadow|Dark)\s+')
basica = lambda n: not PREF.match(n) and not any(n.startswith(p) for p in ('Mega ', 'Alolan ', 'Galarian ', 'Hisuian '))
porId = {}
for n, v in E.items():
    if v[8] and basica(n):
        for k_ in ([v[8], v[8] - 13000] if v[8] > 13000 else [v[8]]):  # Hoenn em diante: o jogo guarda o número com 13000 a mais, mas evolvesToId e as Megas usam o número comum
            porId.setdefault(k_, n)
pai = {}
for n, v in E.items():
    if basica(n) and v[9] and v[9] in porId and porId[v[9]] not in pai: pai[porId[v[9]]] = n
megasDe = collections.defaultdict(list); megaBase = {}
for pid, nome, bs, _x in BA['megas']:
    if pid in porId: megaBase[nome] = porId[pid]
def raiz(n):
    n = megaBase.get(n, n); n = PREF.sub('', n)
    k = 0
    while n in pai and k < 5: n = pai[n]; k += 1
    return n
nomes = set(E) | set(megaBase)
for l in H[i + 1:]:
    if l.startswith('## '): break
    r = l.split(',')
    if len(r) >= 3: nomes.add(r[2])
for nome in megaBase: megasDe[raiz(nome)].append(nome)
bases = {n: v[:8] for n, v in E.items()}
for pid, nome, bs, _x in BA['megas']:
    o = E.get(porId.get(pid, ''), [None] * 10); bases[nome] = list(bs) + [o[6], o[7]]
uso = collections.defaultdict(lambda: collections.Counter()); times = collections.Counter(); usoNome = collections.defaultdict(lambda: collections.Counter())
for l in open(FAIXAS, encoding='utf-8'):
    if not l.startswith('['): continue
    try: r = json.loads(l)
    except Exception: continue
    fx = 'top110' if 1 <= r[0] <= 110 else 'pos440a560' if 440 <= r[0] <= 560 else 'pos1900a2100' if 1900 <= r[0] <= 2100 else None
    if not fx: continue
    times[fx] += 1
    for ln in set(raiz(p[1]) for p in r[7]): uso[ln][fx] += 1
    for nm_ in set(p[1] for p in r[7]): usoNome[nm_][fx] += 1
of = collections.defaultdict(lambda: [0, 0, 0]); lido = 0
for l in open(CENSO, encoding='utf-8'):
    if l.startswith('#'): continue
    r = l.strip().split(',')
    if len(r) < 15: continue
    try: mn = int(r[11])
    except Exception: continue
    lido = max(lido, mn); of[r[2]][0] += 1
    if r[13] and r[14] == 'orb': of[r[2]][2] += 1
    of[r[2]].append(mn)
oferta = {}
for e, v in of.items(): oferta[e] = [v[0], sum(1 for x in v[3:] if lido - x <= 7 * 1440), v[2]]
A = {'versao': M['versao'], 'bases': bases, 'raiz': {n: raiz(n) for n in sorted(nomes) if raiz(n) != n}, 'megas': {k: sorted(v) for k, v in megasDe.items()},
     'times': dict(times), 'uso': {k: dict(v) for k, v in uso.items()}, 'usoPorEspecie': {k: dict(v) for k, v in usoNome.items()}, 'oferta': oferta}
json.dump(A, open(SAIDA_A, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(json.dumps({'versao': M['versao'], 'vendasDeShiny': M['vendas'], 'especies': len(M['esp']), 'arvores': len(arv), 'bases': len(bases), 'linhasComUso': len(A['uso']), 'ofertaEspecies': len(oferta)}, ensure_ascii=False))
