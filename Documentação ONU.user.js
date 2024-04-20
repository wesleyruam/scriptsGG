// ==UserScript==
// @name         Documentação ONU
// @version      0.1
// @description  Extrair automaticamente os dados da ONU do gCommit.
// @author       Wesley GG
// @match        https://ggnet.gcommit.com.br/showonu/*/*/*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    function extrairDados() {
        let dadosFormatados = '';
        const url = window.location.href;

        const nameOnu = document.querySelector("#nameSpan").innerText;
        const nameOlt = document.querySelector("body > div.container-fluid > div.row > main > h2 > span:nth-child(2) > a").innerText;
        const slotOnu = document.querySelector("body > div.container-fluid > div.row > main > h2 > span:nth-child(3) > a").innerText;
        const idOnu = document.querySelector("body > div.container-fluid > div.row > main > h2 > span:nth-child(4)").innerText;
        const serialNumber = document.querySelector("#onu-detail > table:nth-child(1) > tbody > tr:nth-child(1) > td").innerText;
        const SA = document.querySelector("#onu-detail > table:nth-child(1) > tbody > tr:nth-child(5) > td > span:nth-child(2)").innerText;
        let SR;
        try {
            SR = document.querySelector("#onu-detail > table:nth-child(1) > tbody > tr:nth-child(5) > td > span:nth-child(5)").innerText;
        } catch {
            SR = "N/A"
        }
        const negociacao = document.querySelector("#onu-detail > table:nth-child(3) > tbody > tr > td:nth-child(2)").innerText;

        dadosFormatados = `[LOCALIZAÇÃO]\n- Cliente está na ${nameOlt}\n- ONU está localizada em ${nameOnu} / slot: ${slotOnu} / onu id: ${idOnu}\n- Serial Number: ${serialNumber}\n- SA: ${SA}\n- SR: ${SR}\n- Negociação em ${negociacao}\n\n`;

        if (url.includes('show-logs-onu')) {
            // Extrair dados dos alarmes

            const alarmes = document.querySelectorAll("#show-logs tbody tr");

            if (alarmes.length > 0) {
                dadosFormatados += "[ALARMES]\n"
                alarmes.forEach(alarme => {
                    const log = alarme.querySelector("td:nth-child(4)").innerText;
                    if (log.includes("Alarm")) {
                        const dataHora = alarme.querySelector("td:nth-child(1)").innerText;
                        const alarmeFormatado = log.split(" : ")[3];
                        console.log(alarmeFormatado)
                        dadosFormatados += `${alarmeFormatado} em ${dataHora}\n`;
                    }
                });
            }
        }
        GM_setClipboard(dadosFormatados);

        return dadosFormatados;
    }

    console.log(extrairDados());

})();
