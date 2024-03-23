console.log(3)

function fetchVendor(macAddress, macCell) {
    const url = "https://api.macvendors.com/" + encodeURIComponent(macAddress);
    fetch(url, {
        mode: 'no-cors' // Define o modo 'no-cors'
    })
    .then(response => {
        // A resposta não estará disponível para leitura devido ao modo 'no-cors'
        // Verificamos apenas se a solicitação foi feita com sucesso
        if (response.ok) {
            const currentText = macAddress + " (Unknown)"; // Como não podemos acessar a resposta, definimos como "Unknown"
            // Verifica se o texto atual é diferente do que já está no campo do MAC
            if (macCell.textContent.trim() !== currentText) {
                // Insere a resposta da API no mesmo campo que o MAC
                macCell.textContent = currentText;
            }
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}



// Função para verificar se a tabela está presente e modificar o MAC
function modifyTable() {
    let table = document.querySelectorAll('.ui-table-tbody')[1];
    let macRow;
    let macCell;

    if (!table) {
        console.log("Table not found. Retrying...");
        return;
    }

    macRow = table.querySelectorAll('tr')[12]; // 13ª linha
    if (!macRow) {
        console.log("MAC row not found. Retrying...");
        return;
    }

    macCell = macRow.querySelectorAll('td')[2];
    if (macCell) {
        const macAddress = macCell.textContent.trim();
        // Verifica se já foi adicionado o nome do fornecedor
        if (!macAddress.includes("(")) {
            fetchVendor(macAddress, macCell);
        }
    }
}

// Função para executar a modificação repetidamente
function executeRepeatedly() {
    setInterval(modifyTable, 1000); // Executar a cada segundo
}

// Executa a função principal
executeRepeatedly();
