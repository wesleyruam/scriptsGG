// ==UserScript==
// @name         Exibição de Dados de Agendamento NOC-Suporte
// @namespace    http:
// @version      0.1
// @description  mostra os agendamentos do NOC
// @author       alecx/wesley
// @match        https://integrator6.gegnet.com.br/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const jsonUrl = 'https://noc-ferramentas.gegnet.com.br/json_noc.php';
    let cardContainer;
    let titleBar;
    let toggleBtn;
    let windowState = 'maximized'; // Estado inicial da janela
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
            const scheduleDate = new Date(item.dataHora_noc);
            const diff = Math.abs(scheduleDate - now);
            if (diff < nearestDiff) {
                nearestDiff = diff;
                nearestSchedule = item;
            }
        });

        return nearestSchedule;
    }

    function renderMaximizedCard(data) {
        
        cardContainer = document.createElement('div');
        cardContainer.id = 'schedule-window';
        cardContainer.style.position = 'fixed';
        cardContainer.style.bottom = '0.7px';
        cardContainer.style.left = '330px';
        cardContainer.style.zIndex = '9999';
        cardContainer.style.backgroundColor = '#fff';
        cardContainer.style.border = '1px solid #ccc';
        cardContainer.style.borderRadius = '5px';
        cardContainer.style.padding = '10px';
        cardContainer.style.width = originalWidth;
        cardContainer.style.height = originalHeight;
        cardContainer.style.overflowY = 'auto';


        titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#1a428a';
        titleBar.style.color = '#fff';
        titleBar.style.padding = '5px 10px';
        titleBar.style.fontWeight = 'bold';
        titleBar.textContent = 'Dados de Agendamento NOC-Suporte';
        titleBar.style.cursor = 'pointer';
        titleBar.addEventListener('click', toggleWindowState);
        cardContainer.appendChild(titleBar);


        const nearestSchedule = findNearestSchedule(data);


        const minimizedContent = document.createElement('div');
        minimizedContent.style.display = 'none';

        if (nearestSchedule) {
            const dateTime = new Date(nearestSchedule.dataHora_noc);
            const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
            const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
            const scheduleDetails = document.createElement('p');
            scheduleDetails.textContent = `${nearestSchedule.protocolo_noc} - ${formattedDate} ${formattedTime} - ${nearestSchedule.nome_usuario}`;
            minimizedContent.appendChild(scheduleDetails);
        } else {
            minimizedContent.textContent = 'Nenhum agendamento próximo encontrado.';
        }

        cardContainer.appendChild(minimizedContent);


        const scheduleList = document.createElement('ul');
        scheduleList.style.listStyleType = 'none';
        scheduleList.style.padding = '10px';
        data.forEach(item => {
            const dateTime = new Date(item.dataHora_noc);
            const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
            const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '10px';
            listItem.style.fontSize = '14px';
            listItem.textContent = `${item.protocolo_noc} - ${formattedDate} ${formattedTime} - ${item.nome_usuario}`;
            scheduleList.appendChild(listItem);
        });
        cardContainer.appendChild(scheduleList);

        document.body.appendChild(cardContainer);
    }

    function renderMinimizedCard() {

        cardContainer.style.width = 'auto';
        cardContainer.style.height = 'auto';


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

                fetchScheduleData().then(data => {
                    renderMaximizedCard(data);
                }).catch(error => {
                    console.error('Erro ao exibir dados de agendamento:', error);
                });
            } else {

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
  
