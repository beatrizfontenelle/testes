// ==UserScript==
// @name         PokeIdle: conta extra
// @namespace    biafontenelle.pokeidle
// @version      1.32
// @updateURL    https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra.user.js
// @downloadURL  https://raw.githubusercontent.com/beatrizfontenelle/testes/scripts/pokeidle-extra.user.js
// @description  (1.32, 23/11: manda à principal o nível da treinadora e o tipo do pokemon que caça, para o conselho do dia considerar o Shield do Novato e o bônus de tipo.) (1.31, 23/11, V3, conselheiro: a extra manda à principal a cartela do Prey e o XP por hora; a principal decide a espécie do Prey com a mesma regra das 4 contas e manda por comando. A extra escolhe na hora quando a espécie da caça vem na lista; senão espera a ordem da principal por até 30 minutos e só então pega a primeira.) (1.30, 23/11, pedido dela: uma mensagem só por compra. Quando a extra leva um pokemon em Gemas para revenda, espera o anúncio automático e manda uma mensagem só: "comprou por X e já anunciou por Y (lucro ~Z)". Se o anúncio não sair em 15 minutos, avisa só a compra. O "entrou na Coleção" não sai mais para o que acabou de ser comprado. Shiny, item, Coins e o que serve para o PvP da principal avisam na hora, como antes.) (1.29, 23/11, pedido dela: comando "comprar" vindo da principal ("capivara comprar #código"): compra o anúncio da principal pelo preço mandado, depois da retenção, para passar Gemas entre as contas.) (1.27, 23/11, pedido dela: freio no Prey. A roleta e a escolha automáticas ficam desligadas até o conselheiro novo; a principal liga e desliga com "prey ligar" e "prey desligar".) (1.26, 23/11, V3: agora que a extra entra em tudo o que a principal compraria, ela ganha o mesmo teto de estoque da principal: o custo do que comprou e ainda não vendeu, mais a compra nova, não passa de 50% do total (Gemas livres mais esse estoque). Compra de até 10 Gemas passa sempre.) (1.25, 23/11, V3: a venda é avisada na hora, pelo evento do jogo (antes só na conferência dos anúncios, de 10 em 10 minutos); o relatório sobe em seguida para a principal ver o saldo novo.) (1.24, 20/11, pedido dela: só anota cada captura com a hunt (espécie, nível, qualidade, potência, IVs) para medir a nota por hunt; nenhuma regra muda com isso. Prey: bônus de defesa com nome.) (1.23, 20/11, pedido dela: as mensagens de anúncio (anunciou, preço mudado, vendeu e as de negociação) dizem quanto a conta pagou, com o lucro naquele preço, ou se foi captura.) (1.22, 20/11, pedidos dela: (1) o Depot é vendido ao NPC sozinho a cada 1 h, como na principal (só o lixo: nota abaixo de 3,5, sem shiny, P5, TM, refino, inicial, ativo ou anunciado; para antes do primeiro que não é lixo); (2) as mensagens de negociação dos anúncios desta conta chegam no Telegram (as das últimas 12 h também, na primeira leitura).) (1.21, 20/11: Prey. Todo dia às 18h pede a roleta grátis (só ela, um pedido por dia; se vier com custo, desliga e avisa) e escolhe a espécie da hunt desta conta, ou a primeira da lista se ela não vier. Nunca paga reroll nem a cartela 2. Na principal quem cuida é o monitor.) (1.20, 20/11, pedido dela: os comandos da principal passam a valer para as extras. Pelo Telegram, com o nome da conta na frente ("capivara anunciar #código 580", "coxinha status", "vortek hunt larvitar") ou respondendo em cima de uma mensagem da extra ("anunciar 580"), a principal manda a ordem pelo quadro e esta conta executa: anunciar, mudar o preço, cancelar, status, relatório, pausar e retomar os sorteios, hunt fixa ("hunt auto" devolve a escolha ao script). O preço do anúncio e a escada de descida são os mesmos da principal: quem calcula é a principal, com a base e o modelo dela, e ela manda os "mudar" quando for a hora (sem mensagem, como na principal). Esta conta lista os próprios anúncios abertos a cada 10 minutos, põe no relatório os dados que a principal usa (pokemon vendáveis com a ficha e anúncios abertos) e avisa quando um anúncio dela vende ("💰 Vendeu").) (1.19, 18/11 14h, pedido dela: a extra resgata o Passe (grátis) sozinha todo dia às 00:05, como a principal; o resgate fica no registro e no relatório.) (1.18, 18/11, pedido dela: o aviso de compra da extra traz o mesmo começo e o mesmo piso de venda que a principal usaria no anúncio e na resposta de preço (antes dizia o preço justo e a revenda esperada, que não batiam com a resposta de preço).) (1.17, 18/11: mesma regra da versão anterior; só passa a se atualizar sozinho pelo repositório e vem sem o token no arquivo (usa o que já está guardado no Tampermonkey).) (1.16, 18/11 manhã, pedidos dela: (1) a CoxinhaFria fica fixa na Outland (Furious Scizor 150) para pegar os drops: não testa mais degrau de XP enquanto estiver lá e volta sozinha se sair; só desce se desmaiar demais ou o ouro não pagar a poção; (2) som quase mudo na aba do jogo, para o Chrome não atrasar o pedido do sorteio com a janela em segundo plano; (3) freio de sorteios de 12 para 30 pedidos por hora.) (1.15, 17/11 fim da tarde, depois da auditoria dos relatórios das 16:38: (1) a lista de hunts fica guardada no navegador, então a conta não fica mais "esperando o jogo" quando o script perde a mensagem de entrada do jogo (foi o que deixou a CapivaraZen cega das 13:26 às 15:19, sem amostra, sem sorteio e sem aviso); se mesmo assim passar 8 minutos sem conseguir ler a conta, avisa no Telegram e recarrega a aba uma vez; (2) avisa no Telegram quando a conta fica 15 minutos sem ganhar XP; (3) a etiqueta mostra quando a ponte parou; (4) Shield do Novato: abaixo do nível 1.160 o tipo do dia não deixa mais o selvagem forte, então a conta não foge nem evita alvo do tipo do dia; (5) o resultado do sorteio mostra o número de participantes em vez de "?" e não guarda mais mensagens de batalha; o pedido de relatório não aparece mais como "pulso") (1.14: pedido dela em 17/11: reserva de ouro nos sorteios em Coins = ouro para uns 10 minutos de bolas e poções (de 5 mil a 50 mil; antes era 50 mil fixos e a Vortek77 ficou fora de um anúncio de 2 Coins); o aviso 🎉 diz quantos participaram do sorteio, quanto vale pela conta da principal e se é para revender aqui ou passar para a principal; o relatório traz os stats do pokemon ativo e pode ir ao Telegram pelo "exportar tudo" da principal; na Larvitar 290 (alvo de shiny) fica mesmo com até 10% menos XP) (1.13: o aviso 📦 também sai para anúncio em Coins, com o comando pronto para a principal comprar e passar ouro para esta conta) (1.12: sorteio com relógio próprio (um worker, que o Chrome não atrasa com a janela em segundo plano), e aceita pedir até 3,2 s depois de liberar; a CapivaraZen perdia a janela por chegar 3 s atrasada) (1.11: ouro e poção. Só sobe de hunt com poção para 1,5 h; desce quando o ouro não paga a poção; sem poção e sem ouro, cura de graça e caça 30 níveis abaixo para juntar ouro, em vez de ficar parada no Centro) Para as contas extras (nunca para a principal). Faz só três coisas: repõe poção e revive com o ouro da própria conta, religa a caçada quando a conta fica parada no Centro Pokemon, e sobe de hunt sozinha conforme a treinadora libera, testando cada troca pelo XP por hora (se piorar, volta). Não anuncia nada, não usa diamantes, não manda mensagem no Telegram sozinho. Desde a 1.6 entra em sorteios do Mercado, mas só quando a conta principal avisa e só nos casos combinados (ver 1.6). Aprende a comprar poção e revive na primeira compra feita à mão. 1.1: insiste na ida ao Centro (o jogo recusa enquanto a conta está em combate), escolhe uma hunt sozinho quando não conhece nenhuma, e a etiqueta deixou de mostrar o contador de abates, que não funcionava. 1.2: usa o Desistir do Combate quando o jogo não deixa ir ao Centro. 1.3: a troca de hunt anda no ritmo das mensagens do jogo (com a janela em segundo plano o Chrome atrasava os temporizadores e cada troca levava 7 minutos); repõe bolas quando vê que a conta está arremessando (Lançar sem Parar ligado no jogo, precisa de VIP): Poke Ball sempre, Ultra Ball só com o ouro que sobra. 1.4: hunt que rende menos de 75% do XP da atual só é testada de novo 10 níveis depois (antes eram 4, e a CapivaraZen passou a manhã de 16/11 retestando Marowak 50 e Seaking 50, que davam metade do XP). 1.5: avisa quando um pokemon entra na Coleção (o filtro do próprio jogo) e quando captura shiny; o aviso vai ao Telegram pelo script irmão "PokeIdle: avisos das extras". Ao religar depois de um F5, volta para a última hunt aprovada, nunca para uma reprovada. 1.6: (a) sorteios do Mercado a pedido da principal: o monitor dela publica cada lance num quadro, o script irmão "PokeIdle: ponte das extras" lê e entrega aqui; a conta só entra se o lance está na regra das extras (Gemas: custa até 25% da saída pessimista, ou shiny abaixo do piso; erro em Coins até 200 mil; item muito barato), se tem o saldo e se o aviso chegou a tempo; nunca anuncia nem revende: se ganhar, só avisa no Telegram. Tudo o que chega fica anotado com o atraso, mesmo quando não entra. (b) O relatório agora é um arquivo, com o nick no nome, baixado pelo botão da etiqueta ou pelo menu do Tampermonkey. (c) Guarda uma amostra da conta a cada 10 minutos (nível, XP por hora, ouro, Gemas, bolas). 1.7: quando você anuncia algo em Gemas nesta conta, manda ao Telegram o número do anúncio já no formato do comando da principal (\"comprar anúncio NÚMERO PREÇO\"), porque a tela de itens do jogo não deixa achar um anúncio caro no meio de milhares. Para isso pede ao jogo a lista \"Meus anúncios\" (só leitura). 1.8: tipo do dia. Quando o XP por hora da hunt cai para menos de 55% do que vinha dando (foi o caso da CoxinhaFria em 16/11 às 18h: o alvo virou do tipo do dia e passou a levar um quarto do dano), testa o degrau de baixo da escada e fica nele se render mais; e quando o tipo do dia muda, esquece as reprovações e testa a escada de novo. 1.9: agora olha o tipo de cada alvo da escada. Alvo que é do tipo do dia leva um quarto do dano: a conta sai dele assim que o dia vira (sem esperar o XP cair), nunca testa um alvo do tipo do dia, e ao descer escolhe o degrau mais alto que não seja desse tipo. 1.10: o pedido de sorteio não depende mais só de chegar mensagem do jogo na hora certa (em 16/11 a CapivaraZen perdeu a janela do Wooper shiny porque a página ficou 3 s sem mensagem): ao aceitar um lance, marca também três despertadores diretos para a hora de liberar.
// @match        https://pokeidle.io/*
// @run-at       document-start
// @grant        none
// @sandbox      raw
// ==/UserScript==

