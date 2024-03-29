// ==UserScript==
// @name         Copiar mensagens SZ teste
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copiar mensagens do chat do SZ para a área de transferência
// @author       Wesley GG
// @match        https://ggnet.sz.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sz.chat
// @grant        GM_setClipboard
// ==/UserScript==

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

            mensagens += nome + " - " + horario + " - " + texto + "\n";
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

            // Criando o HTML do toast
            var toastHTML = '<div id="toast-container" class="toast-top-right" style="display: none;"><div class="toast toast-info" aria-live="polite" style="opacity: 1;"><div class="toast-progress" style="width: 0%;"></div><button type="button" class="toast-close-button" role="button">×</button><div class="toast-message"></div></div></div>';

            // Adicionando o toast ao corpo do documento
            document.body.insertAdjacentHTML('beforeend', toastHTML);

            // Adicionando o evento de clique para copiar as mensagens e mostrar o toast
            var linkElement = divMenuTags.querySelector('.item');
            var toastContainer = document.getElementById('toast-container');
            linkElement.addEventListener('click', function() {
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
        var toastMessage = toastContainer.querySelector('.toast-message');
        toastMessage.textContent = "Mensagens copiadas com sucesso";
        toastContainer.style.display = "block";

        // Ocultar o toast após 3 segundos
        setTimeout(function() {
            toastContainer.style.display = "none";
        }, 3000);
    }

    // Adicionar botão e toast ao HTML
    adicionarElementos();

})();

