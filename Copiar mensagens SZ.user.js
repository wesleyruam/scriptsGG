// ==UserScript==
// @name         Copiar mensagens SZ
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Copiar mensagens do chat do SZ para a área de transferência
// @author       Wesley GG
// @match        https://ggnet.sz.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sz.chat
// @grant        GM_setClipboard
// ==/UserScript==


// Teste

(function() {
    'use strict';

    // Função para extrair e formatar as mensagens do chat
    function copiarMensagens() {
        var liElements = document.querySelectorAll('.speech-wrapper li');
        var mensagens = "";

        liElements.forEach(function(li) {
            var nome = li.querySelector('.name').textContent.trim();
            var horario = li.querySelector('.timestamp').textContent.trim();
            var texto = li.querySelector(".bubble > div:nth-child(2) > div > div:nth-child(1) > span").textContent.trim();

            mensagens += nome + " - " + horario + " - " + texto + "\n\n";
        });

        return mensagens;
    }

    // Função para criar e adicionar o botão e o toast ao HTML
    function adicionarElementos() {
        var divMenuTags = document.querySelector('.menu.tags.ft-scroll');

        if (divMenuTags) {
            // Criando o HTML do botão
            var linkHTML = '<a data-v-5cbb963e="" class="item text-ellipsis"><i data-v-5cbb963e="" class="icon tag"></i> Mensagens: Copiar Mensagens </a>';

            // Adicionando o botão à div
            divMenuTags.insertAdjacentHTML('beforeend', linkHTML);


            // Adicionando o evento de clique para copiar as mensagens e mostrar o toast
            var linkElement = divMenuTags.querySelector('.item');

            linkElement.addEventListener('click', function() {
                var toastHTML = '<div id="custom-toast-container" class="custom-toast-top-right" style="display: none;"><div class="custom-toast custom-toast-info" aria-live="polite" style="opacity: 1;"><div class="custom-toast-progress" style="width: 0%;"></div><button type="button" class="custom-toast-close-button" role="button">×</button><div class="custom-toast-message"></div></div></div>';
                document.body.insertAdjacentHTML('beforeend', toastHTML);
                var toastContainer = document.getElementById('custom-toast-container');
                copiarParaAreaDeTransferencia();
                mostrarToast(toastContainer);
            });
        }
    }

    // Copiar mensagens para a área de transferência
    function copiarParaAreaDeTransferencia() {
        var mensagens = copiarMensagens();
        GM_setClipboard(mensagens);
    }

    // Mostrar toast
    function mostrarToast(toastContainer) {
        var toastMessage = toastContainer.querySelector('.custom-toast-message');
        toastMessage.textContent = "Mensagens copiadas com sucesso";
        toastContainer.style.display = "block";

        // Ocultar o toast após 3 segundos e remover a div do toast
        setTimeout(function() {
            toastContainer.style.display = "none";
            toastContainer.remove();
        }, 3000);
    }

    // Adicionar botão e toast ao HTML
    adicionarElementos();

    // Função para adicionar o CSS ao head do documento
    function addCSS(cssText) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = cssText;
        } else {
            style.appendChild(document.createTextNode(cssText));
        }

        head.appendChild(style);
    }

    // CSS que você deseja adicionar
    var customCSS = `
    .custom-toast-title { font-weight: 700; }
    .custom-toast-message { -ms-word-wrap: break-word; word-wrap: break-word; }
    .custom-toast-message a, .custom-toast-message label { color: #fff; }
    .custom-toast-message a:hover { color: #ccc; text-decoration: none; }
    .custom-toast-close-button { position: relative; right: -.3em; top: -.3em; float: right; font-size: 20px; font-weight: 700; color: #fff; -webkit-text-shadow: 0 1px 0 #fff; text-shadow: 0 1px 0 #fff; opacity: .8; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80); filter: alpha(opacity=80); line-height: 1; }
    .custom-toast-close-button:focus, .custom-toast-close-button:hover { color: #000; text-decoration: none; cursor: pointer; opacity: .4; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40); filter: alpha(opacity=40); }
    .rtl .custom-toast-close-button { left: -.3em; float: left; right: .3em; }
    button.custom-toast-close-button { padding: 0; cursor: pointer; background: 0 0; border: 0; -webkit-appearance: none; }
    .custom-toast-top-center { top: 0; right: 0; width: 100%; }
    .custom-toast-bottom-center { bottom: 0; right: 0; width: 100%; }
    .custom-toast-top-full-width { top: 0; right: 0; width: 100%; }
    .custom-toast-bottom-full-width { bottom: 0; right: 0; width: 100%; }
    .custom-toast-top-left { top: 12px; left: 12px; }
    .custom-toast-top-right { top: 12px; right: 12px; }
    .custom-toast-bottom-right { right: 12px; bottom: 12px; }
    .custom-toast-bottom-left { bottom: 12px; left: 12px; }
    #custom-toast-container { position: fixed; z-index: 999999; pointer-events: none; }
    #custom-toast-container * { box-sizing: border-box; }
    #custom-toast-container > div { position: relative; pointer-events: auto; overflow: hidden; margin: 0 0 6px; padding: 15px 15px 15px 50px; width: 300px; border-radius: 3px; background-position: 15px; background-repeat: no-repeat; box-shadow: 0 0 12px #999; color: #fff; opacity: .8; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80); filter: alpha(opacity=80); }
    #custom-toast-container > div.rtl { direction: rtl; padding: 15px 50px 15px 15px; background-position: right 15px center; }
    #custom-toast-container > div:hover { box-shadow: 0 0 12px #000; opacity: 1; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100); filter: alpha(opacity=100); cursor: pointer; }
    #custom-toast-container > .custom-toast-info { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=)!important; }
    #custom-toast-container > .custom-toast-error { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=)!important; }
    #custom-toast-container > .custom-toast-success { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==)!important; }
    #custom-toast-container > .custom-toast-warning { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=)!important; }
    #custom-toast-container .custom-toast-progress { position: absolute; left: 0; bottom: 0; height: 4px; background-color: #000; opacity: .4; -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40); filter: alpha(opacity=40); }

    @media (max-width: 240px) {
        #custom-toast-container > div { padding: 8px 8px 8px 50px; width: 11em; }
        #custom-toast-container > div.rtl { padding: 8px 50px 8px 8px; }
        #custom-toast-container .custom-toast-close-button { right: -.2em; top: -.2em; }
        #custom-toast-container .rtl .custom-toast-close-button { left: -.2em; right: .2em; }
    }

    @media (min-width: 241px) and (max-width: 480px) {
        #custom-toast-container > div { padding: 8px 8px 8px 50px; width: 18em; }
        #custom-toast-container > div.rtl { padding: 8px 50px 8px 8px; }
        #custom-toast-container .custom-toast-close-button { right: -.2em; top: -.2em; }
        #custom-toast-container .rtl .custom-toast-close-button { left: -.2em; right: .2em; }
    }

    @media (min-width: 481px) and (max-width: 768px) {
        #custom-toast-container > div { padding: 15px 15px 15px 50px; width: 25em; }
        #custom-toast-container > div.rtl { padding: 15px 50px 15px 15px; }
    }
    .custom-toast {
            background-color: #030303
        }

        .custom-toast-success {
            background-color: #51a351
        }

        .custom-toast-error {
            background-color: #bd362f
        }

        .custom-toast-info {
            background-color: #2f96b4
        }

        .custom-toast-warning {
            background-color: #f89406
        }

        .custom-toast-progress {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 4px;
            background-color: #000;
            opacity: .4;
            -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
            filter: alpha(opacity=40)
        }
`;

    // Adicionando o CSS personalizado ao head do documento
    addCSS(customCSS);


})();
