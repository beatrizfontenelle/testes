// ==UserScript==
// @name         PokeIdle: ponte das extras
// @namespace    biafontenelle.pokeidle
// @version      1.4
// @updateURL    https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra-ponte.user.js
// @downloadURL  https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra-ponte.user.js
// @description  (1.4, 18/11: mesma regra da versão anterior; só passa a se atualizar sozinho pelo repositório e vem sem o token no arquivo (usa o que já está guardado no Tampermonkey).) (1.3, 17/11 fim da tarde, depois da auditoria dos relatórios das 16:38: (1) a leitura do quadro não fica mais presa quando o Tampermonkey não devolve resposta (foi o que deixou a CapivaraZen 49 minutos sem sinais, das 15:52 às 16:41): depois de 25 s sem resposta, solta e tenta de novo; (2) quando a leitura volta depois de 5 minutos ou mais parada, avisa no Telegram quanto tempo ficou sem ler; (3) avisa quando a principal fica 50 minutos ou mais sem publicar nada no quadro (ela publica pelo menos um pulso a cada 30); (4) o token e o chat ficam guardados no Tampermonkey (menu "Colar o token e o chat do Telegram"): as próximas versões não precisam deles no arquivo; (5) vigia opcional: menu "Colar o link do vigia" manda um sinal de vida a cada 5 minutos enquanto o jogo desta conta responde) (1.2, 17/11: o "exportar tudo" da principal faz cada extra mandar o próprio relatório ao Telegram, como arquivo; avisos de até 1.500 caracteres) Script irmão do "PokeIdle: conta extra" (1.6 ou mais novo). Substitui o "PokeIdle: avisos das extras" 1.0 (apague o antigo neste perfil). Faz três coisas: 1) manda ao Telegram os avisos da conta extra (pokemon que entrou na Coleção, shiny, sorteio ganho); 2) lê o quadro que o monitor da conta principal mantém fixado na conversa do bot (os lances que ele marcou) e entrega cada sinal novo ao script da conta extra, que decide se entra; 3) põe no menu do Tampermonkey o botão que baixa o relatório da conta. Não fala com o jogo. Contém o endereço do bot: não publicar este arquivo.
// @match        https://pokeidle.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.telegram.org
// @connect      hc-ping.com
// ==/UserScript==

(function () {
  'use strict';
  const VERSAO = '1.4';

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
      if (s.k === 'relatorio' && typeof s.q === 'number' && Date.now() - s.q < 10 * 60e3) paraPagina({ pokeidleExtraPedido: 'relatorioTexto' }); // 1.2: "exportar tudo" da principal
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
    if (rel) { if (e.origin === location.origin && typeof rel.texto === 'string' && rel.texto.length < 5e6 && String(rel.conta || '').toLowerCase() !== CONTA_PRINCIPAL) mandarArquivo(rel.nome, rel.texto); return; }
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
