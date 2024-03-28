// ==UserScript==
// @name         Copiar mensagens SZ
// @namespace    http://tampermonkey.net/
// @version      0.1
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

    // Função para criar e adicionar o botão à div
    function adicionarBotao() {
        var divTagsSessions = document.querySelector('.item.tags-sessions');

        if (divTagsSessions) {
            var button = document.createElement('button');
            button.textContent = 'Copiar Mensagens';
            button.style.border = '1px solid black';
            button.addEventListener('click', function() {
                copiarParaAreaDeTransferencia();
            });

            divTagsSessions.appendChild(button);
        }
    }

    // Copiar mensagens para a área de transferência
    function copiarParaAreaDeTransferencia() {
        var mensagens = copiarMensagens();
        GM_setClipboard(mensagens);
        console.log("Mensagens copiadas para a área de transferência:");
        console.log(mensagens);
    }

    // Adicionar botão à div
    adicionarBotao();

})();