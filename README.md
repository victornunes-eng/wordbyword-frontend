# Word by Word

Uma palavra pode abrir uma nova possibilidade. **Word by Word** é um site para praticar vocabulário em inglês: consulte cinco palavras, leia a explicação e explore um exemplo de uso em contexto.

Projeto da disciplina **Front-end Engineering — FIAP**.


## Links do projeto

- [Site](https://wordbyword-fiap-victor-marjorie.pink-peach-7262.chatgpt.site)
- [Frontend no GitHub](https://github.com/victornunes-eng/wordbyword-frontend)
- [API no GitHub](https://github.com/victornunes-eng/wordbyword-api)
- [Endpoint público de palavras](https://wordbyword-api.vercel.app/ask)
- [Saúde da API](https://wordbyword-api.vercel.app/health)

## Integrantes

| Integrante | RM |
| --- | --- |
| Victor Santana Nunes da Silva | 369361 |
| Marjorie Nunes Ribeiro | 366725 |

## Funcionalidades

- Consulta ao BFF usando o contrato `{ word, description, useCase }`.
- Cartões com palavra, significado e frase de exemplo.
- Busca de novas palavras sem recarregar a página.
- Interface responsiva para celular, tablet e desktop.
- Estados de carregamento, lista vazia, erro e nova tentativa.
- Cancelamento e timeout de requisições; preservação das palavras anteriores se uma nova consulta falhar.
- HTML semântico, indicação de foco, link para pular ao conteúdo, mensagens acessíveis e respeito à preferência por movimento reduzido.

## Tecnologias

| Tecnologia | Papel |
| --- | --- |
| React 19 + TypeScript | Interface e estado das consultas. |
| Vinext + Vite | Compilação da aplicação com estrutura App Router. |
| Tailwind CSS + CSS próprio | Estilos e layout responsivo. |
| Shadcn / Base UI | Botões e esqueletos de carregamento. |
| Lucide | Ícones de interface. |
| Sites / Cloudflare Workers | Publicação do frontend. |
| Node.js + OpenAI | API própria, mantida em repositório separado. |

O frontend não recebe a chave da OpenAI. Ele conhece apenas o endereço público da API.

## Executar localmente

Pré-requisitos: Node.js 22.13 ou superior e npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abra a URL local informada pelo terminal, normalmente `http://localhost:3000`.

No arquivo `.env.local`, configure:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001/ask
```

Execute a API própria em outro terminal conforme seu README. Para testar o BFF da aula, use `https://fiap-bff-10aojr.onrender.com/ask`. O site utiliza essa URL quando a variável não está definida; o deploy final deve apontar explicitamente para a API própria. A língua da explicação depende do provedor; a API própria solicita português.

## Compilar e verificar

```bash
npx tsc --noEmit
npm run build
npm start
```

`npm start` executa localmente o Worker compilado com Wrangler. O comando de build gera `dist/client` e `dist/server`; não publique `dist/server` como arquivos estáticos.

## Publicar

O frontend foi preparado para **Sites**, que executa o resultado da compilação no Cloudflare Workers.

1. Defina `NEXT_PUBLIC_API_URL` com o endereço público completo da sua API (`https://seu-projeto.vercel.app/ask`) no ambiente de compilação.
2. Execute `npm ci` e `npm run build`.
3. Salve e publique a versão pelo Sites. O identificador da instância está em `.openai/hosting.json`.
4. Configure o acesso público para que o professor consiga abrir a página sem login.
5. Confirme que a origem do site está em `ALLOWED_ORIGINS` na API e valide uma consulta real.

A variável `NEXT_PUBLIC_API_URL` é incorporada ao JavaScript na compilação. Alterá-la exige novo build e deploy. Nunca use prefixo `NEXT_PUBLIC_` para segredos.

Para uma nova instância em outra conta do Sites, registre um novo site e use o identificador retornado; o identificador deste projeto não transfere acesso à conta original. Não é necessário usar a Vercel para o frontend: ela hospeda a API separadamente.

## Estrutura

```text
app/page.tsx          Interface e consulta ao BFF
app/layout.tsx        Idioma e metadados
app/globals.css       Identidade visual e responsividade
components/ui/        Componentes de interface do scaffold
public/favicon.svg    Ícone do projeto
.env.example          Exemplo de configuração, sem segredos
docs/                 Evidências e documentação da entrega
```

## Lighthouse e Web Vitals

A evidência e os resultados da versão pública serão registrados em `docs/` após a publicação. Nenhuma pontuação foi estimada ou inventada.

| Métrica | O que significa |
| --- | --- |
| FCP — First Contentful Paint | Tempo até aparecer o primeiro conteúdo de texto ou imagem. |
| LCP — Largest Contentful Paint | Tempo até aparecer o maior elemento de conteúdo visível. |
| Speed Index | Rapidez com que o conteúdo visível é preenchido durante o carregamento. |
| TBT — Total Blocking Time | Soma dos períodos de tarefas longas que bloqueiam a thread principal durante a medição. |
| CLS — Cumulative Layout Shift | Instabilidade visual causada por mudanças inesperadas de posição dos elementos. |

**Lighthouse é uma medição de laboratório.** Os Core Web Vitals atuais são LCP, INP e CLS. O relatório padrão de navegação não comprova o INP de usuários reais; TBT ajuda a diagnosticar bloqueios, mas não é o mesmo que INP. As notas variam com dispositivo, rede e execução. Um site novo pode não ter dados de campo suficientes.

Medidas adotadas: fontes do sistema sem downloads externos, ausência de imagens pesadas, ícones vetoriais, CSS responsivo e espaços reservados durante a consulta.

- [Google — Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Google — Web Vitals](https://web.dev/articles/vitals)

## Referência didática

[BFF de Jaison Schmidt](https://github.com/jaisonschmidt/fiap-bff), indicado no enunciado da disciplina. O frontend e a API própria foram escritos para este trabalho, com auxílio de IA na implementação e documentação.
