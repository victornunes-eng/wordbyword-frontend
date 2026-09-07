# Validação do projeto

## Escopo e método

A avaliação combina testes automatizados da API, compilação e verificação de tipos do frontend, consultas HTTP reais e Lighthouse sobre a URL pública. Os testes automatizados usam um provedor simulado para cobrir falhas sem gerar custos.

## Resultados já verificados

- Dez testes automatizados da API aprovados: contrato, CORS, limites, concorrência, cache, erros, validação e adaptador OpenAI.
- Consulta real à OpenAI realizada com sucesso em 07/09/2026: cinco palavras únicas, explicações em português e exemplos em inglês.
- TypeScript e compilação do frontend aprovados.
- Dependências atualizadas; auditoria npm sem vulnerabilidades reportadas em 07/09/2026.
- Arquivos `.env`, `.env.local` e dados locais da Vercel ignorados pelo Git.

## Limitações de validação

A interface foi aberta e inspecionada no Chrome via controle do aplicativo nativo, após a prévia integrada não estar disponível. Os testes adicionais e o Lighthouse são descritos abaixo conforme forem concluídos.

Há integração opcional e detectável com WebMCP para a mesma ação de buscar palavras. O ambiente não disponibilizou um contexto WebMCP para execução dos testes dessa integração; seu contrato não foi verificado em navegador compatível. A função principal do site não depende dela.

## Conferência manual recomendada antes do envio

1. Abrir o site em computador e celular, sem login em qualquer plataforma.
2. Confirmar cinco palavras, explicações e exemplos.
3. Clicar em “Buscar novas palavras” e observar carregamento e resultado. O cache da API pode repetir palavras por 15 segundos.
4. Navegar por Tab e ativar o botão pelo teclado; conferir o link de pular ao conteúdo.
5. Aumentar o zoom para 200% e confirmar a leitura e o acesso ao botão.
6. Desconectar a rede, buscar novamente e conferir a mensagem de erro e a opção de tentar novamente.
7. Abrir os dois repositórios públicos e o relatório do Lighthouse.
