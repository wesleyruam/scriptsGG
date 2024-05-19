// ==UserScript==
// @name         ISP New Style!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://integrator6.gegnet.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// ==/UserScript==



(function() {
    'use strict';

    function verificarURL() {
        return window.location.href !== "https://integrator6.gegnet.com.br/#/login";
    }

    function aplicarEstilos() {
        const lista = document.querySelector(".lista");
        const conteudo = document.querySelector(".conteudo");
        const dropDownMenu = document.querySelector(".dropdown-menu")
        const tabsComponent = document.querySelector('.row.tabsComponent');
        const elemento = document.querySelector('elite-tab');
        const eliteTab = document.querySelector('elite-tab');

        dropDownMenu.style.position = 'relative';
        dropDownMenu.style.margin = "0%"

        conteudo.style.maxWidth = `calc(100% - ${lista.clientWidth}px - 1%)`;

        if (lista) {
            lista.style.minHeight = "90%"
            lista.style.maxHeight = "90%";
            lista.style.margin = 0;
            lista.style.marginTop = "0";
            lista.style.backgroundColor = "#353535";
            lista.style.zIndex = "99998";
            lista.style.display = "flex";
            lista.style.flexDirection = "column";
            lista.style.borderLeft = "1px solid #ccc";
            lista.style.position = "absolute";
            lista.style.right = "0";
            lista.style.order = "2"; // Define a ordem da lista
            lista.style.overflowY = "auto";

            if (tabsComponent && eliteTab) {
                // Remove 'tabsComponent' de seu pai atual
                tabsComponent.parentNode.removeChild(tabsComponent);

                // Insere 'tabsComponent' antes de 'eliteTab' no DOM
                eliteTab.parentNode.insertBefore(tabsComponent, eliteTab);
            }

            if (elemento) {
                // Remove o elemento do DOM
                elemento.remove();
            }

            $(document).ready(function() {
                $(".lista").addClass('sortable');

                $('.sortable').sortable();
            })

            return true
        }else return false;
    }

    function tentarAplicarEstilos() {
        if (verificarURL()) {
            if (aplicarEstilos()) {
                aplicarEstilos()
                clearInterval(intervaloVerificacao); // Parar a verificação após aplicar os estilos
            }
        } else {
            console.log("A URL atual é a página de login. O script não será executado.");
        }
    }

    // Verificar a cada 1,5 segundo
    const intervaloVerificacao = setInterval(tentarAplicarEstilos, 500);

    function VerificacoesConstantes(){
        const btn = document.querySelector(".btn.btn-block.btn-primary.btn-abrir")
        const lista = document.querySelector(".lista");
        const conteudo = document.querySelector(".conteudo");
        conteudo.style.maxWidth = `calc(100% - ${lista.clientWidth}px - 1%)`;
    }

    const invervaloVerificaWidth = setInterval(VerificacoesConstantes, 500)
    })();
