// ==UserScript==
// @name         Mostra agendados NOC e SZ no ISP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mostra agendados NOC e SZ no ISP
// @author       alecx/Wesley
// @match        https://integrator6.gegnet.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=net.br
// @downloadURL  https://github.com/wrGGsiq/scriptsGG/raw/main/agendados_no_integrator.user.js
// @updateURL    https://github.com/wrGGsiq/scriptsGG/raw/main/agendados_no_integrator.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const urls = [{
            url: 'https://noc-ferramentas.gegnet.com.br/json_noc.php',
            key: 'dataHora_noc',
            protocol: 'protocolo_noc',
            user: 'nome_usuario',
            title: 'NOC-Suporte'
        },
        {
            url: 'https://noc-ferramentas.gegnet.com.br/json.php',
            key: 'dataHora',
            protocol: 'protocolo',
            user: 'usuario',
            title: 'SZ.CHAT'
        }
    ];

    const originalWidth = '600px';
    const originalHeight = 'auto';

    let cardContainer, titleBar, windowState = 'maximized';

    async function fetchScheduleData() {
        return Promise.all(urls.map(({ url }) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'json',
                onload: function (response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error('Erro ao obter os dados de agendamento'));
                    }
                },
                onerror: function (error) {
                    reject(new Error('Erro na requisição HTTP: ' + error.statusText));
                }
            });

        })));
    }

    function sortScheduleData(data, key) {
        return data.sort((a, b) => new Date(a[key]) - new Date(b[key]));
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
        const intervalId = setInterval(() => {
            try {
                const fontAwesomeLink = document.createElement('link');
                fontAwesomeLink.rel = 'stylesheet';
                fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
                document.head.appendChild(fontAwesomeLink);

                cardContainer = document.createElement('div');
                cardContainer.id = 'schedule-window';
                cardContainer.classList.add('maximized');
                cardContainer.style.zIndex = '9999';
                cardContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
                titleBar.style.cursor = 'pointer';
                titleBar.style.transition = 'background-color 0.3s ease';

                const icon = document.createElement('i');
                icon.className = 'fas fa-calendar-alt';
                icon.style.fontSize = '24px';

                titleBar.appendChild(icon);

                cardContainer.appendChild(titleBar);

                const contentContainer = document.createElement('div');
                contentContainer.style.display = 'flex';
                contentContainer.style.justifyContent = 'space-between';

                data.forEach((scheduleData, index) => {
                    const { key, protocol, user, title } = urls[index];
                    const sortedData = sortScheduleData(scheduleData, key);
                    const column = document.createElement('div');
                    column.style.flex = '1';
                    column.style.padding = '10px';

                    const sectionTitle = document.createElement('h3');
                    sectionTitle.textContent = title;
                    sectionTitle.style.fontSize = '14px';
                    sectionTitle.style.margin = '0 0 10px 0';
                    sectionTitle.style.color = 'black';
                    column.appendChild(sectionTitle);

                    const scheduleList = createScheduleList(sortedData, key, protocol, user);
                    column.appendChild(scheduleList);

                    contentContainer.appendChild(column);
                });

                const bar = document.querySelector("#bar1");
                const dropdownDiv = document.createElement('div');
                dropdownDiv.setAttribute('_ngcontent-c4', '');
                dropdownDiv.classList.add('dropdown', 'ng-star-inserted');
                dropdownDiv.setAttribute('role', 'presentation');

                const innerDiv = document.createElement('div');
                innerDiv.setAttribute('_ngcontent-c4', '');
                innerDiv.setAttribute('aria-expanded', 'true');
                innerDiv.setAttribute('aria-haspopup', 'true');
                innerDiv.classList.add('item', 'dropdown-toggle');
                innerDiv.setAttribute('data-toggle', 'dropdown');
                innerDiv.setAttribute('type', 'button');

                const bodyDiv = document.createElement('div');
                bodyDiv.setAttribute('_ngcontent-c4', '');
                bodyDiv.setAttribute('data-placement', 'right');
                bodyDiv.setAttribute('title', 'Agendados');

                const titleIcon = document.createElement('strong');
                titleIcon.setAttribute('_ngcontent-c4', '');
                titleIcon.setAttribute('class', 'titulo');
                titleIcon.textContent = "Agendados";

                const content = document.createElement('div');
                content.setAttribute('_ngcontent-c4', '');
                content.classList.add('dropdown-menu', 'dropdown-menu-side');
                content.style.zIndex = "999999";
                content.style.width = originalWidth;
                content.style.height = originalHeight;
                content.style.border = '1px solid #ccc';
                content.style.borderRadius = '10px';
                content.appendChild(contentContainer);

                const spanicon = document.createElement('span');
                spanicon.style.fontSize = '24px';
                spanicon.setAttribute('_ngcontent-c4', '');
                spanicon.classList.add('fas', 'fa-calendar-alt');

                bodyDiv.appendChild(spanicon);
                bodyDiv.appendChild(titleIcon);

                innerDiv.appendChild(bodyDiv);
                dropdownDiv.appendChild(content);
                dropdownDiv.appendChild(innerDiv);

                bar.appendChild(dropdownDiv);

                setTimeout(() => {
                    cardContainer.style.height = originalHeight;
                }, 1000);
                clearInterval(intervalId);
            } catch {}

        }, 1000);

    }

    async function displayScheduleData() {
        try {
            const data = await fetchScheduleData();
            console.log(data);
            renderMaximizedCard(data);
        } catch (error) {
            console.error('Erro ao exibir dados de agendamento:', error);
        }
    }

    window.addEventListener('load', displayScheduleData);

})();
