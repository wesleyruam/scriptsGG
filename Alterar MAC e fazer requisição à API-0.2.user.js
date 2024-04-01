// ==UserScript==
// @name         Alterar MAC e fazer requisição à API
// @version      0.2
// @description  Altera o MAC e faz uma requisição à API ao identificar a tabela específica
// @author       Wesley GG
// @match        https://integrator6.gegnet.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @license      MIT
// @downloadURL  https://github.com/wrGGsiq/scriptsGG/raw/main/Alterar%20MAC%20e%20fazer%20requisi%C3%A7%C3%A3o%20%C3%A0%20API-0.2.user.js
// @updateURL    https://github.com/wrGGsiq/scriptsGG/raw/main/updates/Alterar%20MAC%20e%20fazer%20requisi%C3%A7%C3%A3o%20%C3%A0%20API-0.2.meta.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==



function fetchVendor(macAddress, macCell) {
    const url = "https://api.macvendors.com/" + encodeURIComponent(macAddress);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                const vendor = response.responseText;

                const currentText = macAddress + " (" + vendor + ")";
                if (macCell.textContent.trim() !== currentText) {
                    macCell.textContent = currentText;
                    return currentText;
                }
            } else {
              return 1;
            }
        }
    });
}

async function modifyTable() {

    let table = document.querySelectorAll('.ui-table-tbody')[1];
    let macRow;
    let macCell;


    if (!table) {
        return 1;
    }else{
        macRow = table.querySelectorAll('tr');
        let temp = 0;
        for (const element of macRow){
            let temp_td = 0;
            for (const tag_td of element.querySelectorAll('td')){
                let i = tag_td.textContent.trim()
                if (i.indexOf("Last-Mac") !== -1){
                    macCell = element.querySelectorAll('td')[temp_td+1];
                }
            temp_td += 1;
            }
            temp += 1;
        }
        if (macCell){
            const macAddress = macCell.textContent.trim();

            const hasVendorText = macAddress.indexOf("(")
            if (hasVendorText !== -1) {
                return 1;
            }else{
                fetchVendor(macAddress, macCell);
                return 1;
            }
        }

    }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeRepeatedly() {
  while (true) {
    modifyTable();
    await delay(100);
  }
}

executeRepeatedly();
