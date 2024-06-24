// ==UserScript==
// @name         Exibição de Dados de Agendamento SZ.CHAT
// @namespace    http:
// @version      0.1
// @description  mostra os agendamentos do NOC
// @author       alecx/wesley
// @match        https://integrator6.gegnet.com.br/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const jsonUrl = 'https://noc-ferramentas.gegnet.com.br/json.php';
    let cardContainer;
    let titleBar;
    let toggleBtn;
    let windowState = 'maximized'; // Estado inicial da janela: maximizado
    let originalWidth = '300px';
    let originalHeight = '300px';

    function fetchScheduleData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: jsonUrl,
                responseType: 'json',
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error('Erro ao obter os dados de agendamento'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Erro na requisição HTTP: ' + error.statusText));
                }
            });
        });
    }

    function findNearestSchedule(data) {
        const now = new Date();
        let nearestSchedule = null;
        let nearestDiff = Infinity;

        data.forEach(item => {
            const scheduleDate = new Date(item.dataHora);
            const diff = Math.abs(scheduleDate - now);
            if (diff < nearestDiff) {
                nearestDiff = diff;
                nearestSchedule = item;
            }
        });

        return nearestSchedule;
    }

    function renderMaximizedCard(data) {
        // Cria o container da janela
        cardContainer = document.createElement('div');
        cardContainer.id = 'schedule-window';
        cardContainer.style.position = 'fixed';
        cardContainer.style.bottom = '0.7px'; // Posiciona na parte inferior da tela
        cardContainer.style.left = '10px';
        cardContainer.style.zIndex = '9999';
        cardContainer.style.backgroundColor = '#fff';
        cardContainer.style.border = '1px solid #ccc';
        cardContainer.style.borderRadius = '5px';
        cardContainer.style.padding = '10px';
        cardContainer.style.width = originalWidth; // Largura inicial da janela
        cardContainer.style.height = originalHeight; // Altura inicial da janela
        cardContainer.style.overflowY = 'auto'; // Adiciona barra de rolagem vertical

        // Título da janela
        titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#1a428a'; // Cor de fundo azul para a barra de título
        titleBar.style.color = '#fff'; // Cor do texto branco
        titleBar.style.padding = '5px 10px';
        titleBar.style.fontWeight = 'bold';
        titleBar.textContent = 'Dados de Agendamento SZ.chat';
        titleBar.style.cursor = 'pointer'; // Adiciona cursor de ponteiro ao título
        titleBar.addEventListener('click', toggleWindowState);
        cardContainer.appendChild(titleBar);

        // Encontra o agendamento mais próximo
        const nearestSchedule = findNearestSchedule(data);

        // Mostra apenas o agendamento mais próximo minimizado
        const minimizedContent = document.createElement('div');
        minimizedContent.style.display = 'none'; // Inicia oculto quando maximizado

        if (nearestSchedule) {
            const dateTime = new Date(nearestSchedule.dataHora);
            const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
            const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
            const scheduleDetails = document.createElement('p');
            scheduleDetails.textContent = `${nearestSchedule.protocolo} - ${formattedDate} ${formattedTime} - ${nearestSchedule.usuario}`;
            minimizedContent.appendChild(scheduleDetails);
        } else {
            minimizedContent.textContent = 'Nenhum agendamento próximo encontrado.';
        }

        cardContainer.appendChild(minimizedContent);

        // Lista de agendamentos completa
        const scheduleList = document.createElement('ul');
        scheduleList.style.listStyleType = 'none';
        scheduleList.style.padding = '10px';
        data.forEach(item => {
            const dateTime = new Date(item.dataHora);
            const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
            const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '10px';
            listItem.style.fontSize = '14px';
            listItem.textContent = `${item.protocolo} - ${formattedDate} ${formattedTime} - ${item.usuario}`;
            scheduleList.appendChild(listItem);
        });
        cardContainer.appendChild(scheduleList);

        document.body.appendChild(cardContainer);
    }

    function renderMinimizedCard() {
        // pra minimizar
        cardContainer.style.width = 'auto';
        cardContainer.style.height = 'auto';

        // Mostra o conteúdo minimizado e oculta a lista completa de agendamentos
        const minimizedContent = cardContainer.querySelector('div:nth-child(2)');
        if (minimizedContent) {
            minimizedContent.style.display = 'block';
        }

        const fullScheduleList = cardContainer.querySelector('ul');
        if (fullScheduleList) {
            fullScheduleList.style.display = 'none';
        }
    }

    function toggleWindowState() {
        if (windowState === 'maximized') {
            windowState = 'minimized';
            renderMinimizedCard();
        } else {
            windowState = 'maximized';
            if (!cardContainer.querySelector('ul')) {
                // Apenas renderiza 
                fetchScheduleData().then(data => {
                    renderMaximizedCard(data);
                }).catch(error => {
                    console.error('Erro ao exibir dados de agendamento:', error);
                });
            } else {
                // Volta para o tamanho original ao maximizar de novoo
                cardContainer.style.width = originalWidth;
                cardContainer.style.height = originalHeight;

                const minimizedContent = cardContainer.querySelector('div:nth-child(2)');
                if (minimizedContent) {
                    minimizedContent.style.display = 'none';
                }

                const fullScheduleList = cardContainer.querySelector('ul');
                if (fullScheduleList) {
                    fullScheduleList.style.display = 'block';
                }
            }
        }
    }

    async function displayScheduleData() {
        try {
            const data = await fetchScheduleData();
            renderMaximizedCard(data);
        } catch (error) {
            console.error('Erro ao exibir dados de agendamento:', error);
        }
    }

    window.addEventListener('load', displayScheduleData);

})();
