// ==UserScript==
// @name         Quantidade de ligações
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Wesley GG
// @match        http://qm.coger.net.br:8080/queuemetrics/qm_agentpage2_load.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gegnet.com.br
// @grant        none
// ==/UserScript==




// Função para verificar periodicamente se os elementos estão presentes na página
function waitForElements() {
    let chamadas = document.getElementsByClassName("GMTE43CCCT");
    let title = document.getElementsByClassName("GMTE43CCBD")[7];

    // Verifica se ambos os elementos estão presentes
    if (chamadas.length > 0 && title) {
        let title_text = title.textContent.trim();
        const currentText = title_text + " | Quantidade de chamadas:" + chamadas.length;
        title.textContent = currentText;
    } else {
        // Se os elementos não estiverem presentes, espera mais um pouco e verifica novamente
        setTimeout(waitForElements, 500); // Tenta novamente após 500 milissegundos
    }
}

// Inicia o processo de verificação
waitForElements();

