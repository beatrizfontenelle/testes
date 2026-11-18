// ==UserScript==
// @name         PokeIdle: ponte das extras
// @namespace    biafontenelle.pokeidle
// @version      1.6
// @updateURL    https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra-ponte.user.js
// @downloadURL  https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra-ponte.user.js
// @description  (1.6, 18/11 11h, pedido dela: o relatório da extra no GitHub passa a ser gravado a cada 15 minutos, sempre por cima do anterior.) (1.5, 18/11, pedido dela: o relatório da conta extra vai sozinho para o repositório privado "relatorios" no GitHub (extras/NOME.txt), a cada 3 horas e no "exportar tudo", para o Claude ler direto. Menu "Colar a chave do GitHub (relatórios)". Sem a chave, tudo como antes, pelo Telegram.) (1.4, 18/11: mesma regra da versão anterior; só passa a se atualizar sozinho pelo repositório e vem sem o token no arquivo (usa o que já está guardado no Tampermonkey).) (1.3, 17/11 fim da tarde, depois da auditoria dos relatórios das 16:38: (1) a leitura do quadro não fica mais presa quando o Tampermonkey não devolve resposta (foi o que deixou a CapivaraZen 49 minutos sem sinais, das 15:52 às 16:41): depois de 25 s sem resposta, solta e tenta de novo; (2) quando a leitura volta depois de 5 minutos ou mais parada, avisa no Telegram quanto tempo ficou sem ler; (3) avisa quando a principal fica 50 minutos ou mais sem publicar nada no quadro (ela publica pelo menos um pulso a cada 30); (4) o token e o chat ficam guardados no Tampermonkey (menu "Colar o token e o chat do Telegram"): as próximas versões não precisam deles no arquivo; (5) vigia opcional: menu "Colar o link do vigia" manda um sinal de vida a cada 5 minutos enquanto o jogo desta conta responde) (1.2, 17/11: o "exportar tudo" da principal faz cada extra mandar o próprio relatório ao Telegram, como arquivo; avisos de até 1.500 caracteres) Script irmão do "PokeIdle: conta extra" (1.6 ou mais novo). Substitui o "PokeIdle: avisos das extras" 1.0 (apague o antigo neste perfil). Faz três coisas: 1) manda ao Telegram os avisos da conta extra (pokemon que entrou na Coleção, shiny, sorteio ganho); 2) lê o quadro que o monitor da conta principal mantém fixado na conversa do bot (os lances que ele marcou) e entrega cada sinal novo ao script da conta extra, que decide se entra; 3) põe no menu do Tampermonkey o botão que baixa o relatório da conta. Não fala com o jogo. Contém o endereço do bot: não publicar este arquivo.
// @match        https://pokeidle.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.telegram.org
// @connect      api.github.com
// @connect      hc-ping.com
// ==/UserScript==

