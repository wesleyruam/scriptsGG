// ==UserScript==
// @name         Mostra agendados NOC e SZ no ISP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mostra agendados NOC e SZ no ISP
// @author       Wesley GG
// @match        https://integrator6.gegnet.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=net.br
// @downloadURL  https://github.com/wrGGsiq/scriptsGG/raw/main/agendados_no_integrator.user.js
// @updateURL    https://github.com/wrGGsiq/scriptsGG/raw/main/agendados_no_integrator.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==


(function() {
    'use strict';

    const urls = [
        { url: 'https://noc-ferramentas.gegnet.com.br/json_noc.php', key: 'dataHora_noc', protocol: 'protocolo_noc', user: 'nome_usuario', title: 'NOC-Suporte' },
        { url: 'https://noc-ferramentas.gegnet.com.br/json.php', key: 'dataHora', protocol: 'protocolo', user: 'usuario', title: 'SZ.CHAT' }
    ];

    const originalWidth = '600px';
    const originalHeight = '300px';

    let cardContainer, titleBar, windowState = 'maximized';

    async function fetchScheduleData() {
        return Promise.all(urls.map(({ url }) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
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

        })));
    }

    function findNearestSchedule(data, key) {
        const now = new Date();
        let nearestSchedule = null, nearestDiff = Infinity;
        data.forEach(item => {
            const scheduleDate = new Date(item[key]);
            const diff = Math.abs(scheduleDate - now);
            if (diff < nearestDiff) {
                nearestDiff = diff;
                nearestSchedule = item;
            }
        });
        return nearestSchedule;
    }

    function createScheduleList(data, key, protocolKey, userKey) {
        const scheduleList = document.createElement('ul');
        scheduleList.style.listStyleType = 'none';
        scheduleList.style.padding = '0';
        scheduleList.style.margin = '0';

        data.forEach(item => {
            const dateTime = new Date(item[key]);
            const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
            const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
            const listItem = document.createElement('li');
            listItem.style.marginBottom = '5px';
            listItem.style.fontSize = '12px';
            listItem.style.color = '#696969';
            listItem.textContent = `${item[protocolKey]} - ${formattedDate} ${formattedTime} - ${item[userKey]}`;
            scheduleList.appendChild(listItem);
        });

        return scheduleList;
    }

    function renderMaximizedCard(data) {
        cardContainer = document.createElement('div');
        cardContainer.id = 'schedule-window';
        cardContainer.classList.add('maximized');
        cardContainer.style.position = 'fixed';
        cardContainer.style.bottom = '10px';
        cardContainer.style.left = '10px';
        cardContainer.style.zIndex = '9999';
        cardContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        cardContainer.style.border = '1px solid #ccc';
        cardContainer.style.borderRadius = '5px';
        cardContainer.style.padding = '10px';
        cardContainer.style.width = originalWidth;
        cardContainer.style.height = originalHeight;
        cardContainer.style.overflowY = 'auto';
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'column';
        cardContainer.style.transition = 'height 0.3s ease, width 0.3s ease';

        titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#1a428a';
        titleBar.style.color = '#fff';
        titleBar.style.padding = '5px 10px';
        titleBar.style.fontWeight = 'bold';
        titleBar.style.width = '100%';
        titleBar.textContent = 'Dados';
        titleBar.style.cursor = 'pointer';
        titleBar.style.transition = 'background-color 0.3s ease';
        titleBar.addEventListener('click', toggleWindowState);

        cardContainer.appendChild(titleBar);

        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.justifyContent = 'space-between';

        data.forEach((scheduleData, index) => {
            const { key, protocol, user, title } = urls[index];
            const column = document.createElement('div');
            column.style.flex = '1';
            column.style.padding = '10px';

            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = title;
            sectionTitle.style.fontSize = '14px';
            sectionTitle.style.margin = '0 0 10px 0';
            column.appendChild(sectionTitle);

            const scheduleList = createScheduleList(scheduleData, key, protocol, user);
            column.appendChild(scheduleList);

            contentContainer.appendChild(column);
        });

        cardContainer.appendChild(contentContainer);
        document.body.appendChild(cardContainer);

        setTimeout(() => {
            cardContainer.style.height = originalHeight;
        }, 50);
    }

    function renderMinimizedCard(data) {
        cardContainer.classList.remove('maximized');
        cardContainer.classList.add('minimized');

        cardContainer.style.width = 'auto';
        cardContainer.style.height = 'auto';
        cardContainer.style.padding = '10px';
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'column';
        cardContainer.style.bottom = '5px';
        cardContainer.style.left = '10px';

        const contentContainer = cardContainer.querySelector('div:nth-child(2)');
        contentContainer.innerHTML = '';
        contentContainer.style.width = '100%';

        data.forEach((scheduleData, index) => {
            const { key, protocol, user } = urls[index];
            const nearestSchedule = findNearestSchedule(scheduleData, key);

            if (nearestSchedule) {
                const dateTime = new Date(nearestSchedule[key]);
                const formattedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;
                const formattedTime = `${dateTime.getHours()}:${String(dateTime.getMinutes()).padStart(2, '0')}`;

                const scheduleDetails = document.createElement('p');
                scheduleDetails.style.fontSize = '10px';
                scheduleDetails.style.margin = '0';
                scheduleDetails.textContent = `${nearestSchedule[protocol]} - ${formattedDate} ${formattedTime} - ${nearestSchedule[user]}`;
                contentContainer.appendChild(scheduleDetails);
            }
        });

        setTimeout(() => {
            cardContainer.style.width = originalWidth;
        }, 50);
    }

    function renderTitleOnlyCard() {
        cardContainer.classList.remove('maximized', 'minimized');
        cardContainer.classList.add('titleOnly');

        cardContainer.style.width = 'auto';
        cardContainer.style.height = 'auto';
        cardContainer.style.padding = '0';
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'column';
        cardContainer.style.bottom = '5px'; // Ajuste vertical
        cardContainer.style.left = '10px';  // Ajuste horizontal

        const contentContainer = cardContainer.querySelector('div:nth-child(2)');
        if (contentContainer) {
            contentContainer.innerHTML = '';
        }

        setTimeout(() => {
            cardContainer.style.width = 'auto';
        }, 50);
    }

    function toggleWindowState() {
        if (windowState === 'maximized') {
            windowState = 'minimized';
            cardContainer.style.height = `${titleBar.clientHeight}px`;
            fetchScheduleData()
                .then(data => {
                    renderMinimizedCard(data);
                })
                .catch(error => {
                    console.error('Erro ao exibir dados de agendamento:', error);
                });
        } else if (windowState === 'minimized') {
            windowState = 'titleOnly';
            renderTitleOnlyCard();
        } else {
            windowState = 'maximized';
            cardContainer.style.height = originalHeight;
            cardContainer.innerHTML = '';
            displayScheduleData();
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

    const style = document.createElement('style');
    style.textContent = `
        #schedule-window {
            transition: height 0.3s ease, width 0.3s ease;
        }
        #schedule-window.maximized {
            height: ${originalHeight};
            width: ${originalWidth};
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        #schedule-window.minimized {
            height: auto !important;
            width: auto !important;
            padding: 5px !important;
            bottom: 5px !important; /* Ajuste a posição vertical */
            left: 10px !important;  /* Ajuste a posição horizontal */
        }
        #schedule-window.titleOnly {
            height: auto !important;
            width: auto !important;
            padding: 0 !important;
            left: 10px !important;  /* Ajuste a posição horizontal */
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', displayScheduleData);


    function insertButtonIntoSidebar() {
       
        const sidebar = document.getElementById('bar1');

        if (sidebar) {
          
            const button = document.createElement('button');
            button.textContent = 'Meu Botão';
            button.className = 'my-custom-button'; 

         
            button.addEventListener('click', function() {
              
                alert('Botão clicado!');
            });

            
            sidebar.insertBefore(button, sidebar.firstChild);
        } else {
            console.error('Elemento <aside id="bar1"> não encontrado na página.');
        }
    }

   
    document.addEventListener('DOMContentLoaded', () => {
        insertButtonIntoSidebar();
    });

})();
