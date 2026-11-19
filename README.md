# testes

Scripts de uso pessoal para o Tampermonkey. Cada arquivo se atualiza sozinho a partir deste ramo (`scripts`).

| Script | Onde instalar | Arquivo |
|---|---|---|
| Monitor | perfil da conta principal | `pokeidle-monitor.user.js` |
| Extra | perfil de cada conta secundária | `pokeidle-extra.user.js` |
| Ponte das extras | perfil de cada conta secundária | `pokeidle-extra-ponte.user.js` |
| Lives (Twitch e Kick) | perfil em que as lives rodam | `pokeidle-lives.user.js` |

Arquivos do modelo de preço (monitor 2.11.37+):

| Arquivo | Para quê |
|---|---|
| `modelo-preco.json` | modelo de preço que o monitor lê a cada 3 h (refeito toda noite) |
| `treino-modelo-preco.py` | o treino: limpa a base, treina e confere a estabilidade contra o modelo do dia anterior |
| `especies-pokeapi.csv` | linha de evolução, geração e lendário de cada espécie (PokeAPI) |

Os arquivos não trazem chave nem token: cada navegador usa o que já está guardado no Tampermonkey.
A versão de cada script está na linha `@version` do próprio arquivo.
