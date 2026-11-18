// ==UserScript==
// @name         PokeIdle: lives (Twitch e Kick)
// @namespace    biafontenelle.pokeidle
// @version      1.22
// @updateURL    https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-lives.user.js
// @downloadURL  https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-lives.user.js
// @description  (1.22, 18/11 15h, este chat: Kick. As abas da Kick vão primeiro para o canal ao vivo que está mais perto de fechar o menor pacote de XP dele (1 h = 200 pontos), e depois ficam concentradas; canal sem pacote de XP conhecido fica de fora. Gravação na Kick: o que ela clica e os pedidos de recompensa que a página faz, para achar o caminho do resgate (seção "Gravação da Kick" no relatório).) (1.21: ordens de resgate vindas do monitor ou do Telegram ("resgatar lure 3h", "resgatar captura 1h às 20:00", "resgates"): as lives executam na Twitch, com reserva de 30 h de XP, e guardam o resultado) (1.20: anota os pacotes de Captura e Lure de cada canal com preço; botão "Resgatar agora" (XP, Captura ou Lure, nas horas escolhidas, no canal com pontos); resgate automático de XP quando faltar menos de 3 h, depois de um resgate certo na plataforma; Kick: acha o botão de pontos pelo saldo) (1.19: teste de resgate acha o cartão do bônus subindo do nome até o pedaço que tem o preço (na Twitch o nome e o preço ficam em partes separadas do cartão); cada plataforma guarda o seu último teste no relatório) (1.18: os pacotes de XP de cada canal são lidos logo depois de atualizar, sem esperar a conferência de quem você segue) (1.17: pacotes de XP de cada canal (tem canal sem o de 1 h): Twitch pela API, Kick pela tela de pontos ou pela API; recomendação, plano do Telegram e teste de resgate só usam pacotes que o canal tem; pulo: só tentativas que falharam contam) (1.16: o relatório completo vai sozinho para o repositório privado "relatorios" (lives/relatorio.txt) a cada 30 min, depois de cada teste de resgate e quando você clica em Relatório; a chave fica só no Tampermonkey, pelo menu "Lives: colar a chave do GitHub") (1.15: quando sai versão nova no repositório e o Tampermonkey a instala, a central se recarrega sozinha e recarrega as abas das lives uma por vez; não precisa mais Desligar, F5 e Ligar) (1.14: botões "Testar resgate" na central: resgata 1 hora de XP uma vez, com a aba à vista, conferindo nome, preço e saldo, e anota o que viu no menu de pontos (primeiro passo do resgate automático)) (1.13: aba que, depois de 30 min, ganha menos da metade do ritmo normal (10 pontos a cada 5 min) passa a contar como "ganhando pouco": troca de canal e, se continuar, sai, e o limite fica anotado) (1.12: mesma regra da 1.11; só passa a se atualizar sozinho pelo repositório) (1.11: aba com o vídeo rodando que não ganha pontos troca de canal primeiro; se continuar sem ganhar, é ela que sai (não outra aba que estava contando) e o limite fica anotado por 7 dias) (1.10: de volta às abas, na janela da central; quando uma live para no fundo (troca de canal da Kick, live engasgada), a central mostra essa aba uns segundos até o vídeo andar e volta; o relatório lista os parceiros que você não segue (seguir dá +300 de uma vez na Twitch)) (1.9: cada live numa janelinha própria, empilhadas no canto inferior direito (à vista, o vídeo reinicia sozinho quando a live troca de canal ou engasga); vídeo parado não conta mais como limite e não fecha aba; resgate não conta como perda) (1.8: a Kick também só dá pontos com o vídeo rodando (medido às 22:24): Kick e Twitch com o som ligado no player, nunca no mudo do player) (1.7: Twitch com o som ligado no player (silencie pelo Chrome: botão direito na aba, Silenciar site), porque vídeo no mudo pausa quando a aba vai para o fundo; nada de mostrar aba sozinho; abas só abrem quando você clica em Ligar ou +1 na central; botões +1 e −1 por plataforma; o número de abas só cai sozinho) (1.6: vídeo conta como tocando se qualquer player da página anda (anúncio não engana mais); mede os pontos mesmo sem achar o vídeo; traz aba para a frente no máximo 3 vezes por canal e não fica indo e voltando) (1.5: a central abre as abas na janela dela mesma, mesmo com você em outra janela) (1.4: resgate de 1 hora entra na conta: qualquer canal com 200 pontos na Kick ou 300 na Twitch já serve) (1.3: as lives rodam numa janela separada do jogo, comandadas por uma aba "central" com botões; lista fixa de parceiros de reserva) (1.2: lista de parceiros, quem está ao vivo, custo por hora e fim do bônus lidos do próprio jogo pela ponte; responde ao comando "resgatar" do Telegram (pelo monitor) com o plano de resgate) (1.1: varre os saldos de todos os parceiros antes de abrir as abas; número de abas se ajusta sozinho pela medição: Kick sobe até 6, Twitch testa 3 uma vez, e cai quando uma live em outro aparelho atrapalha) Mantém 2 lives da Twitch e de 3 a 6 da Kick rodando nos canais parceiros do PokeIdle, troca sozinho quando um canal sai do ar, clica no baú da Twitch, guarda o saldo de cada canal e calcula onde resgatar o +15% de XP. Não resgata nada e não manda mensagem.
// @match        https://www.twitch.tv/*
// @match        https://kick.com/*
// @match        https://pokeidle.io/app*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        window.focus
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';
  const VERSAO = '1.22';

  // ===== CONFIGURAÇÃO =====
  const CUSTO_HORA = { tw: 300, kk: 200 };   // pontos por hora de +15% de XP; atualizado pelo que o jogo informa
  const PACOTES = [10, 5, 3, 1];              // horas por resgate (1 h avulsa e pacotes de 3, 5 e 10), mesmo preço por hora
  const ABAS_PADRAO = { tw: 2, kk: 3 };       // começo: Twitch 2 (o teto relatado por internet), Kick 3
  const ABAS_MAX = { tw: 3, kk: 6 };          // até onde o ajuste automático testa (Twitch 3 só como teste)
  const AJUSTE_MIN = 30;                      // minutos entre uma subida e outra
  const RETORNO_MIN = 60;                     // depois de cair por live em outro aparelho, tenta voltar em 1 h
  const TETO_DIAS = 7;                        // limite descoberto vale 7 dias; depois testa de novo
  const SEQUENCIA_MIN = 0;                    // 1.3: sem pular de live em live atrás da sequência (cada troca em aba de fundo travava o vídeo); 12 liga de novo
  const RITMO_MIN = 60;                       // pontos/h: abaixo disso, depois de 30 min, a aba está "ganhando pouco" (o normal é 120/h, 10 a cada 5 min)
  const TROCA_MIN_PONTOS = 300;               // só troca de canal ao vivo por outro com pelo menos 1 hora a mais de pontos
  // reserva: lista do jogo em 17/11 15h18 (usada só se a ponte não trouxer a lista atual)
  const CANAIS_FIXOS = {
    tw: ['patopapao', 'axtlol', 'rodil', 'clovaobengala', 'biscoitao', 'cogu', 'tftoddy', 'luccatv', 'techzz', 'guaxilol1', 'dersin2k', 'denissnidertv',
      'faturetosl', 'mecmeno', 'yetz', 'revolta', 'daniels', 'kennzy', 'ookina', 'surskity11', 'gragolandia1', 'matta', 'fnblol9'],
    kk: ['yetz', 'patopapao2', 'axt', 'rodil', 'clovaobengalalol', 'biscoitao', 'cogu', 'tftoddy', 'luccatv', 'techzz', 'guaxilol1', 'dersin2k', 'faturetosl',
      'mecmeno', 'surskity', 'yulla', 'denissnider', 'revolta', 'daniels', 'yoda', 'fnblol', 'kennzy', 'ookina8', 'gragolandia', 'matta'],
  };
  const URL_CENTRAL = 'https://www.twitch.tv/directory/following#pkl=central'; // página sem vídeo; o script a transforma na central
  const TWITCH_CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'; // identificador público do próprio site da Twitch
  const HASH_PONTOS_TW = '7fe050e3761eb2cf258d70ee1a21cbd76fa8cf3d7e7b12fc437e7029d446b5e3'; // ChannelPointsContext
  const NOME = { tw: 'Twitch', kk: 'Kick' };
  const MIN = 60e3, H = 3600e3;

  // ===== FUNÇÕES PURAS (testadas fora do navegador) =====
  // Horas que um saldo compra (tem resgate de 1 h, então é o saldo dividido pelo custo da hora).
  // 1.17: cada canal tem os seus pacotes (18/11: kick.com/denissnider só tem 3, 5 e 10 h). Sem pacotes conferidos,
  // vale 1, 3, 5 e 10 h, marcado como incerto.
  const RX_XP_TITULO = /b[oô]nus\s*(de\s*)?\+?\s*15\s*%\s*(de\s*)?xp/i;
  // 1.20: os três bônus do PokeIdle (XP, Capture Boost e Secret Lure), com pacotes de horas e preço por canal
  const RX_TIPO = {
    xp: RX_XP_TITULO,
    captura: /b[oô]nus\s*(de\s*)?\+?\s*15\s*%\s*(de\s*)?capture/i,
    lure: /b[oô]nus\s*(de\s*)?\+?\s*15\s*%\s*(de\s*)?(secret\s*)?lure/i,
  };
  const NOME_TIPO = { xp: 'XP', captura: 'Captura', lure: 'Lure' };
  function tiposDePremios(premios, custoXpHora) {
    const out = { xp: [], captura: [], lure: [] };
    for (const r of premios || []) {
      if (!r) continue;
      const titulo = String(r.titulo != null ? r.titulo : r.title || '');
      const custo = Number(r.custo != null ? r.custo : r.cost);
      if (!(custo > 0) || r.ativo === false || r.isEnabled === false || r.isPaused === true) continue;
      for (const tipo of Object.keys(RX_TIPO)) {
        if (!RX_TIPO[tipo].test(titulo)) continue;
        const m = titulo.replace(RX_TIPO[tipo], ' ').match(/(\d+)\s*(h\b|hora)/i);
        let h = m ? Number(m[1]) : 1;
        if (tipo === 'xp' && !m && custoXpHora && custo % custoXpHora === 0) h = custo / custoXpHora;
        if (!out[tipo].some((x) => x.h === h)) out[tipo].push({ h, custo });
      }
    }
    for (const t of Object.keys(out)) out[t].sort((a, b) => a.h - b.h);
    return out;
  }
  function pacotesDoCanal(opcoes, canal) {
    const o = opcoes && opcoes[canal];
    return o && Array.isArray(o.hs) && o.hs.length ? { hs: o.hs.slice().sort((a, b) => b - a), certo: true } : { hs: PACOTES.slice(), certo: false };
  }
  // mais horas que cabem em "cap" somando pacotes (cada um quantas vezes quiser)
  function maxHoras(cap, hs) {
    if (!(cap > 0)) return 0;
    const ok = new Array(cap + 1).fill(false); ok[0] = true;
    for (let i = 1; i <= cap; i++) for (const h of hs) if (h <= i && ok[i - h]) { ok[i] = true; break; }
    for (let i = cap; i > 0; i--) if (ok[i]) return i;
    return 0;
  }
  // Horas que um saldo compra. Sem "hs", qualquer número de horas (tem o de 1 h).
  function horasResgataveis(saldo, custo, hs) {
    const cap = Math.max(0, Math.floor((Number(saldo) || 0) / custo));
    return hs ? maxHoras(cap, hs) : cap;
  }
  function melhorPacote(saldo, custo, hs) {
    const h = Math.floor((Number(saldo) || 0) / custo);
    return (hs ? hs.slice().sort((a, b) => b - a) : PACOTES).find((p) => p <= h) || 0;
  }
  // Pacotes de XP a partir da lista de recompensas do canal ({ titulo/title, custo/cost, ativo }).
  function pacotesDePremios(premios, custoHora) {
    const itens = [];
    for (const r of premios || []) {
      if (!r) continue;
      const titulo = String(r.titulo != null ? r.titulo : r.title || '');
      const custo = Number(r.custo != null ? r.custo : r.cost);
      if (!RX_XP_TITULO.test(titulo) || !(custo > 0) || r.ativo === false || r.isEnabled === false || r.isPaused === true) continue;
      const m = titulo.replace(RX_XP_TITULO, ' ').match(/(\d+)\s*(h\b|hora)/i);
      const h = m ? Number(m[1]) : (custo % custoHora === 0 ? custo / custoHora : 0);
      if (h > 0 && Math.abs(custo - h * custoHora) <= custoHora * 0.05) itens.push({ h, custo, titulo });
    }
    const hs = [...new Set(itens.map((x) => x.h))].sort((a, b) => b - a);
    return { hs, itens };
  }
  function versaoMaior(a, b) {
    const x = String(a || '0').split('.').map(Number), y = String(b || '0').split('.').map(Number);
    for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0; }
    return false;
  }
  function urlCanal(plat, canal) { return plat === 'tw' ? 'https://www.twitch.tv/' + canal : 'https://kick.com/' + canal; }
  function urlCurta(plat, canal) { return (plat === 'tw' ? 'twitch.tv/' : 'kick.com/') + canal; }

  // Onde resgatar: o canal que compra mais horas; no empate, o que está ao vivo; depois o de mais pontos.
  function recomendar(plat, saldos, vivos, opcoes) {
    const custo = CUSTO_HORA[plat];
    let melhor = null, banco = 0;
    for (const canal of Object.keys(saldos || {})) {
      const pts = Number((saldos[canal] || {}).pts) || 0;
      const pc = pacotesDoCanal(opcoes, canal);
      const horas = horasResgataveis(pts, custo, pc.hs);
      banco += horas;
      if (!horas) continue;
      const vivo = !!(vivos && vivos[canal] && vivos[canal].sid);
      const c = { canal, pts, horas, pacote: melhorPacote(pts, custo, pc.hs), vivo, certo: pc.certo };
      if (!melhor || c.horas > melhor.horas || (c.horas === melhor.horas && (c.vivo > melhor.vivo || (c.vivo === melhor.vivo && c.pts > melhor.pts)))) melhor = c;
    }
    return { melhor, banco };
  }
  function textoRecomendacao(plat, r) {
    if (!r || !r.melhor) return NOME[plat] + ': nenhum canal com ' + CUSTO_HORA[plat] + ' pontos ainda';
    return NOME[plat] + ': entre em ' + urlCurta(plat, r.melhor.canal) + ' e resgate ' + r.melhor.pacote + ' h' + (r.melhor.pacote === 1 && r.melhor.certo === false ? ' (se o canal tiver o de 1 h)' : '');
  }

  // Precisa assistir esta live para segurar a sequência? (só Twitch)
  function precisaSequencia(plat, canal, vivos, hist, minSeq) {
    if (plat !== 'tw' || !(minSeq > 0)) return false;
    const v = (vivos || {})[canal];
    if (!v || !v.sid) return false;
    const h = (hist || {})[canal];
    return !(h && h.sid === v.sid && (h.min || 0) >= minSeq);
  }

  // Para onde esta aba deve ir. Retorna o canal (pode ser o atual) ou null se ninguém estiver ao vivo.
  function escolherCanal(o) {
    const vivos = o.vivos || {}, saldos = o.saldos || {}, hist = o.hist || {};
    const ocupados = o.ocupados || new Set();
    const pts = (c) => Number((saldos[c] || {}).pts) || 0;
    const seq = (c) => precisaSequencia(o.plat, c, vivos, hist, o.minSeq != null ? o.minSeq : SEQUENCIA_MIN);
    const lista = (o.canais || Object.keys(vivos)).filter((c) => vivos[c] && vivos[c].sid && !ocupados.has(c));
    if (!lista.length) return null;
    if (o.plat === 'kk' && o.opcoes) { // 1.22: Kick: completa primeiro o canal mais perto de fechar o menor pacote de XP dele; depois concentra
      const unid = (c) => { const xs = ((((o.opcoes[c] || {}).tipos) || {}).xp || []).map((q) => Number(q.custo) || 0).filter((x) => x > 0); return xs.length ? Math.min(...xs) : 0; };
      const falta = (c) => { const u = unid(c); return u ? u - (pts(c) % u) : Infinity; };
      const lk = lista.filter((c) => unid(c) > 0);
      if (lk.length) {
        lk.sort((a, b) => (falta(a) - falta(b)) || (pts(b) - pts(a)) || (a < b ? -1 : 1));
        const at = o.atual, okAt = at && vivos[at] && vivos[at].sid && !ocupados.has(at) && unid(at) > 0;
        if (!okAt) return lk[0];
        return falta(lk[0]) + (o.margemKk == null ? 30 : o.margemKk) < falta(at) ? lk[0] : at;
      }
    }
    lista.sort((a, b) => (seq(b) - seq(a)) || (pts(b) - pts(a)) || (a < b ? -1 : 1));
    const alvo = lista[0];
    const atual = o.atual;
    const atualValido = atual && vivos[atual] && vivos[atual].sid && !ocupados.has(atual);
    if (!atualValido) return alvo;
    if (seq(atual)) return atual;                       // ainda segurando a sequência deste
    if (seq(alvo)) return alvo;                         // outra live pede a sequência
    if (pts(alvo) >= pts(atual) + (o.margem == null ? TROCA_MIN_PONTOS : o.margem)) return alvo;
    return atual;
  }

  // Links de canais na página do jogo (lista de streamers oficiais).
  const RESERVADOS_TW = /^(directory|videos|settings|subscriptions|inventory|wallet|drops|search|p|downloads|jobs|turbo|prime|login|signup|friends|messages|moderator|popout|embed|clip|clips|following|u|team|store|bits|creatorcamp|broadcast|privacy|legal)$/i;
  const RESERVADOS_KK = /^(categories|category|browse|following|dashboard|settings|search|clips|clip|popout|video|videos|privacy-policy|terms-of-service|community-guidelines|login|signup|help|api|subscriptions|kicks|drops|wallet|messages|notifications)$/i;
  function extrairCanais(hrefs) {
    const tw = new Set(), kk = new Set();
    for (const h of hrefs || []) {
      let u;
      try { u = new URL(h); } catch (e) { continue; }
      const host = u.hostname.toLowerCase().replace(/^(www|m)\./, '');
      const seg = u.pathname.split('/').filter(Boolean);
      if (seg.length < 1 || seg.length > 2) continue;
      if (seg.length === 2 && !/^(about|videos|schedule)$/i.test(seg[1])) continue;
      const nome = decodeURIComponent(seg[0]).toLowerCase();
      if (host === 'twitch.tv' && /^[a-z0-9_]{3,25}$/.test(nome) && !RESERVADOS_TW.test(nome)) tw.add(nome);
      if (host === 'kick.com' && /^[a-z0-9_-]{3,25}$/.test(nome) && !RESERVADOS_KK.test(nome)) kk.add(nome);
    }
    return { tw: [...tw], kk: [...kk] };
  }
  // Lista colada: links, ou linhas que começam com "twitch" / "kick" seguidas dos nomes.
  function lerListaColada(texto) {
    const out = { tw: new Set(), kk: new Set() };
    let plat = null;
    for (const linha of String(texto || '').split(/\r?\n/)) {
      const rot = linha.match(/^\s*(twitch|kick)\s*[:\-]?\s*(.*)$/i);
      let resto = linha;
      if (rot) { plat = rot[1].toLowerCase() === 'twitch' ? 'tw' : 'kk'; resto = rot[2]; }
      for (const tok of resto.split(/[\s,;]+/).filter(Boolean)) {
        if (/twitch\.tv\/|kick\.com\//i.test(tok)) {
          const c = extrairCanais([/^https?:/i.test(tok) ? tok : 'https://' + tok]);
          c.tw.forEach((x) => out.tw.add(x));
          c.kk.forEach((x) => out.kk.add(x));
        } else if (plat && /^[a-z0-9_-]{3,25}$/i.test(tok)) {
          out[plat].add(tok.toLowerCase());
        }
      }
    }
    return { tw: [...out.tw], kk: [...out.kk] };
  }
  // Saldo como a Twitch mostra na tela: "850", "1.234", "3,1 mil", "12.5K", "1,2 mi".
  function lerNumeroTela(txt) {
    let t = String(txt || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!t) return null;
    let mult = 1;
    if (/(k|mil)$/.test(t)) { mult = 1e3; t = t.replace(/\s*(k|mil)$/, ''); }
    else if (/(m|mi)$/.test(t)) { mult = 1e6; t = t.replace(/\s*(m|mi)$/, ''); }
    if (mult > 1) { t = t.replace(',', '.'); const n = parseFloat(t); return isNaN(n) ? null : Math.round(n * mult); }
    t = t.replace(/[.,\s]/g, '');
    const n = parseInt(t, 10);
    return isNaN(n) ? null : n;
  }
  // Uma aba está contando? Qualquer ganho em 5+ min prova que sim; 20 min sem ganho, que não.
  function avaliarContagem(ini, ult) {
    if (!ini || !ult || ult.t - ini.t < 5 * MIN) return { contando: null, porHora: null };
    const ganho = ult.pts - ini.pts;
    const dur = ult.t - ini.t;
    const porHora = Math.round(ganho / (dur / H));
    // 1.13: depois de 30 min, ganhar menos da metade do ritmo normal também é "não está contando" (sinal de que a
    // plataforma credita só parte das abas: 18/11, com 3 abas da Kick, uma ganhou +10 em 34 min e as outras +50 e +60)
    if (dur >= 30 * MIN && porHora < RITMO_MIN) return { contando: false, porHora: Math.max(0, porHora) };
    if (ganho > 0) return { contando: true, porHora };
    if (dur >= 20 * MIN) return { contando: false, porHora: 0 };
    return { contando: null, porHora: null };
  }

  // Quantas abas manter numa plataforma, pela medição de cada aba.
  // e: { n, bom (maior número em que todas contaram), teto ({n, t} limite descoberto), ultAjuste, ultQueda, subiuEm, teste (subida acima do bom) }
  // medidas: contando de cada aba ao vivo e tocando, medida depois do último ajuste; vivos: parceiros ao vivo disponíveis.
  function ajustarAbas(plat, e, medidas, vivos, agoraT, soCair) {
    const est = Object.assign({ n: ABAS_PADRAO[plat], bom: 0, teto: null, ultAjuste: 0, ultQueda: 0, subiuEm: 0, teste: false }, e || {});
    if (est.teto && agoraT - est.teto.t > TETO_DIAS * 24 * H) est.teto = null;
    const limite = Math.min(ABAS_MAX[plat], est.teto ? est.teto.n : ABAS_MAX[plat]);
    const falsas = medidas.filter((m) => m === false).length;
    const verdadeiras = medidas.filter((m) => m === true).length;
    if (falsas) {
      if (est.teste) {
        const novo = Math.max(1, est.n - 1);
        return { est: Object.assign(est, { n: novo, teto: { n: novo, t: agoraT }, teste: false, ultAjuste: agoraT }), acao: 'limite' };
      }
      if (est.n <= 1) return { est, acao: null };
      const tudo = falsas === est.n;
      Object.assign(est, { n: est.n - 1, ultAjuste: agoraT, ultQueda: agoraT });
      return { est, acao: tudo ? 'fora' : 'aba' };
    }
    if (verdadeiras >= est.n) {
      if (est.n > est.bom) est.bom = est.n;
      if (est.teste) est.teste = false;
      const podeSubir = est.n < limite && vivos > est.n && agoraT - est.ultAjuste >= AJUSTE_MIN * MIN && (!est.ultQueda || agoraT - est.ultQueda >= RETORNO_MIN * MIN);
      if (podeSubir && soCair) return { est, acao: 'pode' };
      if (podeSubir) {
        const teste = est.n + 1 > est.bom;
        Object.assign(est, { n: est.n + 1, ultAjuste: agoraT, subiuEm: agoraT, teste });
        return { est, acao: teste ? 'teste' : 'volta' };
      }
    }
    return { est, acao: null };
  }

  // 1.9: posição de cada janelinha de live. Empilhadas no canto inferior direito, em colunas; cada linha sobe
  // 110 px, então toda janelinha fica com uma faixa à vista (janela totalmente coberta conta como escondida).
  const JAN = { w: 320, h: 240, moldW: 16, moldH: 80, passo: 110 };
  function posicaoJanela(slot, tela) {
    const ow = JAN.w + JAN.moldW, oh = JAN.h + JAN.moldH;
    const cols = Math.max(1, Math.min(3, Math.floor((tela.w * 0.55) / ow)));
    const col = slot % cols, row = Math.floor(slot / cols);
    const left = Math.round(tela.x + tela.w - (cols - col) * ow);
    const top = Math.round(Math.max(tela.y, tela.y + tela.h - oh - row * JAN.passo));
    return { left, top, width: JAN.w, height: JAN.h };
  }

  // Plano de resgate para cobrir "falta" horas (ou tudo o que der): o canal com mais pontos primeiro, e em cada
  // resgate o menor pacote que fecha o que falta (se não der, o maior que o saldo paga). Hora a mais não se perde: soma.
  function planoResgate(plat, saldos, vivos, falta, tudo, opcoes) {
    const custo = CUSTO_HORA[plat];
    const lista = Object.keys(saldos || {}).map((c) => ({ canal: c, pts: Number((saldos[c] || {}).pts) || 0, vivo: !!(vivos && vivos[c] && vivos[c].sid), pc: pacotesDoCanal(opcoes, c) }))
      .filter((x) => x.pts >= Math.min(...x.pc.hs) * custo)
      .sort((a, b) => (b.pts - a.pts) || (b.vivo - a.vivo) || (a.canal < b.canal ? -1 : 1));
    let resta = tudo ? Infinity : Math.max(0, Math.ceil(falta));
    const itens = [];
    for (const x of lista) {
      if (resta <= 0) break;
      let pts = x.pts;
      const pacotes = [];
      const desc = x.pc.hs.slice().sort((a, b) => b - a), asc = desc.slice().reverse();
      while (resta > 0) {
        const cabe = Math.floor(pts / custo);
        const fecha = asc.find((p) => p >= resta && p <= cabe);
        const p = fecha || desc.find((q) => q <= cabe);
        if (!p) break;
        pacotes.push(p);
        pts -= p * custo;
        resta -= p;
      }
      if (pacotes.length) {
        const horas = pacotes.reduce((a, b) => a + b, 0);
        itens.push({ canal: x.canal, vivo: x.vivo, pacotes, horas, pontos: horas * custo, incerto: !x.pc.certo && pacotes.includes(1) });
      }
    }
    const total = itens.reduce((a, b) => a + b.horas, 0);
    return { itens, total, faltou: tudo ? 0 : Math.max(0, resta) };
  }
  function horaCurta(t, agoraT) {
    const d = new Date(t), h = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const amanha = new Date(agoraT); amanha.setHours(24, 0, 0, 0);
    return t >= amanha.getTime() ? h + ' de amanhã' : h;
  }
  function milhar(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  // Texto curto para o Telegram. alvo: horas a cobrir a partir de agora (padrão 12); tudo: resgatar tudo o que der.
  function textoPlano(plat, saldos, vivos, ativoAte, alvo, tudo, agoraT, opcoes) {
    const fimAtual = ativoAte && ativoAte > agoraT ? ativoAte : agoraT;
    const tem = (fimAtual - agoraT) / H;
    const cab = NOME[plat] + ': XP ' + (ativoAte && ativoAte > agoraT ? 'até ' + horaCurta(ativoAte, agoraT) : 'desligado');
    const falta = tudo ? 0 : alvo - tem;
    if (!tudo && falta <= 0) return cab + '. Já cobre ' + alvo + ' h, nada a resgatar.';
    const pl = planoResgate(plat, saldos, vivos, falta, tudo, opcoes);
    if (!pl.itens.length) return cab + '. Nenhum canal com ' + milhar(CUSTO_HORA[plat]) + ' pontos ainda.';
    const fim = fimAtual + pl.total * H;
    const L = [cab + '. ' + (tudo ? 'Resgatando tudo' : 'Para ' + alvo + ' h') + ', fica até ' + horaCurta(fim, agoraT) + (pl.faltou ? ' (só dá ' + Math.round(tem + pl.total) + ' h)' : '') + ':'];
    pl.itens.forEach((x, i) => L.push((i + 1) + '. ' + urlCurta(plat, x.canal) + ': ' + x.pacotes.join(' h + ') + ' h (' + milhar(x.pontos) + ' pontos)' + (x.incerto ? ' (se tiver o de 1 h)' : '')));
    if (!tudo && !pl.faltou) {
      const max = planoResgate(plat, saldos, vivos, 0, true, opcoes).total;
      if (max > pl.total) L.push('Dá para ' + Math.round(tem + max) + ' h com "resgatar ' + (plat === 'tw' ? 'twitch' : 'kick') + ' tudo".');
    }
    return L.join('\n');
  }
  // Comando do Telegram (o monitor repassa o texto): "resgatar", "resgatar kick", "resgatar twitch 20", "resgatar tudo".
  function lerComandoResgate(txt) {
    const t = String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (!/^resgat/.test(t)) return null;
    const plats = /twitch/.test(t) && !/kick/.test(t) ? ['tw'] : /kick|kik/.test(t) && !/twitch/.test(t) ? ['kk'] : ['tw', 'kk'];
    const n = t.match(/(\d+)\s*h?/);
    return { plats, tudo: /tudo|max/.test(t), horas: n ? Math.min(72, Math.max(1, Number(n[1]))) : 12 };
  }

  // 1.21: ordem de resgate em texto (o monitor repassa as mensagens do Telegram que começam com "resgat").
  // "resgatar lure 3h", "resgatar captura 1h às 20:00", "resgatar xp 10h", "resgates" (lista). Só Twitch.
  function lerOrdemTexto(txt, agoraT) {
    const t = String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (/^resgates\b|^resgatar\s+(status|lista|ordens)\b/.test(t)) return { lista: true };
    const m = t.match(/^resgat\w*\s+(xp|captura|capture|lure)\b(.*)$/);
    if (!m) return null;
    const tipo = m[1] === 'capture' ? 'captura' : m[1];
    let resto = m[2];
    if (/\b(kick|kik)\b/.test(resto)) return { erro: 'Pela Kick não: os pontos de lá só pagam o XP. Ordens de resgate são só na Twitch.' };
    let quando = 0;
    const q = resto.match(/\b(?:as|a partir das|para as)\s*(\d{1,2})(?:\s*[:h]\s*(\d{2}))?\s*h?\b/);
    if (q) {
      const d = new Date(agoraT);
      d.setHours(Number(q[1]), Number(q[2] || 0), 0, 0);
      if (d.getTime() < agoraT - 5 * 60e3) d.setDate(d.getDate() + 1);
      quando = d.getTime();
      resto = resto.replace(q[0], ' ');
    }
    const hm = resto.match(/(\d+)\s*(h\b|hora)/) || resto.match(/\b(\d+)\b/);
    const h = hm ? Number(hm[1]) : 1;
    if (!(h >= 1 && h <= 24)) return { erro: 'As horas vão de 1 a 24.' };
    return { plat: 'tw', tipo, h, quando };
  }
  // menor número de pacotes que soma exatamente "h" (ex.: 2 h com 1/3/5 vira 1 + 1)
  function combinarPacotes(h, hs) {
    const best = new Array(h + 1).fill(null); best[0] = [];
    for (let i = 1; i <= h; i++) for (const p of hs) if (p <= i && best[i - p] && (!best[i] || best[i - p].length + 1 < best[i].length)) best[i] = best[i - p].concat([p]);
    return best[h] ? best[h].sort((a, b) => b - a) : null;
  }

  // Lê, da mensagem de estado do jogo, a lista de parceiros, quem está ao vivo, o custo da hora de XP e o fim do bônus.
  function lerEstadoJogo(txt) {
    let e;
    try { e = JSON.parse(txt).estado; } catch (err) { return null; }
    if (!e) return null;
    const out = {};
    for (const [p, chave, campo] of [['tw', 'twitch', 'login'], ['kk', 'kick', 'slug']]) {
      const x = e[chave];
      if (!x || !Array.isArray(x.oficiais)) continue;
      const xp = (x.recompensas || []).find((r) => r && r.tipo === 'xp');
      out[p] = {
        canais: x.oficiais.filter((c) => c && c.ativo !== false && c[campo]).map((c) => String(c[campo]).toLowerCase()),
        aoVivo: x.oficiais.filter((c) => c && c.aoVivo && c[campo]).map((c) => String(c[campo]).toLowerCase()),
        custo: xp && Number(xp.custo) > 0 ? Number(xp.custo) : null,
        fimXp: x.bonus && Number(x.bonus.xp) > 0 ? Number(x.bonus.xp) : 0,
        vinculado: !!x.vinculado,
      };
    }
    return Object.keys(out).length ? Object.assign(out, { servidorAgora: Number(e.servidorAgora) || 0 }) : null;
  }

  const PURAS = { lerOrdemTexto, combinarPacotes, tiposDePremios, pacotesDoCanal, maxHoras, pacotesDePremios, horasResgataveis, melhorPacote, recomendar, textoRecomendacao, precisaSequencia, escolherCanal, extrairCanais, lerListaColada, lerNumeroTela, avaliarContagem, ajustarAbas, urlCanal, planoResgate, textoPlano, lerComandoResgate, lerEstadoJogo, posicaoJanela, versaoMaior };
  if (typeof window === 'undefined' || typeof GM_getValue === 'undefined') {
    if (typeof module !== 'undefined') module.exports = PURAS;
    return;
  }

  // ===== NAVEGADOR =====
  const agora = () => Date.now();
  // 1.22: gravação na Kick (pedido dela em 18/11): os cliques dela e os pedidos de recompensa da página, para achar o caminho do resgate
  function gravarKick(item) { try { const g = GM_getValue('gravacao_kk') || []; g.push(Object.assign({ t: Date.now() }, item)); GM_setValue('gravacao_kk', g.slice(-40)); } catch (e) { /* nada */ } }
  if (/(^|\.)kick\.com$/.test(location.hostname)) {
    try {
      const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, RXK = /reward|redeem|point|loyalty/i;
      const vale = (url, metodo) => /redeem/i.test(url) || (metodo !== 'GET' && RXK.test(url));
      let ghDepois = 0; const subir = () => { if (Date.now() - ghDepois > 60e3) { ghDepois = Date.now(); setTimeout(() => { try { ghRelatorio('gravação da Kick').catch(() => {}); } catch (e) { /* nada */ } }, 5000); } };
      const of = W.fetch;
      if (typeof of === 'function') W.fetch = function (input, init) {
        const url = String((input && input.url) || input || ''), metodo = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
        const pr = of.apply(this, arguments);
        if (vale(url, metodo)) { const corpo = init && typeof init.body === 'string' ? init.body.slice(0, 500) : ''; pr.then((r) => { try { r.clone().text().then((x) => { gravarKick({ tipo: 'fetch', metodo, url: url.slice(0, 220), corpo, status: r.status, resposta: String(x).slice(0, 300) }); subir(); }).catch(() => {}); } catch (e) { /* nada */ } }).catch(() => {}); }
        return pr;
      };
      const XP = W.XMLHttpRequest && W.XMLHttpRequest.prototype;
      if (XP) { const o1 = XP.open, o2 = XP.send;
        XP.open = function (m, u) { this.__pk = [String(m || 'GET').toUpperCase(), String(u || '')]; return o1.apply(this, arguments); };
        XP.send = function (b) { const k = this.__pk; if (k && vale(k[1], k[0])) { const corpo = typeof b === 'string' ? b.slice(0, 500) : ''; this.addEventListener('loadend', () => { gravarKick({ tipo: 'xhr', metodo: k[0], url: k[1].slice(0, 220), corpo, status: this.status, resposta: String(this.responseText || '').slice(0, 300) }); subir(); }); } return o2.apply(this, arguments); };
      }
      document.addEventListener('click', (e) => {
        if (!e.isTrusted) return; // só os cliques dela
        const el = e.target && e.target.closest ? (e.target.closest('button, [role="button"], a, [role="menuitem"]') || e.target) : null; if (!el) return;
        const at = (x) => x ? [x.tagName, (x.getAttribute('aria-label') || '').slice(0, 40), String(x.className || '').slice(0, 60), [...x.attributes].filter((a) => /^data-/.test(a.name)).map((a) => a.name + '=' + String(a.value).slice(0, 30)).join(' ')].join(' | ') : '';
        gravarKick({ tipo: 'clique', texto: ((el.innerText || el.textContent || '') + '').replace(/\s+/g, ' ').trim().slice(0, 80), el: at(el), pai: at(el.parentElement), avo: at(el.parentElement && el.parentElement.parentElement), url: location.pathname });
      }, true);
    } catch (e) { /* nada */ }
  }
  const ler = (k, padrao) => { try { const v = GM_getValue(k); return v === undefined ? padrao : v; } catch (e) { return padrao; } };
  const gravar = (k, v) => { try { GM_setValue(k, v); } catch (e) { /* nada */ } };
  const $ = (s, r) => (r || document).querySelector(s);
  const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
  function logar(txt) {
    const l = ler('log', []);
    l.push([agora(), txt]);
    while (l.length > 400) l.shift();
    gravar('log', l);
  }
  function hora(t) { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function cookie(nome) { const m = document.cookie.match(new RegExp('(?:^|; )' + nome + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : ''; }
  function cfg() {
    const c = ler('cfg', null) || { ativo: false, abas: Object.assign({}, ABAS_PADRAO) };
    if (!c.abas) c.abas = Object.assign({}, ABAS_PADRAO);
    return c;
  }
  function canais(plat) {
    const jogo = ler('canais_jogo', null);
    if (jogo && jogo[plat] && jogo[plat].length && agora() - jogo.t < 2 * 24 * H) return jogo[plat].slice();
    const salvos = ler('canais', { tw: [], kk: [] });
    return [...new Set([...(salvos[plat] || []), ...CANAIS_FIXOS[plat]])];
  }
  function naoSegue(plat) {
    const sg = ler('segue_' + plat, null);
    if (!sg || !sg.mapa) return [];
    return canais(plat).filter((c) => sg.mapa[c] === false);
  }
  // Identificador que sobrevive ao F5 (recarregar a aba não faz a aba perder o comando para ela mesma por 2,5 min).
  function idFixo(prefixo) {
    try {
      let x = sessionStorage.getItem('pkl-id-' + prefixo);
      if (!x) { x = prefixo + '-' + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('pkl-id-' + prefixo, x); }
      return x;
    } catch (e) { return prefixo + '-' + Math.random().toString(36).slice(2, 8); }
  }
  function centralViva() { const c = ler('central', null); return !!(c && agora() - c.t < 2 * MIN); }
  function atualizarCustos() { const c = ler('custos', null); if (c) for (const p of ['tw', 'kk']) if (c[p] > 0) CUSTO_HORA[p] = c[p]; }
  function souLider(chave, id, prazo) {
    const l = ler('lider_' + chave, null);
    if (!l || l.id === id || agora() - l.t > prazo) { gravar('lider_' + chave, { id, t: agora() }); return true; }
    return false;
  }
  function abasDe(plat) {
    const out = [];
    for (let i = 1; i <= 8; i++) {
      const s = ler('aba_' + plat + i, null);
      if (s) out.push(s);
    }
    return out;
  }

  // ---------- leitura das plataformas ----------
  async function gqlTwitch(corpo) {
    const token = cookie('auth-token');
    const headers = { 'Client-Id': TWITCH_CLIENT_ID, 'Content-Type': 'text/plain;charset=UTF-8' };
    if (token) headers.Authorization = 'OAuth ' + token;
    const r = await fetch('https://gql.twitch.tv/gql', { method: 'POST', headers, body: JSON.stringify(corpo) });
    return r.json();
  }
  // Ao vivo e saldos da Twitch numa leitura só (saldos só se estiver logada).
  async function lerTwitch(lista, comSaldo) {
    const logada = !!cookie('auth-token');
    const campos = 'login stream { id createdAt }' + (comSaldo && logada ? ' channel { self { communityPoints { balance } } }' : '');
    const vivos = {}, saldos = {};
    for (let i = 0; i < lista.length; i += 90) {
      const parte = lista.slice(i, i + 90);
      const j = await gqlTwitch({ query: 'query { users(logins: ' + JSON.stringify(parte) + ') { ' + campos + ' } }' });
      const us = j && j.data && j.data.users;
      if (!Array.isArray(us)) throw new Error('resposta sem users' + (j && j.errors ? ': ' + JSON.stringify(j.errors).slice(0, 120) : ''));
      for (const u of us) {
        if (!u || !u.login) continue;
        const c = u.login.toLowerCase();
        vivos[c] = u.stream && u.stream.id ? { sid: String(u.stream.id), desde: Date.parse(u.stream.createdAt) || 0 } : { sid: null };
        const b = u.channel && u.channel.self && u.channel.self.communityPoints && u.channel.self.communityPoints.balance;
        if (typeof b === 'number') saldos[c] = b;
      }
    }
    // Reserva: consulta do próprio site, canal por canal.
    if (comSaldo && logada && !Object.keys(saldos).length) {
      for (const c of lista) {
        try {
          const j = await gqlTwitch({ operationName: 'ChannelPointsContext', variables: { channelLogin: c }, extensions: { persistedQuery: { version: 1, sha256Hash: HASH_PONTOS_TW } } });
          const b = j && j.data && j.data.community && j.data.community.channel && j.data.community.channel.self && j.data.community.channel.self.communityPoints && j.data.community.channel.self.communityPoints.balance;
          if (typeof b === 'number') saldos[c] = b;
        } catch (e) { /* segue */ }
        await dorme(400);
      }
    }
    return { vivos, saldos, logada };
  }
  async function kickJson(caminho) {
    const headers = { Accept: 'application/json' };
    const s = cookie('session_token');
    if (s) headers.Authorization = 'Bearer ' + s;
    const r = await fetch(caminho, { credentials: 'include', headers });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }
  async function lerKickVivo(c) {
    const j = await kickJson('/api/v2/channels/' + encodeURIComponent(c));
    const l = j && j.livestream;
    return l && l.id ? { sid: String(l.id), desde: Date.parse(l.created_at || l.start_time || '') || 0 } : { sid: null };
  }
  async function lerKickSaldo(c) {
    const j = await kickJson('/api/v2/channels/' + encodeURIComponent(c) + '/points');
    const p = j && ((j.data && j.data.points) != null ? j.data.points : j.points);
    return typeof p === 'number' ? p : (p != null && !isNaN(Number(p)) ? Number(p) : null);
  }
  // 1.10: quem você segue. Consulta separada da dos saldos: se falhar, não atrapalha nada.
  async function lerSegueTwitch(lista) {
    const out = {};
    for (let i = 0; i < lista.length; i += 50) {
      const parte = lista.slice(i, i + 50);
      const j = await gqlTwitch({ query: 'query { users(logins: ' + JSON.stringify(parte) + ') { login self { follower { followedAt } } } }' });
      const us = j && j.data && j.data.users;
      if (!Array.isArray(us)) throw new Error('resposta sem users');
      for (const u of us) {
        if (!u || !u.login || !u.self) continue;
        out[u.login.toLowerCase()] = !!(u.self.follower && u.self.follower.followedAt);
      }
    }
    return out;
  }
  async function lerPremiosTwitch(lista) {
    const out = {};
    for (let i = 0; i < lista.length; i += 20) {
      const parte = lista.slice(i, i + 20);
      const j = await gqlTwitch({ query: 'query { users(logins: ' + JSON.stringify(parte) + ') { login channel { communityPointsSettings { customRewards { title cost isEnabled isPaused isInStock } } } } }' });
      const us = j && j.data && j.data.users;
      if (!Array.isArray(us)) throw new Error((j && j.errors && j.errors[0] && j.errors[0].message) || 'resposta sem users');
      for (const u of us) {
        const rs = u && u.channel && u.channel.communityPointsSettings && u.channel.communityPointsSettings.customRewards;
        if (u && u.login && Array.isArray(rs)) out[u.login.toLowerCase()] = rs.map((r) => ({ titulo: r.title, custo: r.cost, ativo: r.isEnabled !== false && !r.isPaused && r.isInStock !== false }));
      }
    }
    return out;
  }
  // Kick: o endereço das recompensas não é documentado; testa alguns e guarda o que responder com uma lista.
  const KK_PREMIOS_URLS = ['/api/v2/channels/{c}/rewards', '/api/v2/channels/{c}/channel-rewards', '/api/v2/channels/{c}/points/rewards', '/api/internal/v1/channels/{c}/rewards'];
  function listaDePremiosKick(j) {
    const arr = Array.isArray(j) ? j : j && (Array.isArray(j.data) ? j.data : Array.isArray(j.rewards) ? j.rewards : j.data && Array.isArray(j.data.rewards) ? j.data.rewards : null);
    if (!arr) return null;
    return arr.filter((r) => r && (r.title || r.name)).map((r) => ({ titulo: r.title || r.name, custo: Number(r.cost != null ? r.cost : r.points != null ? r.points : r.price), ativo: r.is_enabled !== false && r.enabled !== false && !r.is_paused && !r.paused }));
  }
  async function lerPremiosKick(c) {
    const fixo = ler('kk_premios_url', '');
    const urls = fixo ? [fixo] : KK_PREMIOS_URLS;
    const sonda = ler('kk_premios_sonda', {});
    for (const u of urls) {
      const url = u.replace('{c}', encodeURIComponent(c));
      let st = 0, lista = null;
      try {
        const r = await fetch(url, { headers: Object.assign({ Accept: 'application/json' }, cookie('session_token') ? { Authorization: 'Bearer ' + cookie('session_token') } : {}), credentials: 'include' });
        st = r.status;
        if (r.ok) lista = listaDePremiosKick(await r.json());
      } catch (e) { st = -1; }
      if (!fixo) { sonda[u] = st + (lista ? ' lista com ' + lista.length : ''); gravar('kk_premios_sonda', sonda); }
      if (lista) { if (!fixo) gravar('kk_premios_url', u); return lista; }
    }
    return null;
  }
  // Lê os pacotes de XP na tela de pontos aberta (você ou o teste de resgate abriu): cartões com o nome do bônus e o preço.
  function premiosDaTela() {
    const visivel = (el) => { try { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; } catch (e) { return false; } };
    const tx = (el) => ((el && el.textContent) || '').replace(/\s+/g, ' ').trim();
    const titulos = [...document.querySelectorAll('body *')].filter((e) => RX_XP_TITULO.test(tx(e)) && ![...e.children].some((f) => RX_XP_TITULO.test(tx(f))) && visivel(e));
    const out = [];
    for (const t of titulos) {
      const titulo = tx(t);
      let el = t.parentElement, custo = 0;
      for (let i = 0; i < 4 && el && !custo; i++, el = el.parentElement) {
        const resto = tx(el).replace(titulo, ' ');
        if (RX_XP_TITULO.test(resto)) break; // já pegou outro cartão
        const m = resto.match(/(\d{1,3}(?:[.,]\d{3})+|\d+)/);
        if (m) custo = Number(m[1].replace(/[.,]/g, ''));
      }
      if (custo) out.push({ titulo, custo, ativo: true });
    }
    return out;
  }
  function autoXpEstadoGlobal(p) {
    if (!(ler('auto_ok_' + p, false) || ((ler('teste_resgate_fim_' + p, null) || {}).ok === true && ((ler('teste_resgate_fim_' + p, null) || {}).tipo || 'xp') === 'xp'))) return 'espera um resgate de XP certo pelo painel';
    const b = ler('auto_bloq_' + p, null);
    if (b) return 'desligado às ' + hora(b.t) + ' (' + b.motivo + '); um resgate certo pelo painel liga de novo';
    const u = ler('auto_feito_' + p, null);
    return 'ligado (resgata quando faltar menos de 3 h)' + (u ? '; último às ' + hora(u.t) + ', ' + u.h + ' h em ' + u.canal : '');
  }
  // ===== ORDENS DE RESGATE (1.21) =====
  // O monitor (ou o Telegram, pelo monitor) manda o que resgatar; a central executa na Twitch e guarda o resultado.
  const RESERVA_XP_H = 30; // horas de XP da Twitch que ficam guardadas antes de gastar com Captura e Lure
  function textoOrdem(o) {
    return NOME_TIPO[o.tipo] + ' ' + o.h + ' h na ' + NOME[o.plat] + (o.quando ? ' às ' + hora(o.quando) + (new Date(o.quando).toDateString() !== new Date().toDateString() ? ' de ' + new Date(o.quando).toLocaleDateString('pt-BR').slice(0, 5) : '') : '') +
      ': ' + (o.estado === 'pendente' ? 'esperando' : o.estado === 'andamento' ? 'resgatando' : o.estado) + (o.detalhe ? ' (' + o.detalhe + ')' : '');
  }
  function criarOrdem(o) {
    if (!o || o.plat !== 'tw') return { ok: false, texto: 'Ordens de resgate são só na Twitch.' };
    if (!RX_TIPO[o.tipo]) return { ok: false, texto: 'Tipo de bônus desconhecido (use xp, captura ou lure).' };
    const h = Number(o.h);
    if (!(h >= 1 && h <= 24)) return { ok: false, texto: 'As horas vão de 1 a 24.' };
    const ordens = ler('ordens', []);
    const id = 'o' + agora().toString(36) + Math.random().toString(36).slice(2, 5);
    const nova = { id, plat: 'tw', tipo: o.tipo, h, quando: Number(o.quando) || 0, origem: o.origem || 'monitor', motivo: o.motivo || '', criada: agora(), estado: 'pendente', detalhe: '' };
    ordens.push(nova);
    gravar('ordens', ordens.slice(-30));
    logar('Ordem de resgate ' + id + ' (' + nova.origem + '): ' + textoOrdem(nova));
    return { ok: true, id, texto: 'Anotado: ' + NOME_TIPO[nova.tipo] + ' ' + h + ' h na Twitch' + (nova.quando ? ' às ' + hora(nova.quando) : ', agora') + '. A central das lives resgata e o resultado sai no relatório e em "resgates".' };
  }
  function textoOrdens() {
    const os = ler('ordens', []).slice(-6).reverse();
    return os.length ? 'Ordens de resgate:\n' + os.map((o) => hora(o.criada) + ' ' + textoOrdem(o)).join('\n') : 'Nenhuma ordem de resgate.';
  }
  function descreverPacotes(op) {
    const t = op.tipos || { xp: (op.hs || []).map((h) => ({ h })) };
    return ['xp', 'captura', 'lure'].filter((k) => t[k] && t[k].length).map((k) => NOME_TIPO[k] + ' ' + t[k].map((x) => x.h).join('/')).join(', ') + ' h (' + op.fonte + ')';
  }
  function guardarOpcoes(plat, canal, premios, fonte) {
    const pk = pacotesDePremios(premios, CUSTO_HORA[plat]);
    const tipos = tiposDePremios(premios, CUSTO_HORA[plat]);
    const op = ler('opcoes_' + plat, {});
    // a lista da API vale mais que a tela (na tela pode faltar cartão fora de vista)
    if (fonte === 'tela' && op[canal] && op[canal].fonte === 'API' && agora() - op[canal].t < 12 * H) return pk;
    const antes = op[canal] && op[canal].hs ? op[canal].hs.join(',') : '';
    if (!pk.hs.length && !tipos.captura.length && !tipos.lure.length) { if (op[canal]) { delete op[canal]; gravar('opcoes_' + plat, op); } return pk; }
    op[canal] = { hs: pk.hs, tipos, t: agora(), fonte };
    gravar('opcoes_' + plat, op);
    if (antes !== pk.hs.join(',') && pk.hs.length) logar(NOME[plat] + ': ' + canal + ' tem XP de ' + pk.hs.slice().reverse().join(', ') + ' h (' + fonte + ')');
    return pk;
  }
  async function lerSegueKick(c) {
    const j = await kickJson('/api/v2/channels/' + encodeURIComponent(c) + '/me');
    if (!j || typeof j !== 'object') return null;
    if ('is_following' in j) return !!j.is_following;
    if ('following' in j) return !!j.following;
    return null;
  }
  function guardarSaldo(plat, c, pts, fonte) {
    if (typeof pts !== 'number' || isNaN(pts)) return;
    const s = ler('saldos_' + plat, {});
    s[c] = { pts, t: agora(), fonte };
    gravar('saldos_' + plat, s);
  }

  function logarVarredura(plat) {
    const saldos = ler('saldos_' + plat, {});
    const lista = canais(plat);
    const lidos = lista.filter((c) => saldos[c]);
    const total = lidos.reduce((a, c) => a + (saldos[c].pts || 0), 0);
    const r = recomendar(plat, saldos, ler('vivos_' + plat, {}), ler('opcoes_' + plat, {}));
    logar(NOME[plat] + ': varredura de ' + lidos.length + ' de ' + lista.length + ' canais, ' + total + ' pontos, ' + r.banco + ' h para resgatar');
  }
  // Líder da plataforma atualiza quem está ao vivo (a cada 90 s) e todos os saldos (a cada 15 min).
  async function atualizarPlataforma(plat, meuId) {
    const lista = canais(plat);
    if (!lista.length) return;
    if (!souLider(plat, meuId, 150e3)) return;
    const tV = ler('t_vivos_' + plat, 0), tS = ler('t_saldos_' + plat, 0);
    const jogoFresco = agora() - ler('t_jogo', 0) < 10 * MIN; // o jogo já diz quem está ao vivo na Kick
    const querVivo = agora() - tV > (plat === 'tw' ? 90e3 : (jogoFresco ? 10 * MIN : 3 * MIN)), querSaldo = agora() - tS > 15 * MIN;
    const querSegue = agora() - ler('t_segue_' + plat, 0) > 6 * H && !querSaldo;
    // 1.18: pacotes de XP com relógio próprio (na 1.17 iam junto com quem segue e só seriam lidos 6 h depois)
    const querPremios = agora() - ler('t_premios_' + plat, 0) > 6 * H && !querSaldo && !querSegue;
    if (!querVivo && !querSaldo && !querSegue && !querPremios) return;
    if (querPremios) {
      gravar('t_premios_' + plat, agora());
      // pacotes de XP de cada canal
      try {
        if (plat === 'tw') {
          const pr = await lerPremiosTwitch(lista);
          for (const c of Object.keys(pr)) guardarOpcoes('tw', c, pr[c], 'API');
          gravar('premios_estado_tw', { t: agora(), ok: Object.keys(pr).length });
        } else {
          let ok = 0;
          for (const c of lista) {
            const pr = await lerPremiosKick(c);
            if (pr) { guardarOpcoes('kk', c, pr, 'API'); ok++; } else if (!ler('kk_premios_url', '')) break;
            await dorme(700);
          }
          gravar('premios_estado_kk', { t: agora(), ok });
        }
      } catch (e) {
        gravar('premios_estado_' + plat, { t: agora(), ok: 0, erro: String(e.message || e).slice(0, 100) });
      }
      if (!querVivo) return;
    }
    if (querSegue) {
      gravar('t_segue_' + plat, agora());
      try {
        let mapa = {};
        if (plat === 'tw') { if (cookie('auth-token')) mapa = await lerSegueTwitch(lista); }
        else {
          for (const c of lista) {
            try { const x = await lerSegueKick(c); if (x != null) mapa[c] = x; } catch (e) { /* segue */ }
            await dorme(700);
          }
        }
        if (Object.keys(mapa).length) {
          gravar('segue_' + plat, { t: agora(), mapa });
          const nao = lista.filter((c) => mapa[c] === false);
          logar(NOME[plat] + ': você segue ' + lista.filter((c) => mapa[c] === true).length + ' de ' + lista.length + ' parceiros' + (nao.length ? '; não segue: ' + nao.join(', ') : ''));
        }
      } catch (e) {
        gravar('t_segue_' + plat, agora() - 5 * H); // tenta de novo em 1 h
        logar(NOME[plat] + ': não consegui ver quem você segue (' + String(e.message || e).slice(0, 80) + ')');
      }
      if (!querVivo) return;
    }
    try {
      if (plat === 'tw') {
        const r = await lerTwitch(lista, querSaldo);
        gravar('vivos_tw', r.vivos);
        gravar('t_vivos_tw', agora());
        if (querSaldo) {
          for (const c of Object.keys(r.saldos)) guardarSaldo('tw', c, r.saldos[c], 'conta');
          gravar('t_saldos_tw', agora());
          if (!r.logada) logar('Twitch: esta janela não está logada na Twitch (sem saldos)');
          else if (!ler('varreu_tw', 0)) { gravar('varreu_tw', agora()); logarVarredura('tw'); }
        }
      } else {
        const vivos = Object.assign({}, ler('vivos_kk', {}));
        if (querVivo) {
          for (const c of lista) {
            try { vivos[c] = await lerKickVivo(c); } catch (e) { /* mantém o anterior */ }
            await dorme(700);
          }
          gravar('vivos_kk', vivos);
          gravar('t_vivos_kk', agora());
        }
        if (querSaldo) {
          let ok = 0;
          for (const c of lista) {
            try { const p = await lerKickSaldo(c); if (p != null) { guardarSaldo('kk', c, p, 'conta'); ok++; } } catch (e) { /* segue */ }
            await dorme(700);
          }
          gravar('t_saldos_kk', agora());
          if (!ok) logar('Kick: não consegui ler os saldos (a página pode ter mudado)');
          else if (!ler('varreu_kk', 0)) { gravar('varreu_kk', agora()); logarVarredura('kk'); }
        }
      }
    } catch (e) {
      logar(NOME[plat] + ': leitura falhou (' + String(e.message || e).slice(0, 140) + ')');
      gravar('t_vivos_' + plat, agora()); // não martela
    }
  }

  // ===== ABA DE LIVE (Twitch ou Kick) =====
  function plataformaDaPagina() {
    if (/(^|\.)twitch\.tv$/.test(location.hostname)) return 'tw';
    if (/(^|\.)kick\.com$/.test(location.hostname)) return 'kk';
    return null;
  }
  function canalDaUrl(plat) {
    const seg = location.pathname.split('/').filter(Boolean);
    if (!seg.length) return '';
    const c = seg[0].toLowerCase();
    if (plat === 'tw' && RESERVADOS_TW.test(c)) return '';
    if (plat === 'kk' && RESERVADOS_KK.test(c)) return '';
    return c;
  }
  function idDaAba() {
    const m = location.hash.match(/pkl=(tw\d|kk\d|central)/);
    if (m) { try { sessionStorage.setItem('pkl-aba', m[1]); } catch (e) { /* nada */ } }
    try { return sessionStorage.getItem('pkl-aba'); } catch (e) { return null; }
  }

  function iniciarAba(plat, id) {
    // Twitch: menor qualidade e som ligado (baixo) antes de o player carregar. Desde o Chrome 145, vídeo no mudo
    // do player pausa quando a aba vai para o fundo, e a Twitch só dá pontos com o vídeo rodando. Para não ouvir,
    // silencie pelo Chrome (botão direito na aba, "Silenciar site"): o player continua tocando.
    if (plat === 'tw') {
      try {
        localStorage.setItem('video-quality', JSON.stringify({ default: '160p30' }));
        localStorage.setItem('video-muted', JSON.stringify({ default: false }));
        localStorage.setItem('volume', '0.05');
      } catch (e) { /* nada */ }
    }
    let ultTempo = -1, parado = 0, ultCiclo = agora(), ultTroca = 0;
    const est = ler('aba_' + id, null) || {};
    const estado = { id, plat, canal: '', desde: agora(), ini: null, ult: null, contando: null, porHora: null, tocando: false, t: agora() };
    if (est.canal) Object.assign(estado, { canal: est.canal, desde: est.desde, ini: est.ini, ult: est.ult, contando: est.contando, porHora: est.porHora });

    function fechar() {
      gravar('aba_' + id, null);
      try { sessionStorage.removeItem('pkl-aba'); } catch (e) { /* nada */ }
      try { window.close(); } catch (e) { /* nada */ }
      setTimeout(() => location.replace('about:blank'), 1500);
    }
    // Troca de canal sem recarregar a página: o Chrome só deixa vídeo começar sozinho em aba de fundo
    // se a página já tocou vídeo antes; recarregar faz a aba esperar um clique.
    let navPendente = null;
    function navegar(alvo) {
      const caminho = '/' + alvo;
      const link = [...document.querySelectorAll('a[href]')].find((a) => {
        try { const u = new URL(a.href); return u.host === location.host && u.pathname.replace(/\/$/, '').toLowerCase() === caminho; } catch (e) { return false; }
      });
      let modo = 'recarga';
      if (link) { link.click(); modo = 'link'; }
      else if (plat === 'tw') {
        history.pushState({}, '', caminho);
        window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        modo = 'rota';
      } else {
        location.assign(urlCanal(plat, alvo));
      }
      navPendente = { alvo, t: agora(), modo };
      return modo;
    }
    function clicarPortao() {
      const b = $('[data-a-target="content-classification-gate-overlay-start-watching-button"]') || $('[data-a-target="player-overlay-mature-accept"]');
      if (b) b.click();
    }
    function clicarBau() {
      if (plat !== 'tw') return;
      const ic = $('.claimable-bonus__icon');
      const b = (ic && ic.closest('button')) || $('[data-test-selector="community-points-summary"] button[aria-label*="onus" i]');
      if (!b) return;
      b.click();
      const dia = new Date().toDateString();
      const c = ler('baus_tw', { dia, n: 0 });
      gravar('baus_tw', c.dia === dia ? { dia, n: c.n + 1 } : { dia, n: 1 });
    }
    // Tocando = algum player da página andou desde a última olhada (a página pode ter mais de um vídeo:
    // anúncio, prévia; olhar só o primeiro dava "sem vídeo" com a live rodando).
    const tempos = new WeakMap();
    function videoTocando() {
      if (plat === 'tw') clicarPortao();
      const vs = [...document.querySelectorAll('video')];
      if (!vs.length) return false;
      let ok = false;
      for (const v of vs) {
        const antes = tempos.get(v);
        if (!v.paused && v.readyState >= 2 && (antes === undefined ? v.currentTime > 0 : v.currentTime !== antes)) ok = true;
        tempos.set(v, v.currentTime);
      }
      // o player principal (o maior)
      const v = vs.slice().sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight))[0];
      if (!v) return ok;
      // Mudo do player pausa no fundo (Chrome 145+). Liga o som se a aba já recebeu um clique seu; sem clique,
      // ligar o som de um vídeo tocando faria o Chrome pausar, então só avisa.
      const clicada = !!(navigator.userActivation && navigator.userActivation.hasBeenActive);
      if ((v.muted || v.volume === 0) && clicada) { try { v.muted = false; if (v.volume === 0) v.volume = 0.05; } catch (e) { /* nada */ } }
      if (!ok && v.paused) {
        // parado: tenta dar play com som (o Chrome deixa se você costuma ver esse site com som);
        // se recusar e a aba estiver na tela, toca sem som (na tela o mudo não pausa)
        try {
          if (v.muted) v.muted = false;
          if (v.volume === 0) v.volume = 0.05;
          const pr = v.play();
          if (pr && pr.catch) pr.catch(() => { if (!document.hidden) { try { v.muted = true; v.play().catch(() => {}); } catch (e) { /* nada */ } } });
        } catch (e) { /* nada */ }
      }
      estado.mudo = !!(v.muted || v.volume === 0);
      return ok;
    }
    function saldoDaTela() {
      if (plat !== 'tw') return null;
      const el = $('[data-test-selector="copo-balance-string"]');
      return el ? lerNumeroTela(el.textContent) : null;
    }
    async function lerMeuSaldo(c) {
      try {
        if (plat === 'tw') {
          const r = await lerTwitch([c], true);
          if (typeof r.saldos[c] === 'number') return r.saldos[c];
        } else {
          return await lerKickSaldo(c);
        }
      } catch (e) { /* segue */ }
      return null;
    }

    let ultSaldoProprio = 0, esperando = 0, semVideo = 0;
    const ruins = {}; // canal -> até quando fica de fora (vídeo travado: 15 min; sem pontos com o vídeo rodando: 60 min)
    let testando = false;
    async function ciclo() {
      if (testando) return;
      atualizarCustos();
      const c0 = cfg();
      const n = Number(id.slice(2));
      if (!c0.ativo || n > (c0.abas[plat] || 0)) { fechar(); return; }
      await atualizarPlataforma(plat, id);
      const lista = canais(plat);
      const atual = canalDaUrl(plat);
      // Kick: a própria aba confere o seu canal a cada minuto (o líder confere todos a cada 3 min)
      if (plat === 'kk' && atual && lista.includes(atual)) {
        try { const v = await lerKickVivo(atual); v.tAba = agora(); const vv = ler('vivos_kk', {}); vv[atual] = v; gravar('vivos_kk', vv); } catch (e) { /* segue */ }
      }
      const vivos = ler('vivos_' + plat, {});
      const saldos = ler('saldos_' + plat, {});
      const hist = ler('hist_' + plat, {});
      const dt = Math.min(3, (agora() - ultCiclo) / MIN);
      ultCiclo = agora();
      const tAjuste = ler('t_ajuste_' + plat, 0);
      if (estado.ini && estado.ini.t < tAjuste) Object.assign(estado, { ini: null, ult: null, contando: null, porHora: null });

      // troca pedida antes e ainda não feita: a rota interna falhou, então recarrega
      if (navPendente) {
        if (atual === navPendente.alvo) navPendente = null;
        else if (agora() - navPendente.t > 90e3 && navPendente.modo !== 'recarga') {
          logar(NOME[plat] + ' ' + id + ': troca sem recarregar falhou, recarregando em ' + navPendente.alvo);
          navPendente.modo = 'recarga';
          location.assign(urlCanal(plat, navPendente.alvo));
          return;
        } else if (agora() - navPendente.t < 90e3) return;
      }

      // canais em outras abas desta plataforma (a de número menor fica com o canal) e canais travados
      const ocupados = new Set();
      for (const a of abasDe(plat)) {
        if (!a || a.id === id || agora() - a.t > 3 * MIN) continue;
        const na = Number(a.id.slice(2));
        if (a.canal && (a.canal !== atual || na < n)) ocupados.add(a.canal);
      }
      const rc = ler('ruim_' + id, null);
      if (rc && rc.canal && agora() - rc.t < (rc.min || 15) * MIN && !ruins[rc.canal]) {
        ruins[rc.canal] = rc.t + (rc.min || 15) * MIN;
        logar(NOME[plat] + ' ' + id + ': ' + rc.canal + (rc.motivo === 'contagem' ? ' não está dando pontos com o vídeo rodando' : ' não voltou nem aparecendo') + '; vou para outro canal por ' + (rc.min || 15) + ' min');
      }
      for (const c of Object.keys(ruins)) { if (ruins[c] > agora()) ocupados.add(c); else delete ruins[c]; }
      // 1.11: a central manda esta aba ficar com o canal de outra (que vai fechar) quando esta não ganha pontos
      const as = ler('assumir_' + id, null);
      if (as && as.canal && agora() - as.t < 3 * MIN) {
        gravar('assumir_' + id, null);
        if (as.canal !== atual) {
          ultTroca = agora(); parado = 0;
          Object.assign(estado, { canal: as.canal, desde: agora(), ini: null, ult: null, contando: null, porHora: null, t: agora() });
          gravar('aba_' + id, estado);
          const modo = navegar(as.canal);
          logar(NOME[plat] + ' ' + id + ': ficou com ' + as.canal + ' (da aba que fechou)' + (modo === 'recarga' ? ' (recarregou)' : ''));
          return;
        }
      }
      const atualValido = atual && lista.includes(atual);
      const alvo = escolherCanal({ plat, atual: atualValido ? atual : null, vivos, saldos, hist, ocupados, canais: lista, minSeq: SEQUENCIA_MIN, opcoes: ler('opcoes_' + plat, {}) });

      // troca de canal (no máximo a cada 3 min, a menos que o atual tenha saído do ar, travado ou não seja parceiro)
      const atualVivo = atualValido && vivos[atual] && vivos[atual].sid;
      if (alvo && alvo !== atual && (!atualVivo || agora() - ultTroca > 3 * MIN || ocupados.has(atual))) {
        ultTroca = agora();
        parado = 0;
        Object.assign(estado, { canal: alvo, desde: agora(), ini: null, ult: null, contando: null, porHora: null, t: agora() });
        gravar('aba_' + id, estado);
        const modo = navegar(alvo);
        logar(NOME[plat] + ' ' + id + ': ' + (atual ? (atualVivo ? (ocupados.has(atual) ? atual + ' travado ou em outra aba' : 'trocou ' + atual) : atual + ' fora do ar') + ' → ' : 'abriu ') + alvo +
          (precisaSequencia(plat, alvo, vivos, hist, SEQUENCIA_MIN) ? ' (sequência)' : '') + (modo === 'recarga' ? ' (recarregou)' : ''));
        return;
      }

      // no canal certo: confere o vídeo, a sequência e o saldo. Twitch e Kick só dão pontos com o vídeo rodando
      // (Kick medida às 22:24 de 17/11: 3 abas com o vídeo parado no fundo, +0 em 11 min).
      const escondida = document.hidden;
      const tocando = atualVivo ? videoTocando() : false;
      // no fundo com o vídeo parado: o Chrome segurando (aba que nunca apareceu, ou no mudo do player).
      // Não troca de canal nem traz a aba para a frente; o painel avisa.
      esperando = atualVivo && escondida && !tocando ? esperando + 1 : 0;
      if (esperando === 3) logar(NOME[plat] + ' ' + id + ': vídeo parado no fundo (' + atual + (estado.mudo ? ', no mudo do player' : '') + ')');
      estado.esperandoClique = esperando >= 2;
      parado = atualVivo && !escondida && !tocando ? parado + 1 : 0;
      // 1.9: a medição só vale com o vídeo rodando. Vídeo parado 2 min seguidos zera a medição, para não virar
      // "não está contando" (e fechar janela) por causa de vídeo parado.
      semVideo = atualVivo && !tocando ? semVideo + 1 : 0;
      if (semVideo >= 2 && estado.ini) Object.assign(estado, { ini: null, ult: null, contando: null, porHora: null });
      if (parado >= 4) {
        parado = 0;
        ruins[atual] = agora() + 15 * MIN;
        logar(NOME[plat] + ' ' + id + ': vídeo travado em ' + atual + ', vou para outro canal por 15 min');
        return;
      }
      if (estado.canal !== atual) Object.assign(estado, { canal: atual, desde: agora(), ini: null, ult: null, contando: null, porHora: null });
      if (atualVivo && tocando && plat === 'tw') {
        const sid = vivos[atual].sid;
        const h = hist[atual] && hist[atual].sid === sid ? hist[atual] : { sid, min: 0 };
        h.min = (h.min || 0) + dt;
        hist[atual] = h;
        gravar('hist_tw', hist);
      }
      // 1.17: tela de pontos aberta (Kick): guarda os pacotes de XP deste canal
      if (plat === 'kk' && document.body && /PokeIdle/i.test(document.body.textContent || '')) {
        const cab = [...document.querySelectorAll('h1, h2, h3, h4, div, span, p')].some((e) => e.children.length === 0 && /^(channel points|pontos do canal)$/i.test((e.textContent || '').trim()));
        if (cab) { const pr = premiosDaTela(); if (pr.length) guardarOpcoes('kk', atual, pr, 'tela'); }
      }
      // saldo exato do canal desta aba a cada 5 min
      if (atualVivo && agora() - ultSaldoProprio > 5 * MIN) {
        ultSaldoProprio = agora();
        let p = await lerMeuSaldo(atual);
        let fonte = 'conta';
        if (p == null) { p = saldoDaTela(); fonte = 'tela'; }
        if (p != null) {
          const anterior = (saldos[atual] || {}).pts;
          guardarSaldo(plat, atual, p, fonte);
          if (fonte === 'conta') {
            // resgate (saldo caiu): recomeça a medição a partir do saldo novo
            if (estado.ini && p < (estado.ult ? estado.ult.pts : estado.ini.pts)) Object.assign(estado, { ini: null, ult: null, contando: null, porHora: null });
            if (!estado.ini && semVideo === 0) estado.ini = { pts: p, t: agora() };
            else if (estado.ini) estado.ult = { pts: p, t: agora() };
            const av = avaliarContagem(estado.ini, estado.ult);
            estado.contando = av.contando;
            estado.porHora = av.porHora;
            if (plat === 'tw' && typeof anterior === 'number' && p - anterior >= 250 && hist[atual]) {
              hist[atual].min = Math.max(hist[atual].min || 0, SEQUENCIA_MIN);
              gravar('hist_tw', hist);
              logar('Twitch: bônus de sequência em ' + atual + ' (+' + (p - anterior) + ')');
            }
          }
        }
      }
      Object.assign(estado, { tocando, t: agora(), vivo: !!atualVivo, versao: VERSAO });
      gravar('aba_' + id, estado);
    }

    // 1.10: a central pede que esta aba apareça (vídeo parado no fundo). A aba vem para a frente, confere o vídeo
    // a cada segundo e avisa a central assim que ele andar (até 15 s); a central então volta para a frente.
    let mostrando = false;
    async function aparecer() {
      if (mostrando) return;
      mostrando = true;
      try {
        try { window.focus(); } catch (e) { /* nada */ }
        for (let i = 0; i < 15; i++) {
          await dorme(1000);
          if (!document.hidden && videoTocando()) {
            estado.tocando = true; estado.esperandoClique = false; esperando = 0; semVideo = 0;
            gravar('aba_' + id, Object.assign(estado, { t: agora() }));
            gravar('frente_ok', { id, t: agora() });
            return;
          }
        }
        gravar('frente_ok', { id, t: agora(), falhou: true });
      } finally { mostrando = false; }
    }
    try {
      GM_addValueChangeListener('frente', (k, antigo, val) => {
        if (val && val.id === id && agora() - val.t < 30e3) aparecer().catch(() => {});
      });
    } catch (e) { /* nada */ }
    // 1.14: teste de resgate (você aperta na central). A aba aparece, abre o menu de pontos do canal, anota o que vê,
    // resgata 1 vez o bônus de XP de 1 hora (nome e preço conferidos) e confere se o saldo caiu. Nunca tenta de novo sozinha.
    const RX_XP = /b[oô]nus\s*(de\s*)?\+?\s*15\s*%\s*(de\s*)?xp/i;
    function vis(el) { try { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; } catch (e) { return false; } }
    function txt(el) { return ((el && (el.innerText || el.textContent)) || '').replace(/\s+/g, ' ').trim(); }
    function rotulo(el) { return [el.getAttribute('aria-label'), el.getAttribute('title'), txt(el).slice(0, 40)].filter(Boolean).join(' / ').slice(0, 90); }
    function temNumero(t, n) { return new RegExp('(^|[^0-9.,])' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '[.,]?') + '([^0-9]|$)').test(t); }
    function menuAberto() {
      const ds = [...document.querySelectorAll('[role="dialog"], [role="menu"], [aria-modal="true"], [data-test-selector*="popover" i], .tw-balloon')].filter(vis);
      return ds[ds.length - 1] || null;
    }
    async function testarResgate(pedido) {
      if (testando) return;
      testando = true;
      const passos = [];
      const canal = canalDaUrl(plat);
      const fim = (ok, msg) => {
        passos.push(msg);
        const tp = (pedido && pedido.tipo) || 'xp', hh = (pedido && pedido.h) || 1;
        gravar('teste_resgate_fim', { id, plat, canal, t: agora(), ok, passos, tipo: tp, h: hh, nr: pedido && pedido.nr });
        gravar('teste_resgate_fim_' + plat, { id, plat, canal, t: agora(), ok, passos, tipo: tp, h: hh });
        logar(NOME[plat] + ' ' + id + ': resgate de ' + hh + ' h de ' + (NOME_TIPO[tp] || 'XP') + ' em ' + canal + (pedido && pedido.origem ? ' (' + pedido.origem + ')' : '') + (ok ? ' deu certo: ' : ' parou: ') + msg);
      };
      try {
        try { window.focus(); } catch (e) { /* nada */ }
        await dorme(2500);
        atualizarCustos();
        const tipo = (pedido && RX_TIPO[pedido.tipo]) ? pedido.tipo : 'xp';
        const RX = RX_TIPO[tipo];
        const custo = (pedido && pedido.custo) || CUSTO_HORA[plat];
        const antes = await lerMeuSaldo(canal);
        passos.push('canal ' + canal + ', saldo ' + antes + ', ' + NOME_TIPO[tipo] + ' ' + ((pedido && pedido.h) || 1) + ' h por ' + custo + (pedido && pedido.origem ? ' (' + pedido.origem + ')' : ''));
        if (antes == null || antes < custo) return fim(false, antes == null ? 'não consegui ler o saldo do canal' : 'saldo de ' + antes + ' não paga ' + custo + ' (resgatado antes do teste?)');
        // campos de texto que já existiam (o chat): só um campo NOVO depois de escolher a recompensa conta como "pede texto"
        const camposAntes = new Set(document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]'));
        // 1) o botão que abre o menu de pontos
        let botao = null;
        if (plat === 'tw') {
          const sum = $('[data-test-selector="community-points-summary"]');
          const bs = sum ? [...sum.querySelectorAll('button')].filter(vis) : [];
          passos.push('botões do resumo de pontos: ' + (bs.map(rotulo).join(' ; ') || 'nenhum (chat escondido?)'));
          botao = bs.find((b) => !b.querySelector('.claimable-bonus__icon') && !/b[oô]nus/i.test(b.getAttribute('aria-label') || '')) || null;
        } else {
          // 1.20: na Kick o botão dos pontos mostra o saldo (18/11 13:14: o único com "reward" no nome era o dos Drops)
          const todos = [...document.querySelectorAll('button, [role="button"]')].filter(vis);
          const num = (t) => {
            const m = String(t).replace(/\s/g, '').match(/^([0-9][0-9.,]*)(k|mil)?$/i);
            if (!m) return null;
            let v = Number(m[1].replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.'));
            if (m[2]) v *= 1000;
            return isFinite(v) ? v : null;
          };
          const porSaldo = todos.filter((b) => { const v = num(txt(b)); return v != null && antes > 0 && Math.abs(v - antes) <= Math.max(10, antes * 0.06); });
          const porNome = todos.filter((b) => /pontos do canal|channel points/i.test((b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '') + ' ' + txt(b).slice(0, 40)) && !/drops/i.test(txt(b)));
          passos.push('botões com o saldo: ' + (porSaldo.map(rotulo).join(' ; ') || 'nenhum') + ' | com "channel points": ' + (porNome.map(rotulo).join(' ; ') || 'nenhum'));
          const caixa = document.querySelector('textarea, [contenteditable="true"]');
          let perto = caixa; for (let i = 0; i < 4 && perto; i++) perto = perto.parentElement;
          if (perto) passos.push('botões perto do chat: ' + ([...perto.querySelectorAll('button, [role="button"]')].filter(vis).map(rotulo).join(' ; ') || 'nenhum'));
          const cands = porNome.length === 1 ? porNome : porSaldo;
          if (cands.length === 1) botao = cands[0];
        }
        if (!botao) return fim(false, 'não achei, com certeza, o botão do menu de pontos');
        botao.click();
        await dorme(2000);
        const menu = menuAberto();
        passos.push('menu: ' + (menu ? txt(menu).slice(0, 600) : 'nenhum menu à vista'));
        try { const pr = premiosDaTela(); if (pr.length) guardarOpcoes(plat, canal, pr, 'tela'); } catch (e) { /* nada */ }
        // 2) o cartão do bônus pedido, com o preço pedido
        const raiz = menu || document.body;
        const titulos = [...raiz.querySelectorAll('*')].filter((e) => RX.test(txt(e)) && ![...e.children].some((f) => RX.test(txt(f))));
        // 1.19: o cartão é o pedaço que tem o nome e o preço (sobe a partir do nome até aparecer um número, sem pegar
        // outro bônus de XP junto). Na Twitch, 18/11 11:42: o nome e o preço ficam em partes separadas do cartão.
        const contaXp = (t) => Object.values(RX_TIPO).reduce((n, rx) => n + (t.match(new RegExp(rx.source, 'gi')) || []).length, 0);
        const cartoes = titulos.map((e) => {
          let el = e;
          for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
            const t = txt(el);
            if (contaXp(t) > 1) return null;
            if (/(^|[^0-9.,%+])(\d{1,3}([.,]\d{3})+|\d{2,3})([^0-9%]|$)/.test(t.replace(RX, ' ').replace(/\(\s*\d+\s*h\s*\)/i, ' '))) return el;
          }
          return null;
        }).filter(Boolean);
        passos.push('cartões de ' + NOME_TIPO[tipo] + ': ' + (cartoes.map((c) => txt(c).slice(0, 60)).join(' ; ') || 'nenhum'));
        const cartao = cartoes.filter((c) => temNumero(txt(c), custo)).map((c) => c.closest('button, [role="button"], a') || c.querySelector('button, [role="button"]') || c);
        if (cartao.length !== 1) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return fim(false, cartao.length ? 'mais de um bônus de ' + NOME_TIPO[tipo] + ' com o preço de ' + custo : 'não achei o bônus de ' + NOME_TIPO[tipo] + ' de ' + custo + ' pontos'); }
        cartao[0].click();
        await dorme(2000);
        // 3) confirmar: botão "Resgatar" ou com o preço; nada de recompensa que pede texto
        const tela = menuAberto() || document.body;
        if ([...document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]')].some((e) => !camposAntes.has(e) && vis(e))) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return fim(false, 'a recompensa pede um texto; não confirmei'); }
        const confs = [...tela.querySelectorAll('button, [role="button"]')].filter(vis).filter((b) => b !== botao && b !== cartao[0] && (/resgatar|redeem/i.test(txt(b) + ' ' + (b.getAttribute('aria-label') || '')) || temNumero(txt(b), custo)));
        passos.push('botões de confirmar: ' + (confs.map(rotulo).join(' ; ') || 'nenhum') + ' | tela: ' + txt(tela).slice(0, 300));
        if (confs.length !== 1) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return fim(false, confs.length ? 'mais de um botão de confirmar; não cliquei' : 'não achei o botão de confirmar'); }
        confs[0].click();
        await dorme(6000);
        // 4) conferir pelo saldo
        const depois = await lerMeuSaldo(canal);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        if (depois != null) guardarSaldo(plat, canal, depois, 'conta');
        if (depois != null && antes - depois >= custo - 5) return fim(true, 'saldo ' + antes + ' → ' + depois);
        return fim(false, 'cliquei em confirmar, mas o saldo não caiu (' + antes + ' → ' + depois + ')');
      } catch (e) {
        fim(false, 'erro ' + String(e.message || e).slice(0, 100));
      } finally { testando = false; }
    }
    // 1.15: a central pede para esta aba recarregar quando há versão nova instalada (a aba volta no mesmo canal;
    // o vídeo que ficar parado no fundo a central traz de volta mostrando a aba uns segundos)
    try {
      GM_addValueChangeListener('recarregar_' + id, (k, a, val) => {
        if (val && agora() - val.t < 60e3 && versaoMaior(val.versao, VERSAO) && !testando) { logar(NOME[plat] + ' ' + id + ': recarregando para a versão ' + val.versao); location.reload(); }
      });
    } catch (e) { /* nada */ }
    try {
      GM_addValueChangeListener('teste_resgate', (k, a, val) => {
        if (val && val.id === id && agora() - val.t < 30e3) testarResgate(val).catch(() => {});
      });
    } catch (e) { /* nada */ }
    setInterval(clicarBau, 20e3);
    const rodar = () => ciclo().catch((e) => logar(NOME[plat] + ' ' + id + ': erro ' + String(e.message || e).slice(0, 120)));
    setTimeout(rodar, 12e3);
    setInterval(rodar, MIN);
  }

  // ===== PÁGINA DO JOGO =====
  // Lê o jogo pela ponte, guarda a sugestão para o monitor e responde ao "resgatar". Não abre abas: isso é da central.
  function iniciarJogo() {
    const meuId = idFixo('pk');
    // 1) lista de streamers oficiais: capturada dos links da página do jogo
    let agendado = false;
    function capturar() {
      agendado = false;
      const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.href);
      const achados = extrairCanais(hrefs);
      if (!achados.tw.length && !achados.kk.length) return;
      const salvos = ler('canais', { tw: [], kk: [] });
      let novos = 0;
      for (const p of ['tw', 'kk']) {
        const s = new Set(salvos[p] || []);
        for (const c of achados[p]) if (!s.has(c)) { s.add(c); novos++; }
        salvos[p] = [...s];
      }
      if (novos) { gravar('canais', salvos); logar('Lista de canais: +' + novos + ' (Twitch ' + salvos.tw.length + ', Kick ' + salvos.kk.length + ')'); }
    }
    new MutationObserver(() => { if (!agendado) { agendado = true; setTimeout(capturar, 3000); } })
      .observe(document.documentElement, { childList: true, subtree: true });

    // 2) bônus no jogo, recomendação para o monitor e vigia das abas
    function cicloJogo() {
      atualizarCustos();
      const twEl = $('[data-tw-fim]'), kkEl = $('[data-kk-fim]');
      const jogo = ler('jogo_bonus', null); // o fim do bônus que o próprio jogo informa vale mais que a tela
      const fresco = jogo && agora() - jogo.t < 15 * MIN;
      const bonus = {
        tw: fresco && jogo.tw != null ? jogo.tw : (twEl ? Number(twEl.getAttribute('data-tw-fim')) || 0 : null),
        kk: fresco && jogo.kk != null ? jogo.kk : (kkEl ? Number(kkEl.getAttribute('data-kk-fim')) || 0 : null), t: agora() };
      if (bonus.tw != null || bonus.kk != null) gravar('bonus', bonus);
      const reco = { t: agora(), versao: VERSAO };
      for (const p of ['tw', 'kk']) {
        const r = recomendar(p, ler('saldos_' + p, {}), ler('vivos_' + p, {}), ler('opcoes_' + p, {}));
        reco[p] = { canal: r.melhor ? r.melhor.canal : null, url: r.melhor ? urlCanal(p, r.melhor.canal) : null, pacote: r.melhor ? r.melhor.pacote : 0, banco: r.banco, ativoAte: bonus[p] || 0, texto: textoRecomendacao(p, r) };
      }
      gravar('reco', reco);
      try { localStorage.setItem('pokeidle-lives', JSON.stringify(reco)); } catch (e) { /* nada */ }

      gravar('jogo_vis', { t: agora(), visivel: document.visibilityState === 'visible' });
    }
    // 3) dados do próprio jogo pela ponte: a cada 2 min pede a última mensagem de estado completa (lista de parceiros,
    // ao vivo, custo da hora, fim do bônus). O monitor ignora respostas que não são para ele.
    const esperaPonte = new Map();
    function recebeuPonte(dado) {
      let x = null;
      try { x = typeof dado === 'string' ? JSON.parse(dado) : dado; } catch (e) { return; }
      const cb = x && esperaPonte.get(x.pedido);
      if (cb) { esperaPonte.delete(x.pedido); cb(x.tipos || {}); }
    }
    document.addEventListener('pokeidle-ponte-tipos', (e) => recebeuPonte(e.detail));
    window.addEventListener('message', (e) => {
      if (e.origin === location.origin && e.data && e.data.fonte === 'pokeidle-ponte' && e.data.canal === 'tipos') recebeuPonte(e.data.dado);
    });
    function aplicarJogo(d) {
      if (!d) return;
      const antes = ler('canais_jogo', null);
      const nova = { t: agora(), tw: (d.tw && d.tw.canais) || (antes && antes.tw) || [], kk: (d.kk && d.kk.canais) || (antes && antes.kk) || [] };
      for (const p of ['tw', 'kk']) {
        const velhos = new Set((antes && antes[p]) || []);
        const novos = nova[p].filter((c) => !velhos.has(c));
        if (antes && novos.length) logar(NOME[p] + ': parceiro novo no jogo: ' + novos.join(', '));
      }
      if (!antes) logar('Lista de parceiros do jogo: Twitch ' + nova.tw.length + ', Kick ' + nova.kk.length);
      gravar('canais_jogo', nova);
      const custos = ler('custos', {}), jb = { t: agora() };
      for (const p of ['tw', 'kk']) {
        if (!d[p]) continue;
        if (d[p].custo && d[p].custo !== custos[p]) { if (custos[p]) logar(NOME[p] + ': hora de XP passou de ' + custos[p] + ' para ' + d[p].custo + ' pontos'); custos[p] = d[p].custo; }
        jb[p] = d[p].fimXp;
        // Kick: quem está ao vivo vem do jogo (a aba de cada canal ainda confere o seu a cada minuto)
        if (p === 'kk') {
          const vivos = ler('vivos_kk', {}), aoVivo = new Set(d.kk.aoVivo);
          for (const c of nova.kk) {
            const v = vivos[c] || {};
            if (v.tAba && agora() - v.tAba < 2 * MIN) continue;
            vivos[c] = aoVivo.has(c) ? { sid: v.sid || 'jogo', desde: v.desde || agora() } : { sid: null };
          }
          gravar('vivos_kk', vivos);
        }
      }
      gravar('custos', custos);
      gravar('jogo_bonus', jb);
      gravar('t_jogo', agora());
      atualizarCustos();
    }
    function pedirJogo() {
      const nonce = 'lives' + Date.now() + Math.random();
      esperaPonte.set(nonce, (tipos) => {
        const g = tipos && tipos['estado|cheio'];
        const d = g && (lerEstadoJogo(g.recente) || lerEstadoJogo(g.maior));
        if (d) aplicarJogo(d);
      });
      setTimeout(() => esperaPonte.delete(nonce), 5000);
      document.dispatchEvent(new CustomEvent('pokeidle-monitor-lance', { detail: JSON.stringify({ fonte: 'pokeidle-monitor', pedir: 'tipos', chaves: ['estado|cheio'], nonce }) }));
    }
    setTimeout(pedirJogo, 5e3);
    setInterval(pedirJogo, 2 * MIN);

    // 4) pedidos do monitor (comando "resgatar..." no Telegram e aviso de bônus acabando): responde com o texto pronto.
    // Pedido: evento 'pokeidle-lives-pedido' (ou postMessage {fonte:'pokeidle-monitor-lives'}) com {nonce, texto}.
    // Resposta: evento 'pokeidle-lives-resposta' e postMessage {fonte:'pokeidle-lives'} com {nonce, texto}.
    const respondidos = new Set();
    function responder(ped) {
      if (!ped || !ped.nonce || respondidos.has(ped.nonce)) return;
      respondidos.add(ped.nonce);
      // 1.21: ordens de resgate (estruturadas, do monitor; ou em texto, do Telegram)
      let ordemRes = null;
      if (ped.ordem) ordemRes = criarOrdem(Object.assign({ plat: 'tw', origem: 'monitor' }, ped.ordem));
      const ot = !ped.ordem && !ped.consulta ? lerOrdemTexto(ped.texto, agora()) : null;
      const cmd = ped.ordem || ped.consulta || ot ? null : lerComandoResgate(ped.texto || 'resgatar');
      let texto;
      if (ordemRes) texto = ordemRes.texto;
      else if (ped.consulta) { const o = ler('ordens', []).find((x) => x.id === ped.consulta); texto = o ? textoOrdem(o) : 'Não achei essa ordem.'; ordemRes = { ordem: o || null }; }
      else if (ot) texto = ot.lista ? textoOrdens() : ot.erro ? ot.erro : (ordemRes = criarOrdem(Object.assign(ot, { origem: 'Telegram' }))).texto;
      else if (!cmd) texto = '';
      else {
        atualizarCustos();
        const bonus = ler('bonus', {}), jogo = ler('jogo_bonus', null);
        const el = { tw: $('[data-tw-fim]'), kk: $('[data-kk-fim]') };
        texto = cmd.plats.map((p) => {
          const fim = jogo && agora() - jogo.t < 15 * MIN && jogo[p] != null ? jogo[p] : (el[p] ? Number(el[p].getAttribute('data-' + p + '-fim')) || 0 : (bonus[p] || 0));
          const t = textoPlano(p, ler('saldos_' + p, {}), ler('vivos_' + p, {}), fim, cmd.horas, cmd.tudo, agora(), ler('opcoes_' + p, {}));
          const tS = ler('t_saldos_' + p, 0);
          const bq = ler('auto_bloq_' + p, null);
          return t + (tS && agora() - tS > 40 * MIN ? ' (pontos lidos às ' + hora(tS) + ')' : '') + (bq ? '\nO resgate automático parou às ' + hora(bq.t) + ': ' + bq.motivo + '.' : '');
        }).join('\n\n');
      }
      const out = JSON.stringify(Object.assign({ nonce: ped.nonce, texto, versao: VERSAO }, ordemRes ? { ordem: ordemRes.ordem || (ordemRes.id ? ler('ordens', []).find((x) => x.id === ordemRes.id) : null), aceita: ordemRes.ok !== false } : {}));
      document.dispatchEvent(new CustomEvent('pokeidle-lives-resposta', { detail: out }));
      window.postMessage({ fonte: 'pokeidle-lives', dado: out }, location.origin);
    }
    document.addEventListener('pokeidle-lives-pedido', (e) => { try { responder(JSON.parse(e.detail)); } catch (err) { /* nada */ } });
    window.addEventListener('message', (e) => {
      if (e.origin === location.origin && e.data && e.data.fonte === 'pokeidle-monitor-lives') { try { responder(typeof e.data.dado === 'string' ? JSON.parse(e.data.dado) : e.data.dado); } catch (err) { /* nada */ } }
    });
    setInterval(() => gravar('jogo_vis', { t: agora(), visivel: document.visibilityState === 'visible' }), 5e3);
    setTimeout(cicloJogo, 15e3);
    setInterval(cicloJogo, MIN);
  }


  // ===== CENTRAL (aba sem vídeo, numa janela só das lives) =====
  // Abre, reabre e ajusta as abas das lives. As abas abrem na janela onde a central está.
  let rodarCentralAgora = null;
  function iniciarCentral() {
    const meuId = idFixo('central');
    let painel = null;
    function montarPainel() {
      if (!document.body) return;
      if (painel && document.body.contains(painel)) return;
      painel = document.createElement('div');
      painel.id = 'pkl-central';
      painel.innerHTML = '<style>' +
        '#pkl-central{position:fixed;inset:0;z-index:2147483647;background:#14121a;color:#eee;font:15px/1.45 system-ui,sans-serif;padding:28px;overflow:auto}' +
        '#pkl-central h1{font-size:22px;margin:0 0 6px}#pkl-central .sub{color:#b9b4c8;margin:0 0 18px;max-width:760px}' +
        '#pkl-central button{font:600 15px system-ui,sans-serif;padding:10px 18px;margin:0 10px 10px 0;border-radius:10px;border:0;cursor:pointer;background:#3a3550;color:#fff}' +
        '#pkl-central .resg{margin:6px 0;color:#efeff1}#pkl-central .resg select{background:#26262c;color:#efeff1;border:1px solid #555;border-radius:6px;padding:6px;margin:0 4px}#pkl-central .segue{margin:4px 0 12px;max-width:900px}#pkl-central .segue a{color:#bf94ff}#pkl-central button.ligar{background:#7c4dff}#pkl-central pre{white-space:pre-wrap;background:#1d1a26;padding:14px;border-radius:10px;font:13px/1.5 ui-monospace,Consolas,monospace}' +
        '</style><h1>Central das lives (PokeIdle)</h1>' +
        '<p class="sub">As lives abrem em abas nesta janela, só quando você clica em Ligar ou +1. Quando uma live para no fundo (canal saiu do ar, live engasgou), esta janela mostra a aba dela uns segundos até o vídeo voltar e depois volta para a central. Deixe esta janela aparecendo na tela (não minimizada). Som: o Chrome já silencia twitch.tv e kick.com ("Silenciar site"); não use o mudo do vídeo.</p>' +
        '<div class="segue"></div>' +
        '<div><button class="ligar">Ligar</button><button class="desligar">Desligar</button><button class="plano">O que resgatar (12 h)</button><button class="relatorio">Relatório (arquivo)</button></div>' +
        '<div class="resg">Resgatar agora: <select class="r-plat"><option value="tw">Twitch</option><option value="kk">Kick</option></select> ' +
        '<select class="r-tipo"><option value="xp">XP</option><option value="captura">Captura</option><option value="lure">Lure</option></select> ' +
        '<select class="r-h"><option value="1">1 h</option><option value="3">3 h</option><option value="5">5 h</option><option value="10">10 h</option></select> ' +
        '<button class="resgatar">Resgatar</button></div>' +
        '<div><button class="mais" data-p="kk">Kick +1</button><button class="menos" data-p="kk">Kick −1</button><button class="mais" data-p="tw">Twitch +1</button><button class="menos" data-p="tw">Twitch −1</button></div>' +
        '<pre class="status">Carregando...</pre>';
      document.body.appendChild(painel);
      painel.querySelector('.ligar').onclick = () => {
        // ligado: abre o que falta; desligado: liga. Abas só abrem logo depois de um clique seu aqui.
        if (!cfg().ativo) ligar();
        else for (const p of ['tw', 'kk']) for (let i = 1; i <= 8; i++) gravar('t_abriu_' + p + i, 0);
        gravar('pode_abrir_ate', agora() + 3 * MIN);
        mostrar();
        setTimeout(ciclo, 300);
      };
      painel.querySelector('.desligar').onclick = () => { desligar(); mostrar(); };
      painel.querySelector('.resgatar').onclick = () => resgatarAgora(painel.querySelector('.r-plat').value, painel.querySelector('.r-tipo').value, Number(painel.querySelector('.r-h').value)).catch(() => {});
      painel.querySelectorAll('.mais, .menos').forEach((b) => {
        b.onclick = () => {
          const p = b.dataset.p, mais = b.classList.contains('mais');
          const r = mudarAbas(p, mais ? 1 : -1);
          if (r) { gravar('pode_abrir_ate', agora() + 3 * MIN); setTimeout(ciclo, 300); }
          mostrar();
        };
      });
      painel.querySelector('.plano').onclick = () => alert(textoPlanoAgora());
      painel.querySelector('.relatorio').onclick = relatorio;
    }
    function mostrar() {
      montarPainel();
      const el = painel && painel.querySelector('.status');
      const sg = painel && painel.querySelector('.segue');
      if (sg) {
        const partes = [];
        for (const p of ['tw', 'kk']) {
          const nao = naoSegue(p);
          if (nao.length) partes.push('<b>' + NOME[p] + ', parceiros que você não segue</b>' + (p === 'tw' ? ' (seguir dá +300 pontos de uma vez em cada)' : '') + ': ' +
            nao.map((c) => '<a href="' + urlCanal(p, c) + '" target="_blank" rel="noopener">' + c + '</a>').join(', '));
        }
        const html = partes.join('<br>');
        if (sg.dataset.html !== html) { sg.dataset.html = html; sg.innerHTML = html; }
      }
      if (el) el.textContent = (ler('aviso_popup', 0) ? 'ATENÇÃO: o Chrome bloqueou pop-ups desta página. Clique no ícone de pop-up bloqueado na barra de endereço desta janela e escolha "Sempre permitir pop-ups e redirecionamentos de www.twitch.tv". Sem isso, abas novas podem abrir na janela que estiver ativa.\n\n' : '') + montarRelatorio(true);
    }
    function ciclo() {
      atualizarCustos();
      gravar('central', { id: meuId, t: agora() });
      const c0 = cfg();
      if (!c0.ativo || !souLider('central', meuId, 150e3)) return;
      // número de abas de cada plataforma, pela medição
      for (const p of ['tw', 'kk']) {
        const tAj = ler('t_ajuste_' + p, 0);
        const frescas = abasDe(p).filter((a) => a && agora() - a.t < 3 * MIN && Number(a.id.slice(2)) <= c0.abas[p]);
        const medidas = frescas.filter((a) => a.vivo && a.ini && a.ini.t >= tAj).map((a) => a.contando);
        const vivos = ler('vivos_' + p, {});
        const nVivos = canais(p).filter((c) => vivos[c] && vivos[c].sid).length;
        const r = ajustarAbas(p, Object.assign({}, ler('ajuste_' + p, {}), { n: c0.abas[p] }), medidas, nVivos, agora(), true);
        // 1.11: aba que não ganha pontos com o vídeo rodando. Primeiro ela troca de canal (o canal pode ser o problema);
        // se de novo não ganhar, é ela que sai: fica com o canal da última aba, e a última fecha.
        const falha = frescas.find((a) => a.vivo && a.ini && a.ini.t >= tAj && a.contando === false);
        if (falha && (r.acao === 'aba' || r.acao === 'limite')) {
          const tc = ler('troca_contagem_' + falha.id, null);
          if (!tc || agora() - tc.t > 45 * MIN) {
            gravar('troca_contagem_' + falha.id, { t: agora(), canal: falha.canal });
            gravar('ruim_' + falha.id, { canal: falha.canal, t: agora(), min: 60, motivo: 'contagem' });
            gravar('t_ajuste_' + p, agora()); // recomeça as medições
            logar(NOME[p] + ': a aba ' + falha.id + ' (' + falha.canal + ') ' + (falha.porHora > 0 ? 'está ganhando pouco (' + falha.porHora + ' pontos/h)' : 'não ganhou pontos em 20 min') + ' com o vídeo rodando; ela vai tentar outro canal');
            continue;
          }
          const ultima = frescas.filter((a) => Number(a.id.slice(2)) === c0.abas[p])[0];
          if (ultima && ultima.id !== falha.id && ultima.canal) gravar('assumir_' + falha.id, { canal: ultima.canal, t: agora() });
          if (r.est.n >= 2) r.est.teto = { n: r.est.n, t: agora() };
          gravar('troca_contagem_' + falha.id, null);
          logar(NOME[p] + ': a aba ' + falha.id + ' também não ganhou pontos no outro canal; ' + NOME[p] + ' parece contar só ' + r.est.n + ' ao mesmo tempo' +
            (ultima && ultima.id !== falha.id ? '; ' + falha.id + ' fica com ' + ultima.canal + ' e ' + ultima.id + ' fecha' : '') + (r.est.n >= 2 ? ' (limite anotado por ' + TETO_DIAS + ' dias)' : ''));
        }
        gravar('ajuste_' + p, r.est);
        // 1.7: subir é com o botão +1 (abrir aba sozinho tiraria o foco do jogo); aqui só guarda a sugestão
        if (r.acao === 'pode') { if (!ler('pode_subir_' + p, null)) gravar('pode_subir_' + p, { n: r.est.n + 1, t: agora() }); continue; }
        if (!r.acao) continue;
        gravar('pode_subir_' + p, null);
        c0.abas[p] = r.est.n;
        gravar('cfg', c0);
        gravar('t_ajuste_' + p, agora());
        const txt = {
          teste: 'testando ' + r.est.n + ' abas',
          volta: 'voltando para ' + r.est.n + ' abas',
          limite: 'com mais abas alguma parou de contar; limite ' + r.est.n + ' (testa de novo em ' + TETO_DIAS + ' dias)',
          fora: 'todas as abas pararam de contar (live em outro aparelho ou janela?); ' + r.est.n + ' aba(s); para voltar, use o +1 na central',
          aba: 'uma aba parou de contar; ' + r.est.n + ' abas',
        }[r.acao];
        logar(NOME[p] + ': ' + txt);
      }
      abrirAbas(c0);
    }
    // Abre ou reabre as abas que faltam, só nos 3 min depois de um clique seu em Ligar ou +1.
    // Abrir aba sozinha, com você no jogo, puxaria o foco do jogo.
    let abrindo = false;
    async function abrirAbas(c0) {
      if (abrindo || agora() > ler('pode_abrir_ate', 0)) return;
      abrindo = true;
      try {
        let algumaAbriu = false;
        const escolhidos = new Set();
        for (const p of ['tw', 'kk']) {
          const lista = canais(p);
          if (!lista.length) continue;
          for (let i = 1; i <= c0.abas[p]; i++) {
            const id = p + i;
            const a = ler('aba_' + id, null);
            if (a && agora() - a.t < 4 * MIN) continue;
            if (agora() - ler('t_abriu_' + id, 0) < 5 * MIN) continue;
            if (agora() > ler('pode_abrir_ate', 0) || !cfg().ativo) return;
            gravar('t_abriu_' + id, agora());
            const vivos = ler('vivos_' + p, {});
            const ocupados = new Set(abasDe(p).filter((x) => x && x.id !== id && agora() - x.t < 3 * MIN).map((x) => x.canal));
            escolhidos.forEach((c) => ocupados.add(c));
            const alvo = escolherCanal({ plat: p, vivos, saldos: ler('saldos_' + p, {}), hist: ler('hist_' + p, {}), ocupados, canais: lista, opcoes: ler('opcoes_' + p, {}) }) ||
              lista.filter((c) => !ocupados.has(c))[0] || lista[(i - 1) % lista.length];
            escolhidos.add(alvo);
            gravar('aba_' + id, { id, plat: p, canal: alvo, desde: agora(), t: agora(), abrindo: true }); // reserva o canal até a aba responder
            // 1.10: de volta às abas, na janela da central (a aba nova aparece uns segundos e o vídeo começa).
            // Se o Chrome bloquear (pop-up), cai no Tampermonkey, que abre na janela ativa (esta, porque você acabou de clicar aqui).
            let w = null;
            try { w = window.open(urlCanal(p, alvo) + '#pkl=' + id, '_blank'); } catch (e) { w = null; }
            if (!w) {
              GM_openInTab(urlCanal(p, alvo) + '#pkl=' + id, { active: true, insert: true, setParent: true });
              if (!ler('aviso_popup', 0)) { gravar('aviso_popup', agora()); logar('O Chrome bloqueou a central de abrir abas: permita pop-ups de twitch.tv (ícone na barra de endereço da central)'); }
            } else gravar('aviso_popup', 0);
            logar((a ? 'Reabri' : 'Abri') + ' a aba ' + id + ' em ' + alvo);
            algumaAbriu = true;
            await dorme(7000);
          }
        }
        if (algumaAbriu) { await dorme(1500); try { window.focus(); } catch (e) { /* nada */ } }
      } finally { abrindo = false; }
    }

    // 1.10: aba com o vídeo parado no fundo (troca de canal da Kick recarregou a página, live engasgou): o Chrome só
    // volta a tocar quando ela aparece. A central mostra essa aba até o vídeo andar (até 15 s) e volta para a frente.
    // No máximo uma por minuto, cada aba no máximo a cada 5 min; se 3 tentativas no mesmo canal falham, a aba troca de canal.
    let ultMexida = 0, trazendo = false;
    ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => document.addEventListener(ev, () => { ultMexida = agora(); }, { passive: true, capture: true }));
    async function reiniciarAba() {
      if (trazendo || !cfg().ativo || agora() - ler('t_trouxe', 0) < MIN) return;
      if (document.hasFocus() && agora() - ultMexida < 20e3) return; // você está lendo a central agora
      const tent = ler('tentativas_frente', {});
      const c0 = cfg();
      const parada = [...abasDe('tw'), ...abasDe('kk')].find((a) => {
        if (!a || !a.esperandoClique || !a.vivo || agora() - a.t > 3 * MIN) return false;
        if (Number(a.id.slice(2)) > (c0.abas[a.plat] || 0)) return false;
        const x = tent[a.id + ':' + a.canal] || { n: 0, t: 0 };
        return x.n < 3 && agora() - x.t > 5 * MIN;
      });
      if (!parada) return;
      const k = parada.id + ':' + parada.canal, x = tent[k] || { n: 0, t: 0 };
      tent[k] = { n: x.n + 1, t: agora() };
      for (const kk of Object.keys(tent)) if (agora() - tent[kk].t > 2 * H) delete tent[kk];
      gravar('tentativas_frente', tent);
      trazendo = true;
      const t0 = agora();
      try {
        gravar('t_trouxe', t0);
        gravar('frente', { id: parada.id, t: t0 });
        let ok = null;
        for (let i = 0; i < 18; i++) {
          await dorme(1000);
          const f = ler('frente_ok', null);
          if (f && f.id === parada.id && f.t >= t0) { ok = !f.falhou; break; }
        }
        await dorme(800);
        try { window.focus(); } catch (e) { /* nada */ }
        if (ok) {
          // 1.17: deu certo, zera a conta (antes, 3 sucessos travavam o pulo por 2 h e a aba ficava parada)
          const t2 = ler('tentativas_frente', {}); delete t2[k]; gravar('tentativas_frente', t2);
          logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei e o vídeo voltou');
        } else if (x.n + 1 >= 3) {
          const t2 = ler('tentativas_frente', {}); delete t2[k]; gravar('tentativas_frente', t2);
          gravar('ruim_' + parada.id, { canal: parada.canal, t: agora(), min: 60 });
          logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei 3 vezes e o vídeo não voltou; ela vai para outro canal por 60 min');
        }
        else logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei e o vídeo ainda não voltou');
      } finally { trazendo = false; }
    }
    setInterval(() => { reiniciarAba().catch(() => {}); }, 15e3);

    // 1.20: resgate (XP, Captura ou Lure). A aba faz os cliques do jeito que você faria, confere nome, preço e saldo
    // e para se algo não bater. Se o canal escolhido não estiver aberto, a primeira aba da plataforma vai até ele.
    let resgatando = false;
    function custoNoCanal(p, c, tipo, h) {
      const op = (ler('opcoes_' + p, {}) || {})[c];
      const ts = op && op.tipos && op.tipos[tipo];
      const x = ts && ts.find((q) => q.h === h);
      if (x) return { custo: x.custo, certo: true };
      if (tipo === 'xp' && !(op && op.hs && op.hs.length)) return { custo: h * CUSTO_HORA[p], certo: false };
      return null;
    }
    function abasAbertas(p) {
      return abasDe(p).filter((a) => a && agora() - a.t < 3 * MIN && Number(a.id.slice(2)) <= (cfg().abas[p] || 0));
    }
    // canais que pagam "h" horas de "tipo": abertos primeiro, depois mais pontos
    function canaisQuePagam(p, tipo, h) {
      const saldos = ler('saldos_' + p, {}), abertas = abasAbertas(p);
      return Object.keys(saldos).map((c) => {
        const k = custoNoCanal(p, c, tipo, h);
        return k && { c, pts: (saldos[c] || {}).pts || 0, custo: k.custo, certo: k.certo, aba: abertas.find((a) => a.canal === c) || null };
      }).filter((x) => x && x.pts >= x.custo).sort((a, b) => (!!b.aba - !!a.aba) || b.pts - a.pts);
    }
    async function executarResgate(o) {
      if (resgatando) return null;
      resgatando = true;
      try {
        let aba = o.aba;
        if (!aba) {
          aba = abasAbertas(o.p)[0];
          if (!aba) { logar(NOME[o.p] + ': resgate não feito, nenhuma aba aberta'); return null; }
          gravar('assumir_' + aba.id, { canal: o.canal, t: agora() });
          logar(NOME[o.p] + ': a aba ' + aba.id + ' vai até ' + o.canal + ' para o resgate');
          let chegou = false;
          for (let i = 0; i < 100 && !chegou; i++) { await dorme(1000); const a = ler('aba_' + aba.id, null); chegou = !!(a && a.canal === o.canal); }
          if (!chegou) { logar(NOME[o.p] + ': a aba ' + aba.id + ' não chegou em ' + o.canal + '; resgate não feito'); return null; }
          await dorme(10000);
        }
        const jb0 = ler('jogo_bonus', null), fim0 = jb0 ? Number(jb0[o.p]) || 0 : 0;
        const t0 = agora();
        const nr = Math.random().toString(36).slice(2, 10);
        gravar('teste_resgate', { id: aba.id, t: t0, tipo: o.tipo, h: o.h, custo: o.custo, origem: o.origem, nr });
        let r = null;
        for (let i = 0; i < 60 && !r; i++) {
          await dorme(1000);
          const f = ler('teste_resgate_fim', null);
          if (f && f.id === aba.id && f.t >= t0 && f.nr === nr) r = f;
        }
        try { window.focus(); } catch (e) { /* nada */ }
        mostrar();
        ghRelatorio('resgate ' + o.origem).catch(() => {});
        if (!r) { logar(NOME[o.p] + ': o resgate não respondeu em 60 s'); return { ok: false }; }
        if (r.ok && o.tipo === 'xp') {
          gravar('auto_ok_' + o.p, true); gravar('auto_bloq_' + o.p, null); gravar('auto_falhas_' + o.p, 0);
          setTimeout(() => {
            const j = ler('jogo_bonus', null), fim1 = j ? Number(j[o.p]) || 0 : 0;
            const base = Math.max(fim0, t0);
            const recebeu = fim1 - base > o.h * H - 20 * MIN;
            logar(NOME[o.p] + ': no jogo, o XP ia até ' + (fim0 ? hora(fim0) : '?') + ' e agora vai até ' + (fim1 ? hora(fim1) : '?') + (recebeu ? ' (o jogo recebeu ' + o.h + ' h)' : ' (o jogo ainda não mostrou as ' + o.h + ' h)'));
            if (!recebeu && o.origem === 'automático') { gravar('auto_bloq_' + o.p, { t: agora(), motivo: 'o jogo não mostrou as horas resgatadas' }); logar(NOME[o.p] + ': resgate automático desligado até um resgate certo pelo painel'); }
            mostrar();
            ghRelatorio('5 min depois do resgate').catch(() => {});
          }, 5 * MIN);
        }
        return r;
      } finally { resgatando = false; }
    }
    async function resgatarAgora(p, tipo, h) {
      atualizarCustos();
      const cs = canaisQuePagam(p, tipo, h);
      if (!cs.length) {
        const op = ler('opcoes_' + p, {}), saldos = ler('saldos_' + p, {});
        const tem = Object.keys(op).filter((c) => custoNoCanal(p, c, tipo, h)).map((c) => c + ' (' + milhar((saldos[c] || {}).pts || 0) + ' de ' + milhar(custoNoCanal(p, c, tipo, h).custo) + ')').slice(0, 8);
        alert(NOME[p] + ': nenhum canal tem pontos para ' + h + ' h de ' + NOME_TIPO[tipo] + '.' + (tem.length ? ' Canais com esse pacote: ' + tem.join(', ') + '.' : ' Nenhum canal conferido tem esse pacote.'));
        return;
      }
      const x = cs[0];
      if (!confirm('Resgatar ' + h + ' h de ' + NOME_TIPO[tipo] + ' em ' + urlCurta(p, x.c) + ' (' + milhar(x.custo) + ' pontos; o canal tem ' + milhar(x.pts) + ')' + (x.certo ? '' : ', se o canal tiver esse pacote') + '?' +
        (x.aba ? ' A aba ' + x.aba.id + ' vai aparecer uns segundos.' : ' A aba ' + ((abasAbertas(p)[0] || {}).id || '?') + ' vai até esse canal antes.'))) return;
      logar(NOME[p] + ': resgate de ' + h + ' h de ' + NOME_TIPO[tipo] + ' pedido em ' + x.c);
      await executarResgate({ p, tipo, h, custo: x.custo, canal: x.c, aba: x.aba, origem: 'painel' });
    }
    // 1.20: resgate automático de XP (escolha dela: só XP, quando faltar menos de 3 h). Só depois de um resgate de XP
    // certo nessa plataforma; maior pacote até 10 h; no máximo 30 h por dia; 2 falhas, ou o jogo sem mostrar as horas,
    // desligam até um resgate certo pelo painel.
    const AUTO_XP_ABAIXO = 3 * H;
    const autoXpEstado = autoXpEstadoGlobal;
    async function autoXp() {
      if (!cfg().ativo || resgatando || trazendo) return;
      if (document.hasFocus() && agora() - ultMexida < 30e3) return;
      const jogo = ler('jogo_bonus', null);
      if (!jogo || agora() - jogo.t > 15 * MIN) return;
      for (const p of ['tw', 'kk']) {
        if (!/^ligado/.test(autoXpEstado(p))) continue;
        const fim = Number(jogo[p]) || 0;
        if (fim - agora() >= AUTO_XP_ABAIXO) continue;
        if (agora() - ler('auto_ult_' + p, 0) < 20 * MIN) continue;
        const dia = new Date().toDateString(), d = ler('auto_dia_' + p, { dia: '', h: 0 });
        const hojeH = d.dia === dia ? d.h : 0;
        if (hojeH >= 30) continue;
        let escolha = null;
        for (const h of [10, 5, 3, 1]) {
          if (hojeH + h > 30) continue;
          const cs = canaisQuePagam(p, 'xp', h).filter((x) => x.certo);
          if (cs.length) { escolha = Object.assign({ h }, cs[0]); break; }
        }
        if (!escolha) {
          if (agora() - ler('auto_sem_' + p, 0) > H) { gravar('auto_sem_' + p, agora()); logar(NOME[p] + ': XP acaba às ' + hora(fim) + ' e nenhum canal conferido tem pontos para um pacote de XP'); }
          continue;
        }
        gravar('auto_ult_' + p, agora());
        logar(NOME[p] + ': XP acaba às ' + (fim > agora() ? hora(fim) : 'já acabou') + '; resgate automático de ' + escolha.h + ' h em ' + escolha.c);
        const r = await executarResgate({ p, tipo: 'xp', h: escolha.h, custo: escolha.custo, canal: escolha.c, aba: escolha.aba, origem: 'automático' });
        if (r && r.ok) {
          gravar('auto_dia_' + p, { dia, h: hojeH + escolha.h });
          gravar('auto_feito_' + p, { t: agora(), h: escolha.h, canal: escolha.c });
        } else {
          const f = ler('auto_falhas_' + p, 0) + 1;
          gravar('auto_falhas_' + p, f);
          if (f >= 2) { gravar('auto_bloq_' + p, { t: agora(), motivo: '2 resgates seguidos não deram certo' }); logar(NOME[p] + ': resgate automático desligado depois de 2 falhas; um resgate certo pelo painel liga de novo'); }
        }
        return;
      }
    }
    setInterval(() => { autoXp().catch(() => {}); }, 2 * MIN);

    // 1.21: executa as ordens de resgate (Twitch). Pacotes do mesmo canal somando as horas pedidas (2 h = 1 + 1);
    // Captura e Lure só se, depois, a Twitch ainda tiver 30 h de XP guardadas. Ordem marcada para um horário espera;
    // passou 2 h do horário, ou 6 h sem horário, expira.
    function mudarOrdem(id, campos) {
      const os = ler('ordens', []), o = os.find((x) => x.id === id);
      if (!o) return null;
      Object.assign(o, campos, { t: agora() });
      gravar('ordens', os);
      return o;
    }
    async function executarOrdens() {
      if (!cfg().ativo || resgatando || trazendo) return;
      const o = ler('ordens', []).find((x) => x.estado === 'pendente' && (x.quando || 0) <= agora());
      if (!o) return;
      if (agora() - (o.quando || o.criada) > (o.quando ? 2 : 6) * H) { mudarOrdem(o.id, { estado: 'expirou', detalhe: 'não deu para resgatar a tempo' }); logar('Ordem ' + o.id + ' expirou'); return; }
      atualizarCustos();
      const saldos = ler('saldos_tw', {}), op = ler('opcoes_tw', {}), abertas = abasAbertas('tw');
      const opcoesCanal = Object.keys(saldos).map((c) => {
        const ts = (op[c] && op[c].tipos && op[c].tipos[o.tipo]) || [];
        const comb = ts.length ? combinarPacotes(o.h, ts.map((x) => x.h)) : null;
        const custo = comb ? comb.reduce((n, h) => n + ts.find((x) => x.h === h).custo, 0) : 0;
        return comb && { c, pts: (saldos[c] || {}).pts || 0, comb, custo, ts, aba: abertas.find((a) => a.canal === c) || null };
      }).filter((x) => x && x.pts >= x.custo).sort((a, b) => (a.comb.length - b.comb.length) || (!!b.aba - !!a.aba) || b.pts - a.pts);
      if (!opcoesCanal.length) { mudarOrdem(o.id, { estado: 'falhou', detalhe: 'nenhum canal da Twitch tem pacotes de ' + NOME_TIPO[o.tipo] + ' que somem ' + o.h + ' h com pontos para pagar' }); logar('Ordem ' + o.id + ' não feita: nenhum canal paga ' + o.h + ' h de ' + NOME_TIPO[o.tipo]); ghRelatorio('ordem').catch(() => {}); return; }
      const x = opcoesCanal[0];
      if (o.tipo !== 'xp') {
        const total = Object.values(saldos).reduce((n, s) => n + ((s && s.pts) || 0), 0);
        if (total - x.custo < RESERVA_XP_H * CUSTO_HORA.tw) {
          mudarOrdem(o.id, { estado: 'falhou', detalhe: 'deixaria menos de ' + RESERVA_XP_H + ' h de XP na Twitch (' + milhar(total) + ' pontos no total, custa ' + milhar(x.custo) + ')' });
          logar('Ordem ' + o.id + ' não feita: reserva de XP'); ghRelatorio('ordem').catch(() => {}); return;
        }
      }
      mudarOrdem(o.id, { estado: 'andamento', detalhe: x.comb.join(' h + ') + ' h em ' + x.c });
      logar('Ordem ' + o.id + ': resgatando ' + NOME_TIPO[o.tipo] + ' ' + x.comb.join(' h + ') + ' h em ' + x.c + ' (' + milhar(x.custo) + ' pontos)');
      let feitas = 0;
      for (const h of x.comb) {
        const r = await executarResgate({ p: 'tw', tipo: o.tipo, h, custo: x.ts.find((q) => q.h === h).custo, canal: x.c, aba: feitas ? (abasAbertas('tw').find((a) => a.canal === x.c) || x.aba) : x.aba, origem: 'ordem' });
        if (!(r && r.ok)) break;
        feitas += h;
      }
      const ok = feitas === o.h;
      mudarOrdem(o.id, { estado: ok ? 'feito' : 'falhou', detalhe: (ok ? '' : 'resgatou ' + feitas + ' de ' + o.h + ' h; ') + x.c + ', ' + hora(agora()) });
      logar('Ordem ' + o.id + (ok ? ' feita: ' : ' não terminou: ') + NOME_TIPO[o.tipo] + ' ' + feitas + ' de ' + o.h + ' h em ' + x.c);
      ghRelatorio('ordem').catch(() => {});
    }
    setInterval(() => { executarOrdens().catch(() => {}); }, 30e3);

    // 1.15: atualização sem cliques. O Tampermonkey instala a versão nova do repositório no intervalo dele; as páginas
    // abertas continuam com a antiga até recarregar. A central confere a versão publicada a cada 10 min: se for maior que
    // a dela, ela se recarrega (no máximo a cada 30 min) e, já na versão nova, recarrega as abas antigas, uma a cada 90 s.
    const URL_REPO = 'https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-lives.user.js';
    const carregadaEm = agora();
    async function conferirVersao() {
      try {
        const r = await fetch(URL_REPO + '?t=' + Math.floor(agora() / 60e3), { cache: 'no-store' });
        if (!r.ok) return;
        const m = (await r.text()).match(/@version\s+([0-9.]+)/);
        if (!m) return;
        gravar('versao_repo', { v: m[1], t: agora() });
        if (versaoMaior(m[1], VERSAO) && agora() - carregadaEm > 2 * MIN && agora() - ler('t_central_recarregou', 0) > 30 * MIN &&
          !(document.hasFocus() && agora() - ultMexida < 60e3)) {
          gravar('t_central_recarregou', agora());
          logar('Central: versão ' + m[1] + ' publicada (esta é a ' + VERSAO + '); recarregando a central');
          location.reload();
        }
      } catch (e) { /* sem rede: tenta depois */ }
    }
    function recarregarAbasAntigas() {
      if (!cfg().ativo || agora() - ler('t_recarregou_aba', 0) < 90e3) return;
      const velha = [...abasDe('tw'), ...abasDe('kk')].find((a) => a && a.versao && versaoMaior(VERSAO, a.versao) && agora() - a.t < 3 * MIN &&
        agora() - ler('t_pediu_recarga_' + a.id, 0) > 10 * MIN);
      if (!velha) return;
      gravar('t_recarregou_aba', agora());
      gravar('t_pediu_recarga_' + velha.id, agora());
      logar('Central: pedindo para a aba ' + velha.id + ' recarregar (' + velha.versao + ' → ' + VERSAO + ')');
      gravar('recarregar_' + velha.id, { t: agora(), versao: VERSAO });
    }
    // 1.16: relatório no GitHub a cada 30 min (só a central manda, para não repetir)
    setInterval(() => { if (souLider('github', meuId, 5 * MIN) && agora() - Math.max(ler('ghUltimo', 0), ler('ghTentou', 0)) > GH_AUTO) { gravar('ghTentou', agora()); ghRelatorio('automático').catch(() => {}); } }, 60e3);
    setTimeout(() => { conferirVersao(); }, 60e3);
    setInterval(() => { conferirVersao(); }, 10 * MIN);
    setInterval(recarregarAbasAntigas, 30e3);

    rodarCentralAgora = () => setTimeout(ciclo, 500);
    try { GM_addValueChangeListener('cfg', (k, antes, depois, remoto) => { if (remoto && depois && depois.ativo && agora() - (depois.ligadoEm || 0) < 30e3) setTimeout(ciclo, 500); }); } catch (e) { /* nada */ }
    document.title = 'Central das lives';
    gravar('central', { id: meuId, t: agora() });
    setInterval(() => { gravar('central', { id: meuId, t: agora() }); if (document.title !== 'Central das lives') document.title = 'Central das lives'; mostrar(); }, 10e3);
    setTimeout(mostrar, 1500);
    setTimeout(ciclo, 5e3);
    setInterval(ciclo, MIN);
  }

  // ===== RELATÓRIO =====
  function montarRelatorio(curto) {
    atualizarCustos();
    const c0 = cfg();
    const linhas = [];
    const t = agora();
    const d = new Date(t);
    const vr = ler('versao_repo', null);
    linhas.push('PokeIdle lives ' + VERSAO + ', ' + (curto ? 'situação às ' : 'relatório de ' + d.toLocaleDateString('pt-BR') + ' ') + hora(t) +
      (vr && versaoMaior(vr.v, VERSAO) ? ' (a ' + vr.v + ' já está publicada; quando o Tampermonkey instalar, a central recarrega sozinha)' : ''));
    const ce = ler('central', null), jv = ler('jogo_vis', null), cj0 = ler('canais_jogo', null);
    linhas.push('Central: ' + (ce && t - ce.t < 2 * MIN ? 'aberta' : 'fechada (abra pelo menu do jogo: "Lives: abrir a central")') +
      '; aba do jogo: ' + (jv && t - jv.t < 3 * MIN ? 'aberta' : 'sem sinal') + '; lista de parceiros: ' + (cj0 && t - cj0.t < 2 * 24 * H ? 'do jogo (' + hora(cj0.t) + ')' : 'reserva fixa de 17/11'));
    linhas.push('Resgate automático de XP: Twitch ' + autoXpEstadoGlobal('tw') + '; Kick ' + autoXpEstadoGlobal('kk'));
    const ordensAbertas = ler('ordens', []).filter((o) => o.estado === 'pendente' || o.estado === 'andamento');
    if (curto && ordensAbertas.length) linhas.push('Ordens de resgate: ' + ordensAbertas.map(textoOrdem).join('; '));
    if (!curto) { const gk = ler('gravacao_kk', []); if (gk.length) { linhas.push('Gravação da Kick (1.22; últimos ' + gk.length + '):'); gk.slice(-25).forEach((g) => linhas.push(' ' + hora(g.t) + ' ' + JSON.stringify(Object.assign({}, g, { t: undefined })).slice(0, 700))); } }
    if (!curto && ler('ordens', []).length) { linhas.push('Ordens de resgate (as 10 últimas):'); ler('ordens', []).slice(-10).forEach((o) => linhas.push(' ' + o.id + ' ' + new Date(o.criada).toLocaleDateString('pt-BR').slice(0, 5) + ' ' + hora(o.criada) + ' (' + o.origem + (o.motivo ? ', ' + o.motivo : '') + '): ' + textoOrdem(o))); }
    const ghU = ler('ghUltimo', 0);
    linhas.push('GitHub: ' + (ghChave() ? 'relatório enviado ' + (ghU ? 'às ' + hora(ghU) : 'ainda não') + ' (lives/relatorio.txt, a cada 30 min)' : 'sem a chave (menu do Tampermonkey: "Lives: colar a chave do GitHub")'));
    const baus = ler('baus_tw', { dia: '', n: 0 });
    linhas.push('Situação: ' + (c0.ativo ? 'ligado' : 'desligado') + '; abas: Twitch ' + c0.abas.tw + ', Kick ' + c0.abas.kk +
      '; baús da Twitch hoje: ' + (baus.dia === new Date().toDateString() ? baus.n : 0));
    for (const p of ['tw', 'kk']) {
      const aj = ler('ajuste_' + p, {});
      linhas.push(NOME[p] + ' abas: ' + c0.abas[p] + (aj.bom ? '; todas contaram com até ' + aj.bom : '') + (aj.teto ? '; limite ' + aj.teto.n + ' desde ' + new Date(aj.teto.t).toLocaleDateString('pt-BR') : '; sem limite descoberto (máximo ' + ABAS_MAX[p] + ')') + (aj.teste ? '; em teste' : ''));
      const vivas = abasDe(p).filter((a) => a && t - a.t < 4 * MIN && Number(a.id.slice(2)) <= c0.abas[p]).length;
      if (c0.ativo && vivas < c0.abas[p]) linhas.push('  ' + NOME[p] + ': ' + (c0.abas[p] - vivas) + ' aba(s) faltando; clique em Ligar para abrir');
      const ps = ler('pode_subir_' + p, null);
      if (c0.ativo && ps && c0.abas[p] > 0 && ps.n === c0.abas[p] + 1) linhas.push('  ' + NOME[p] + ': as ' + c0.abas[p] + ' abas estão contando; para testar ' + ps.n + ', clique em ' + NOME[p] + ' +1');
    }
    const bonus = ler('bonus', {}), reco = ler('reco', {});
    for (const p of ['tw', 'kk']) {
      const fim = bonus[p];
      const r = reco[p] || {};
      linhas.push(NOME[p] + ': XP ativo ' + (fim && fim > t ? 'até ' + hora(fim) + ' (falta ' + Math.floor((fim - t) / H) + 'h' + String(Math.floor(((fim - t) % H) / MIN)).padStart(2, '0') + ')' : 'desligado') +
        '; no banco ' + (r.banco || 0) + ' h; ' + (r.texto || ''));
    }
    linhas.push('');
    linhas.push('Abas:');
    for (const p of ['tw', 'kk']) {
      for (const a of abasDe(p)) {
        if (!a) continue;
        const idade = Math.round((t - a.t) / MIN);
        const ganho = a.ini && a.ult ? ' (' + (a.ult.pts - a.ini.pts >= 0 ? '+' : '') + (a.ult.pts - a.ini.pts) + ' pontos em ' + Math.round((a.ult.t - a.ini.t) / MIN) + ' min)' : '';
        const veredito = a.contando === true ? 'CONTANDO' + ganho : a.contando === false ? (a.porHora > 0 ? 'GANHANDO POUCO' : 'NÃO está contando') + ganho :
          'medindo' + (ganho || (a.ini ? ' (segunda leitura em até 5 min)' : a.tocando ? ' (primeira leitura em até 5 min)' : ' (mede quando o vídeo rodar)'));
        const video = a.tocando ? ', vídeo rodando' + (a.mudo ? ' (no mudo do player)' : '') :
          a.esperandoClique ? ', vídeo parado no fundo (a central vai mostrar essa aba para o vídeo voltar)' : '';
        linhas.push(' ' + a.id + ': ' + (a.canal || '?') + (a.vivo ? '' : ' (fora do ar)') + ', ' + veredito + video +
          ', ' + Math.round((t - (a.desde || t)) / MIN) + ' min no canal' +
          (idade > 3 ? ', sem sinal há ' + idade + ' min' : ''));
      }
    }
    for (const p of ['tw', 'kk']) {
      const saldos = ler('saldos_' + p, {}), vivos = ler('vivos_' + p, {}), hist = ler('hist_' + p, {});
      const lista = canais(p);
      if (curto) {
        const nv = lista.filter((c) => vivos[c] && vivos[c].sid).length, lidos = lista.filter((c) => saldos[c]).length;
        linhas.push('');
        linhas.push(NOME[p] + ': ' + lista.length + ' parceiros, ' + nv + ' ao vivo, saldo lido em ' + lidos);
        continue;
      }
      linhas.push('');
      const cj = ler('canais_jogo', null);
      linhas.push('Canais ' + NOME[p] + ' (' + lista.length + (cj && agora() - cj.t < 2 * 24 * H ? ', lista do jogo de ' + hora(cj.t) : ', lista dos links') + '; hora de XP = ' + CUSTO_HORA[p] + ' pontos):');
      lista.slice().sort((a, b) => ((saldos[b] || {}).pts || 0) - ((saldos[a] || {}).pts || 0)).forEach((c) => {
        const s = saldos[c];
        const op = (ler('opcoes_' + p, {}) || {})[c];
        linhas.push(' ' + c + ': ' + (s ? s.pts + ' pontos (' + hora(s.t) + ', ' + s.fonte + ')' : 'sem leitura') + (vivos[c] && vivos[c].sid ? ', ao vivo' : '') +
          (p === 'tw' && hist[c] ? ', ' + Math.round(hist[c].min) + ' min na live ' + hist[c].sid : '') +
          (op ? ', ' + descreverPacotes(op) : ''));
      });
      const pe = ler('premios_estado_' + p, null);
      linhas.push(' Pacotes de XP: ' + Object.keys(ler('opcoes_' + p, {})).length + ' canais conferidos' + (pe ? ' (última leitura ' + hora(pe.t) + (pe.erro ? ', erro: ' + pe.erro : '') + ')' : '') +
        (p === 'kk' ? '; sonda da API: ' + (JSON.stringify(ler('kk_premios_sonda', {})) || '{}') + '; a tela de pontos aberta numa aba também conta' : ''));
    }
    // 1.20: preços de Captura e Lure nos canais com pontos para algum pacote
    if (!curto) for (const p of ['tw', 'kk']) {
      const op = ler('opcoes_' + p, {}), saldos = ler('saldos_' + p, {});
      const ls = Object.keys(op).filter((c) => op[c].tipos).map((c) => ({ c, pts: (saldos[c] || {}).pts || 0, t: op[c].tipos }))
        .filter((x) => ['captura', 'lure'].some((k) => (x.t[k] || []).some((q) => q.custo <= x.pts))).sort((a, b) => b.pts - a.pts);
      if (!ls.length) continue;
      linhas.push('');
      linhas.push(NOME[p] + ', Captura e Lure nos canais com pontos (horas: preço):');
      ls.forEach((x) => linhas.push(' ' + x.c + ' (' + milhar(x.pts) + '): ' + ['captura', 'lure'].filter((k) => (x.t[k] || []).length).map((k) => NOME_TIPO[k] + ' ' + x.t[k].map((q) => q.h + ' h ' + milhar(q.custo)).join(', ')).join('; ')));
    }
    for (const p of ['tw', 'kk']) {
      const sg = ler('segue_' + p, null);
      if (!sg || curto) continue;
      const nao = naoSegue(p);
      linhas.push('');
      linhas.push(NOME[p] + ': você não segue ' + nao.length + ' parceiro(s) (conferido às ' + hora(sg.t) + ')' + (nao.length ? ': ' + nao.map((c) => urlCurta(p, c)).join(', ') : ''));
    }
    for (const p of ['tw', 'kk']) {
      const tr = ler('teste_resgate_fim_' + p, null) || ((ler('teste_resgate_fim', null) || {}).plat === p ? ler('teste_resgate_fim', null) : null);
      if (!tr || curto) continue;
      linhas.push('');
      linhas.push('Último teste de resgate (' + NOME[tr.plat] + ', ' + tr.id + ', ' + tr.canal + ', ' + new Date(tr.t).toLocaleDateString('pt-BR').slice(0, 5) + ' ' + hora(tr.t) + '): ' + (tr.ok ? 'deu certo' : 'parou'));
      (tr.passos || []).forEach((x) => linhas.push('  ' + x));
    }
    linhas.push('');
    linhas.push('Eventos:');
    ler('log', []).slice(curto ? -12 : -150).forEach(([tt, txt]) => linhas.push(' ' + new Date(tt).toLocaleDateString('pt-BR').slice(0, 5) + ' ' + hora(tt) + ' ' + txt));
    return linhas.join('\n');
  }
  function relatorio() {
    ghRelatorio('pedido').catch(() => {});
    const t = agora(), d = new Date(t);
    const texto = montarRelatorio(false);
    const dataLocal = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const nome = 'pokeidle-lives_relatorio_' + dataLocal + '_' + hora(t).replace(':', 'h') + '.txt';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
    a.download = nome;
    (document.body || document.documentElement).appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
  }

  // ===== LIGAR, DESLIGAR, PLANO =====
  function ligar() {
    const c0 = cfg();
    c0.ativo = true;
    c0.abas = {};
    for (const p of ['tw', 'kk']) {
      // começa no maior número em que todas as abas já contaram (sem passar do limite descoberto)
      const aj = ler('ajuste_' + p, {});
      const teto = aj.teto && agora() - aj.teto.t <= TETO_DIAS * 24 * H ? aj.teto.n : ABAS_MAX[p];
      c0.abas[p] = Math.min(teto, Math.max(ABAS_PADRAO[p], aj.bom || 0));
    }
    c0.ligadoEm = agora();
    for (const p of ['tw', 'kk']) {
      for (let i = 1; i <= 8; i++) gravar('t_abriu_' + p + i, 0);
      gravar('varreu_' + p, 0);
      gravar('t_saldos_' + p, 0);
      gravar('t_vivos_' + p, 0);
      gravar('t_ajuste_' + p, agora());
      const aj = ler('ajuste_' + p, {});
      gravar('ajuste_' + p, Object.assign(aj, { n: c0.abas[p], ultAjuste: agora(), teste: false }));
    }
    gravar('cfg', c0);
    logar('Ligado (Twitch ' + c0.abas.tw + ', Kick ' + c0.abas.kk + ')');
  }
  // botões +1 e −1 da central (subir é sempre escolha sua; cair também acontece sozinho quando uma aba para de contar)
  function mudarAbas(p, d) {
    const c0 = cfg();
    const n0 = c0.abas[p] || 0;
    const n = Math.max(0, Math.min(ABAS_MAX[p], n0 + d));
    if (n === n0) return false;
    c0.abas[p] = n;
    gravar('cfg', c0);
    const aj = ler('ajuste_' + p, {});
    gravar('ajuste_' + p, Object.assign(aj, { n, ultAjuste: agora(), teste: d > 0 && n > (aj.bom || 0) }));
    gravar('t_ajuste_' + p, agora());
    gravar('pode_subir_' + p, null);
    logar(NOME[p] + ': ' + n + ' aba(s) (você clicou ' + (d > 0 ? '+1' : '−1') + ')');
    return d > 0 && !!c0.ativo;
  }
  function desligar() {
    const c0 = cfg();
    c0.ativo = false;
    gravar('cfg', c0);
    logar('Desligado');
  }
  function textoPlanoAgora() {
    atualizarCustos();
    const jogo = ler('jogo_bonus', null), bonus = ler('bonus', {});
    return ['tw', 'kk'].map((p) => textoPlano(p, ler('saldos_' + p, {}), ler('vivos_' + p, {}),
      jogo && agora() - jogo.t < 15 * MIN && jogo[p] != null ? jogo[p] : (bonus[p] || 0), 12, false, agora(), ler('opcoes_' + p, {}))).join('\n\n');
  }

  // ===== GITHUB (1.16) =====
  // O relatório vai para o repositório PRIVADO dela, para o Claude ler direto. A chave de escrita fica só no
  // Tampermonkey (menu "Lives: colar a chave do GitHub"); nunca no arquivo do script, que é público.
  const GH_REPO = 'beatrizfontenelle/relatorios', GH_RAMO = 'main', GH_ARQ = 'lives/relatorio.txt', GH_AUTO = 30 * MIN;
  const ghChave = () => { try { return String(GM_getValue('ghChave', '') || ''); } catch (e) { return ''; } };
  function ghB64(texto) {
    const u = new TextEncoder().encode(texto), N = 0x2000 * 3; let out = '';
    for (let i = 0; i < u.length; i += N) out += btoa(String.fromCharCode.apply(null, u.subarray(i, i + N)));
    return out;
  }
  const ghUrl = (caminho) => 'https://api.github.com/repos/' + GH_REPO + '/contents/' + String(caminho).split('/').map(encodeURIComponent).join('/');
  function ghSha(caminho, cab) {
    return new Promise((ok) => {
      const i = caminho.lastIndexOf('/'), pasta = i > 0 ? caminho.slice(0, i) : '', nome = caminho.slice(i + 1);
      GM_xmlhttpRequest({ method: 'GET', url: ghUrl(pasta) + '?ref=' + GH_RAMO, headers: cab, timeout: 30000,
        onload: (r) => { let sha = ''; try { const l = JSON.parse(r.responseText); if (Array.isArray(l)) { const x = l.find((y) => y && y.name === nome); sha = x ? x.sha : ''; } } catch (e) { /* nada */ } ok(sha); },
        onerror: () => ok(null), ontimeout: () => ok(null) });
    });
  }
  // grava (cria ou substitui) um arquivo no repositório; devolve { ok, motivo }
  function ghSubir(caminho, texto, msg) {
    return new Promise((fim) => {
      const chave = ghChave();
      if (!chave) return fim({ ok: false, motivo: 'sem a chave do GitHub' });
      let conteudo; try { conteudo = ghB64(texto); } catch (e) { return fim({ ok: false, motivo: 'não consegui preparar o arquivo' }); }
      const cab = { Authorization: 'Bearer ' + chave, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
      const shas = ler('ghShas', {});
      const tentar = (sha, vez) => GM_xmlhttpRequest({ method: 'PUT', url: ghUrl(caminho), headers: cab, timeout: 120000,
        data: JSON.stringify(Object.assign({ message: msg, content: conteudo, branch: GH_RAMO }, sha ? { sha } : {})),
        onload: (r) => {
          if (r.status === 200 || r.status === 201) { try { shas[caminho] = JSON.parse(r.responseText).content.sha; gravar('ghShas', shas); } catch (e) { /* nada */ } return fim({ ok: true, motivo: '' }); }
          if ((r.status === 409 || r.status === 422) && vez < 3) return setTimeout(() => ghSha(caminho, cab).then((s2) => (s2 === null ? fim({ ok: false, motivo: 'o GitHub não respondeu' }) : tentar(s2, vez + 1))), 2000 + Math.floor(Math.random() * 4000));
          fim({ ok: false, motivo: r.status === 401 ? 'a chave do GitHub não vale mais (401)' : r.status === 403 || r.status === 404 ? 'a chave não tem permissão de escrita no repositório (' + r.status + ')' : 'o GitHub respondeu ' + r.status });
        },
        onerror: () => fim({ ok: false, motivo: 'falha de rede com o GitHub' }), ontimeout: () => fim({ ok: false, motivo: 'o GitHub demorou demais' }) });
      tentar(shas[caminho] || '', 0);
    });
  }
  async function ghRelatorio(motivo) {
    if (!ghChave()) return null;
    const r = await ghSubir(GH_ARQ, montarRelatorio(false), 'lives ' + VERSAO + ', ' + motivo + ', ' + new Date().toLocaleString('pt-BR').slice(0, 17));
    if (r.ok) gravar('ghUltimo', agora());
    else if (agora() - ler('ghFalhaAviso', 0) > 12 * H) { gravar('ghFalhaAviso', agora()); logar('GitHub: não consegui gravar o relatório (' + r.motivo + ')'); }
    return r;
  }
  function ghMenuChave() {
    const txt = (prompt('Cole a chave do GitHub que escreve no repositório privado "relatorios" (começa com github_pat_). Fica guardada só no Tampermonkey deste script. Deixe vazio e confirme para desligar.') || '').trim();
    if (!txt) { if (ghChave() && confirm('Desligar o envio do relatório das lives para o GitHub?')) { GM_setValue('ghChave', ''); alert('Desligado.'); } return; }
    if (!/^(github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{30,})$/.test(txt)) { alert('Isso não parece uma chave do GitHub (github_pat_...). Nada foi guardado.'); return; }
    GM_setValue('ghChave', txt);
    ghSubir('teste/lives.txt', 'Teste de escrita das lives em ' + new Date().toLocaleString('pt-BR') + '.\n', 'teste de escrita (lives)')
      .then((r) => {
        alert(r.ok ? 'Chave guardada e testada: consegui gravar no repositório. O relatório das lives passa a ir para lá a cada 30 min.' : 'Guardei a chave, mas o teste de escrita falhou: ' + r.motivo + '.');
        if (r.ok) ghRelatorio('primeiro envio');
      });
  }

  // ===== MENU DO TAMPERMONKEY =====
  GM_registerMenuCommand('Lives: abrir a central (janela das lives)', () => {
    if (centralViva() && !confirm('A central já está aberta em alguma janela. Abrir outra?')) return;
    GM_openInTab(URL_CENTRAL, { active: true, insert: true });
  });
  GM_registerMenuCommand('Lives: desligar', () => { desligar(); alert('Lives desligadas. As abas se fecham em até 1 minuto.'); });
  GM_registerMenuCommand('Lives: relatório (arquivo)', relatorio);
  GM_registerMenuCommand('Lives: colar a chave do GitHub (relatórios)', ghMenuChave);
  GM_registerMenuCommand('Lives: o que resgatar (12 h)', () => alert(textoPlanoAgora()));
  GM_registerMenuCommand('Lives: colar lista de canais', () => {
    const txt = prompt('Cole a lista de streamers do jogo (links, ou uma linha "twitch: nome1, nome2" e outra "kick: nome3, nome4"):', '');
    if (!txt) return;
    const novos = lerListaColada(txt);
    const salvos = ler('canais', { tw: [], kk: [] });
    for (const p of ['tw', 'kk']) salvos[p] = [...new Set([...(salvos[p] || []), ...novos[p]])];
    gravar('canais', salvos);
    logar('Lista colada: Twitch ' + novos.tw.length + ', Kick ' + novos.kk.length);
    alert('Guardado: Twitch ' + salvos.tw.length + ' canais, Kick ' + salvos.kk.length + ' canais.');
  });

  // ===== QUEM SOU EU =====
  const plat = plataformaDaPagina();
  if (plat) {
    const id = idDaAba();
    if (id === 'central') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarCentral); else iniciarCentral(); }
    else if (id && id.slice(0, 2) === plat) iniciarAba(plat, id);
  } else if (location.hostname === 'pokeidle.io') {
    iniciarJogo();
  }
})();
