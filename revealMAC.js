// Função para fazer a requisição à API
function fetchVendor(macAddress, macCell) {

    const url = "https://api.macvendors.com/" + encodeURIComponent(macAddress);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            if (response.status === 200) {
                const vendor = response.responseText;

                const currentText = macAddress + " (" + vendor + ")";
                // Verifica se o texto atual é diferente do que já está no campo do MAC
                if (macCell.textContent.trim() !== currentText) {
                    // Insere a resposta da API no mesmo campo que o MAC
                    macCell.textContent = currentText;
                    return currentText;
                }
            } else {
              return 1;
            }
        }
    });
}

// Função para verificar se a tabela está presente e modificar o MAC
async function modifyTable() {

    let table = document.querySelectorAll('.ui-table-tbody')[1];
    let macRow;
    let macCell;


    if (!table) {

        await new Promise(resolve => setTimeout(resolve, 500)); // Espera 1 segundo antes de tentar novamente
        return 1;
    }else{


        macRow = table.querySelectorAll('tr')[12]; // 13ª linha
        if (!macRow) {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("1")
            return 1;
        }



        macCell = macRow.querySelectorAll('td')[2];
        if (macCell) {
            const macAddress = macCell.textContent.trim();
            console.log("2")


            //const hasVendorText = macCell.textContent.includes(fetchVendor(macAddress, macCell));
            const hasVendorText = macAddress.indexOf("(")
            if (hasVendorText !== -1) {
                console.log("1")
                return 1;
            }else{
                fetchVendor(macAddress, macCell);
                console.log("1")
                return 1;
            }
        } else {

            return 1;
        }
    }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeRepeatedly() {
  while (true) {
    modifyTable();
    await delay(500);
    console.log('teste')
  }
}

executeRepeatedly();