(function () {
  'use strict';
  const VERSAO = '1.6';

  const TOKEN_DO_ARQUIVO = 'COLE_AQUI_O_TOKEN', CHAT_DO_ARQUIVO = '1451127393';
  // 1.3: o token e o chat ficam guardados no Tampermonkey deste perfil. Se o arquivo vier sem eles (cópia do Projeto), usa os guardados; se vier com eles, guarda.
  const guardado = (chave, doArquivo) => { try { if (!/^COLE_AQUI/.test(doArquivo)) { GM_setValue(chave, doArquivo); return doArquivo; } return String(GM_getValue(chave, '') || ''); } catch (e) { return /^COLE_AQUI/.test(doArquivo) ? '' : doArquivo; } };
  const TOKEN = guardado('tgToken', TOKEN_DO_ARQUIVO), CHAT = guardado('tgChat', CHAT_DO_ARQUIVO);
  const CONFIGURADO = !!TOKEN && !!CHAT;
  const CONTA_PRINCIPAL = 'biafontenelle';
  const LER_A_CADA_MS = 5000;   // lê o quadro no máximo a cada 5 s, no ritmo dos pulsos que a página manda
  const LEITURA_PRESA_MS = 25000; // 1.3: pedido sem resposta nenhuma há 25 s (o tempo limite dele é 15 s): solta a leitura
  const PARADA_AVISA_MS = 5 * 60e3; // 1.3: leitura que volta depois de 5 minutos parada vira aviso
  const PRINCIPAL_MUDA_MS = 50 * 60e3; // 1.3: a principal publica pelo menos um pulso a cada 30 minutos; 50 sem nada novo vira aviso
  const vistos = new Set();
  let conta = '', ocupado = false, pedidoN = 0, ultimaLeitura = 0, leituras = 0, falhas = 0, status = 0, erro = '', ultimoN = Number(GM_getValue('ultimoN', -1));
  let ultimaBoa = 0, ultimoPulsoPagina = 0, avisouPrincipal = false;
  function mandar(texto, silencioso) {
    if (!CONFIGURADO) return;
    GM_xmlhttpRequest({
      method: 'POST', url: 'https://api.telegram.org/bot' + TOKEN + '/sendMessage', timeout: 20000,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ chat_id: CHAT, text: texto, disable_notification: !!silencioso }),
      onload: (r) => { if (r.status !== 200) console.warn('[ponte das extras] Telegram', r.status); },
      onerror: () => console.warn('[ponte das extras] sem resposta do Telegram'),
    });
  }
  let ultimoArquivo = 0;
  function mandarArquivo(nome, texto) { // 1.2: o relatório da extra vai como documento para a conversa do bot
    if (!CONFIGURADO) return;
    const t = Date.now(); if (t - ultimoArquivo < 60e3) return; ultimoArquivo = t;
    try {
      const fd = new FormData();
      fd.append('chat_id', CHAT); fd.append('disable_notification', 'true');
      fd.append('document', new Blob([texto], { type: 'text/plain;charset=utf-8' }), String(nome || 'pokeidle-extra.txt').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 80) || 'pokeidle-extra.txt');
      GM_xmlhttpRequest({ method: 'POST', url: 'https://api.telegram.org/bot' + TOKEN + '/sendDocument', data: fd, timeout: 120000,
        onload: (r) => { let ok = false; try { ok = JSON.parse(r.responseText).ok === true; } catch (e) {} if (!ok) mandar('⚠️ ' + (conta || 'conta extra') + ': não consegui mandar o relatório (status ' + r.status + '). Baixe pelo botão da etiqueta.', true); },
        onerror: () => mandar('⚠️ ' + (conta || 'conta extra') + ': não consegui mandar o relatório (falha de rede).', true),
        ontimeout: () => mandar('⚠️ ' + (conta || 'conta extra') + ': o envio do relatório demorou demais.', true) });
    } catch (e) { mandar('⚠️ ' + (conta || 'conta extra') + ': não consegui montar o relatório para o Telegram.', true); }
  }
  // GITHUB: os relatórios vão para um repositório PRIVADO dela, para o Claude ler direto (pedido dela em 18/11).
  // A chave de escrita fica só no Tampermonkey deste perfil (menu "Colar a chave do GitHub"); nunca vem no arquivo do script.
  const GH_REPO = 'beatrizfontenelle/relatorios', GH_RAMO = 'main', GH_AUTO_MS = 15 * 60e3;
  const ghChave = () => { try { return String(GM_getValue('ghChave', '') || ''); } catch (e) { return ''; } };
  function ghB64(texto) { // texto (UTF-8) em base64, aos pedaços: o arquivo da principal tem alguns MB
    const u = new TextEncoder().encode(texto), N = 0x2000 * 3; let out = '';
    for (let i = 0; i < u.length; i += N) out += btoa(String.fromCharCode.apply(null, u.subarray(i, i + N)));
    return out;
  }
  const ghUrl = (caminho) => 'https://api.github.com/repos/' + GH_REPO + '/contents/' + String(caminho).split('/').map(encodeURIComponent).join('/');
  function ghShaDe(caminho, cab, cb) { // a lista da pasta traz o sha de cada arquivo, mesmo dos grandes
    const i = caminho.lastIndexOf('/'), pasta = i > 0 ? caminho.slice(0, i) : '', nome = caminho.slice(i + 1);
    GM_xmlhttpRequest({ method: 'GET', url: ghUrl(pasta) + '?ref=' + GH_RAMO, headers: cab, timeout: 30000,
      onload: (r) => { let s = ''; try { const l = JSON.parse(r.responseText); if (Array.isArray(l)) { const x = l.find((y) => y && y.name === nome); s = x ? x.sha : ''; } } catch (e) {} cb(s); },
      onerror: () => cb(null), ontimeout: () => cb(null) });
  }
  // grava (cria ou substitui) um arquivo no repositório. fim(ok, motivo)
  function ghSubir(caminho, texto, msg, fim) {
    fim = fim || (() => {});
    const chave = ghChave(); if (!chave) return fim(false, 'sem a chave do GitHub');
    let conteudo; try { conteudo = ghB64(texto); } catch (e) { return fim(false, 'não consegui preparar o arquivo'); }
    const cab = { Authorization: 'Bearer ' + chave, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
    const shas = (() => { try { return GM_getValue('ghShas', {}) || {}; } catch (e) { return {}; } })();
    const tentar = (sha, vez) => GM_xmlhttpRequest({ method: 'PUT', url: ghUrl(caminho), headers: cab, timeout: 240000,
      data: JSON.stringify(Object.assign({ message: msg, content: conteudo, branch: GH_RAMO }, sha ? { sha } : {})),
      onload: (r) => {
        if (r.status === 200 || r.status === 201) { try { shas[caminho] = JSON.parse(r.responseText).content.sha; GM_setValue('ghShas', shas); } catch (e) {} return fim(true, ''); }
        // 409 ou 422: o arquivo mudou ou já existe (ou outra conta gravou no mesmo instante): pega o sha atual e tenta de novo, até 3 vezes
        if ((r.status === 409 || r.status === 422) && vez < 3) return setTimeout(() => ghShaDe(caminho, cab, (s) => (s === null ? fim(false, 'o GitHub não respondeu') : tentar(s, vez + 1))), 2000 + Math.floor(Math.random() * 6000));
        fim(false, r.status === 401 ? 'a chave do GitHub não vale mais (401)' : r.status === 403 || r.status === 404 ? 'a chave não tem permissão de escrita no repositório (' + r.status + ')' : 'o GitHub respondeu ' + r.status);
      },
      onerror: () => fim(false, 'falha de rede com o GitHub'), ontimeout: () => fim(false, 'o GitHub demorou demais') });
    tentar(shas[caminho] || '', 0);
  }
  function ghMenuChave(pasta) {
    const txt = (window.prompt('Cole a chave do GitHub que escreve no repositório privado "relatorios" (começa com github_pat_). Fica guardada só neste Tampermonkey. Deixe vazio e confirme para desligar.') || '').trim();
    if (!txt) { if (ghChave() && window.confirm('Desligar o envio dos relatórios para o GitHub neste perfil?')) { GM_setValue('ghChave', ''); window.alert('Desligado.'); } return; }
    if (!/^(github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{30,})$/.test(txt)) { window.alert('Isso não parece uma chave do GitHub (github_pat_...). Nada foi guardado.'); return; }
    GM_setValue('ghChave', txt);
    ghSubir('teste/' + pasta + '.txt', 'Teste de escrita em ' + new Date().toLocaleString('pt-BR') + '.\n', 'teste de escrita (' + pasta + ')', (ok, motivo) => window.alert(ok ? 'Chave guardada e testada: consegui gravar no repositório. Os relatórios desta conta passam a ir para lá.' : 'Guardei a chave, mas o teste de escrita falhou: ' + motivo + '.'));
  }
  let relPedido = ''; // quem pediu o último relatório: 'tudo' (comando da principal) ou 'auto' (a cada 3 h)
  function relatorioChegou(nome, texto) {
    const motivo = relPedido; relPedido = '';
    if (!ghChave()) return mandarArquivo(nome, texto);
    const quem = String(conta || 'extra').replace(/[^A-Za-z0-9_.-]/g, '') || 'extra';
    ghSubir('extras/' + quem + '.txt', texto, quem + ' ' + new Date().toLocaleString('pt-BR').slice(0, 17), (ok, porque) => {
      if (ok) { GM_setValue('ghUltimo', Date.now()); return; }
      if (motivo !== 'auto') { mandar('⚠️ ' + quem + ': não consegui gravar no GitHub (' + porque + '). Vai pelo Telegram.', true); return mandarArquivo(nome, texto); }
      if (Date.now() - Number(GM_getValue('ghFalhaAviso', 0)) > 12 * 3600e3) { GM_setValue('ghFalhaAviso', Date.now()); mandar('⚠️ ' + quem + ': o envio automático do relatório para o GitHub falhou: ' + porque + '.', true); }
    });
  }
  setInterval(() => { try {
    if (!ghChave() || !conta || conta.toLowerCase() === CONTA_PRINCIPAL || Date.now() - ultimoPulsoPagina > 2 * 60e3) return;
    if (Date.now() - Math.max(Number(GM_getValue('ghUltimo', 0)), Number(GM_getValue('ghTentou', 0))) < GH_AUTO_MS) return;
    GM_setValue('ghTentou', Date.now()); relPedido = 'auto'; paraPagina({ pokeidleExtraPedido: 'relatorioTexto' });
  } catch (e) {} }, 60e3);
  const paraPagina = (dado) => { try { window.postMessage(dado, location.origin); } catch (e) {} };
  const situacao = () => paraPagina({ pokeidleExtraPonte: { versao: VERSAO, leituras, falhas, status, erro, ultimoN } });
  // O quadro: uma mensagem fixada na conversa, escrita pelo monitor da principal. Texto = uma linha de título e, na linha seguinte, {"v":1,"s":[sinais]}.
  function lerQuadroTexto(texto) {
    const i = String(texto || '').indexOf('{"v":');
    if (i < 0) return null;
    try { const j = JSON.parse(String(texto).slice(i)); return j && Array.isArray(j.s) ? j.s : null; } catch (e) { return null; }
  }
  function entregar(sinais) {
    const novos = sinais.filter((s) => s && typeof s.n === 'number').sort((a, b) => a.n - b.n);
    if (!novos.length) return;
    const maior = novos[novos.length - 1].n;
    if (maior < ultimoN - 20) ultimoN = -1; // o monitor recomeçou a contagem
    for (const s of novos) {
      if (s.n <= ultimoN) continue;
      ultimoN = s.n; GM_setValue('ultimoN', ultimoN);
      paraPagina({ pokeidleExtraSinal: s });
      if (s.k === 'relatorio' && typeof s.q === 'number' && Date.now() - s.q < 10 * 60e3) { relPedido = 'tudo'; paraPagina({ pokeidleExtraPedido: 'relatorioTexto' }); } // 1.2: "exportar tudo" da principal
      if (s.k === 'teste' && typeof s.q === 'number' && Date.now() - s.q < 5 * 60e3) mandar('✅ Ponte ok: ' + (conta || 'conta extra') + ' leu o teste em ' + (Math.round((Date.now() - s.q) / 100) / 10).toLocaleString('pt-BR') + ' s.', true);
    }
  }
  const minutos = (ms) => Math.max(1, Math.round(ms / 60e3));
  function leituraBoa(sinais) { // 1.3: avisos de parada (desta ponte) e de silêncio (da principal)
    const t = Date.now();
    if (ultimaBoa && t - ultimaBoa >= PARADA_AVISA_MS) mandar('⚠️ ' + (conta || 'conta extra') + ': fiquei ' + minutos(t - ultimaBoa) + ' min sem conseguir ler o quadro da principal. Já voltou. Os sorteios desse intervalo não foram vistos por esta conta.', true);
    ultimaBoa = t;
    let maisNovo = 0; for (const s of sinais) if (s && typeof s.q === 'number' && s.q > maisNovo) maisNovo = s.q;
    if (!maisNovo) return;
    if (t - maisNovo >= PRINCIPAL_MUDA_MS) { if (!avisouPrincipal) { avisouPrincipal = true; mandar('🚨 A conta principal não publica nada há ' + minutos(t - maisNovo) + ' min (quem viu: ' + (conta || 'conta extra') + '). A aba dela pode estar travada ou fechada: sem ela, ninguém dá lance.', false); } }
    else avisouPrincipal = false;
  }
  function lerQuadro() {
    const t = Date.now();
    if (!CONFIGURADO) return;
    if (ocupado && t - ultimaLeitura >= LEITURA_PRESA_MS) { ocupado = false; pedidoN++; leituras++; falhas++; status = 0; erro = 'pedido sem resposta do Tampermonkey (soltei depois de 25 s)'; situacao(); } // 1.3
    if (ocupado || t - ultimaLeitura < LER_A_CADA_MS || !conta || conta.toLowerCase() === CONTA_PRINCIPAL) return;
    ocupado = true; ultimaLeitura = t;
    const meu = ++pedidoN; // resposta de um pedido já solto não conta
    const fim = (ok, st, er) => { if (meu !== pedidoN) return; ocupado = false; leituras++; if (!ok) falhas++; status = st; erro = er || ''; situacao(); };
    try {
      GM_xmlhttpRequest({
        method: 'POST', url: 'https://api.telegram.org/bot' + TOKEN + '/getChat', timeout: 15000,
        headers: { 'Content-Type': 'application/json' }, data: JSON.stringify({ chat_id: CHAT }),
        onload: (r) => {
          if (meu !== pedidoN) return;
          let j = null; try { j = JSON.parse(r.responseText); } catch (e) {}
          if (r.status !== 200 || !j || !j.ok) return fim(false, r.status, 'o Telegram recusou a leitura');
          const fix = j.result && j.result.pinned_message, sinais = fix ? lerQuadroTexto(fix.text) : null;
          if (!fix) return fim(false, 200, 'não há mensagem fixada na conversa');
          if (!sinais) return fim(false, 200, 'a mensagem fixada não é o quadro');
          try { entregar(sinais); } catch (e) {}
          try { leituraBoa(sinais); } catch (e) {}
          fim(true, 200, '');
        },
        onerror: () => fim(false, 0, 'sem resposta do Telegram'), ontimeout: () => fim(false, 0, 'o Telegram demorou'), onabort: () => fim(false, 0, 'pedido interrompido'),
      });
    } catch (e) { fim(false, 0, 'não consegui fazer o pedido'); }
  }
  window.addEventListener('message', (e) => {
    const d = e && e.data; if (!d) return;
    if (d.pokeidleExtraPulso) { ultimoPulsoPagina = Date.now(); if (d.pokeidleExtraPulso.conta) conta = String(d.pokeidleExtraPulso.conta); lerQuadro(); return; }
    const rel = d.pokeidleExtraRelatorio; // 1.2
    if (rel) { if (e.origin === location.origin && typeof rel.texto === 'string' && rel.texto.length < 5e6 && String(rel.conta || '').toLowerCase() !== CONTA_PRINCIPAL) { if (rel.conta && !conta) conta = String(rel.conta); relatorioChegou(rel.nome, rel.texto); } return; }
    const a = d.pokeidleExtraAviso;
    if (!a || typeof a.texto !== 'string' || !a.texto || a.texto.length > 1500) return;
    if (String(a.conta || '').toLowerCase() === CONTA_PRINCIPAL) return; // a principal tem o monitor
    const chave = a.texto + '|' + Math.floor((a.quando || Date.now()) / 60000);
    if (vistos.has(chave)) return; vistos.add(chave); if (vistos.size > 500) vistos.clear();
    mandar(a.texto, false);
  });
  setInterval(lerQuadro, 15000); // reserva, para quando a página não manda pulso
  // 1.3: vigia de fora (opcional). Enquanto o jogo desta conta manda mensagem, um sinal de vida a cada 5 minutos para o link colado no menu.
  // Se o PC, a internet, o Chrome ou a aba pararem, o sinal para e o serviço avisa no Telegram.
  setInterval(() => {
    try {
      const u = String(GM_getValue('vigiaUrl', '') || '');
      if (!u || !conta || conta.toLowerCase() === CONTA_PRINCIPAL || Date.now() - ultimoPulsoPagina > 2 * 60e3) return;
      GM_xmlhttpRequest({ method: 'GET', url: u, timeout: 20000 });
    } catch (e) {}
  }, 5 * 60e3);
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Baixar o relatório desta conta extra', () => paraPagina({ pokeidleExtraPedido: 'relatorio' }));
    GM_registerMenuCommand('Colar a chave do GitHub (relatórios)', () => ghMenuChave(String(conta || 'extra').replace(/[^A-Za-z0-9_.-]/g, '') || 'extra')); // 1.5
    GM_registerMenuCommand('Colar o token e o chat do Telegram', () => { // 1.3
      const txt = window.prompt('Cole a linha do script antigo que tem o TOKEN e o CHAT (a linha inteira serve). Ficam guardados só neste Tampermonkey.') || '';
      const tk = txt.match(/\d{6,}:[A-Za-z0-9_-]{30,}/), resto = tk ? txt.replace(tk[0], ' ') : txt, ch = resto.match(/-?\d{5,}/);
      if (!tk || !ch) { if (txt.trim()) window.alert('Não achei o token e o chat nesse texto. Nada foi guardado.'); return; }
      GM_setValue('tgToken', tk[0]); GM_setValue('tgChat', ch[0]);
      window.alert('Guardado. Recarregue a página do jogo (F5) para a ponte voltar a funcionar.');
    });
    GM_registerMenuCommand('Colar o link do vigia (sinal de vida)', () => { // 1.3
      const bruto = window.prompt('Cole o link de ping desta conta no Healthchecks (começa com https://hc-ping.com/). Deixe vazio e confirme para desligar.', String(GM_getValue('vigiaUrl', '') || ''));
      if (bruto === null) return; // cancelou: não muda nada
      const txt = bruto.trim();
      if (txt && !/^https:\/\/hc-ping\.com\/[A-Za-z0-9\/_-]+$/.test(txt)) { window.alert('Isso não parece um link do Healthchecks (https://hc-ping.com/...). Nada foi mudado.'); return; }
      GM_setValue('vigiaUrl', txt);
      window.alert(txt ? 'Vigia ligado: mando um sinal de vida a cada 5 minutos enquanto o jogo desta conta estiver respondendo.' : 'Vigia desligado.');
    });
  }
  if (!CONFIGURADO) { erro = 'falta colar o token e o chat do Telegram (menu do Tampermonkey)'; console.warn('[ponte das extras] falta o token ou o chat do Telegram: use o menu do Tampermonkey'); situacao(); }
  if (typeof module !== 'undefined' && module.exports) module.exports = { lerQuadroTexto };
})();