(function () {
  'use strict';
  const VERSAO = '1.32';
  const CONTA_PRINCIPAL = 'biafontenelle';   // trava: nesta conta o script não faz nada (ela tem o monitor)

  // ===== REGRAS (tudo que dá para ajustar está aqui) =====
  const RESERVA_OURO = 5000;                 // nunca gasta abaixo disto
  const OURO_POCAO_H = 0.5, OURO_OLHA_MS = 15 * 60e3; // 1.11: poção para menos de 30 min, caindo há 15 min, e ouro que não compra mais 30 min: o ouro não paga a poção, desce
  const SEM_ITENS_FOLGA = 30;               // 1.11: sem poção, sem revive e sem ouro: caça pelo menos 30 níveis abaixo para juntar ouro
  const POCAO_MIN = 500, POCAO_ALVO = 3000, POCAO_TETO = 20000; // sem gasto medido: repõe abaixo de 500, até 3.000
  const POCAO_HORAS_MIN = 1.5, POCAO_HORAS_ALVO = 14;           // com gasto medido: repõe quando sobra 1,5 h, compra para 14 h
  const REVIVE_MIN = 30, REVIVE_ALVO = 100;
  const TESTE_ASSENTA_MS = 60e3;             // depois de trocar de hunt, espera 1 minuto antes de medir
  const TESTE_MEDE_MS = 4 * 60e3;            // mede 4 minutos
  const TESTE_GANHO = 1.10;                  // a hunt nova fica se der pelo menos 10% mais XP por hora
  const TESTE_MORTES = 2;                    // e no máximo 2 desmaios nos 4 minutos
  const BLOQUEIO_NIVEIS = 4;                 // hunt reprovada: tenta de novo 4 níveis de treinadora depois
  const BLOQUEIO_LONGE = 10, LONGE_FRACAO = 0.75; // 1.4: se rendeu menos de 75% do XP da hunt atual, só 10 níveis depois
  const MORTES_DESCE = 8, MORTES_JANELA_MS = 10 * 60e3; // 8 desmaios em 10 minutos fora de teste: desce um degrau
  const PARADA_MS = 45e3;                    // parada no Centro por 45 s: cura e volta para a hunt
  const PEDIDOS_POR_MINUTO = 12;
  const IDA_NORMAIS = 3;                     // depois de 3 recusas, usa o Desistir do Combate (custa 10% do XP do nível atual)
  const IDA_TENTATIVAS = 6;
  // Bolas (1.3). Só compra depois de ver a conta gastar bola (sinal de que o Lançar sem Parar está ligado no jogo).
  const BOLA_POKE = 1, BOLA_ULTRA = 4, PRECO_POKE = 5, PRECO_ULTRA = 130; // preços da loja do jogo (catálogo de 16/11)
  const POKE_MIN = 500, POKE_ALVO = 3000;    // Poke Ball: garante que todo corpo recebe um arremesso (é no arremesso que o shiny é sorteado)
  const ULTRA_MIN = 300, ULTRA_ALVO = 2000;  // Ultra Ball: 4 vezes a chance de fechar a captura
  const ULTRA_SOBRA_OURO = 300000;           // Ultra só com o ouro acima disto (poção e revive vêm primeiro)
  // Sorteios do Mercado (1.6). A principal decide; aqui só se confere a regra das extras, o saldo e a hora.
  const SORTEIO_CLASSES = { gemas25: 'Gemas, na regra das extras', shiny: 'shiny abaixo do piso', coins: 'erro em Coins', item: 'item muito barato' };
  const SORTEIO_COINS_MAX = 200000;          // em Coins só entra em anúncio de até 200 mil (os erros de preço vistos foram de 2 a 100 mil)
  const SORTEIO_RESERVA_OURO = 50000;        // 1.14: teto da reserva; a reserva é o ouro de uns 10 minutos de bolas e poções (reservaSorteio)
  const ARREMESSOS_H = 1100, ALVO_SHINY = /^larvitar/i, ALVO_SHINY_GANHO = 0.9; // 1.14: Larvitar 290 é o alvo de shiny: fica lá mesmo rendendo até 10% menos XP
  const SORTEIO_ATRASO_MS = 300;             // pede 0,3 s depois de o anúncio liberar (igual à principal)
  const SORTEIO_JANELA_MS = 3200;            // 1.12: o sorteio aceita pedidos por 3 s; até 3,2 s ainda tenta (pedido atrasado é inofensivo: o jogo responde que o anúncio já saiu)
  const SORTEIO_POR_HORA = 30;               // freio: no máximo 30 pedidos por hora (1.16: era 12; fica só como fusível contra defeito do script)
  const QUEDA_FRACAO = 0.55, QUEDA_ESPERA_MS = 3 * 3600e3; // 1.8: queda de XP na hunt atual (tipo do dia): testa o degrau de baixo, no máximo a cada 3 h
  const NIVEL_VETERANO = 1160;               // 1.15: Shield do Novato (jogo v1.436.0, 17/11): abaixo deste nível de treinadora o selvagem do tipo do dia não fica mais forte
  const SEM_LER_MS = 8 * 60e3, SEM_XP_MS = 15 * 60e3, RECARGA_ESPERA_MS = 30 * 60e3; // 1.15: vigia da própria conta
  const ARREMESSO_VALE_MS = 60 * 60e3;       // viu bola sendo gasta na última hora                  // o jogo só deixa ir ao Centro depois de 3 s sem dar nem tomar dano: insiste nas brechas

  // Escada por tipo do inicial: [nível da hunt, nome]. Só hunts em que o tipo do inicial bate com vantagem.
  // O último degrau é o destino (Larvitar para Água e Planta, Chikorita para Fogo). Outland fica de fora.
  const ESCADA = {
    GRASS: [[1, 'Geodude'], [10, 'Diglett'], [20, 'Omanyte'], [20, 'Kabuto'], [30, 'Rhyhorn'], [30, 'Poliwhirl'], [40, 'Graveler'], [50, 'Marowak'], [50, 'Seaking'],
      [60, 'Onix'], [80, 'Golem'], [80, 'Omastar'], [100, 'Rhydon'], [100, 'Lapras'], [230, 'Remoraid'], [230, 'Chinchou'], [260, 'Wooper'], [290, 'Larvitar']],
    FIRE: [[1, 'Paras'], [10, 'Metapod'], [10, 'Kakuna'], [20, 'Bulbasaur'], [20, 'Venonat'], [30, 'Butterfree'], [30, 'Weepinbell'], [30, 'Beedrill'], [40, 'Ivysaur'],
      [50, 'Parasect'], [50, 'Tangela'], [60, 'Venomoth'], [60, 'Victreebel'], [70, 'Vileplume'], [80, 'Venusaur'], [80, 'Magneton'], [100, 'Scyther'], [100, 'Pinsir'],
      [100, 'Jynx'], [200, 'Sunkern'], [200, 'Hoppip'], [230, 'Spinarak'], [230, 'Ledyba'], [260, 'Chikorita']],
    WATER: [[1, 'Geodude'], [10, 'Diglett'], [20, 'Sandshrew'], [20, 'Vulpix'], [20, 'Charmander'], [30, 'Rhyhorn'], [40, 'Graveler'], [50, 'Marowak'], [60, 'Onix'],
      [70, 'Rapidash'], [80, 'Golem'], [100, 'Rhydon'], [230, 'Slugma'], [230, 'Swinub'], [260, 'Phanpy'], [260, 'Houndour'], [290, 'Larvitar']],
  };

  const P = window.WebSocket && window.WebSocket.prototype;
  if (!P) return;
  const addOrig = EventTarget.prototype.addEventListener, sendOrig = P.send;
  let socketJogo = null;

  // ===== memória (fica no navegador deste perfil) =====
  const CHAVE = 'pokeidle-extra-v1';
  let M = { loja: {}, bloqueio: {}, ultimaHunt: null, pausado: false, log: [] };
  try { const g = JSON.parse(localStorage.getItem(CHAVE) || 'null'); if (g && typeof g === 'object') M = Object.assign(M, g); } catch (e) {}
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(M)); } catch (e) {} };
  // 1.24 (pedido dela em 20/11): capturas por hunt, só anotadas (minuto, hunt, espécie, nível, qualidade×1000, potência, IVs, shiny, nível do selvagem)
  let capturas = []; try { const g = JSON.parse(localStorage.getItem(CHAVE + '-capturas') || '[]'); if (Array.isArray(g)) capturas = g; } catch (e) {}
  let capturasMudou = false;
  setInterval(() => { if (!capturasMudou) return; capturasMudou = false; try { localStorage.setItem(CHAVE + '-capturas', JSON.stringify(capturas)); } catch (e) {} }, 60e3);
  const agora = () => Date.now();
  const hora = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
  function registrar(texto) {
    M.log.push([agora(), texto]);
    if (M.log.length > 200) M.log.splice(0, M.log.length - 200);
    salvar(); pintar();
  }

  // ===== estado da conta, montado com o que o servidor manda =====
  // 1.9: tipos de cada alvo das escadas (para o tipo do dia: alvo do tipo do dia leva um quarto do dano)
  const TIPOS_ALVO = { Geodude: 'ROCK GROUND', Diglett: 'GROUND', Omanyte: 'ROCK WATER', Kabuto: 'ROCK WATER', Rhyhorn: 'GROUND ROCK', Poliwhirl: 'WATER', Graveler: 'ROCK GROUND', Marowak: 'GROUND', Seaking: 'WATER',
    Onix: 'ROCK GROUND', Golem: 'ROCK GROUND', Omastar: 'ROCK WATER', Rhydon: 'GROUND ROCK', Lapras: 'WATER ICE', Remoraid: 'WATER', Chinchou: 'WATER ELECTRIC', Wooper: 'WATER GROUND', Larvitar: 'ROCK GROUND',
    Paras: 'BUG GRASS', Metapod: 'BUG', Kakuna: 'BUG POISON', Bulbasaur: 'GRASS POISON', Venonat: 'BUG POISON', Butterfree: 'BUG FLYING', Weepinbell: 'GRASS POISON', Beedrill: 'BUG POISON', Ivysaur: 'GRASS POISON',
    Parasect: 'BUG GRASS', Tangela: 'GRASS', Venomoth: 'BUG POISON', Victreebel: 'GRASS POISON', Vileplume: 'GRASS POISON', Venusaur: 'GRASS POISON', Magneton: 'ELECTRIC STEEL', Scyther: 'BUG FLYING', Pinsir: 'BUG',
    Jynx: 'ICE PSYCHIC', Sunkern: 'GRASS', Hoppip: 'GRASS FLYING', Spinarak: 'BUG POISON', Ledyba: 'BUG FLYING', Chikorita: 'GRASS',
    Sandshrew: 'GROUND', Vulpix: 'FIRE', Charmander: 'FIRE', Rapidash: 'FIRE', Slugma: 'FIRE', Swinub: 'ICE GROUND', Phanpy: 'GROUND', Houndour: 'DARK FIRE' };
  const doDia = (h) => !!(h && M.diaTipo && !(S.level > 0 && S.level < NIVEL_VETERANO) && (' ' + (TIPOS_ALVO[h.nome] || '') + ' ').indexOf(' ' + M.diaTipo + ' ') >= 0); // o alvo desta hunt é do tipo do dia?
  const S = { pronto: false, nick: null, level: 0, xp: 0, gold: 0, orbs: null, nomesItem: {}, vendaveis: null, items: null, huntSlug: null, noCentro: false, centroLivreEm: 0, difServidor: 0,
    potionIds: [200, 201, 202, 204], reviveIds: [205, 206], balls: {}, activeId: null, tipo: null, nivelPk: 0, hunts: null, desdeCentro: 0,
    pk: null, meus: null, meusEm: 0 }; // 1.20: pokemon da conta (id -> ficha) e anúncios abertos (lista do jogo)
  if (Array.isArray(M.hunts) && M.hunts.length) S.hunts = M.hunts; // 1.15: a lista de hunts guardada da última vez (o jogo só manda na entrada, e o script pode engatar depois)
  let primeiraMsg = 0, prontoEm = 0, ultimoGanhoXp = 0, avisouSemXp = 0, avisouSemLer = false;
  const amostrasXp = [];   // [quando, xp]
  const mortes = [], abates = []; // quando
  let fotoPocao = null, gastoPocaoH = null, compradoDesdeFoto = 0; // gasto de poção por hora, medido entre dois estados cheios
  let pedidoLoja = null;   // último shop.buy visto (seu ou meu), para ligar à resposta
  const envios = [];
  let teste = null;        // { de, para, inicio, base, nivel }
  let semItens = null, pocVista = null; // 1.11: { slug, em } da última ida sem itens; [quando, poções, hunt] da última olhada no estoque
  let trocando = 0, ultimaCompra = 0, ultimaCura = 0, desdeHunt = 0, ultimoArremesso = 0;
  let bolaPedida = null, bolaFalhas = 0, bolaEspera = 0; // compra de bola esperando a confirmação do jogo
  let troca = null;        // 1.3: a troca de hunt em andamento { slug, tent, esc, prox, espera, feito }
  const falhou = {};       // slug -> até quando não tentar (a troca não pegou)
  // 1.16 (pedido dela em 18/11): conta fixa na Outland, pelos drops. Nick em minúsculas -> nome da hunt. Vale a partir do nível 150 da treinadora.
  const OUTLAND_FIXA = { coxinhafria: 'Furious Scizor' }, OUTLAND_NIVEL = 150, OUTLAND_TENTA_MS = 15 * 60e3;
  let outlandEm = 0;
  function outlandAlvo() {
    const nome = OUTLAND_FIXA[String(S.nick || '').toLowerCase()];
    if (!nome || !S.hunts || !(S.level >= OUTLAND_NIVEL)) return null;
    return (M.outlandSlug && huntDe(M.outlandSlug)) || S.hunts.find((h) => h.area === 'outland' && h.nome === nome) || null;
  }
  // 1.16: som quase mudo (30 Hz, volume 0,0008). O Chrome não freia aba que está tocando áudio, e o pedido do sorteio sai na hora mesmo em segundo plano.
  let somCtx = null;
  function somLigar() {
    try {
      if (!somCtx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        somCtx = new AC(); const o = somCtx.createOscillator(), g = somCtx.createGain();
        o.frequency.value = 30; g.gain.value = 0.0008; o.connect(g); g.connect(somCtx.destination); o.start();
      }
      if (somCtx.state === 'suspended') { const p = somCtx.resume(); if (p && p.catch) p.catch(() => {}); }
    } catch (e) { /* sem áudio: segue sem */ }
  }
  const somEstado = () => (!somCtx ? 'sem áudio' : somCtx.state === 'running' ? 'tocando' : 'bloqueado pelo Chrome (clique uma vez na página do jogo)');
  somLigar(); setInterval(somLigar, 60e3);
  ['pointerdown', 'keydown'].forEach((ev) => { try { document.addEventListener(ev, somLigar, true); } catch (e) { /* nada */ } });

  const somaItens = (ids) => (S.items ? ids.reduce((a, id) => a + (S.items[id] || 0), 0) : null);
  const huntDe = (slug) => (S.hunts || []).find((h) => h.slug === slug) || null;
  const nomeHunt = (slug) => { const h = huntDe(slug); return h ? h.nome + ' ' + h.nivel : String(slug); };

  function taxaXp(de, ate) { // XP por hora entre dois instantes, pelas amostras
    const a = amostrasXp.filter((x) => x[0] >= de && x[0] <= ate);
    if (a.length < 2) return null;
    const dt = a[a.length - 1][0] - a[0][0];
    if (dt < 100e3) return null;
    return (a[a.length - 1][1] - a[0][1]) / (dt / 3600e3);
  }
  const conta = (lista, de) => lista.filter((t) => t >= de).length;

  // ---------- 1.5: avisos de captura ----------
  // O script roda na página e não pode falar com o Telegram. Ele só publica o aviso; quem envia é o script irmão "PokeIdle: avisos das extras".
  function avisar(texto) {
    registrar('aviso: ' + texto);
    try { window.postMessage({ pokeidleExtraAviso: { conta: S.nick || '?', texto, quando: Date.now() } }, '*'); } catch (e) {}
  }
  const fichaTxt = (p) => (p.nome || 'pokemon') + ' Nv ' + (p.level || '?') + ' (' + ['P' + (p.potencia || 1), p.quality ? 'Q ' + String(p.quality).replace('.', ',') : '', typeof p.nota === 'number' ? 'nota ' + String(Math.round(p.nota * 1000) / 1000).replace('.', ',') : ''].filter(Boolean).join(', ') + ')';
  function conferirColecao(e) { // a Coleção é a lista automation.pokemonTravado do jogo: o que entra nela passou no filtro da própria conta
    const lista = e && e.automation && e.automation.pokemonTravado;
    if (!Array.isArray(lista) || !Array.isArray(e.pokemons)) return;
    if (!Array.isArray(M.colecao)) { M.colecao = lista.slice(-400); salvar(); return; } // primeira vez: só anota o que já existe
    const antes = new Set(M.colecao), novos = lista.filter((id) => !antes.has(id));
    if (!novos.length) return;
    const porId = new Map(e.pokemons.map((p) => [p.id, p]));
    for (const id of novos.slice(0, 8)) {
      const p = porId.get(id);
      if (!p || p.starter) continue;
      if (!p.shiny && (() => { try { return !!pendDe(fichaTxt(p)); } catch (err) { return false; } })()) { /* 1.30: acabou de ser comprado; a mensagem da compra já cobre */ }
      else avisar(p.shiny ? '✨✨ SHINY na Coleção da ' + S.nick + ': ' + fichaTxt(p) + ' (#' + id + ')' : '⭐ ' + S.nick + ': entrou na Coleção ' + fichaTxt(p) + ' (#' + id + ')');
    }
    M.colecao = lista.slice(-400); salvar();
  }
  function fundirEstado(e, cheio) {
    if (cheio && S.pronto && String(S.nick || '').toLowerCase() !== CONTA_PRINCIPAL) { try { conferirColecao(e); } catch (err) {} }
    if (!e || typeof e !== 'object') return;
    if (e.nick) S.nick = e.nick;
    if (typeof e.level === 'number') S.level = e.level;
    if (typeof e.gold === 'number') S.gold = e.gold;
    if (typeof e.orbs === 'number') S.orbs = e.orbs; // Gemas
    if (e.passe && typeof e.passe === 'object') { S.passe = Object.assign({}, S.passe || {}, e.passe); S.passeT = agora(); } // 1.19
    if (e.diaSazonal && e.diaSazonal.tipo) diaNovo(e.diaSazonal.tipo, e.diaSazonal.fim || e.diaSazonal.chave);
    try { preyDoEstado(e, cheio); } catch (err) {} // 1.21
    if (cheio && Array.isArray(e.pokemons)) { try { S.pk = new Map(e.pokemons.map((p) => [p.id, p])); S.pkEm = agora(); conferirSumidos(); } catch (err) {} try { ligarCustos(); } catch (err) {} } // 1.20; 1.23: custo das compras
    if (cheio && Array.isArray(e.pokemons)) { try { S.vendaveis = e.pokemons.filter((p) => !p.starter && (p.shiny || (p.potencia || 1) >= 5 || ((p.level || 0) >= 50 && (p.nota || 0) >= 3.5))).map((p) => fichaTxt(p) + ' #' + p.id).slice(0, 12); } catch (err) {} }
    if (typeof e.servidorAgora === 'number') S.difServidor = e.servidorAgora - agora();
    if (typeof e.centroLivreEm === 'number') S.centroLivreEm = e.centroLivreEm;
    if (typeof e.xp === 'number') { if (e.xp > S.xp) ultimoGanhoXp = agora(); S.xp = e.xp; amostrasXp.push([agora(), e.xp]); while (amostrasXp.length && amostrasXp[0][0] < agora() - 20 * 60e3) amostrasXp.shift(); }
    if (e.items && typeof e.items === 'object') S.items = cheio ? e.items : Object.assign({}, S.items || {}, e.items);
    if (e.balls && typeof e.balls === 'object') { // 1.3: bola que diminui sem compra minha = a conta está arremessando
      for (const k of Object.keys(e.balls)) { const antes = S.balls[k], agoraN = Number(e.balls[k]) || 0; if (typeof antes === 'number' && agoraN < antes) ultimoArremesso = agora(); S.balls[k] = agoraN; }
    }
    if (e.automation) { if (Array.isArray(e.automation.potionIds) && e.automation.potionIds.length) S.potionIds = e.automation.potionIds; if (Array.isArray(e.automation.reviveIds) && e.automation.reviveIds.length) S.reviveIds = e.automation.reviveIds; }
    if (e.activeId) S.activeId = e.activeId;
    if (e.automation && Array.isArray(e.automation.pokemonTravado)) S.travados = e.automation.pokemonTravado; // 1.22: a Coleção (o resto fora do time é o Depot)
    if (typeof e.noCentro === 'boolean') {
      if (e.noCentro && !S.noCentro) S.desdeCentro = agora();
      S.noCentro = e.noCentro;
    }
    if (typeof e.huntSlug === 'string') { if (e.huntSlug !== S.huntSlug && e.huntSlug !== 'centro') { desdeHunt = agora(); mortes.length = 0; } S.huntSlug = e.huntSlug; }
    if (!desdeHunt && S.huntSlug) desdeHunt = agora();
    if (Array.isArray(e.pokemons)) { const a = e.pokemons.find((p) => p.id === S.activeId) || e.pokemons.find((p) => p.starter); if (a) { S.tipo = (a.tipos || [])[0] || S.tipo; S.nivelPk = a.level || S.nivelPk; S.ativo = a; } }
    if (!S.noCentro && S.huntSlug && S.huntSlug !== 'centro' && huntDe(S.huntSlug) && M.ultimaHunt !== S.huntSlug) { M.ultimaHunt = S.huntSlug; salvar(); }
    if (cheio && S.items) { // gasto de poção por hora, entre dois estados cheios
      const tot = somaItens(S.potionIds), t = agora();
      if (fotoPocao && t - fotoPocao[0] >= 4 * 60e3) {
        const usado = fotoPocao[1] + compradoDesdeFoto - tot;
        if (usado >= 0) { const h = usado / ((t - fotoPocao[0]) / 3600e3); gastoPocaoH = gastoPocaoH === null ? h : 0.5 * gastoPocaoH + 0.5 * h; }
        fotoPocao = [t, tot]; compradoDesdeFoto = 0;
      } else if (!fotoPocao) { fotoPocao = [t, tot]; compradoDesdeFoto = 0; }
    }
    if (S.nick && S.items && S.hunts) { if (!S.pronto) prontoEm = agora(); S.pronto = true; }
  }

  function mudouLugar(slug, centro) {
    const t = agora();
    if (centro || slug === 'centro') { if (!S.noCentro) S.desdeCentro = t; S.noCentro = true; return; }
    if (S.huntSlug !== slug || S.noCentro) { desdeHunt = t; mortes.length = 0; }
    S.huntSlug = slug; S.noCentro = false;
    if (huntDe(slug) && M.ultimaHunt !== slug) { M.ultimaHunt = slug; salvar(); }
  }
  let ultimoPulso = 0;
  // 1.7: anúncios desta conta em Gemas: avisa o número, para a principal comprar pelo comando
  let pedirMeusEm = 0, pediuNaCarga = false;
  function meusAnuncios(txt) {
    const o = JSON.parse(txt);
    if (!o || o.aba !== 'meus' || !Array.isArray(o.linhas) || ehPrincipal()) return;
    guardarMeus(o.linhas.filter((l) => l && l.id && (!l.estado || l.estado === 'aberto'))); // 1.20
    if (!Array.isArray(M.anunciados)) M.anunciados = [];
    for (const l of o.linhas) {
      if (!l || !l.id || M.anunciados.includes(l.id)) continue;
      if (l.estado && l.estado !== 'aberto') continue;
      if (pidDe(l) && M.cmdAnuncio && agora() - (M.cmdAnuncio[pidDe(l)] || 0) < 15 * 60e3) { M.anunciados.push(l.id); if (M.anunciados.length > 200) M.anunciados.shift(); continue; } // 1.20: anunciado por comando: a confirmação já sai pelo comando
      const moeda = l.moeda || (l.anuncio && l.anuncio.moeda), preco = Number(l.preco || l.precoUnit || (l.anuncio && l.anuncio.preco)) || 0;
      if ((moeda !== 'orb' && moeda !== 'gold') || !(preco > 0)) continue; // 1.13: Coins também
      const emCoins = moeda === 'gold';
      M.anunciados.push(l.id); if (M.anunciados.length > 200) M.anunciados.shift();
      const oque = l.tipo === 'pokemon' && l.ficha ? fichaTxt(l.ficha) : (S.nomesItem[l.itemId] || 'item ' + l.itemId) + ((l.qtd || 1) > 1 ? ' ×' + l.qtd : '');
      avisar('📦 ' + S.nick + ' anunciou ' + oque + ' por ' + fmt(preco) + (emCoins ? ' Coins' : ' Gemas') + ((l.qtd || 1) > 1 ? ' cada' : '') + '. Para a principal comprar (depois dos 2 minutos de retenção), mande aqui:\ncomprar anúncio ' + l.id + ' ' + preco + (emCoins ? ' coins' : ''));
    }
    salvar();
  }
  function receber(txt) {
    if (typeof txt !== 'string') return;
    if (!primeiraMsg) primeiraMsg = agora();
    try { receber2(txt); } catch (e) {}
    try { if (txt.startsWith('{"t":"market"') && txt.slice(0, 60).indexOf('"aba":"meus"') >= 0) meusAnuncios(txt); } catch (e) {}
    try { const t = agora(); if (S.pronto && !pediuNaCarga) { pediuNaCarga = true; pedirMeusEm = t + 15000; } if (pedirMeusEm && t >= pedirMeusEm && !ehPrincipal()) { pedirMeusEm = 0; mandar({ t: 'market.meus' }); } } catch (e) {}
    try { if (pendentes.length) passoSorteio(); } catch (e) {}
    try { if (cmdResposta && agora() < cmdResposta.ate && txt.length < 800 && txt.indexOf('"k":"aviso"') >= 0) { const m = txt.match(/"msg":"([^"]{1,160})"/); if (m && cmdResposta.msgs.length < 4) cmdResposta.msgs.push(m[1]); } } catch (e) {} // 1.20
    try { if (respostaAte && agora() < respostaAte && txt.length < 600 && /market|mercado|sorteio|aviso|erro/i.test(txt) && !txt.startsWith('{"t":"chat') && (txt.indexOf('"k":"aviso"') >= 0 || (respostaLinha && respostaLinha[3] && txt.indexOf(String(respostaLinha[3])) >= 0))) { anotarResposta(txt); } } catch (e) {}
    try { const t = agora(); if (t - ultimoPulso >= 4000) { ultimoPulso = t; window.postMessage({ pokeidleExtraPulso: { conta: S.nick || '', quando: t, versao: VERSAO } }, location.origin); } } catch (e) {} // 1.6: o script irmão lê o quadro no ritmo do jogo (o relógio do Chrome atrasa em segundo plano)
    try { if (troca && !M.pausado) passoTroca(); } catch (e) {}
  }
  function receber2(txt) {
    try {
      if (txt.startsWith('{"t":"campo.init"')) {
        const m = txt.match(/^\{"t":"campo.init","slug":"([^"]+)"/);
        if (m) mudouLugar(m[1], txt.slice(0, 400).indexOf('"centro":true') >= 0);
        return;
      }
      if (txt.startsWith('{"t":"comercio"')) { try { comercioEvento(JSON.parse(txt)); } catch (err) {} return; } // 1.22
      if (txt.startsWith('{"t":"passe"')) { try { const r = JSON.parse(txt).resgate; if (r) registrar('Passe: dia ' + r.degrau + ' resgatado' + (agora() - (M.passeTentou || 0) < 2 * 60e3 ? ' (automático)' : '') + (r.quebrou ? '; a sequência quebrou' : '') + ': ' + (r.premios || []).map((x) => x.tipo === 'boost' ? x.boost + ' ' + x.horas + ' h' : x.tipo === 'coins' ? fmt(x.qtd) + ' Coins' : (x.qtd || '') + ' ' + (x.nome || x.tipo)).join(', ')); } catch (e) {} return; }
      if (txt.startsWith('{"t":"welcome"')) {
        const w = JSON.parse(txt);
        if (Array.isArray(w.hunts)) { S.hunts = w.hunts.map((h) => ({ slug: h.slug, nome: h.nome, nivel: h.nivel, area: h.area, pk: (h.especies || []).map((e) => e && e.pokeId).filter(Boolean) })); M.hunts = S.hunts; salvar(); } // 1.15: guarda; 1.21: espécies
        try { // 1.6: nomes dos itens que o Mercado aceita (pedras e o catálogo da vitrine), para o relatório
          for (const k of Object.keys(w.pedrasEvolucao || {})) { const x = w.pedrasEvolucao[k]; if (x && x.itemId) S.nomesItem[x.itemId] = x.nome; }
          for (const c of (w.mercado && w.mercado.catalogo) || []) if (c && c.id && c.categoria !== 'casa' && c.categoria !== 'bicicleta') S.nomesItem[c.id] = c.nome;
        } catch (err) {}
        fundirEstado(w.estado, true);
      } else if (txt.startsWith('{"t":"estado"')) {
        const o = JSON.parse(txt);
        fundirEstado(o.estado, !!(o.estado && o.estado.cheio));
      } else if (txt.startsWith('{"t":"batalha"')) {
        const temMorte = txt.indexOf('"k":"morte"') >= 0, temAbate = txt.indexOf('"k":"abate"') >= 0, temCompra = txt.indexOf('"k":"compra"') >= 0, temShiny = txt.indexOf('"shiny":true') >= 0;
        const temCaptura = txt.indexOf('"k":"capturado"') >= 0, temMercado = temCaptura || txt.indexOf('"k":"mktSorteio"') >= 0 || txt.indexOf('"k":"marketComprado"') >= 0 || txt.indexOf('"k":"diaSazonal"') >= 0 || txt.indexOf('"k":"prey') >= 0 || txt.indexOf('"k":"venda"') >= 0 || txt.indexOf('"k":"marketVendido"') >= 0;
        if (!temMorte && !temAbate && !temCompra && !temShiny && !temMercado) return;
        const o = JSON.parse(txt), t = agora();
        for (const ev of o.ev || []) {
          if (ev.k === 'abate') { abates.push(t); if (abates.length > 4000) abates.splice(0, 1000); }
          else if (ev.k === 'morte' && ev.quem !== 'selvagem') { mortes.push(t); if (mortes.length > 500) mortes.splice(0, 100); }
          else if (ev.k === 'compra') aprender(ev);
          else if (ev.k === 'capturado' && ev.pokemon) { // 1.24
            const pk = ev.pokemon, iv = pk.ivs ? ['hp', 'atk', 'def', 'spAtk', 'spDef', 'speed'].map((k) => Number(pk.ivs[k]) || 0).join('/') : '';
            capturas.push([Math.floor(t / 60000), S.huntSlug || '', Number(pk.speciesId) || 0, Number(pk.level) || 0, Math.round((Number(pk.quality) || 0) * 1000), Number(pk.potencia) || 0, iv, pk.shiny ? 1 : 0, Number(ev.levelSelvagem) || 0]);
            if (capturas.length > 3000) capturas.splice(0, capturas.length - 3000);
            capturasMudou = true;
          }
          else if (ev.k === 'mktSorteio' || ev.k === 'marketComprado') { try { eventoMercado(ev); } catch (err) {} }
          else if (ev.k === 'marketVendido') { try { vendidoNaHora(ev); } catch (err) {} } // 1.25
          else if (ev.k === 'diaSazonal' && ev.tipo) diaNovo(ev.tipo, ev.fim || ev.tipo);
          else if ((ev.k === 'preyRoletou' || ev.k === 'preyEscolheu') && ev.c) { try { preyEvento(ev); } catch (err) {} } // 1.21
          else if (ev.k === 'venda' && /depot/i.test(ev.nome || '')) { M.depotVendas = (M.depotVendas || []).concat([[t, ev.qtd || 0, ev.ganho || 0]]).slice(-100); salvar(); registrar('Depot: vendi ' + (ev.qtd !== undefined ? ev.qtd : '?') + ' pokemon ao NPC por ' + fmt(ev.ganho || 0) + ' de ouro'); } // 1.22
          else if (ev.k === 'bola' && ev.shiny && ev.sucesso && String(S.nick || '').toLowerCase() !== CONTA_PRINCIPAL) avisar('✨✨ SHINY CAPTURADO na ' + S.nick + '! Os detalhes chegam em até 5 minutos.');
        }
      }
    } catch (e) {}
  }

  // Aprende a comprar: liga o pedido shop.buy (feito à mão ou por mim) à resposta com nome, quantidade e gasto
  function aprender(ev) {
    const p = pedidoLoja;
    if (!p || agora() - p.quando > 8000 || !ev.qtd) return;
    pedidoLoja = null;
    if (p.kind === 'ball') { if (p.meu) { bolaPedida = null; bolaFalhas = 0; S.balls[p.id] = (S.balls[p.id] || 0) + ev.qtd; registrar('comprei ' + fmt(ev.qtd) + ' ' + ev.nome + ' por ' + fmt(ev.gasto) + ' de ouro'); } return; }
    const qual = S.potionIds.includes(p.id) ? 'pocao' : S.reviveIds.includes(p.id) ? 'revive' : null;
    if (!qual) return;
    const antes = M.loja[qual], preco = ev.gasto / ev.qtd;
    M.loja[qual] = { kind: p.kind, id: p.id, nome: ev.nome, preco };
    if (qual === 'pocao') compradoDesdeFoto += ev.qtd;
    if (S.items) S.items[p.id] = (S.items[p.id] || 0) + (p.meu ? ev.qtd : 0); // a compra feita por mim ainda não entrou no estado
    if (!antes) registrar('aprendi a comprar ' + ev.nome + ' (' + fmt(preco) + ' de ouro cada)');
    else if (p.meu) registrar('comprei ' + fmt(ev.qtd) + ' ' + ev.nome + ' por ' + fmt(ev.gasto) + ' de ouro');
    salvar();
  }

  function mandar(obj) {
    const t = agora();
    while (envios.length && envios[0] < t - 60e3) envios.shift();
    if (envios.length >= PEDIDOS_POR_MINUTO) return false;
    if (!socketJogo || socketJogo.readyState !== 1) return false;
    envios.push(t);
    try { sendOrig.call(socketJogo, JSON.stringify(obj)); } catch (e) { return false; }
    return true;
  }

  // ===== 1) repor poção e revive =====
  function repor() {
    const t = agora();
    if (t - ultimaCompra < 60e3) return false;
    const comprar = (L, qtd) => {
      qtd = Math.min(qtd, Math.floor((S.gold - RESERVA_OURO) / Math.max(1, L.preco)), 9999);
      if (qtd < 20) return false;
      pedidoLoja = { quando: t, kind: L.kind, id: L.id, meu: true };
      if (!mandar({ t: 'shop.buy', kind: L.kind, id: L.id, qty: qtd })) { pedidoLoja = null; return false; }
      S.gold -= qtd * L.preco; ultimaCompra = t;
      return true;
    };
    const rev = somaItens(S.reviveIds), poc = somaItens(S.potionIds);
    if (M.loja.revive && rev !== null && rev < REVIVE_MIN && comprar(M.loja.revive, REVIVE_ALVO - rev)) return true;
    if (M.loja.pocao && poc !== null) {
      const min = gastoPocaoH ? Math.max(POCAO_MIN, gastoPocaoH * POCAO_HORAS_MIN) : POCAO_MIN;
      const alvo = Math.min(POCAO_TETO, gastoPocaoH ? Math.max(POCAO_ALVO, gastoPocaoH * POCAO_HORAS_ALVO) : POCAO_ALVO);
      if (poc < min && comprar(M.loja.pocao, alvo - poc)) return true;
    }
    // 1.3: bolas, só com a conta arremessando e só depois de poção e revive
    if (bolaPedida && t - bolaPedida > 15e3) { // o jogo não confirmou a compra: não insiste às cegas
      bolaPedida = null; bolaFalhas++; bolaEspera = t + 30 * 60e3;
      registrar(bolaFalhas >= 3 ? 'o jogo não confirmou a compra de bolas 3 vezes: parei de tentar (compre à mão e me mande o relatório)' : 'o jogo não confirmou a compra de bolas: tento de novo em 30 minutos');
    }
    if (ultimoArremesso && t - ultimoArremesso < ARREMESSO_VALE_MS && bolaFalhas < 3 && t >= bolaEspera && !bolaPedida) {
      const bola = (id, preco, falta, sobra) => {
        const qtd = Math.min(falta, Math.floor((S.gold - sobra) / preco), 9999);
        if (qtd < 50) return false;
        pedidoLoja = { quando: t, kind: 'ball', id, meu: true };
        if (!mandar({ t: 'shop.buy', kind: 'ball', id, qty: qtd })) { pedidoLoja = null; return false; }
        S.gold -= qtd * preco; ultimaCompra = t; bolaPedida = t;
        return true;
      };
      const poke = S.balls[BOLA_POKE] || 0, ultra = S.balls[BOLA_ULTRA] || 0;
      if (poke < POKE_MIN && bola(BOLA_POKE, PRECO_POKE, POKE_ALVO - poke, RESERVA_OURO)) return true;
      if (ultra < ULTRA_MIN && bola(BOLA_ULTRA, PRECO_ULTRA, ULTRA_ALVO - ultra, ULTRA_SOBRA_OURO)) return true;
    }
    return false;
  }

  // ===== 2) parada no Centro: cura e volta =====
  function religar() {
    const t = agora();
    if (!S.noCentro || trocando || t - S.desdeCentro < PARADA_MS || t - ultimaCura < 90e3) return false;
    const poc = somaItens(S.potionIds), rev = somaItens(S.reviveIds);
    if (!poc && !rev) {
      if (repor()) return true;
      if (!M.loja.pocao) { if (t - ultimaCura > 10 * 60e3) { ultimaCura = t; registrar('parada no Centro sem poção nem revive (compre 1 poção à mão para eu aprender)'); } return true; }
      // 1.11: sem itens e sem ouro, ficar no Centro não junta ouro nunca (CoxinhaFria, 17/11 06:17). Cura de graça e caça bem abaixo do nível, onde não precisa de poção.
      if (semItens && t - semItens.em < 10 * 60e3) { M.bloqueio[semItens.slug] = S.level + BLOQUEIO_LONGE; registrar('voltei ao Centro em menos de 10 minutos em ' + nomeHunt(semItens.slug) + ' sem poção: bloqueio até o nível ' + (S.level + BLOQUEIO_LONGE)); }
      const D0 = degraus(), seguros = D0.filter((h) => h.nivel <= S.level - SEM_ITENS_FOLGA && !doDia(h) && !(M.bloqueio[h.slug] > S.level));
      const seguro = seguros.length ? seguros[seguros.length - 1] : D0[0];
      if (!seguro || !huntDe(seguro.slug)) { if (t - ultimaCura > 10 * 60e3) { ultimaCura = t; registrar('parada no Centro sem poção nem revive, e não consigo comprar (ouro insuficiente)'); } return true; }
      teste = null; semItens = { slug: seguro.slug, em: t }; ultimaCura = t; salvar();
      mandar({ t: 'centro.curar' });
      trocando = t; troca = { slug: seguro.slug, tent: 0, esc: 0, prox: t + 3000, espera: false, feito: 0 };
      registrar('sem poção, sem revive e com ' + fmt(S.gold) + ' de ouro: curei de graça e vou caçar em ' + nomeHunt(seguro.slug) + ' para juntar ouro (só volto a subir com poção para 1,5 h)');
      return true;
    }
    const reprovada = (sl) => !!sl && (M.bloqueio[sl] || 0) > S.level;
    let alvo = (teste && teste.para) || (M.boa && huntDe(M.boa) && !reprovada(M.boa) ? M.boa : M.ultimaHunt);
    if (!teste && reprovada(alvo)) alvo = null; // 1.5: nunca religa numa hunt reprovada (caso da CapivaraZen no Seaking 50 em 16/11)
    if (teste && t - teste.inicio > 100e3) { // a hunt em teste não abriu: desiste dela por 30 minutos e volta para a anterior
      falhou[teste.para] = t + 15 * 60e3;
      registrar('a troca para ' + nomeHunt(teste.para) + ' não pegou; volto para ' + nomeHunt(teste.de) + ' e tento de novo em 15 minutos');
      alvo = teste.de; teste = null;
    }
    if (!alvo || !huntDe(alvo)) { const D = degraus(), baixos = D.filter((h) => h.nivel <= S.level - 8), topo = baixos.length ? baixos[baixos.length - 1].nivel : null, folga = baixos.find((h) => h.nivel === topo) || D[0]; alvo = folga ? folga.slug : null; } // 1.1: sem hunt conhecida, o degrau mais alto com 8 níveis de folga
    if (!alvo || !huntDe(alvo)) return false;
    ultimaCura = t;
    mandar({ t: 'centro.curar' });
    trocando = t; troca = { slug: alvo, tent: 0, esc: 0, prox: t + 3000, espera: false, feito: 0 };
    registrar('estava parada no Centro: curei e voltei para ' + nomeHunt(alvo));
    return true;
  }

  // 1.8: tipo do dia (quem é do tipo causa o dobro de dano e leva um quarto; vira às 18h). O script não calcula dano: mede o XP.
  let diaDesde = 0; // 1.9: quando vi o tipo do dia atual pela primeira vez nesta página
  function diaNovo(tipo, marca) {
    if (M.diaMarca === marca) return;
    const primeiro = M.diaMarca === undefined;
    M.diaMarca = marca; M.diaTipo = tipo; diaDesde = agora();
    if (!primeiro) { M.bloqueio = {}; M.quedaEm = 0; registrar('o tipo do dia mudou para ' + tipo + ': esqueço as reprovações e testo a escada de novo'); }
    salvar();
  }
  function fugirDoDia(t, atual, D) { // 1.9: o alvo atual é do tipo do dia: sai já, para o degrau mais alto liberado que não seja
    if (!doDia(atual) || M.diaFuga === M.diaMarca || t - desdeHunt < 5 * 60e3 || t - diaDesde < 5 * 60e3) return false; // mede 5 minutos já com o dia novo, para comparar certo
    M.diaFuga = M.diaMarca;
    const outro = D.filter((h) => h.nivel <= S.level && h.slug !== atual.slug && !doDia(h) && !(M.bloqueio[h.slug] > S.level) && !(falhou[h.slug] > t)).pop();
    if (!outro) { registrar(nomeHunt(atual.slug) + ' é do tipo do dia (' + M.diaTipo + ') e leva um quarto do dano, mas não há outro degrau liberado para testar'); salvar(); return false; }
    let base = taxaXp(Math.max(diaDesde + 60e3, desdeHunt + TESTE_ASSENTA_MS), t); if (!(base > 0)) base = null; // só o que rendeu depois que o dia virou
    M.boa = atual.slug; M.quedaEm = t; salvar();
    teste = { de: atual.slug, para: outro.slug, inicio: t, base, nivel: S.level, queda: true };
    trocarPara(outro.slug, nomeHunt(atual.slug) + ' é do tipo do dia (' + M.diaTipo + ') e leva um quarto do dano: testo ' + nomeHunt(outro.slug) + (base !== null ? ' (aqui está dando ' + fmt(base) + ' de XP por hora)' : ''));
    return true;
  }
  function quedaXp(t, atual, D) {
    if (t - (M.quedaEm || 0) < QUEDA_ESPERA_MS || t - desdeHunt < 6 * 60e3 || !Array.isArray(M.amostras)) return false;
    const A = M.amostras.filter((x) => x[7] === atual.slug && typeof x[2] === 'number');
    const rec = A.filter((x) => x[0] > t - 26 * 60e3), ant = A.filter((x) => x[0] <= t - 30 * 60e3 && x[0] > t - 240 * 60e3);
    if (rec.length < 2 || ant.length < 3) return false;
    const meio = (v) => { const s = v.map((x) => x[2]).sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    const ref = meio(ant), cur = Math.max(...rec.map((x) => x[2]));
    if (!(ref > 0) || cur >= ref * QUEDA_FRACAO) return false;
    M.quedaEm = t;
    const abaixo = D.filter((h) => h.nivel < atual.nivel && !doDia(h) && !(M.bloqueio[h.slug] > S.level) && !(falhou[h.slug] > t)).pop();
    const oque = 'o XP em ' + nomeHunt(atual.slug) + ' caiu de ' + fmt(ref) + ' para ' + fmt(cur) + ' por hora' + (M.diaTipo ? ' (tipo do dia: ' + M.diaTipo + ')' : '');
    if (!abaixo) { registrar(oque + ', mas não há degrau abaixo para testar'); salvar(); return false; }
    let base = taxaXp(t - 6 * 60e3, t); if (!(base > 0)) base = cur;
    M.boa = atual.slug; salvar();
    teste = { de: atual.slug, para: abaixo.slug, inicio: t, base, nivel: S.level, queda: true };
    trocarPara(abaixo.slug, oque + ': testo ' + nomeHunt(abaixo.slug));
    return true;
  }

  // ===== 3) escada de hunts =====
  function degraus() {
    const E = ESCADA[S.tipo];
    if (!E || !S.hunts) return [];
    return E.map(([nivel, nome]) => S.hunts.find((h) => h.nome === nome && h.nivel === nivel && h.area !== 'outland')).filter(Boolean);
  }
  // 1.3: sem temporizador. Cada passo roda quando chega mensagem do jogo (chegam várias por segundo, mesmo com a janela em segundo plano) ou no relógio de 20 s.
  const brecha = () => Math.max(300, S.centroLivreEm - (agora() + S.difServidor) + 250);
  function trocarPara(slug, motivo) {
    trocando = agora();
    registrar(motivo);
    troca = { slug, tent: 0, esc: 0, prox: agora() + Math.min(brecha(), 15e3), espera: false, feito: 0 };
  }
  let emPasso = false;
  function passoTroca() { if (emPasso) return; emPasso = true; try { passoTroca2(); } finally { emPasso = false; } } // a resposta do jogo pode chegar no meio de um passo: um de cada vez
  function passoTroca2() {
    const T = troca;
    if (!T) return;
    const t = agora();
    if (T.feito) { if (t >= T.feito) { troca = null; trocando = 0; } return; }
    if (t < T.prox) return;
    if (S.noCentro) { // já no Centro: escolhe a hunt
      if (mandar({ t: 'hunt.select', slug: T.slug })) { T.feito = t + 6000; return; }
      if (++T.esc > 3) { troca = null; trocando = 0; return; }
      T.prox = t + 6000; return;
    }
    if (T.espera) { T.espera = false; T.prox = t + Math.min(brecha(), 5000); return; } // o pedido não levou ao Centro: espera a brecha do combate
    if (T.tent >= IDA_TENTATIVAS) { troca = null; trocando = 0; return; } // não conseguiu sair do combate: o teste registra que a troca não pegou
    T.tent++;
    if (T.tent > IDA_NORMAIS) { if (T.tent === IDA_NORMAIS + 1) registrar('o jogo não deixou ir ao Centro (em combate): desisto do combate para trocar'); mandar({ t: 'centro.desistir' }); } // o mesmo botão Desistir do Combate
    else mandar({ t: 'centro.ir' });
    T.espera = true; T.prox = t + 1500;
  }
  function escada() {
    const t = agora();
    if (S.noCentro || trocando || !S.huntSlug) return;
    const atual = huntDe(S.huntSlug);
    if (!atual) return;
    if (M.huntFixa) { // 1.20: hunt fixa pedida por ela pelo Telegram ("NICK hunt NOME"; "NICK hunt auto" desfaz)
      const hf = huntDe(M.huntFixa);
      if (!hf) { M.huntFixa = null; salvar(); }
      else {
        if (atual.slug === hf.slug) {
          if (conta(mortes, t - MORTES_JANELA_MS) >= MORTES_DESCE * 2) { M.huntFixa = null; salvar(); avisar('⚠️ ' + S.nick + ': muitos desmaios em ' + nomeHunt(hf.slug) + ' (hunt fixa): voltei a escolher a hunt sozinha.'); }
          return;
        }
        if (!(falhou[hf.slug] > t) && t - (M.huntFixaEm || 0) > 5 * 60e3) { M.huntFixaEm = t; salvar(); trocarPara(hf.slug, 'hunt fixa (pedida por você): volto para ' + nomeHunt(hf.slug)); }
        return;
      }
    }
    const D = degraus();
    if (!D.length) return;

    if (atual.area === 'outland' && OUTLAND_FIXA[String(S.nick || '').toLowerCase()] && M.outlandSlug !== atual.slug) { M.outlandSlug = atual.slug; salvar(); } // guarda a Outland em que ela foi posta
    const fixa = outlandAlvo(); // 1.16
    if (teste) { // julgando uma troca
      if (S.huntSlug !== teste.para) { if (t - teste.inicio > 150e3) { falhou[teste.para] = t + 15 * 60e3; registrar('a troca para ' + nomeHunt(teste.para) + ' não pegou; sigo em ' + nomeHunt(S.huntSlug) + ' e tento de novo em 15 minutos'); teste = null; } return; }
      const comeco = Math.max(teste.inicio, desdeHunt);
      if (t - comeco < TESTE_ASSENTA_MS + TESTE_MEDE_MS) return;
      const de = comeco + TESTE_ASSENTA_MS, nova = taxaXp(de, t), caiu = conta(mortes, de);
      if (nova === null) { if (t - teste.inicio > 12 * 60e3) teste = null; return; }
      const alvoShiny = ALVO_SHINY.test(String(teste.para)); // 1.14
      const bom = caiu <= TESTE_MORTES && (teste.base === null || nova >= teste.base * (alvoShiny ? ALVO_SHINY_GANHO : TESTE_GANHO));
      const resumo = fmt(nova) + ' de XP por hora' + (teste.base !== null ? ' (antes ' + fmt(teste.base) + ')' : '') + ', ' + caiu + ' desmaio(s) em 4 minutos';
      if (bom) { registrar('fica em ' + nomeHunt(teste.para) + (alvoShiny ? ' (alvo de shiny: fico mesmo com até 10% menos XP)' : '') + ': ' + resumo); M.boa = teste.para; if (teste.queda) M.bloqueio[teste.de] = S.level + BLOQUEIO_LONGE; /* 1.8: não volta para a hunt que caiu até o tipo do dia mudar ou a treinadora subir 10 níveis */ salvar(); teste = null; return; }
      const espera = teste.base !== null && nova < teste.base * LONGE_FRACAO ? BLOQUEIO_LONGE : BLOQUEIO_NIVEIS;
      M.bloqueio[teste.para] = S.level + espera; salvar();
      const volta = teste.de, ruim = teste.para; teste = null;
      trocarPara(volta, 'volto para ' + nomeHunt(volta) + ': ' + nomeHunt(ruim) + ' deu ' + resumo + '. Tento de novo no nível ' + (S.level + espera));
      return;
    }

    // fora de teste: desmaiando demais, desce um degrau
    if (conta(mortes, t - MORTES_JANELA_MS) >= MORTES_DESCE) {
      const abaixo = D.filter((h) => h.nivel < atual.nivel).pop();
      if (abaixo) { M.bloqueio[atual.slug] = S.level + (atual.area === 'outland' ? BLOQUEIO_LONGE : BLOQUEIO_NIVEIS); salvar(); mortes.length = 0; trocarPara(abaixo.slug, 'muitos desmaios em ' + nomeHunt(atual.slug) + ': desço para ' + nomeHunt(abaixo.slug)); }
      return;
    }

    { // 1.11: o ouro não paga a poção nesta hunt: a cada 15 minutos olha o estoque; se caiu, está abaixo de 30 min e o ouro não compra mais 30 min, desce um degrau
      const pocN = somaItens(S.potionIds);
      if (pocN !== null && (!pocVista || pocVista[2] !== atual.slug || t - pocVista[0] >= OURO_OLHA_MS)) {
        const antes = pocVista && pocVista[2] === atual.slug && desdeHunt <= pocVista[0] ? pocVista[1] : null;
        pocVista = [t, pocN, atual.slug];
        const meia = gastoPocaoH > 0 ? gastoPocaoH * OURO_POCAO_H : 0;
        if (antes !== null && M.loja.pocao && meia && pocN < antes && pocN < meia && S.gold - RESERVA_OURO < M.loja.pocao.preco * meia) {
          const abaixo = D.filter((h) => h.nivel < atual.nivel && !doDia(h) && !(M.bloqueio[h.slug] > S.level)).pop();
          if (abaixo) { M.bloqueio[atual.slug] = S.level + BLOQUEIO_LONGE; salvar(); trocarPara(abaixo.slug, 'o ouro não paga a poção em ' + nomeHunt(atual.slug) + ' (' + fmt(pocN) + ' poções, eram ' + fmt(antes) + ' há 15 minutos; ' + fmt(S.gold) + ' de ouro): desço para ' + nomeHunt(abaixo.slug) + ' e só volto no nível ' + (S.level + BLOQUEIO_LONGE)); return; }
        }
      }
    }
    if (fixa) { // 1.16: conta fixa na Outland
      if (atual.slug === fixa.slug) return; // está lá: não testa degrau de XP nem sai por queda de XP
      if (!(M.bloqueio[fixa.slug] > S.level) && !(falhou[fixa.slug] > t) && t - outlandEm > OUTLAND_TENTA_MS) {
        outlandEm = t; M.boa = fixa.slug; salvar();
        trocarPara(fixa.slug, 'conta fixa na Outland (pelos drops): vou para ' + nomeHunt(fixa.slug) + ' (estava em ' + nomeHunt(atual.slug) + ')');
        return;
      }
    }
    if (fugirDoDia(t, atual, D)) return; // 1.9
    if (quedaXp(t, atual, D)) return; // 1.8

    // procurar o degrau mais alto liberado, acima do atual e não reprovado
    const livres = D.filter((h) => h.nivel <= S.level && h.nivel > atual.nivel && !doDia(h) && !(M.bloqueio[h.slug] > S.level) && !(falhou[h.slug] > t)); // 1.9: nunca testa alvo do tipo do dia
    if (!livres.length) return;
    { const pocN = somaItens(S.potionIds); if (M.loja.pocao && pocN !== null && (gastoPocaoH === null || pocN < gastoPocaoH * POCAO_HORAS_MIN)) return; } // 1.11: só sobe de degrau com poção para 1,5 h (sem isso, o ouro não está dando para repor); antes de medir o gasto (uns 5 minutos depois de abrir a página), não sobe
    const topo = livres[livres.length - 1].nivel, alvo = livres.find((h) => h.nivel === topo);
    let base = taxaXp(Math.max(t - 6 * 60e3, desdeHunt + TESTE_ASSENTA_MS), t); // só com a hunt atual, sem o minuto de assentar
    if (base !== null && base <= 0) base = null;
    if (base === null && t - desdeHunt < 10 * 60e3) return; // espera ter uma base de comparação (sem amostras por 10 minutos, julga só pelos desmaios)
    M.boa = atual.slug; salvar(); // 1.5: se a página recarregar no meio do teste, é para cá que volta
    teste = { de: atual.slug, para: alvo.slug, inicio: t, base, nivel: S.level };
    trocarPara(alvo.slug, 'treinadora no nível ' + S.level + ': testo ' + nomeHunt(alvo.slug) + ' (estava em ' + nomeHunt(atual.slug) + (base !== null ? ', ' + fmt(base) + ' de XP por hora' : '') + ')');
  }

  // ===== 4) 1.6: sorteios do Mercado a pedido da principal =====
  // O sinal vem do monitor da principal pelo quadro do Telegram, lido pelo script irmão. Formato: { n, q (quando foi publicado), k ('lance', 'teste' ou 'pulso'),
  // id (anúncio), lib (hora em que libera, no relógio deste computador), p (preço por unidade), qtd, m ('orb' = Gemas, 'gold' = Coins), nome, via, cls (classe na regra das extras ou ''), pes }.
  if (!Array.isArray(M.sinais)) M.sinais = [];   // [recebido, n, k, id, cls, atraso (ms entre publicar e chegar), folga (ms até liberar), decisão, resultado, nome]
  if (!Array.isArray(M.amostras)) M.amostras = []; // [quando, nível, XP por hora, ouro, Gemas, Ultra, Poke, hunt]
  const pendentes = [];                            // lances que vou pedir: { s, em, linha }
  const quemSorteio = new Map();                   // 1.20: anúncio -> nomes de quem entrou (só na memória)
  const FAMILIA_NICKS = [CONTA_PRINCIPAL, 'CapivaraZen', 'CoxinhaFria', 'Vortek77']; // 1.20: as 4 contas dela (para dizer quem da família entrou no sorteio)
  const pedidosSorteio = [];                       // quando pedi (para o freio por hora)
  let respostaAte = 0, respostaLinha = null, ponte = null;
  const ehPrincipal = () => String(S.nick || '').toLowerCase() === CONTA_PRINCIPAL;
  const inteiro = (v) => typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
  // 1.12: relógio do sorteio num worker. O Chrome atrasa os temporizadores da página em segundo plano (na CapivaraZen, 3 s); os do worker não.
  let relogio = null, relogioNome = 'temporizador da página';
  try {
    const url = URL.createObjectURL(new Blob(['onmessage=function(e){setTimeout(function(){postMessage(e.data)},Math.max(0,e.data.ms||0))}'], { type: 'text/javascript' }));
    relogio = new Worker(url);
    relogio.onmessage = () => { try { passoSorteio(); } catch (e) {} };
    relogio.onerror = () => { relogio = null; relogioNome = 'temporizador da página (o worker falhou)'; };
    relogioNome = 'worker';
  } catch (e) { relogio = null; relogioNome = 'temporizador da página (o jogo não deixou criar o worker)'; }
  function reservaSorteio() { // 1.14: ouro para uns 10 minutos de bolas e poções; entre 5 mil e 50 mil
    const pocH = gastoPocaoH || 0, precoP = (M.loja.pocao && M.loja.pocao.preco) || 50, bola = (S.balls[BOLA_ULTRA] || 0) > 0 ? PRECO_ULTRA : PRECO_POKE;
    return Math.max(RESERVA_OURO, Math.min(SORTEIO_RESERVA_OURO, Math.round((pocH * precoP + ARREMESSOS_H * bola) / 6)));
  }
  // 1.26: custo em Gemas do que esta conta comprou e ainda tem (anunciado ou não)
  function estoqueParado() { try { let t = 0; const C = M.custos || {}, an = new Set((S.meus || []).map(pidDe).filter(Boolean)); for (const pid of Object.keys(C)) { const c = C[pid]; if (c && c.moeda === 'orb' && c.v > 0 && ((S.pk && S.pk.has(Number(pid))) || an.has(Number(pid)))) t += c.v; } return t; } catch (err) { return 0; } }
  try { if (!M.v3PreyFreio) { M.preyDesligado = true; M.v3PreyFreio = Date.now(); salvar(); } } catch (err) {} // 1.27: freio do Prey, uma vez
  function receberSinal(s) {
    if (!s || typeof s !== 'object' || !inteiro(s.n) || ehPrincipal()) return;
    if (M.sinais.some((x) => x[1] === s.n && x[2] === s.k && Math.abs(x[0] - agora()) < 6 * 3600e3)) return; // já vi
    const t = agora(), atraso = typeof s.q === 'number' ? t - s.q : null;
    const linha = [t, s.n, String(s.k || '?'), inteiro(s.id) ? s.id : 0, String(s.cls || ''), atraso, null, '', '', String(s.nome || '').slice(0, 90)];
    M.sinais.push(linha); if (M.sinais.length > 300) M.sinais.splice(0, M.sinais.length - 300);
    linha[11] = 0; linha[12] = { esp: Number(s.esp) > 0 ? Number(s.esp) : null, ju: Number(s.ju) > 0 ? Number(s.ju) : null, co: Number(s.co) > 0 ? Number(s.co) : null, pi: Number(s.pi) > 0 ? Number(s.pi) : null, pv: s.pv && typeof s.pv === 'object' ? s.pv : null, m: s.m === 'orb' ? 'orb' : 'gold', item: s.it ? 1 : 0 }; // 1.14
    if (s.k === 'cmd') { // 1.20: comando da principal (vindo do Telegram dela)
      linha[9] = (String(s.a || '?') + (s.pid ? ' #' + s.pid : '') + (s.p ? ' ' + s.p : '') + (s.nome ? ' ' + s.nome : '')).slice(0, 90);
      if (String(s.c || '').toLowerCase() !== String(S.nick || '').toLowerCase()) { linha[7] = 'comando para ' + (s.c || '?'); salvar(); return; }
      if (typeof s.q === 'number' && agora() - s.q > CMD_VALIDADE_MS) { linha[7] = 'comando velho (' + fmt((agora() - s.q) / 60e3) + ' min): não executei'; salvar(); return; }
      linha[7] = 'executando'; salvar();
      try { executarComando(s, linha); } catch (e) { linha[7] = 'erro no comando: ' + (e && e.message); salvar(); }
      return;
    }
    if (s.k !== 'lance') { linha[7] = s.k === 'teste' ? 'teste da ponte recebido' : s.k === 'relatorio' ? 'pedido de relatório' : 'pulso'; salvar(); if (s.k === 'teste') registrar('teste da ponte: chegou em ' + (atraso === null ? '?' : fmt(atraso / 1000)) + ' s'); return; }
    const qtd = inteiro(s.qtd) && s.qtd > 0 ? s.qtd : 1, total = (Number(s.p) || 0) * qtd, folga = typeof s.lib === 'number' ? s.lib - t : null;
    linha[6] = folga;
    let nao = null;
    if (!inteiro(s.id) || s.id <= 0 || !(s.p > 0) || (s.m !== 'orb' && s.m !== 'gold') || folga === null) nao = 'sinal incompleto';
    else if (!SORTEIO_CLASSES[s.cls]) nao = 'fora da regra das extras';
    else if (M.sorteioDesligado || M.pausado) nao = 'sorteios desligados nesta conta';
    else if (!S.pronto) nao = 'a conta ainda não carregou';
    else if (folga < -SORTEIO_JANELA_MS) nao = 'chegou tarde (' + fmt(-folga / 1000) + ' s depois de liberar)';
    else if (folga > 10 * 60e3) nao = 'hora de liberar estranha';
    else if (s.m === 'orb' && !(S.orbs >= total)) nao = 'sem Gemas (tem ' + fmt(S.orbs || 0) + ', custa ' + fmt(total) + ')';
    else if (s.m === 'orb' && s.cls === 'gemas25' && total > 10 && estoqueParado() + total > 0.5 * ((S.orbs || 0) + estoqueParado())) nao = 'estoque de revenda cheio (' + fmt(estoqueParado()) + ' Gemas paradas; teto de 50% do total)'; // 1.26
    else if (s.m === 'gold' && total > SORTEIO_COINS_MAX) nao = 'em Coins só entro até ' + fmt(SORTEIO_COINS_MAX);
    else if (s.m === 'gold' && S.gold - total < reservaSorteio()) nao = 'sem ouro de sobra (guardo ' + fmt(reservaSorteio()) + ' para bolas e poções)';
    else if (pendentes.some((x) => x.s.id === s.id) || M.sinais.some((x) => x !== linha && x[3] === s.id && /pedi|vou entrar/.test(x[7]))) nao = 'já pedi neste anúncio';
    else if (pedidosSorteio.filter((q) => q > t - 3600e3).length + pendentes.length >= SORTEIO_POR_HORA) nao = 'freio: ' + SORTEIO_POR_HORA + ' pedidos por hora';
    if (nao) { linha[7] = 'não entro: ' + nao; salvar(); return; }
    linha[7] = 'vou entrar (' + SORTEIO_CLASSES[s.cls] + ')';
    pendentes.push({ s: { id: s.id, p: s.p, qtd, m: s.m, lib: s.lib, total }, em: s.lib + SORTEIO_ATRASO_MS, linha });
    // 1.10: despertadores diretos (não encadeados, então o Chrome só os arredonda para o segundo, mesmo com a janela escondida); o primeiro que rodar pede, os outros não acham mais nada na fila
    for (const mais of [0, 600, 1200]) { try { setTimeout(() => { try { passoSorteio(); } catch (e) {} }, Math.max(0, s.lib + SORTEIO_ATRASO_MS - agora() + mais)); } catch (e) {} }
    if (relogio) for (const mais of [0, 400, 800]) { try { relogio.postMessage({ ms: s.lib + SORTEIO_ATRASO_MS - agora() + mais }); } catch (e) {} } // 1.12
    salvar(); passoSorteio();
  }
  function passoSorteio() {
    const t = agora();
    for (let i = pendentes.length - 1; i >= 0; i--) {
      const P2 = pendentes[i], s = P2.s;
      if (t < P2.em) continue;
      pendentes.splice(i, 1);
      if (ehPrincipal() || M.sorteioDesligado || M.pausado) { P2.linha[7] = 'não entro: desligado na hora'; continue; }
      if (t > s.lib + SORTEIO_JANELA_MS) { P2.linha[7] = 'não entro: perdi a janela (o pedido sairia ' + fmt(t - s.lib) + ' ms depois de liberar; relógio: ' + relogioNome + ')'; continue; }
      if (s.m === 'orb' ? !(S.orbs >= s.total) : S.gold - s.total < reservaSorteio()) { P2.linha[7] = 'não entro: o saldo mudou'; continue; }
      const ok = mandar({ t: 'market.comprar', id: s.id, qtd: s.qtd, preco: s.p, moeda: s.m, sorteioUi: 1 });
      P2.linha[7] = ok ? 'pedi ' + fmt(t - s.lib) + ' ms depois de liberar (' + (relogioNome === 'worker' ? 'worker' : 'página') + ')' : 'não entro: não consegui mandar o pedido ao jogo';
      if (ok) { pedidosSorteio.push(t); while (pedidosSorteio.length > 50) pedidosSorteio.shift(); respostaAte = t + 4000; respostaLinha = P2.linha; registrar('sorteio: pedi ' + P2.linha[9] + ' (anúncio ' + s.id + ')'); }
    }
    salvar();
  }
  function anotarResposta(txt) { if (respostaLinha && String(respostaLinha[8]).length < 400) { respostaLinha[8] = (respostaLinha[8] ? respostaLinha[8] + ' | ' : '') + 'jogo: ' + txt.slice(0, 180); salvar(); } }
  function eventoMercado(ev) {
    if (ehPrincipal() || !ev.id) return;
    const linha = M.sinais.slice().reverse().find((x) => x[3] === ev.id && /^pedi/.test(x[7]));
    if (ev.k === 'mktSorteio') {
      if (!linha) return;
      const res = ev.fase === 'fim' ? (ev.perdeu ? 'perdeu' : ev.ok ? 'ganhou' : String(ev.msg || 'terminou')) : null;
      const base = String(linha[8]).replace(/sorteio com (\d+|\?) participante\(s\)(: \S+)?( \| )?( \(da família: [^)]*\))?/g, '');
      // 1.20: o jogo manda a lista de quem entrou ("entrou": todos até ali; "lista": os que chegam). A soma dá a contagem certa e as contas da família.
      let qs = quemSorteio.get(ev.id); if (!qs) { qs = new Set(); quemSorteio.set(ev.id, qs); if (quemSorteio.size > 40) quemSorteio.delete(quemSorteio.keys().next().value); }
      for (const n of Array.isArray(ev.quem) ? ev.quem : []) if (n && qs.size < 5000) qs.add(String(n).toLowerCase());
      if (ev.eu && ev.fase === 'entrou') qs.add(String(ev.eu).toLowerCase());
      const tot = Math.max(Number(ev.total) || 0, qs.size), fam = FAMILIA_NICKS.filter((n) => qs.has(n.toLowerCase())).map((n) => (n.toLowerCase() === CONTA_PRINCIPAL ? 'principal' : n));
      if (tot > 0) linha[11] = Math.max(Number(linha[11]) || 0, tot); // 1.14: o maior total visto é o número de participantes
      if (fam.length) linha[13] = fam;
      linha[8] = 'sorteio com ' + (Number(linha[11]) || ev.total || '?') + ' participante(s)' + (Array.isArray(linha[13]) && linha[13].length ? ' (da família: ' + linha[13].join(', ') + ')' : '') + (res ? ': ' + res : '') + (base ? ' | ' + base : ''); salvar();
      return;
    }
    // marketComprado: a conta levou alguma coisa no Mercado. Só aviso quando foi pedido meu (compra feita à mão não vira mensagem).
    if (!linha || linha[10]) return;
    linha[10] = 1; linha[8] = 'GANHOU' + (linha[8] ? ' | ' + linha[8] : ''); salvar();
    setTimeout(() => { try {
      const info = linha[12] || {}, nomeC = String(ev.descricao || linha[9] || '');
      const direto = ev.moeda !== 'orb' || info.item || /shiny/i.test(nomeC) || (info.pv && info.pv.g >= info.pv.min) || !/ Nv \d+/.test(nomeC);
      if (direto) return avisar(textoGanhou(ev, linha));
      if (!Array.isArray(M.pendCompras)) M.pendCompras = []; // 1.30: espera o anúncio automático para mandar uma mensagem só
      M.pendCompras.push({ t: agora(), nome: nomeC, preco: Number(ev.total) || 0, part: Number(linha[11]) || 0 }); salvar();
      setTimeout(subirRelatorio, 20000);
    } catch (e) { /* nada */ } }, 3000); // 1.20: espera o fim do sorteio para a contagem chegar inteira
  }
  // 1.30: compra que esperou o anúncio demais: avisa só a compra
  const pendDe = (nomeFicha) => { const L = Array.isArray(M.pendCompras) ? M.pendCompras : []; return L.find((x) => agora() - x.t < 20 * 60e3 && String(nomeFicha || '').indexOf(x.nome) === 0) || null; };
  setInterval(() => { try { const L = Array.isArray(M.pendCompras) ? M.pendCompras : []; if (!L.length) return; const fica = [];
    for (const x of L) { if (agora() - x.t < 15 * 60e3) { fica.push(x); continue; } avisar('🎉 ' + S.nick + ' comprou ' + x.nome + ' por ' + fmt(x.preco) + ' Gemas' + (x.part ? ' (sorteio com ' + x.part + ')' : '') + '. Ainda sem anúncio: a principal não achou preço seguro ou não leu a conta. Para anunciar: "' + String(S.nick || '').toLowerCase() + ' anunciar ' + x.nome.split(' Nv ')[0].toLowerCase() + '".'); }
    M.pendCompras = fica; salvar(); } catch (e) { /* nada */ } }, 60e3);
  function textoGanhou(ev, linha) { // 1.14: quantos participaram, quanto vale e o que fazer
    const gemas = ev.moeda === 'orb', info = linha[12] || {}, part = Number(linha[11]) || 0, pct = (x) => (Math.round(Number(x) * 10) / 10).toLocaleString('pt-BR');
    const L = ['🎉 ' + S.nick + ' levou no Mercado: ' + String(ev.descricao || linha[9] || 'anúncio ' + ev.id) + ' por ' + fmt(ev.total || 0) + (gemas ? ' Gemas' : ' Coins') + '.'];
    const famL = Array.isArray(linha[13]) ? linha[13].filter((n) => n.toLowerCase() !== String(S.nick || '').toLowerCase()) : [];
    L.push(part ? 'Sorteio com ' + part + ' participante(s)' + (part > 1 ? (famL.length ? '; da família também entraram: ' + famL.join(', ') : '; nenhuma outra conta da família entrou') : '') + '.' : 'Não vi quantos participaram do sorteio.'); // 1.20
    const topo = info.co || info.ju || (info.esp ? info.esp * 1.1 : null), piso = info.pi || info.esp || (info.ju ? info.ju * 0.85 : null); // 1.18: o mesmo começo e piso do anúncio da principal e da resposta de preço
    if (topo) L.push('Vale ~' + fmt(Math.round(info.ju || topo)) + ' Gemas pela conta da principal' + (piso && piso < (info.ju || topo) ? ' (revenda esperada ~' + fmt(Math.round(piso)) + ')' : '') + '.');
    const pv = info.pv;
    if (pv && pv.g >= pv.min) L.push('Para o PvP da principal: subiria a força do time em ' + pct(pv.g) + '% (' + (pv.t || 'troca') + '; ela pede ' + pct(pv.min) + '%). Vale passar para a principal: fale com o Claude antes, para combinar o preço e não perder no sorteio.');
    else L.push((pv ? 'Para o PvP da principal não compensa (subiria ' + pct(pv.g) + '%, ela pede ' + pct(pv.min) + '%). ' : '') + (topo ? 'Revenda aqui mesmo: anuncie a ~' + fmt(Math.round(topo)) + ' Gemas e baixe até ~' + fmt(Math.round(piso)) + ' se não vender' + (info.co ? ' (mesma conta da resposta de preço da principal)' : ' em um dia') + '.' : 'Revenda aqui mesmo.'));
    L.push('Não anunciei nem mexi em nada.');
    return L.join(' ');
  }
  function amostrar() {
    const t = agora(), u = M.amostras[M.amostras.length - 1];
    if (u && t - u[0] < 10 * 60e3) return;
    const xp = taxaXp(t - 6 * 60e3, t);
    M.amostras.push([t, S.level, xp === null ? null : Math.round(xp), Math.round(S.gold), S.orbs, S.balls[BOLA_ULTRA] || 0, S.balls[BOLA_POKE] || 0, S.noCentro ? 'centro' : S.huntSlug]);
    if (M.amostras.length > 300) M.amostras.splice(0, M.amostras.length - 300);
    salvar();
  }
  // ===== 5) 1.20: comandos da principal (os mesmos do Telegram da principal, com o nome desta conta na frente) =====
  // A principal manda pelo quadro { k: 'cmd', c: nick, a: ação, pid, p (preço), d (dias), tpl (formato de mudar preço), auto (escada: sem mensagem), nota, nome }.
  const CMD_VALIDADE_MS = 15 * 60e3;
  let cmdResposta = null; // { ate, msgs }: avisos do jogo logo depois de um comando
  const pidDe = (l) => Number(l && (l.pokemonId || (l.ficha && l.ficha.id))) || 0;
  const semAcentoX = (x) => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const taxaPk = (t0) => { const t = Math.floor(t0); if (t <= 0) return 0; let piso = 0, bp = 0; for (const [ate, b] of [[500, 1300], [5000, 1000], [Infinity, 750]]) { const teto = Math.min(t, ate); if (teto <= piso) break; bp += (teto - piso) * b; piso = teto; } return Math.min(t, Math.ceil(bp / 10000)); };
  const liquidoPk = (p) => Math.max(0, Math.floor(p) - taxaPk(p)); // a mesma conta do jogo que a principal usa
  const descAn = (l) => (l.tipo === 'pokemon' && l.ficha ? fichaTxt(l.ficha) + ' #' + pidDe(l) : (S.nomesItem[l.itemId] || 'item ' + l.itemId) + ((l.qtd || 1) > 1 ? ' ×' + l.qtd : ''));
  const moedaTxt = (m) => (m === 'gold' ? ' Coins' : ' Gemas');
  const esperaMeus = [];
  let ultimoPedidoMeus = 0;
  const quaseSumidos = new Map(); // anúncio que faltou numa lista: só conta como saído se faltar de novo na lista seguinte (1 min depois ou mais)
  function guardarMeus(linhas) {
    const antes = S.meus, t = agora(); S.meus = linhas; S.meusEm = t;
    const vivos = new Set(linhas.map((l) => l.id));
    for (const [id, x] of quaseSumidos) { if (vivos.has(id)) quaseSumidos.delete(id); else if (t - x.em >= 60e3) { quaseSumidos.delete(id); sumiu(x.l); } }
    if (antes) for (const l of antes) if (!vivos.has(l.id) && !quaseSumidos.has(l.id)) quaseSumidos.set(l.id, { l, em: t });
    while (esperaMeus.length) { const cb = esperaMeus.shift(); try { cb(linhas); } catch (e) { /* nada */ } }
  }
  function pedirMeus(cb) {
    esperaMeus.push(cb); ultimoPedidoMeus = agora();
    if (!mandar({ t: 'market.meus' })) { const i = esperaMeus.indexOf(cb); if (i >= 0) esperaMeus.splice(i, 1); try { cb(null); } catch (e) { /* nada */ } return; }
    setTimeout(() => { const i = esperaMeus.indexOf(cb); if (i >= 0) { esperaMeus.splice(i, 1); try { cb(null); } catch (e) { /* nada */ } } }, 6000);
  }
  // anúncio que some da lista: se o pokemon também saiu da conta, vendeu (avisa); se voltou, foi cancelado ou venceu (só registra)
  function sumiu(l) {
    const pid = pidDe(l); if (!pid || l.tipo !== 'pokemon') return;
    if (M.cancelados && agora() - (M.cancelados[pid] || 0) < 15 * 60e3) return;
    if (!Array.isArray(M.sumidos)) M.sumidos = [];
    if (M.sumidos.some((x) => x.pid === pid)) return;
    if (M.vendidosJa && M.vendidosJa[pid]) return; // 1.25: essa venda já foi avisada na hora
    M.sumidos.push({ pid, nome: l.ficha ? fichaTxt(l.ficha) : 'pokemon', preco: Number(l.preco) || 0, moeda: l.moeda, em: agora() }); salvar();
  }
  // 1.25 (V3): o jogo avisa a venda na hora ({k:"marketVendido", descricao, valor, bruto, moeda}). O aviso sai já; o anúncio que casa com ela não é avisado de novo.
  function vendidoNaHora(ev) {
    if (ehPrincipal()) return;
    const bruto = Number(ev.bruto) || 0, gemas = ev.moeda === 'orb', desc = String(ev.descricao || 'item');
    const l = (S.meus || []).find((a) => a.tipo === 'pokemon' && a.ficha && (Number(a.preco) || 0) === bruto && (a.moeda === 'orb') === gemas && desc.indexOf(String(a.ficha.nome || '?')) === 0 && !(M.vendidosJa || {})[pidDe(a)]);
    const pid = l ? pidDe(l) : 0;
    if (pid) { if (!M.vendidosJa) M.vendidosJa = {}; M.vendidosJa[pid] = agora(); const ks = Object.keys(M.vendidosJa); if (ks.length > 60) delete M.vendidosJa[ks[0]]; if (Array.isArray(M.sumidos)) M.sumidos = M.sumidos.filter((s) => s.pid !== pid); salvar(); }
    avisar('💰 Vendeu na ' + S.nick + ': ' + (l ? fichaTxt(l.ficha) + ' (#' + pid + ')' : desc) + ' por ' + fmt(bruto) + (gemas ? ' Gemas (você recebe ' + fmt(Number(ev.valor) || liquidoPk(bruto)) + ').' : ' Coins.') + (gemas && pid ? origemExtra(pid, bruto) : ''));
    registrar('venda avisada na hora: ' + desc + ' por ' + bruto + (gemas ? ' Gemas' : ' Coins'));
    setTimeout(() => { try { ultimoPedidoMeus = agora(); mandar({ t: 'market.meus' }); } catch (err) {} }, 3000);
    setTimeout(() => { try { subirRelatorio(); } catch (err) {} }, 12000);
  }
  function conferirSumidos() {
    if (!Array.isArray(M.sumidos) || !M.sumidos.length) return;
    const t = agora(), resta = [];
    for (const x of M.sumidos) {
      if (!S.pk || (S.pkEm || 0) - x.em < 15e3) { if (t - x.em < 40 * 60e3) resta.push(x); else registrar('anúncio de ' + x.nome + ' saiu e não consegui conferir se vendeu'); continue; }
      if (S.pk.has(x.pid)) registrar('anúncio de ' + x.nome + ' saiu sem vender (cancelado ou venceu); ele voltou para a conta');
      else avisar('💰 Vendeu na ' + S.nick + ': ' + x.nome + ' (#' + x.pid + ') por ' + fmt(x.preco) + (x.moeda === 'gold' ? ' Coins.' : ' Gemas (você recebe ~' + fmt(liquidoPk(x.preco)) + ').') + (x.moeda === 'gold' ? '' : origemExtra(x.pid, x.preco)));
    }
    M.sumidos = resta; salvar();
  }
  const respostaJogo = (ms) => { cmdResposta = { ate: agora() + (ms || 6000), msgs: [] }; };
  const textoJogo = () => (cmdResposta && cmdResposta.msgs.length ? ' (o jogo disse: ' + cmdResposta.msgs.join('; ') + ')' : '');
  function subirRelatorio() { try { if (S.pronto && !ehPrincipal()) window.postMessage({ pokeidleExtraRelatorio: { conta: S.nick, nome: nomeRelatorio(), texto: relatorio(), soGitHub: true } }, location.origin); } catch (e) { /* nada */ } }
  function statusTexto(ls) {
    const an = ls ? (ls.length ? 'anúncios: ' + ls.map((l) => descAn(l) + ' a ' + fmt(Number(l.preco) || 0) + moedaTxt(l.moeda)).join('; ') : 'nenhum anúncio aberto') : 'não consegui ler os anúncios agora';
    return (S.nick + ': ' + situacao() + ' | ouro ' + fmt(S.gold) + ' | ' + an + (M.huntFixa ? ' | hunt fixa (pedida por você)' : '') + (M.sorteioDesligado ? ' | sorteios desligados' : '')).slice(0, 1400);
  }
  function executarComando(s, linha) {
    const nome = S.nick || 'conta extra', ap = String(S.nick || '').toLowerCase();
    const fim = (txt, aviso) => { linha[7] = String(txt).slice(0, 200); salvar(); if (aviso === false) registrar('comando: ' + txt); else avisar(aviso || txt); };
    if (!S.pronto) return fim('a conta ainda não carregou', '⚠️ ' + nome + ': a conta ainda não carregou nesta aba. Mande o comando de novo em 1 minuto.');
    const a = String(s.a || '');
    if (a === 'status') { linha[7] = 'status pedido'; salvar(); return pedirMeus((ls) => { avisar('📋 ' + statusTexto(ls)); linha[7] = 'status mandado'; salvar(); setTimeout(subirRelatorio, 1500); }); }
    if (a === 'relatorio') { subirRelatorio(); return fim('relatório mandado ao GitHub', s.quieto ? false : '📁 ' + nome + ': mandei o relatório para o GitHub.'); }
    if (a === 'pausar' || a === 'retomar') {
      M.sorteioDesligado = a === 'pausar'; salvar();
      return fim(a === 'pausar' ? 'sorteios desligados por comando' : 'sorteios ligados por comando', a === 'pausar' ? '⏸️ ' + nome + ': sorteios desligados nesta conta. Para ligar de novo: "' + ap + ' retomar".' : '▶️ ' + nome + ': sorteios ligados de novo.');
    }
    if (a === 'prey') { M.preyDesligado = !(Number(s.p) > 0); salvar(); return fim('Prey automático ' + (M.preyDesligado ? 'desligado' : 'ligado') + ' por comando', false); } // 1.27
    if (a === 'comprar') { // 1.29: passagem de Gemas (anúncio da principal)
      const id = Number(s.id), p = Number(s.p);
      if (!(id > 0) || !(p > 0)) return fim('comando de compra incompleto', '⚠️ ' + nome + ': o pedido de compra veio incompleto. Nada feito.');
      if (!(S.orbs >= p)) return fim('sem Gemas para comprar', '⚠️ ' + nome + ': tenho ' + fmt(S.orbs || 0) + ' Gemas e o anúncio custa ' + fmt(p) + '. Nada feito.');
      const espera = Math.min(4 * 60e3, Math.max(0, (Number(s.lib) || 0) - agora())) + 800;
      linha[7] = 'vou comprar o anúncio ' + id + ' por ' + p + ' em ' + Math.round(espera / 1000) + ' s'; salvar();
      setTimeout(() => {
        const antes = S.orbs;
        const ok = mandar({ t: 'market.comprar', id, qtd: 1, preco: p, moeda: 'orb', sorteioUi: 1 });
        if (!ok) return fim('não consegui mandar a compra ao jogo', '⚠️ ' + nome + ': não consegui mandar a compra ao jogo. Mande o comando de novo.');
        respostaJogo(8000);
        setTimeout(() => { const pagou = typeof antes === 'number' && typeof S.orbs === 'number' && S.orbs <= antes - p + 1;
          fim(pagou ? 'comprou o anúncio ' + id + ' por ' + p : 'pedi a compra do anúncio ' + id + ' e o saldo não caiu' + textoJogo(), pagou ? '✅ ' + nome + ': comprei ' + (s.nome || 'o anúncio') + ' da principal por ' + fmt(p) + ' Gemas. Saldo agora: ' + fmt(S.orbs) + '.' : '⚠️ ' + nome + ': pedi a compra, mas o saldo não caiu' + textoJogo() + '. Confira o anúncio e mande de novo.'); setTimeout(subirRelatorio, 3000); }, 9000);
      }, espera);
      return;
    }
    if (a === 'preyPk') { M.preyPedido = { dia: String(s.dia || ''), pk: Number(s.pk) || 0 }; salvar(); try { preyEscolher(); } catch (err) {} return fim('Prey: a principal pediu a espécie ' + s.pk, false); } // 1.31
    if (a === 'hunt') return cmdHunt(s, fim, nome, ap);
    if (a === 'anunciar') return cmdAnunciar(s, fim, nome, linha);
    if (a === 'mudar') return cmdMudar(s, fim, nome);
    if (a === 'cancelar') return cmdCancelar(s, fim, nome);
    fim('comando desconhecido: ' + a, '⚠️ ' + nome + ': não conheço o comando "' + a + '". Atualize o script desta conta (Tampermonkey, Utilitários, Verificar atualizações).');
  }
  function cmdHunt(s, fim, nome, ap) {
    const q = semAcentoX(String(s.nome || '').toLowerCase()).trim();
    if (!q || /^auto/.test(q)) { M.huntFixa = null; salvar(); return fim('hunt automática', '🔁 ' + nome + ': volto a escolher a hunt sozinha.'); }
    const nv = (q.match(/(\d+)\s*$/) || [])[1], nomeQ = q.replace(/\s*\d+\s*$/, '').trim();
    const hs = (S.hunts || []).filter((h) => semAcentoX(String(h.nome).toLowerCase()).startsWith(nomeQ) && (!nv || h.nivel === Number(nv)));
    const ok = hs.filter((h) => h.nivel <= S.level).sort((x, y) => y.nivel - x.nivel);
    if (!ok.length) return fim('hunt não achada: ' + q, '⚠️ ' + nome + ': não achei a hunt "' + (s.nome || '') + '"' + (hs.length ? ' liberada para o nível ' + S.level + ' (ela pede o nível ' + Math.min(...hs.map((h) => h.nivel)) + ')' : '') + '.');
    const h = ok[0];
    M.huntFixa = h.slug; M.boa = h.slug; M.huntFixaEm = agora(); teste = null; salvar();
    if (S.huntSlug !== h.slug && !trocando) trocarPara(h.slug, 'hunt fixa pedida por você: ' + nomeHunt(h.slug));
    fim('hunt fixa: ' + nomeHunt(h.slug), '🎯 ' + nome + ' vai para ' + nomeHunt(h.slug) + ' e fica lá. Para o script voltar a escolher sozinho: "' + ap + ' hunt auto".');
  }
  function cmdAnunciar(s, fim, nome, linha) {
    const pid = Number(s.pid), preco = Math.round(Number(s.p)), dias = Math.max(1, Math.min(30, Math.round(Number(s.d) || 3)));
    const p = S.pk && S.pk.get(pid);
    if (!p) return fim('não achei #' + pid, '⚠️ ' + nome + ': não achei o pokemon #' + pid + ' nesta conta (se acabou de entrar, mande de novo em 1 minuto).');
    if (!(preco >= 1)) return fim('preço inválido', '⚠️ ' + nome + ': preço inválido para o ' + fichaTxt(p) + '.');
    if (!(p.shiny || (p.potencia || 1) >= 5 || ((p.level || 0) >= 50 && (p.nota || 0) >= 3.5))) return fim('não pode ser anunciado', '⚠️ ' + nome + ': o ' + fichaTxt(p) + ' ainda não pode ser anunciado (o Mercado pede Nv 50+ e nota 3,5+; shiny e P5 são exceção).');
    if ((S.meus || []).some((l) => pidDe(l) === pid)) return fim('já anunciado', 'ℹ️ ' + nome + ': o ' + fichaTxt(p) + ' já está anunciado. Para mudar o preço: "' + String(S.nick || '').toLowerCase() + ' mudar #' + pid + ' PREÇO".');
    if (S.gold - dias * 100000 < RESERVA_OURO) return fim('sem ouro para a estadia', '⚠️ ' + nome + ': sem ouro para a estadia de ' + dias + ' dia(s) (' + fmt(dias * 100000) + ').');
    if (!M.cmdAnuncio || typeof M.cmdAnuncio !== 'object') M.cmdAnuncio = {};
    M.cmdAnuncio[pid] = agora(); salvar();
    respostaJogo(6000);
    if (!mandar({ t: 'market.criar', tipo: 'pokemon', pokemonId: pid, casaId: null, bicicletaId: null, qtd: 1, preco, moeda: 'orb', dias })) return fim('não consegui mandar ao jogo', '⚠️ ' + nome + ': não consegui mandar o pedido ao jogo agora. Mande de novo em 1 minuto.');
    linha[7] = 'anúncio pedido a ' + preco; salvar();
    setTimeout(() => pedirMeus((ls) => {
      const l = ls && ls.find((x) => pidDe(x) === pid);
      if (l) { const pc = pendDe(fichaTxt(p));
        if (pc) { M.pendCompras = M.pendCompras.filter((y) => y !== pc); salvar(); const rc = liquidoPk(l.preco);
          fim('anunciado a ' + l.preco, '🎉 ' + nome + ' comprou ' + fichaTxt(p) + ' (#' + pid + ') por ' + fmt(pc.preco) + ' Gemas' + (pc.part ? ' (sorteio com ' + pc.part + ')' : '') + ' e já anunciou por ' + fmt(l.preco) + ' (recebe ~' + fmt(rc) + ', ' + (rc >= pc.preco ? 'lucro ~' + fmt(Math.round(rc - pc.preco)) : 'prejuízo ~' + fmt(Math.round(pc.preco - rc))) + ' neste preço).'); }
        else fim('anunciado a ' + l.preco, '✅ ' + nome + ' anunciou ' + fichaTxt(p) + ' (#' + pid + ') por ' + fmt(l.preco) + ' Gemas (você recebe ~' + fmt(liquidoPk(l.preco)) + ').' + origemExtra(pid, l.preco) + (s.nota ? ' ' + String(s.nota).slice(0, 700) : ''));
        setTimeout(subirRelatorio, 1500); }
      else fim('o anúncio não apareceu' + textoJogo(), '⚠️ ' + nome + ': pedi o anúncio de ' + fichaTxt(p) + ' por ' + fmt(preco) + ' Gemas, mas ele não apareceu nos anúncios da conta' + textoJogo() + '.');
    }), 3500);
  }
  function cmdMudar(s, fim, nome) {
    const pid = Number(s.pid), preco = Math.round(Number(s.p)), quieto = !!s.auto;
    if (!s.tpl || typeof s.tpl !== 'object' || !s.tpl.t) return fim('sem o formato de mudar preço', quieto ? false : '⚠️ ' + nome + ': a principal ainda não sabe o jeito de mudar preço (mude o preço de um anúncio uma vez no jogo da principal).');
    if (!(preco >= 1)) return fim('preço inválido', quieto ? false : '⚠️ ' + nome + ': preço inválido.');
    pedirMeus((ls) => {
      if (!ls) return fim('não consegui ler os anúncios', quieto ? false : '⚠️ ' + nome + ': não consegui ler os anúncios da conta agora. Mande de novo em 1 minuto.');
      const l = s.aid ? ls.find((x) => x.id === Number(s.aid)) : ls.find((x) => pidDe(x) === pid);
      if (!l) return fim('sem anúncio de ' + (s.aid ? 'anúncio ' + s.aid : '#' + pid), quieto ? false : '⚠️ ' + nome + ': não achei ' + (s.aid ? 'o anúncio ' + s.aid : 'anúncio do #' + pid) + ' nesta conta.');
      if (Number(l.preco) === preco) return fim('já estava a ' + preco, quieto ? false : 'ℹ️ ' + nome + ': ' + descAn(l) + ' já está a ' + fmt(preco) + '.');
      respostaJogo(6000);
      const pedido = Object.assign({}, s.tpl, { id: l.id, preco }); if (l.moeda) pedido.moeda = l.moeda; // a moeda é a do anúncio (pedra em Coins continua em Coins)
      if (!mandar(pedido)) return fim('não consegui mandar ao jogo', quieto ? false : '⚠️ ' + nome + ': não consegui mandar o pedido ao jogo agora.');
      setTimeout(() => pedirMeus((l2s) => {
        const l2 = l2s && l2s.find((x) => x.id === l.id);
        if (l2 && Number(l2.preco) === preco) { fim((quieto ? 'escada da principal: ' : '') + descAn(l) + ' de ' + l.preco + ' para ' + preco + moedaTxt(l.moeda), quieto ? false : '✅ ' + nome + ': ' + descAn(l) + ' agora a ' + fmt(preco) + moedaTxt(l.moeda) + (l.tipo === 'pokemon' && l.moeda !== 'gold' ? ' (você recebe ~' + fmt(liquidoPk(preco)) + ')' : '') + '.' + (l.tipo === 'pokemon' && l.moeda !== 'gold' ? origemExtra(pidDe(l), preco) : '')); setTimeout(subirRelatorio, 1500); }
        else fim('o preço de ' + descAn(l) + ' não mudou' + textoJogo(), quieto ? false : '⚠️ ' + nome + ': não consegui mudar o preço de ' + descAn(l) + textoJogo() + '. O jogo só deixa mudar cada anúncio a cada 30 minutos.');
      }), 3500);
    });
  }
  function cmdCancelar(s, fim, nome) {
    const pid = Number(s.pid);
    pedirMeus((ls) => {
      if (!ls) return fim('não consegui ler os anúncios', '⚠️ ' + nome + ': não consegui ler os anúncios da conta agora. Mande de novo em 1 minuto.');
      const l = ls.find((x) => pidDe(x) === pid);
      if (!l) return fim('sem anúncio de #' + pid, '⚠️ ' + nome + ': não achei anúncio do #' + pid + ' nesta conta.');
      if (!M.cancelados || typeof M.cancelados !== 'object') M.cancelados = {};
      M.cancelados[pid] = agora(); salvar();
      respostaJogo(6000);
      if (!mandar({ t: 'market.cancelar', id: l.id })) return fim('não consegui mandar ao jogo', '⚠️ ' + nome + ': não consegui mandar o pedido ao jogo agora.');
      setTimeout(() => pedirMeus((l2s) => {
        if (l2s && !l2s.some((x) => x.id === l.id)) { fim('cancelado: ' + descAn(l), '✅ ' + nome + ': cancelei o anúncio de ' + descAn(l) + '. Ele voltou para a conta (só pode ser anunciado de novo em 30 minutos).'); setTimeout(subirRelatorio, 1500); }
        else fim('não cancelou' + textoJogo(), '⚠️ ' + nome + ': não consegui cancelar o anúncio de ' + descAn(l) + textoJogo() + '.');
      }), 3500);
    });
  }
  function dadosParaPrincipal() { // 1.20: o que a principal precisa para os comandos e a escada (lido do relatório no GitHub)
    const fic = (p) => ({ id: p.id, nome: p.nome, level: p.level, nota: p.nota, potencia: p.potencia || 1, quality: p.quality, ivTotal: p.ivTotal || Object.values(p.ivs || {}).reduce((a, b) => a + (Number(b) || 0), 0), shiny: !!p.shiny, tm: !!(p.tmAoe || p.tmElemental || p.refinoTotal > 0) });
    const vend = S.pk ? [...S.pk.values()].filter((p) => p && !p.starter && (p.shiny || (p.potencia || 1) >= 5 || ((p.level || 0) >= 50 && (p.nota || 0) >= 3.5))).slice(0, 60).map(fic) : [];
    const an = (S.meus || []).slice(0, 30).map((l) => Object.assign({ id: l.id, pid: pidDe(l) || null, item: l.tipo === 'pokemon' ? null : (S.nomesItem[l.itemId] || String(l.itemId || '')), qtd: l.qtd || 1, preco: Number(l.preco) || 0, moeda: l.moeda || null, criado: l.criadoEm || null, expira: l.expiraEm || null },
      l.tipo === 'pokemon' && l.ficha ? { f: fic(Object.assign({}, l.ficha, { id: pidDe(l) })) } : {}));
    return { v: 1, nick: S.nick, em: agora(), versao: VERSAO, orbs: S.orbs, gold: Math.round(S.gold || 0), hunt: S.huntSlug, nivel: S.level || 0, tipoAtivo: S.tipo || null, xpH: (() => { try { return Math.round(taxaXp(agora() - 20 * 60e3, agora()) || 0); } catch (err) { return 0; } })(), prey: (() => { try { const c = preyC0(); return c && Array.isArray(c.lista) ? { dia: diaPrey(), lista: c.lista, pk: c.pk || null, bonus: c.bonus, est: c.est } : null; } catch (err) { return null; } })(), huntFixa: M.huntFixa || null, sorteios: !M.sorteioDesligado, meusEm: S.meusEm || 0, pk: vend, an };
  }

  window.addEventListener('message', (e) => {
    try {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.pokeidleExtraSinal) receberSinal(e.data.pokeidleExtraSinal);
      else if (e.data.pokeidleExtraPonte) { ponte = e.data.pokeidleExtraPonte; ponte.em = agora(); }
      else if (e.data.pokeidleExtraPedido === 'relatorio') baixarRelatorio();
      else if (e.data.pokeidleExtraPedido === 'relatorioTexto' && S.pronto && !ehPrincipal()) { const nome = nomeRelatorio(); window.postMessage({ pokeidleExtraRelatorio: { conta: S.nick, nome, texto: relatorio() } }, location.origin); registrar('relatório mandado ao Telegram: ' + nome); } // 1.14: "exportar tudo" da principal
    } catch (err) {}
  });

  // ===== 1.15: vigia da própria conta =====
  // (a) chegam mensagens do jogo mas a conta não fica pronta: avisa e recarrega a aba uma vez (no máximo a cada 30 minutos); (b) 15 minutos sem ganhar XP: avisa (no máximo uma vez por hora).
  function vigiar() {
    const t = agora();
    if (ehPrincipal() || M.pausado) return;
    if (!S.pronto) {
      if (!primeiraMsg || t - primeiraMsg < SEM_LER_MS) return;
      const falta = !S.nick ? 'o nome da conta' : !S.hunts ? 'a lista de hunts' : 'a mochila';
      if (t - (M.recarregouEm || 0) > RECARGA_ESPERA_MS) {
        M.recarregouEm = t; registrar('8 minutos sem conseguir ler a conta (falta ' + falta + '): recarrego a aba');
        try { window.postMessage({ pokeidleExtraAviso: { conta: S.nick || '?', texto: '⚠️ ' + (S.nick || 'Uma conta extra') + ': o script ficou 8 min sem conseguir ler a conta (falta ' + falta + '). Recarreguei a aba sozinho.', quando: t } }, '*'); } catch (e) {}
        setTimeout(() => { try { location.reload(); } catch (e) {} }, 4000);
      } else if (!avisouSemLer) { avisouSemLer = true; avisar('🚨 ' + (S.nick || 'Uma conta extra') + ': recarreguei a aba e o script continua sem ler a conta (falta ' + falta + '). Precisa olhar essa aba.'); }
      return;
    }
    const ref = Math.max(ultimoGanhoXp, prontoEm);
    if (ref && t - ref >= SEM_XP_MS && t - avisouSemXp >= 3600e3) { avisouSemXp = t; avisar('⚠️ ' + S.nick + ': ' + Math.round((t - ref) / 60e3) + ' min sem ganhar XP (' + (S.noCentro ? 'parada no Centro' : nomeHunt(S.huntSlug)) + '). Confira essa aba.'); }
  }

  // ===== relógio =====
  // 1.19: Passe grátis resgatado sozinho às 00:05 (horário de Brasília), uma tentativa a cada 10 min até o jogo marcar o dia
  function cuidarDoPasse() {
    const p = S.passe, t = agora(); if (!p || !(Number(p.ultimo) > 0)) return;
    const hoje = Math.floor((t - 3 * 3600e3) / 864e5), desde = t - (hoje * 864e5 + 3 * 3600e3);
    if (Number(p.ultimo) >= hoje || desde < 5 * 60e3 || t - (M.passeTentou || 0) < 10 * 60e3) return;
    M.passeTentou = t; salvar();
    if (mandar({ t: 'passe.resgatar' })) registrar('Passe: resgate automático pedido (último resgate no dia ' + p.ultimo + ', degrau ' + p.degrau + ')');
  }
  function tique() {
    try {
      vigiar(); // 1.15
      if (!S.pronto || M.pausado) { pintar(); return; }
      if (String(S.nick).toLowerCase() === CONTA_PRINCIPAL) { pintar(); return; }
      try { cuidarDoPasse(); } catch (e) {} // 1.19
      try { preyCuidar(); } catch (e) {} // 1.21
      try { if (agora() - ultimoComercio > 3 * 60e3 && agora() - prontoEm > 40e3) { ultimoComercio = agora(); mandar({ t: 'comercio.info' }); } } catch (e) {} // 1.22
      try { if (agora() - ultimoDepot > 60 * 60e3 && agora() - prontoEm > 12 * 60e3) { ultimoDepot = agora(); venderDepotExtra(); } } catch (e) {} // 1.22
      passoTroca(); passoSorteio(); amostrar();
      try { if (agora() - Math.max(S.meusEm || 0, ultimoPedidoMeus) > 10 * 60e3) { ultimoPedidoMeus = agora(); mandar({ t: 'market.meus' }); } conferirSumidos(); } catch (e) { /* nada */ } // 1.20
      if (!religar()) { repor(); escada(); }
      pintar();
    } catch (e) {}
  }
  setInterval(tique, 20e3);


  // ===== 1.23: custo ou captura nas mensagens de anúncio (pedido dela em 20/11) =====
  // Compra: as linhas GANHOU dos sinais ("Tyranitar Nv 974 (...) por 12 Gemas") são ligadas ao pokemon da conta de mesmo nome e nível (o mais novo
  // ainda sem custo). Captura: o jogo marca caughtBy com o nick da conta.
  const RX_COMPRA = /^(.+?) Nv (\d+)\b.*? por ([\d.]+) (Gemas|Coins)\s*$/;
  const minhaCapturaExtra = (p) => !!p && (p.caughtBy === true || (typeof p.caughtBy === 'string' && p.caughtBy.toLowerCase() === String(S.nick || '').toLowerCase()));
  function ligarCustos() {
    if (!S.pk || ehPrincipal()) return;
    const cs = M.custos || (M.custos = {}), usados = new Set(Object.values(cs).map((c) => c.t + '|' + c.nome));
    let mudou = false;
    for (const x of M.sinais || []) {
      if (!/GANHOU/.test(String(x[8] || ''))) continue;
      const m = String(x[9] || '').match(RX_COMPRA); if (!m) continue;
      const nome = m[1].trim(), level = Number(m[2]), chave = x[0] + '|' + nome; if (usados.has(chave)) continue;
      const cand = [...S.pk.values()].filter((p) => p.nome === nome && p.level === level && !cs[p.id] && !minhaCapturaExtra(p)).sort((a, z) => z.id - a.id)[0];
      if (!cand) continue;
      cs[cand.id] = { v: Number(m[3].replace(/\./g, '')), moeda: m[4] === 'Gemas' ? 'orb' : 'gold', t: x[0], nome }; usados.add(chave); mudou = true;
    }
    if (mudou) { const ks = Object.keys(cs); while (ks.length > 300) delete cs[ks.shift()]; salvar(); }
  }
  function origemExtra(pid, preco) {
    try {
      const c = (M.custos || {})[pid], p = S.pk && S.pk.get(Number(pid));
      if (c) return ' Custou ' + fmt(c.v) + (c.moeda === 'orb' ? ' Gemas' : ' Coins') + (preco && c.moeda === 'orb' ? ' (lucro ~' + fmt(Math.round(liquidoPk(preco) - c.v)) + ' neste preço)' : '') + '.';
      if (minhaCapturaExtra(p)) return ' Foi captura desta conta (sem custo).';
    } catch (e) { /* nada */ }
    return '';
  }

  // ===== 1.22: Depot ao NPC e mensagens de negociação =====
  // Depot: o pedido do jogo vende o Depot até um código ({"t":"shop.sellAllPokemons","ateId":N}, gravado na principal em 13/11). A Coleção e o time
  // nunca são vendidos (regra do jogo). Só vende o lixo e para antes do primeiro que não é lixo. Precisa de uma leitura cheia da conta de até 10 min.
  let ultimoComercio = 0, ultimoDepot = 0;
  const lixoExtra = (p) => !!p && !p.shiny && !p.starter && !p.lendario && (p.potencia || 1) < 5 && !(p.tmAoe || p.tmElemental || p.refinoTotal > 0) && p.id !== S.activeId && typeof p.nota === 'number' && p.nota < 3.5;
  function venderDepotExtra() {
    if (ehPrincipal() || !S.pk || agora() - (S.pkEm || 0) > 10 * 60e3) return;
    const trav = new Set(S.travados || []), anunciados = new Set((S.meus || []).map(pidDe).filter(Boolean)), ja = new Set(M.depotVendidos || []);
    const depot = [...S.pk.values()].filter((p) => (p.slot === null || p.slot === undefined) && !trav.has(p.id) && !anunciados.has(p.id) && !ja.has(p.id)).sort((a, z) => a.id - z.id);
    let ateId = 0, n = 0, travou = null;
    for (const p of depot) { if (!lixoExtra(p)) { travou = p; break; } ateId = p.id; n++; }
    if (!n) return;
    if (!mandar({ t: 'shop.sellAllPokemons', ateId })) return;
    M.depotVendidos = [...ja].concat(depot.filter((p) => p.id <= ateId).map((p) => p.id)).slice(-2000); salvar();
    registrar('Depot: pedi a venda ao NPC de ' + n + ' pokemon (até #' + ateId + ')' + (travou ? '; parei antes de ' + fichaTxt(travou) + ' #' + travou.id + ', que não é lixo' : ''));
  }
  // Mensagens: {"t":"comercio.info"} devolve a lista de conversas ({"t":"comercio","lista":[{id, anuncio, outro:{nick}, ultima:{texto, ts, minha}}]});
  // mensagem nova chega como {"t":"comercio","msg":{conversaId, de, texto, ts, anuncioId}} (formato lido na principal desde a 2.7.7).
  function nomeDoAnuncioCom(a) { const f = a && a.ficha; return f ? fichaTxt(f) + (f.shiny ? ' shiny' : '') : String((a && (a.descricao || a.nome)) || 'anúncio'); }
  function avisarComercio(conv, de, txt, ts, a) {
    const vis = M.comercioVisto || (M.comercioVisto = {});
    if (!conv || !txt || (vis[conv] || 0) >= ts) return;
    vis[conv] = ts; const ks = Object.keys(vis); if (ks.length > 200) delete vis[ks[0]]; salvar();
    registrar('mensagem de ' + (de || '?') + (a ? ' sobre ' + nomeDoAnuncioCom(a) : '') + ': ' + String(txt).slice(0, 200));
    avisar('💬 ' + S.nick + ': ' + (de || 'um comprador') + (a ? ', sobre o ' + nomeDoAnuncioCom(a) + ' a ' + fmt(a.preco) + (a.moeda === 'orb' ? ' Gemas' : ' Coins') : '') + ': "' + String(txt).slice(0, 300) + '".' + (a && a.moeda === 'orb' ? origemExtra(pidDe(a), a.preco) : '') + ' Para responder, entre na ' + S.nick + '.');
  }
  function comercioEvento(o) {
    if (ehPrincipal()) return;
    const vis = M.comercioVisto || (M.comercioVisto = {}), eu = String(S.nick || '').toLowerCase();
    const anuncioDe = (id) => (S.meus || []).find((l) => l.id === id) || null;
    if (Array.isArray(o.lista)) {
      const primeira = !M.comercioIniciado;
      for (const cv of o.lista) {
        const u = cv.ultima; if (!u) continue;
        if (u.minha || (primeira && (u.ts || 0) < agora() - 12 * 3600e3)) { vis[cv.id] = Math.max(vis[cv.id] || 0, u.ts || 0); continue; }
        avisarComercio(cv.id, cv.outro && cv.outro.nick, u.texto, u.ts || 0, cv.anuncio || anuncioDe(cv.anuncioId));
      }
      M.comercioIniciado = true; salvar();
    }
    if (o.msg) {
      const m = o.msg;
      if (String(m.de || '').toLowerCase() === eu) { vis[m.conversaId] = Math.max(vis[m.conversaId] || 0, m.ts || 0); salvar(); }
      else avisarComercio(m.conversaId, m.de, m.texto, m.ts || agora(), anuncioDe(m.anuncioId));
    }
    if (o.conversa && Array.isArray(o.conversa.mensagens)) { const ult = Math.max(0, ...o.conversa.mensagens.map((x) => x.ts || 0)); vis[o.conversa.id] = Math.max(vis[o.conversa.id] || 0, ult); salvar(); } // ela abriu a conversa no jogo
  }

  // ===== 1.21: Prey (atualização de 20/11) =====
  // Pedidos gravados na principal no clique dela: {"t":"prey.roletar","cartela":0,"categoria":"tudo","dia":"2026-11-20","n":0} (a roleta grátis do dia,
  // resposta preyRoletou com custo 0) e {"t":"prey.escolher","cartela":0,"dia":"2026-11-20","pk":172}. O estado vem em automation.prey.
  // Só a roleta grátis, um pedido por dia, e só depois de ver o estado (conta que nunca roletou não tem a chave). Se vier com custo, desliga e avisa.
  const diaPrey = (t) => new Date((t || agora()) + (S.difServidor || 0) + 3 * 3600e3).toISOString().slice(0, 10); // vira às 18h de Brasília
  let preyVisto = null;
  const preyC0 = () => (M.prey && M.prey.dia === diaPrey() && Array.isArray(M.prey.cartelas) ? M.prey.cartelas[0] : null);
  function preyBonusTxt(c) { const b = String((c && c.bonus) || ''), e = Number(c && c.est) || 0; return /spawn/i.test(b) ? 'Spawn +' + e : /captur/i.test(b) ? 'Capture +' + 2 * e + '%' : /dano|dmg|damage|ataq/i.test(b) ? 'Dano +' + 10 * e + '%' : /defens|defesa/i.test(b) ? 'Defesa -' + 10 * e + '%' : b + ' ' + e; }
  function preyDoEstado(e, cheio) {
    const a = e && e.automation, p = (a && a.prey) || (e && e.prey) || null;
    if (p && p.dia) {
      const c0 = (x) => (x && Array.isArray(x.cartelas) ? x.cartelas[0] : null), cur = M.prey;
      if (!cur || !cur.dia || p.dia > cur.dia || (p.dia === cur.dia && ((c0(p) && c0(p).pk && !(c0(cur) && c0(cur).pk)) || (c0(p) && c0(p).lista && !(c0(cur) && c0(cur).lista))))) { M.prey = { dia: p.dia, cartelas: Array.isArray(p.cartelas) ? p.cartelas : [null, null] }; salvar(); }
    } else if (!M.prey && cheio && a && typeof a === 'object' && Object.keys(a).length) { M.prey = { dia: '', cartelas: [null, null] }; salvar(); } // nunca roletou
  }
  function preyEvento(ev) {
    if (!M.prey || M.prey.dia !== ev.dia) M.prey = { dia: ev.dia, cartelas: [null, null] };
    M.prey.cartelas[ev.cartela || 0] = ev.c; salvar();
    if (ev.k === 'preyRoletou') {
      registrar('Prey: roleta ' + (ev.custo ? 'com custo ' + fmt(ev.custo) : 'grátis') + ' (' + ev.dia + '): ' + preyBonusTxt(ev.c) + '; lista ' + (ev.c.lista || []).join(', '));
      if (ev.custo > 0 && M.preyRolouDia === ev.dia && agora() - (M.preyRolouEm || 0) < 60e3) { M.preyDesligado = true; salvar(); avisar('⚠️ ' + S.nick + ': a roleta do Prey que o bot pediu veio com custo (' + fmt(ev.custo) + '). Desliguei a roleta automática nesta conta.'); }
      if (M.preyRolouDia === ev.dia) setTimeout(preyEscolher, 3000); else preyVisto = { dia: ev.dia, t: agora() };
    } else registrar('Prey: escolhido ' + ev.c.pk + ' (' + preyBonusTxt(ev.c) + ')');
  }
  function preyEscolher() {
    const dia = diaPrey(), c = preyC0();
    if (M.preyDesligado) return; // 1.27
    if (!c || !Array.isArray(c.lista) || !c.lista.length || c.pk || M.preyEscolheuDia === dia) return;
    const lista = c.lista.map(Number), h = huntDe(S.huntSlug) || huntDe(M.ultimaHunt), minhas = ((h && h.pk) || []).map(Number);
    let pk = minhas.find((id) => lista.includes(id)); const minha = !!pk; let daPrincipal = false;
    if (!pk && M.preyPedido && M.preyPedido.dia === dia && lista.includes(Number(M.preyPedido.pk))) { pk = Number(M.preyPedido.pk); daPrincipal = true; } // 1.31
    if (!pk) { if (!M.preyEsperaDesde || M.preyEsperaDia !== dia) { M.preyEsperaDesde = agora(); M.preyEsperaDia = dia; salvar(); setTimeout(subirRelatorio, 3000); } if (agora() - M.preyEsperaDesde < 30 * 60e3) return; pk = lista[0]; }
    if (!mandar({ t: 'prey.escolher', cartela: 0, dia, pk })) return;
    M.preyEscolheuDia = dia; salvar();
    registrar('Prey: escolhi ' + pk + (minha ? ' (a espécie da minha hunt, ' + nomeHunt(h.slug) + ')' : daPrincipal ? ' (escolha da principal)' : ' (a minha hunt não veio na lista e a principal não mandou em 30 min; peguei a primeira)') + '; ' + preyBonusTxt(c));
    setTimeout(subirRelatorio, 5000);
  }
  function preyCuidar() {
    if (ehPrincipal() || M.preyDesligado || !S.pronto) return;
    const t = agora(), dia = diaPrey(t);
    if (dia !== diaPrey(t - 3 * 60e3) || t - prontoEm < 3 * 60e3) return;
    const c = preyC0();
    if (c && Array.isArray(c.lista) && c.lista.length) {
      if (c.pk) return;
      if (M.preyRolouDia === dia) return preyEscolher();
      if (!preyVisto || preyVisto.dia !== dia) preyVisto = { dia, t };
      if (t - preyVisto.t > 15 * 60e3) preyEscolher();
      return;
    }
    if (!M.prey || M.preyRolouDia === dia || M.prey.dia > dia) return;
    if (!mandar({ t: 'prey.roletar', cartela: 0, categoria: 'tudo', dia, n: 0 })) return;
    M.preyRolouDia = dia; M.preyRolouEm = t; salvar();
    registrar('Prey: pedi a roleta grátis de ' + dia);
  }

  // ===== etiqueta na tela (clique abre o registro) =====
  let caixa = null, aberto = false;
  function situacao() {
    if (!S.pronto) return 'esperando o jogo';
    if (String(S.nick).toLowerCase() === CONTA_PRINCIPAL) return 'desligado: esta é a conta principal';
    if (M.pausado) return 'pausado';
    const t = agora(), xp = taxaXp(t - 6 * 60e3, t), poc = somaItens(S.potionIds), rev = somaItens(S.reviveIds);
    const falta = [!M.loja.pocao ? 'compre 1 poção' : null, !M.loja.revive ? 'compre 1 revive' : null].filter(Boolean);
    return (S.noCentro ? 'no Centro' : nomeHunt(S.huntSlug)) + (teste ? ' (em teste)' : '') + ' · nível ' + S.level + (S.orbs ? ' · ' + fmt(S.orbs) + ' Gemas' : '') + (xp !== null ? ' · ' + fmt(xp) + ' XP/h' : '') +
      ' · poções ' + fmt(poc || 0) + ' · revives ' + fmt(rev || 0) + (ultimoArremesso && t - ultimoArremesso < ARREMESSO_VALE_MS ? ' · bolas: Ultra ' + fmt(S.balls[BOLA_ULTRA] || 0) + ', Poke ' + fmt(S.balls[BOLA_POKE] || 0) : '') + (falta.length ? ' · FALTA: ' + falta.join(' e ') + ' à mão, para eu aprender' : '') +
      (ponte && t - (ponte.em || t) > 90e3 ? ' · PONTE PARADA há ' + Math.round((t - ponte.em) / 60e3) + ' min' : !ponte && prontoEm && t - prontoEm > 2 * 60e3 ? ' · SEM PONTE' : ''); // 1.15
  }
  const dh = (t) => { const d = new Date(t), z = (n) => String(n).padStart(2, '0'); return z(d.getDate()) + '/' + z(d.getMonth() + 1) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds()); };
  function ativoTxt() { // 1.14: para o Claude escolher a hunt pela calculadora
    const a = S.ativo; if (!a) return 'ainda não li';
    const st = a.stats || {}, iv = a.ivs || {};
    return (a.nome || '?') + ' Nv ' + (a.level || '?') + ' (' + (a.tipos || []).join('/') + ', espécie ' + (a.speciesId || '?') + ', P' + (a.potencia || 1) + ', Q ' + (a.quality || '?') + (a.shiny ? ', shiny' : '') + ')' +
      ' | stats hp ' + (st.hp || '?') + ', atk ' + (st.atk || '?') + ', def ' + (st.def || '?') + ', spAtk ' + (st.spAtk || '?') + ', spDef ' + (st.spDef || '?') + ', speed ' + (st.speed || '?') +
      ' | IV hp ' + (iv.hp || '?') + ', atk ' + (iv.atk || '?') + ', def ' + (iv.def || '?') + ', spAtk ' + (iv.spAtk || '?') + ', spDef ' + (iv.spDef || '?') + ', speed ' + (iv.speed || '?') + (a.tmElemental ? ' | TM ' + a.tmElemental : '') + (a.tmAoe ? ' | TM AoE' : '');
  }
  function nomeRelatorio() { const d = new Date(), z = (n) => String(n).padStart(2, '0'); return 'pokeidle-extra_' + String(S.nick || 'conta').replace(/[^A-Za-z0-9_-]/g, '') + '_' + d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + '_' + z(d.getHours()) + 'h' + z(d.getMinutes()) + '.txt'; }
  function relatorio() {
    const t = agora(), seg = (ms) => (ms === null || ms === undefined ? '?' : (Math.round(ms / 100) / 10).toLocaleString('pt-BR') + ' s');
    const itens = Object.keys(S.nomesItem).filter((id) => S.items && S.items[id] > 0).map((id) => S.nomesItem[id] + ' ×' + S.items[id]);
    const atrasos = M.sinais.filter((x) => typeof x[5] === 'number' && x[0] > t - 24 * 3600e3).map((x) => x[5]).sort((a, b) => a - b);
    const P = [
      'PokeIdle conta extra ' + VERSAO + ' | ' + (S.nick || '?') + ' | ' + new Date().toLocaleString('pt-BR'),
      situacao(),
      'tipo do inicial: ' + (S.tipo || '?') + ' | tipo do dia: ' + (M.diaTipo || '?') + ' | ouro ' + fmt(S.gold) + ' | Gemas ' + (S.orbs === null ? '?' : fmt(S.orbs)) + ' | gasto de poção: ' + (gastoPocaoH === null ? 'ainda não medido' : fmt(gastoPocaoH) + ' por hora') + ' | loja: ' + JSON.stringify(M.loja) + ' | reprovadas: ' + JSON.stringify(M.bloqueio),
      'pokemon ativo: ' + ativoTxt(), // 1.14
      'Prey: ' + (M.preyDesligado ? 'roleta automática DESLIGADA' : (() => { const c = preyC0(); return c && c.lista ? preyBonusTxt(c) + (c.pk ? ', escolhido ' + c.pk : ', sem escolha') : M.prey ? 'ainda não roletado hoje' : 'estado ainda não visto'; })()), // 1.21
      'passe: ' + (S.passe ? 'degrau ' + S.passe.degrau + ', último resgate ' + (Number(S.passe.ultimo) >= Math.floor((t - 3 * 3600e3) / 864e5) ? 'hoje' : 'no dia ' + S.passe.ultimo) + ' | resgate automático às 00:05' : 'ainda não lido'), // 1.19
      '',
      '## Ponte com a principal',
      'sorteios nesta conta: ' + (M.sorteioDesligado ? 'DESLIGADOS' : 'ligados') + ' | relógio do sorteio: ' + relogioNome + ' | som mudo: ' + somEstado() + ' | script irmão: ' + (ponte ? 'versão ' + (ponte.versao || '?') + ', ' + (ponte.leituras || 0) + ' leituras do quadro, ' + (ponte.falhas || 0) + ' falhas, última resposta ' + (ponte.status || '?') + (ponte.erro ? ' (' + ponte.erro + ')' : '') + ', último sinal nº ' + (ponte.ultimoN || 0) + ', visto há ' + seg(t - (ponte.em || t)) : 'SEM NOTÍCIA (o script "PokeIdle: ponte das extras" está instalado e ligado neste perfil?)'),
      'atraso dos sinais nas últimas 24 h (da publicação até chegar aqui): ' + (atrasos.length ? atrasos.length + ' sinais, mediana ' + seg(atrasos[Math.floor(atrasos.length / 2)]) + ', pior ' + seg(atrasos[atrasos.length - 1]) : 'nenhum sinal'),
      '',
      '## Sinais recebidos (' + M.sinais.length + '; quando | nº | tipo | anúncio | classe | atraso | folga até liberar | decisão | resultado | o quê)',
      ...M.sinais.map((x) => [dh(x[0]), x[1], x[2], x[3] || '-', x[4] || '-', seg(x[5]), x[6] === null ? '-' : seg(x[6]), x[7], x[8] || '-', x[9] || '-'].join(' | ')),
      '',
      '## O que esta conta pode pôr no Mercado',
      'itens: ' + (itens.length ? itens.join(', ') : 'nenhum'),
      'pokemon (nível 50+ e nota 3,5+, ou shiny, ou P5): ' + (S.vendaveis === null ? 'ainda não li a conta inteira' : S.vendaveis.length ? S.vendaveis.join('; ') : 'nenhum'),
      '',
      '## Anúncios abertos (1.20; lidos ' + (S.meusEm ? dh(S.meusEm) : 'ainda não') + ')',
      ...(S.meus && S.meus.length ? S.meus.map((l) => descAn(l) + ' | ' + fmt(Number(l.preco) || 0) + moedaTxt(l.moeda) + ' | anúncio ' + l.id + (l.criadoEm ? ' | desde ' + dh(l.criadoEm) : '')) : ['nenhum']),
      '',
      '## Dados para a principal (1.20)',
      'DADOS ' + JSON.stringify(dadosParaPrincipal()),
      '',
      '## Amostras a cada 10 minutos (' + M.amostras.length + '; quando | nível | XP por hora | ouro | Gemas | Ultra | Poke | hunt)',
      ...M.amostras.map((x) => [dh(x[0]), x[1], x[2] === null ? '?' : fmt(x[2]), fmt(x[3]), x[4] === null || x[4] === undefined ? '?' : x[4], x[5], x[6], x[7] ? nomeHunt(x[7]) : '?'].join(' | ')),
      '',
      '## Capturas por hunt (1.24; ' + capturas.length + '; minuto, hunt, espécie, nível, qualidade×1000, potência, IVs hp/atk/def/spAtk/spDef/speed, shiny, nível do selvagem)',
      ...capturas.map((x) => x.join(',')),
      '',
      '## Registro (' + M.log.length + ')',
      ...M.log.map((l) => dh(l[0]) + ' ' + l[1]),
    ];
    return P.join('\n');
  }
  function baixarRelatorio() {
    try {
      const d = new Date(), z = (n) => String(n).padStart(2, '0');
      const nome = 'pokeidle-extra_' + String(S.nick || 'conta').replace(/[^A-Za-z0-9_-]/g, '') + '_' + d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + '_' + z(d.getHours()) + 'h' + z(d.getMinutes()) + '.txt';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([relatorio()], { type: 'text/plain;charset=utf-8' })); a.download = nome; a.style.display = 'none';
      document.body.appendChild(a); a.click();
      setTimeout(() => { try { URL.revokeObjectURL(a.href); a.remove(); } catch (e) {} }, 10000);
      registrar('relatório baixado: ' + nome);
    } catch (e) { registrar('não consegui baixar o relatório: ' + (e && e.message)); }
  }
  function pintar() {
    try {
      if (!document.body) return;
      if (!caixa) {
        caixa = document.createElement('div');
        caixa.style.cssText = 'position:fixed;left:6px;top:6px;z-index:2147483647;max-width:520px;font:12px/1.35 system-ui,sans-serif;color:#fff;background:rgba(20,20,30,.88);border:1px solid #7c5cff;border-radius:6px;padding:4px 8px;cursor:pointer;white-space:pre-wrap';
        caixa.addEventListener('click', (e) => {
          const a = e.target && e.target.dataset && e.target.dataset.acao;
          if (a === 'pausar') { M.pausado = !M.pausado; registrar(M.pausado ? 'pausado por você' : 'retomado por você'); }
          else if (a === 'baixar') baixarRelatorio();
          else if (a === 'sorteios') { M.sorteioDesligado = !M.sorteioDesligado; registrar(M.sorteioDesligado ? 'sorteios desligados por você' : 'sorteios ligados por você'); caixa.dataset.cab = ''; }
          else if (!a) aberto = !aberto;
          pintar();
        });
        document.body.appendChild(caixa);
      }
      const cab = '⚙ extra ' + VERSAO + ' · ' + situacao();
      if (!aberto) { caixa.textContent = cab; return; }
      if (caixa.dataset.modo !== 'aberto' || caixa.dataset.cab !== cab) {
        caixa.textContent = '';
        const l1 = document.createElement('div'); l1.textContent = cab; caixa.appendChild(l1);
        const l2 = document.createElement('div'); l2.textContent = M.log.slice(-12).map((l) => hora(l[0]) + ' ' + l[1]).join('\n') || 'nada ainda'; l2.style.cssText = 'margin:4px 0;opacity:.9'; caixa.appendChild(l2);
        for (const [acao, rotulo] of [['pausar', M.pausado ? '▶ retomar' : '⏸ pausar'], ['baixar', '⬇ baixar relatório'], ['sorteios', M.sorteioDesligado ? '🎟 ligar sorteios' : '🎟 desligar sorteios']]) {
          const b = document.createElement('span'); b.dataset.acao = acao; b.textContent = rotulo; b.style.cssText = 'display:inline-block;margin:2px 8px 2px 0;padding:2px 8px;border:1px solid #7c5cff;border-radius:4px'; caixa.appendChild(b);
        }
      }
      caixa.dataset.modo = aberto ? 'aberto' : ''; caixa.dataset.cab = cab;
    } catch (e) {}
  }

  // ===== ligação com a conexão do jogo (mesma técnica da ponte) =====
  const escutar = (ws) => {
    if (ws.__extra) return;
    ws.__extra = true;
    if (/pokeidle\.io/.test(ws.url || '')) socketJogo = ws;
    addOrig.call(ws, 'message', (e) => receber(e.data));
  };
  P.addEventListener = function (tipo, fn, op) { escutar(this); return addOrig.call(this, tipo, fn, op); };
  const d = Object.getOwnPropertyDescriptor(P, 'onmessage');
  if (d && d.set) Object.defineProperty(P, 'onmessage', { configurable: true, enumerable: true, get() { return d.get.call(this); }, set(fn) { escutar(this); d.set.call(this, fn); } });
  P.send = function (x) {
    escutar(this);
    if (typeof x === 'string' && x.startsWith('{"t":"market.criar"')) pedirMeusEm = agora() + 3000; // 1.7: você anunciou algo: daqui a 3 s leio a lista para pegar o número
    if (typeof x === 'string' && x.startsWith('{"t":"shop.buy"')) { try { const o = JSON.parse(x); pedidoLoja = { quando: agora(), kind: o.kind, id: o.id, meu: false }; } catch (e) {} }
    return sendOrig.call(this, x);
  };

  if (typeof window.__pokeidleExtraTeste === 'function') window.__pokeidleExtraTeste({ S, M, receber, tique, vigiar, taxaXp, amostrasXp, mortes, abates, estadoTeste: () => teste, receberSinal, passoSorteio, pendentes, relatorio, escada, trocaTeste: () => troca, somEstado, dadosParaPrincipal, conferirSumidos });
})();
