# Micro Frontends — Sistema de Pedidos

Exercício de arquitetura de micro frontends com **Webpack Module Federation** e **Next.js (Pages Router)**.

A aplicação de pedidos foi dividida em três projetos independentes:

| Projeto           | Papel                                                         | Porta |
|-------------------|---------------------------------------------------------------|-------|
| `container-app`   | Aplicação principal. Importa e integra os dois micros.        | 3000  |
| `micro-cardapio`  | Lista estática de pratos com botão "Adicionar ao pedido".     | 3001  |
| `micro-pedido`    | Exibe os itens selecionados e o total do pedido.              | 3002  |

## Versões

- Next.js **14.2.15** com **Pages Router** (compatível com 12, 13, 14 e 15 segundo a documentação do Module Federation; App Router não é usado).
- React **18.3.1**
- Module Federation via `@module-federation/nextjs-mf` 7.0.8
- webpack 5.90.0 (mesma versão embutida no Next 14.2.15, necessária para o plugin)
- `.npmrc` com `legacy-peer-deps=true` em cada projeto, por causa de peer dependencies do plugin

## Estrutura

```
micro-frontends-pedidos/
├── container-app/        # Host: consome os micros via React.lazy + Suspense
├── micro-cardapio/       # Remote: expõe ./Cardapio
├── micro-pedido/         # Remote: expõe ./Pedido
└── README.md
```

## Como rodar

Requisito: Node.js 18.17 ou superior.

Instale as dependências em cada projeto:

```bash
cd micro-cardapio && npm install && npm run build && cd ..
cd micro-pedido && npm install && npm run build && cd ..
cd container-app && npm install && npm run build && cd ..
```

Abra três terminais e suba os micros antes do container:

```bash
# Terminal 1
cd micro-cardapio && npm start       # http://localhost:3001

# Terminal 2
cd micro-pedido && npm start         # http://localhost:3002

# Terminal 3
cd container-app && npm start        # http://localhost:3000
```

Os micros precisam estar em modo produção (`npm run build` + `npm start`), porque o `remoteEntry.js` só é gravado em disco no build. No modo `npm run dev` o container não consegue carregá-los.

Acesse **http://localhost:3000**.

### Testar cada micro isoladamente

Com os micros rodando, cada um pode ser visto sozinho:

- http://localhost:3001 mostra apenas o Micro Cardápio.
- http://localhost:3002 mostra apenas o Micro Pedido.

### Variáveis de ambiente (opcional)

Para apontar o container para outras URLs, defina `CARDAPIO_URL` e `PEDIDO_URL` antes de iniciar o container.

## Como funciona o Module Federation

Cada micro usa o `NextFederationPlugin` em seu `next.config.js` e expõe um componente:

- `micro-cardapio` expõe `./Cardapio`, disponível como `micro_cardapio/Cardapio`.
- `micro-pedido` expõe `./Pedido`, disponível como `micro_pedido/Pedido`.

O `container-app` declara esses micros como *remotes*, apontando para o `remoteEntry.js` de cada um. No container, os componentes são carregados com `React.lazy` e envolvidos por `Suspense`, com um `ErrorBoundary` para que a falha de um micro não derrube a página inteira.

Cada micro carrega a sua própria cópia do React (`shared: {}`). Por isso o Micro Pedido é um componente de classe: componentes de classe funcionam corretamente com a React do container, sem depender de hooks compartilhados.

O container carrega o painel federado somente no cliente (`next/dynamic` com `ssr: false`), pois os remotes são resolvidos pelo navegador em tempo de execução. No build do servidor, os imports dos remotes são apontados para um stub (`container-app/stubs/RemoteStub.js`), porque o Next também compila o código do servidor.

## Comunicação entre os micros

A comunicação é feita por **eventos globais do navegador**, sem acoplamento direto entre os projetos:

1. O Micro Cardápio, ao clicar em "Adicionar ao pedido", dispara:
   ```js
   window.dispatchEvent(new CustomEvent('pedido:adicionar', { detail: prato }));
   ```
2. O Micro Pedido escuta esse evento em um `useEffect`, soma a quantidade do prato se ele já existir no pedido e recalcula o total.
3. O listener é removido no cleanup do `useEffect`, para evitar vazamento de memória ao desmontar o componente.

Como os dois micros não se conhecem, qualquer um pode ser trocado ou reimplantado sem alterar o outro, desde que o nome do evento e o formato de `detail` sejam mantidos.

**Limitação conhecida:** o evento não é armazenado. Se o Micro Pedido ainda não estiver montado quando um item for adicionado, esse clique se perde. Em um cenário real, isso seria resolvido com um contexto ou store compartilhado.

## Responsividade

O layout do container usa CSS Grid com duas colunas em telas largas e uma coluna abaixo de 720px. Os estilos de cada micro são CSS Modules, para não vazarem entre os projetos.

## Observações

- Não há autenticação, banco de dados ou deploy, conforme o enunciado.
- O projeto é em JavaScript puro.
