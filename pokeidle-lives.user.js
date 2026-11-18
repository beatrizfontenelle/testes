// ==UserScript==
// @name         PokeIdle: lives (Twitch e Kick)
// @namespace    biafontenelle.pokeidle
// @version      1.14
// @updateURL    https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-lives.user.js
// @downloadURL  https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-lives.user.js
// @description  (1.14: botões "Testar resgate" na central: resgata 1 hora de XP uma vez, com a aba à vista, conferindo nome, preço e saldo, e anota o que viu no menu de pontos (primeiro passo do resgate automático)) (1.13: aba que, depois de 30 min, ganha menos da metade do ritmo normal (10 pontos a cada 5 min) passa a contar como "ganhando pouco": troca de canal e, se continuar, sai, e o limite fica anotado) (1.12: mesma regra da 1.11; só passa a se atualizar sozinho pelo repositório) (1.11: aba com o vídeo rodando que não ganha pontos troca de canal primeiro; se continuar sem ganhar, é ela que sai (não outra aba que estava contando) e o limite fica anotado por 7 dias) (1.10: de volta às abas, na janela da central; quando uma live para no fundo (troca de canal da Kick, live engasgada), a central mostra essa aba uns segundos até o vídeo andar e volta; o relatório lista os parceiros que você não segue (seguir dá +300 de uma vez na Twitch)) (1.9: cada live numa janelinha própria, empilhadas no canto inferior direito (à vista, o vídeo reinicia sozinho quando a live troca de canal ou engasga); vídeo parado não conta mais como limite e não fecha aba; resgate não conta como perda) (1.8: a Kick também só dá pontos com o vídeo rodando (medido às 22:24): Kick e Twitch com o som ligado no player, nunca no mudo do player) (1.7: Twitch com o som ligado no player (silencie pelo Chrome: botão direito na aba, Silenciar site), porque vídeo no mudo pausa quando a aba vai para o fundo; nada de mostrar aba sozinho; abas só abrem quando você clica em Ligar ou +1 na central; botões +1 e −1 por plataforma; o número de abas só cai sozinho) (1.6: vídeo conta como tocando se qualquer player da página anda (anúncio não engana mais); mede os pontos mesmo sem achar o vídeo; traz aba para a frente no máximo 3 vezes por canal e não fica indo e voltando) (1.5: a central abre as abas na janela dela mesma, mesmo com você em outra janela) (1.4: resgate de 1 hora entra na conta: qualquer canal com 200 pontos na Kick ou 300 na Twitch já serve) (1.3: as lives rodam numa janela separada do jogo, comandadas por uma aba "central" com botões; lista fixa de parceiros de reserva) (1.2: lista de parceiros, quem está ao vivo, custo por hora e fim do bônus lidos do próprio jogo pela ponte; responde ao comando "resgatar" do Telegram (pelo monitor) com o plano de resgate) (1.1: varre os saldos de todos os parceiros antes de abrir as abas; número de abas se ajusta sozinho pela medição: Kick sobe até 6, Twitch testa 3 uma vez, e cai quando uma live em outro aparelho atrapalha) Mantém 2 lives da Twitch e de 3 a 6 da Kick rodando nos canais parceiros do PokeIdle, troca sozinho quando um canal sai do ar, clica no baú da Twitch, guarda o saldo de cada canal e calcula onde resgatar o +15% de XP. Não resgata nada e não manda mensagem.
// @match        https://www.twitch.tv/*
// @match        https://kick.com/*
// @match        https://pokeidle.io/app*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        window.focus
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';
  const VERSAO = '1.14';

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
  function horasResgataveis(saldo, custo) {
    return Math.max(0, Math.floor((Number(saldo) || 0) / custo));
  }
  function melhorPacote(saldo, custo) {
    const h = Math.floor((Number(saldo) || 0) / custo);
    return PACOTES.find((p) => p <= h) || 0;
  }
  function urlCanal(plat, canal) { return plat === 'tw' ? 'https://www.twitch.tv/' + canal : 'https://kick.com/' + canal; }
  function urlCurta(plat, canal) { return (plat === 'tw' ? 'twitch.tv/' : 'kick.com/') + canal; }

  // Onde resgatar: o canal que compra mais horas; no empate, o que está ao vivo; depois o de mais pontos.
  function recomendar(plat, saldos, vivos) {
    const custo = CUSTO_HORA[plat];
    let melhor = null, banco = 0;
    for (const canal of Object.keys(saldos || {})) {
      const pts = Number((saldos[canal] || {}).pts) || 0;
      const horas = horasResgataveis(pts, custo);
      banco += horas;
      if (!horas) continue;
      const vivo = !!(vivos && vivos[canal] && vivos[canal].sid);
      const c = { canal, pts, horas, pacote: melhorPacote(pts, custo), vivo };
      if (!melhor || c.horas > melhor.horas || (c.horas === melhor.horas && (c.vivo > melhor.vivo || (c.vivo === melhor.vivo && c.pts > melhor.pts)))) melhor = c;
    }
    return { melhor, banco };
  }
  function textoRecomendacao(plat, r) {
    if (!r || !r.melhor) return NOME[plat] + ': nenhum canal com ' + CUSTO_HORA[plat] + ' pontos ainda';
    return NOME[plat] + ': entre em ' + urlCurta(plat, r.melhor.canal) + ' e resgate ' + r.melhor.pacote + ' h';
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
  function planoResgate(plat, saldos, vivos, falta, tudo) {
    const custo = CUSTO_HORA[plat];
    const lista = Object.keys(saldos || {}).map((c) => ({ canal: c, pts: Number((saldos[c] || {}).pts) || 0, vivo: !!(vivos && vivos[c] && vivos[c].sid) }))
      .filter((x) => x.pts >= custo)
      .sort((a, b) => (b.pts - a.pts) || (b.vivo - a.vivo) || (a.canal < b.canal ? -1 : 1));
    let resta = tudo ? Infinity : Math.max(0, Math.ceil(falta));
    const itens = [];
    for (const x of lista) {
      if (resta <= 0) break;
      let pts = x.pts;
      const pacotes = [];
      while (resta > 0) {
        const cabe = Math.floor(pts / custo);
        const fecha = PACOTES.slice().reverse().find((p) => p >= resta && p <= cabe);
        const p = fecha || PACOTES.find((q) => q <= cabe);
        if (!p) break;
        pacotes.push(p);
        pts -= p * custo;
        resta -= p;
      }
      if (pacotes.length) {
        const horas = pacotes.reduce((a, b) => a + b, 0);
        itens.push({ canal: x.canal, vivo: x.vivo, pacotes, horas, pontos: horas * custo });
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
  function textoPlano(plat, saldos, vivos, ativoAte, alvo, tudo, agoraT) {
    const fimAtual = ativoAte && ativoAte > agoraT ? ativoAte : agoraT;
    const tem = (fimAtual - agoraT) / H;
    const cab = NOME[plat] + ': XP ' + (ativoAte && ativoAte > agoraT ? 'até ' + horaCurta(ativoAte, agoraT) : 'desligado');
    const falta = tudo ? 0 : alvo - tem;
    if (!tudo && falta <= 0) return cab + '. Já cobre ' + alvo + ' h, nada a resgatar.';
    const pl = planoResgate(plat, saldos, vivos, falta, tudo);
    if (!pl.itens.length) return cab + '. Nenhum canal com ' + milhar(CUSTO_HORA[plat]) + ' pontos ainda.';
    const fim = fimAtual + pl.total * H;
    const L = [cab + '. ' + (tudo ? 'Resgatando tudo' : 'Para ' + alvo + ' h') + ', fica até ' + horaCurta(fim, agoraT) + (pl.faltou ? ' (só dá ' + Math.round(tem + pl.total) + ' h)' : '') + ':'];
    pl.itens.forEach((x, i) => L.push((i + 1) + '. ' + urlCurta(plat, x.canal) + ': ' + x.pacotes.join(' h + ') + ' h (' + milhar(x.pontos) + ' pontos)'));
    if (!tudo && !pl.faltou) {
      const max = planoResgate(plat, saldos, vivos, 0, true).total;
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

  const PURAS = { horasResgataveis, melhorPacote, recomendar, textoRecomendacao, precisaSequencia, escolherCanal, extrairCanais, lerListaColada, lerNumeroTela, avaliarContagem, ajustarAbas, urlCanal, planoResgate, textoPlano, lerComandoResgate, lerEstadoJogo, posicaoJanela };
  if (typeof window === 'undefined' || typeof GM_getValue === 'undefined') {
    if (typeof module !== 'undefined') module.exports = PURAS;
    return;
  }

  // ===== NAVEGADOR =====
  const agora = () => Date.now();
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
    const r = recomendar(plat, saldos, ler('vivos_' + plat, {}));
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
    if (!querVivo && !querSaldo && !querSegue) return;
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
      const alvo = escolherCanal({ plat, atual: atualValido ? atual : null, vivos, saldos, hist, ocupados, canais: lista, minSeq: SEQUENCIA_MIN });

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
      Object.assign(estado, { tocando, t: agora(), vivo: !!atualVivo });
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
    async function testarResgate() {
      if (testando) return;
      testando = true;
      const passos = [];
      const canal = canalDaUrl(plat);
      const fim = (ok, msg) => {
        passos.push(msg);
        gravar('teste_resgate_fim', { id, plat, canal, t: agora(), ok, passos });
        logar(NOME[plat] + ' ' + id + ': teste de resgate em ' + canal + (ok ? ' deu certo: ' : ' parou: ') + msg);
      };
      try {
        try { window.focus(); } catch (e) { /* nada */ }
        await dorme(2500);
        atualizarCustos();
        const custo = CUSTO_HORA[plat];
        const antes = await lerMeuSaldo(canal);
        passos.push('canal ' + canal + ', saldo ' + antes + ', custo de 1 h ' + custo);
        if (antes == null || antes < custo) return fim(false, 'saldo insuficiente ou ilegível');
        // 1) o botão que abre o menu de pontos
        let botao = null;
        if (plat === 'tw') {
          const sum = $('[data-test-selector="community-points-summary"]');
          const bs = sum ? [...sum.querySelectorAll('button')].filter(vis) : [];
          passos.push('botões do resumo de pontos: ' + (bs.map(rotulo).join(' ; ') || 'nenhum (chat escondido?)'));
          botao = bs.find((b) => !b.querySelector('.claimable-bonus__icon') && !/b[oô]nus/i.test(b.getAttribute('aria-label') || '')) || null;
        } else {
          const cands = [...document.querySelectorAll('button, [role="button"]')].filter(vis)
            .filter((b) => /pontos|points|recompensa|reward/i.test((b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('title') || '') + ' ' + txt(b).slice(0, 40)));
          passos.push('botões candidatos: ' + (cands.map(rotulo).join(' ; ') || 'nenhum'));
          if (cands.length === 1) botao = cands[0];
        }
        if (!botao) return fim(false, 'não achei, com certeza, o botão do menu de pontos');
        botao.click();
        await dorme(2000);
        const menu = menuAberto();
        passos.push('menu: ' + (menu ? txt(menu).slice(0, 600) : 'nenhum menu à vista'));
        // 2) o bônus de XP de 1 hora: cartão com o nome certo e o preço de 1 hora
        const raiz = menu || document.body;
        const titulos = [...raiz.querySelectorAll('*')].filter((e) => RX_XP.test(txt(e)) && ![...e.children].some((f) => RX_XP.test(txt(f))));
        const cartoes = titulos.map((e) => e.closest('button, [role="button"]') || e.parentElement).filter(Boolean);
        passos.push('cartões de XP: ' + (cartoes.map((c) => txt(c).slice(0, 60)).join(' ; ') || 'nenhum'));
        const cartao = cartoes.filter((c) => temNumero(txt(c), custo));
        if (cartao.length !== 1) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return fim(false, cartao.length ? 'mais de um bônus de XP com o preço de 1 hora' : 'não achei o bônus de XP de ' + custo + ' pontos'); }
        cartao[0].click();
        await dorme(2000);
        // 3) confirmar: botão "Resgatar" ou com o preço; nada de recompensa que pede texto
        const tela = menuAberto() || document.body;
        if ([...tela.querySelectorAll('textarea, input[type="text"]')].some(vis)) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return fim(false, 'a recompensa pede um texto; não confirmei'); }
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
    try {
      GM_addValueChangeListener('teste_resgate', (k, a, val) => {
        if (val && val.id === id && agora() - val.t < 30e3) testarResgate().catch(() => {});
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
        const r = recomendar(p, ler('saldos_' + p, {}), ler('vivos_' + p, {}));
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
      const cmd = lerComandoResgate(ped.texto || 'resgatar');
      let texto;
      if (!cmd) texto = '';
      else {
        atualizarCustos();
        const bonus = ler('bonus', {}), jogo = ler('jogo_bonus', null);
        const el = { tw: $('[data-tw-fim]'), kk: $('[data-kk-fim]') };
        texto = cmd.plats.map((p) => {
          const fim = jogo && agora() - jogo.t < 15 * MIN && jogo[p] != null ? jogo[p] : (el[p] ? Number(el[p].getAttribute('data-' + p + '-fim')) || 0 : (bonus[p] || 0));
          const t = textoPlano(p, ler('saldos_' + p, {}), ler('vivos_' + p, {}), fim, cmd.horas, cmd.tudo, agora());
          const tS = ler('t_saldos_' + p, 0);
          return t + (tS && agora() - tS > 40 * MIN ? ' (pontos lidos às ' + hora(tS) + ')' : '');
        }).join('\n\n');
      }
      const out = JSON.stringify({ nonce: ped.nonce, texto, versao: VERSAO });
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
        '#pkl-central .segue{margin:4px 0 12px;max-width:900px}#pkl-central .segue a{color:#bf94ff}#pkl-central button.ligar{background:#7c4dff}#pkl-central pre{white-space:pre-wrap;background:#1d1a26;padding:14px;border-radius:10px;font:13px/1.5 ui-monospace,Consolas,monospace}' +
        '</style><h1>Central das lives (PokeIdle)</h1>' +
        '<p class="sub">As lives abrem em abas nesta janela, só quando você clica em Ligar ou +1. Quando uma live para no fundo (canal saiu do ar, live engasgou), esta janela mostra a aba dela uns segundos até o vídeo voltar e depois volta para a central. Deixe esta janela aparecendo na tela (não minimizada). Som: o Chrome já silencia twitch.tv e kick.com ("Silenciar site"); não use o mudo do vídeo.</p>' +
        '<div class="segue"></div>' +
        '<div><button class="ligar">Ligar</button><button class="desligar">Desligar</button><button class="plano">O que resgatar (12 h)</button><button class="relatorio">Relatório (arquivo)</button></div>' +
        '<div><button class="teste" data-p="tw">Testar resgate Twitch (1 h)</button><button class="teste" data-p="kk">Testar resgate Kick (1 h)</button></div>' +
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
      painel.querySelectorAll('.teste').forEach((b) => { b.onclick = () => testarResgateCentral(b.dataset.p).catch(() => {}); });
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
            const alvo = escolherCanal({ plat: p, vivos, saldos: ler('saldos_' + p, {}), hist: ler('hist_' + p, {}), ocupados, canais: lista }) ||
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
        if (ok) logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei e o vídeo voltou');
        else if (x.n + 1 >= 3) { gravar('ruim_' + parada.id, { canal: parada.canal, t: agora() }); logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei 3 vezes e o vídeo não voltou; ela vai trocar de canal'); }
        else logar('Aba ' + parada.id + ' (' + parada.canal + '): mostrei e o vídeo ainda não voltou');
      } finally { trazendo = false; }
    }
    setInterval(() => { reiniciarAba().catch(() => {}); }, 15e3);

    // 1.14: teste de resgate. Escolhe a aba aberta cujo canal tem mais pontos (pelo menos 1 hora), pede confirmação,
    // manda a aba fazer o teste e volta para a central. Uns minutos depois, confere no jogo se o bônus aumentou.
    async function testarResgateCentral(p) {
      atualizarCustos();
      const custo = CUSTO_HORA[p], saldos = ler('saldos_' + p, {});
      const abas = abasDe(p).filter((a) => a && a.vivo && agora() - a.t < 3 * MIN && Number(a.id.slice(2)) <= (cfg().abas[p] || 0))
        .map((a) => ({ a, pts: (saldos[a.canal] || {}).pts || 0 })).sort((x, y) => y.pts - x.pts);
      const escolha = abas.find((x) => x.pts >= custo);
      if (!escolha) {
        alert(NOME[p] + ': nenhuma aba aberta está num canal com ' + custo + ' pontos agora (' + (abas.map((x) => x.a.canal + ' ' + x.pts).join(', ') || 'nenhuma aba') + '). Tente quando algum chegar lá.');
        return;
      }
      const a = escolha.a;
      if (!confirm('Teste: vou resgatar 1 hora de XP em ' + urlCurta(p, a.canal) + ' (' + custo + ' pontos), uma vez só. A aba vai aparecer uns segundos. Pode?')) return;
      const jogo0 = ler('jogo_bonus', null);
      const fim0 = jogo0 ? jogo0[p] : null;
      const t0 = agora();
      logar(NOME[p] + ': teste de resgate pedido para a aba ' + a.id + ' (' + a.canal + ')');
      gravar('teste_resgate', { id: a.id, t: t0 });
      let r = null;
      for (let i = 0; i < 50 && !r; i++) {
        await dorme(1000);
        const f = ler('teste_resgate_fim', null);
        if (f && f.id === a.id && f.t >= t0) r = f;
      }
      try { window.focus(); } catch (e) { /* nada */ }
      mostrar();
      if (!r) { logar(NOME[p] + ': o teste de resgate não respondeu em 50 s'); return; }
      if (r.ok) setTimeout(() => {
        const j = ler('jogo_bonus', null);
        const fim1 = j ? j[p] : null;
        logar(NOME[p] + ': no jogo, o XP ia até ' + (fim0 ? hora(fim0) : '?') + ' e agora vai até ' + (fim1 ? hora(fim1) : '?') + (fim0 && fim1 && fim1 - fim0 > 50 * MIN ? ' (o jogo recebeu o resgate)' : ' (confira no jogo)'));
        mostrar();
      }, 5 * MIN);
    }

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
    linhas.push('PokeIdle lives ' + VERSAO + ', ' + (curto ? 'situação às ' : 'relatório de ' + d.toLocaleDateString('pt-BR') + ' ') + hora(t));
    const ce = ler('central', null), jv = ler('jogo_vis', null), cj0 = ler('canais_jogo', null);
    linhas.push('Central: ' + (ce && t - ce.t < 2 * MIN ? 'aberta' : 'fechada (abra pelo menu do jogo: "Lives: abrir a central")') +
      '; aba do jogo: ' + (jv && t - jv.t < 3 * MIN ? 'aberta' : 'sem sinal') + '; lista de parceiros: ' + (cj0 && t - cj0.t < 2 * 24 * H ? 'do jogo (' + hora(cj0.t) + ')' : 'reserva fixa de 17/11'));
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
        linhas.push(' ' + c + ': ' + (s ? s.pts + ' pontos (' + hora(s.t) + ', ' + s.fonte + ')' : 'sem leitura') + (vivos[c] && vivos[c].sid ? ', ao vivo' : '') +
          (p === 'tw' && hist[c] ? ', ' + Math.round(hist[c].min) + ' min na live ' + hist[c].sid : ''));
      });
    }
    for (const p of ['tw', 'kk']) {
      const sg = ler('segue_' + p, null);
      if (!sg || curto) continue;
      const nao = naoSegue(p);
      linhas.push('');
      linhas.push(NOME[p] + ': você não segue ' + nao.length + ' parceiro(s) (conferido às ' + hora(sg.t) + ')' + (nao.length ? ': ' + nao.map((c) => urlCurta(p, c)).join(', ') : ''));
    }
    const tr = ler('teste_resgate_fim', null);
    if (tr && !curto) {
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
      jogo && agora() - jogo.t < 15 * MIN && jogo[p] != null ? jogo[p] : (bonus[p] || 0), 12, false, agora())).join('\n\n');
  }

  // ===== MENU DO TAMPERMONKEY =====
  GM_registerMenuCommand('Lives: abrir a central (janela das lives)', () => {
    if (centralViva() && !confirm('A central já está aberta em alguma janela. Abrir outra?')) return;
    GM_openInTab(URL_CENTRAL, { active: true, insert: true });
  });
  GM_registerMenuCommand('Lives: desligar', () => { desligar(); alert('Lives desligadas. As abas se fecham em até 1 minuto.'); });
  GM_registerMenuCommand('Lives: relatório (arquivo)', relatorio);
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
