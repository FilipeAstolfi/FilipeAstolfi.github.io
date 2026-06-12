// Preencha este arquivo com qualquer código que você necessite para realizar a
// coleta, desde a biblioteca analytics.js, gtag.js ou o snippet do Google Tag 
// Manager. No último caso, não é necessário implementar a tag <noscript>.
// O ambiente dispõe da jQuery 3.5.1, então caso deseje, poderá utilizá-la
// para fazer a sua coleta.
// Caso tenha alguma dúvida sobre o case, não hesite em entrar em contato.
// tagueamento.js — DP6 Case Martech
// Implementação GA4 via gtag.js | ID: G-096NHNN8Q2

// tagueamento.js — DP6 Case Martech
// Implementação GA4 via gtag.js | ID: G-096NHNN8Q2

(function () {

    // UTILITÁRIO: retorna a URL atual da página
    function getPageLocation() {
        return window.location.href;
    }


    // 1. PAGE VIEW
    // O evento page_view é disparado automaticamente pelo snippet gtag('config', ...)
    // já presente no <head> de cada página HTML.
    // Portanto, só estão nesse arquivo as configurações dos eventos de interação.


    // 2. EVENTOS GLOBAIS — todas as páginas

    // Clique em "Entre em Contato" (menu lateral)
    var linkContato = document.querySelector('.menu-lista-contato');
    if (linkContato) {
        linkContato.addEventListener('click', function () {
            gtag('event', 'click', {
                page_location: getPageLocation(),
                element_name: 'entre_em_contato',
                element_group: 'menu'
            });
        });
    }

    // Clique em "Download PDF" (menu lateral)
    // PS: o link aponta para um arquivo .pdf externo (target="_pdf"), cujo comportamento
    // — visualizar sem fazer download ou iniciar download — varia de acordo com o navegador
    // e suas configurações. O evento file_download foi mantido conforme especificado no case,
    // pois representa a intenção do usuário de acessar o arquivo, independentemente de
    // como o navegador decide exibi-lo.
    var linkDownload = document.querySelector('.menu-lista-download');
    if (linkDownload) {
        linkDownload.addEventListener('click', function () {
            gtag('event', 'file_download', {
                page_location: getPageLocation(),
                element_name: 'download_pdf',
                element_group: 'menu'
            });
        });
    }


    // 3. PÁGINA analise.html — clique nos cards "Ver Mais".
    // A princípio, o código se baseava no data-id para capturar o nome do card,
    // mas dependendo do elemento clicado dentro do botão (imagem ou texto),
    // o parâmetro não seria reconhecido. Em função disso, utilizei o método
    // closest() para garantir que sempre suba até o .card-montadoras que tem o data-id,
    // independentemente de onde o clique ocorreu.

    var cards = document.querySelectorAll('.card-montadoras');
    if (cards.length > 0) {
        cards.forEach(function (card) {
            card.addEventListener('click', function (event) {
                var cardPai = event.target.closest('.card-montadoras');
                var elementName = cardPai ? cardPai.getAttribute('data-id') : '';
                gtag('event', 'click', {
                    page_location: getPageLocation(),
                    element_name: elementName,
                    element_group: 'ver_mais'
                });
            });
        });
    }


    // 4. PÁGINA sobre.html — eventos de formulário

    var form = document.querySelector('form.contato');
    if (form) {

        // O <form> não possuía atributos id, name ou action no HTML original.
        // Para seguir o que o documento pedia, o código HTML foi alterado para
        // incluir id="form-contato", name="form-contato" e action="/sobre.html".
        var formId = form.getAttribute('id') || '';
        var formName = form.getAttribute('name') || '';
        var formDestination = form.getAttribute('action') || getPageLocation();

        var formStartDisparado = false;
        var formSubmitRealizado = false;

        // form_start — ao interagir com o primeiro campo
        var campos = form.querySelectorAll('input, textarea, select');
        campos.forEach(function (campo) {
            campo.addEventListener('focus', function () {
                if (!formStartDisparado) {
                    formStartDisparado = true;
                    gtag('event', 'form_start', {
                        page_location: getPageLocation(),
                        form_id: formId,
                        form_name: formName,
                        form_destination: formDestination
                    });
                }
            });
        });

        // form_submit — ao enviar o formulário
        // A flag formSubmitRealizado também é ativada aqui para garantir que o
        // view_form_success só dispare após o envio do formulário.
        form.addEventListener('submit', function () {
            var botaoEnviar = form.querySelector('button[type="submit"]');
            var formSubmitText = botaoEnviar ? botaoEnviar.innerText.trim() : '';

            gtag('event', 'form_submit', {
                page_location: getPageLocation(),
                form_id: formId,
                form_name: formName,
                form_destination: formDestination,
                form_submit_text: formSubmitText
            });

            formSubmitRealizado = true;
        });

        // view_form_success — quando o popup de sucesso aparece, o main.js adiciona
        // a classe 'lightbox-open' no <body> para exibir o popup.
        // O MutationObserver monitora essa mudança e dispara o evento apenas quando
        // o popup abrir após o envio do formulário, evitando disparos indevidos
        // quando o mesmo lightbox é aberto pelos cards da página de análise.
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    document.body.classList.contains('lightbox-open') &&
                    formSubmitRealizado
                ) {
                    formSubmitRealizado = false;
                    gtag('event', 'view_form_success', {
                        page_location: getPageLocation(),
                        form_id: formId,
                        form_name: formName
                    });
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

})();