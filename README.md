# Case Técnico Martech — DP6

Implementação de coleta de dados para Google Analytics 4 via `gtag.js` e Google Tag Manager, conforme especificações do case técnico da DP6.

---

## Observações Técnicas

**1. Snippet do GA4 nos arquivos HTML**
O snippet de inicialização da biblioteca `gtag.js` foi mantido no `<head>` de cada página HTML, conforme boas práticas de performance — garantindo que a biblioteca carregue o mais cedo possível e que o `page_view` seja disparado corretamente. Toda a implementação dos eventos de interação está no arquivo `tagueamento.js`, separando responsabilidades e facilitando manutenção.

**2. Evento `file_download` no link de Download PDF**
O link "Download PDF" aponta para um arquivo `.pdf` externo com `target="_pdf"`. O comportamento de visualizar sem fazer download ou iniciar o download varia conforme o navegador e suas configurações. O evento `file_download` foi mantido conforme especificado no case, pois representa a intenção do usuário de acessar o arquivo, independentemente de como o navegador decide exibi-lo.

**3. Dois eventos `click` com o mesmo nome**
O evento `click` é utilizado em dois contextos distintos — clique em "Entre em Contato" no menu e clique nos cards "Ver Mais" na página de análise — conforme especificado na documentação do case. Para garantir a correta distinção entre eles, o parâmetro `element_group` foi implementado com valores únicos por contexto (`"menu"` e `"ver_mais"`). Em um ambiente de produção, talvez seja interessante usar nomes de eventos mais descritivos para cada contexto para facilitar a leitura dos dados por novos membros do time que estejam menos habituadas com o que foi criandso anteriormente e reduzindo a dependência de filtros nos relatórios.

**4. Leitura dinâmica do `data-id` nos cards**
O evento de clique nos cards da página `analise.html` utiliza `event.target.closest('.card-montadoras')` para garantir que o `data-id` seja sempre lido corretamente, independentemente de qual elemento filho foi clicado — imagem, título ou texto "Ver Mais". Nesse cenário, notei que usar apenas o data-id poderia deixar o evento pouco seguro, uma vez que o clique na imagem ou no texto não dispara o data-id. Por isso usei utilizei o método closest() para garantir que sempre suba até o .card-montadoras que tem o data-id, independentemente de onde o clique ocorreu.

**5. Detecção do popup via MutationObserver**
O evento `view_form_success` é disparado através de um `MutationObserver` que monitora a classe `lightbox-open` no `<body>`, que é a forma como o `main.js` exibe o popup de confirmação. Uma flag `formSubmitRealizado` foi implementada para garantir que o evento só dispare após o envio do formulário, evitando disparos indevidos quando o mesmo lightbox é aberto pelos cards da página de análise. Essa mesma lógica foi replicada na implementação via GTM através de uma tag HTML personalizada que empurra um evento customizado no dataLayer (`view_form_success_dp6`), acionando o gatilho correspondente.

**6. Atributos `id`, `name` e `action` no formulário**
O elemento `<form>` não possuía os atributos `id`, `name` e `action` no HTML original. Eles foram adicionados para que os parâmetros `form_id`, `form_name` e `form_destination` sejam preenchidos corretamente nos eventos de formulário. O `tagueamento.js` já estava preparado para ler esses atributos dinamicamente, sem necessidade de alteração no JavaScript.

**7. `page_location` em ambiente local**
Durante os testes locais, o parâmetro `page_location` exibe URLs de localhost (`http://127.0.0.1/...`). Em produção, após a publicação no GitHub Pages, o parâmetro refletirá a URL pública correta automaticamente, pois o valor é lido via `window.location.href` durante execução.

**8. Parâmetros fixos nas tags do GTM**
Na implementação via GTM, os parâmetros semânticos como `element_name` e `element_group` foram definidos como valores fixos nas tags, pois o site não possui uma camada de dataLayer estruturada. Em um ambiente de produção, é importante que esses valores sejam empurrados no dataLayer antes do disparo dos eventos, o que deixa a implementação mais escalável, independente do GTM e facilita a manutenção por qualquer membro do time. O arquivo de exportação do container GTM está disponível em /gtm/GTM-NJM54DB5_v6.json.
Como a tag global do Google Analytics já estava inserida nos arquivos HTML, não adicionei a tag global do GTM para evitar qualquer tipo de conflito, mas segue abaixo os 2 snippets:

1 - <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NJM54DB5');</script>
<!-- End Google Tag Manager -->

2 - <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJM54DB5"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

**9. Screenshots comprovando funcionamento**
Depois de criar a implementação da coleta para GA4, testei todos os eventos e comprovei o funcionamento com
screenshots da DevTools. Todos as imagens estão na pasta /testes_evidencias