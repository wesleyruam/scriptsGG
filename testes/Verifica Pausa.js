// Função para verificar o estado de visibilidade da página
function checkVisibility() {
  if (document.hidden) {
    console.log('A página não está visível.');
  } else {
    console.log('A página está visível.');
  }
}

// Função para verificar a visibilidade da página em intervalos regulares
function checkVisibilityPeriodically() {
  checkVisibility(); // Verifica imediatamente
  setInterval(checkVisibility, 1000); // Verifica a cada segundo (1000 milissegundos)
}

// Chama a função para verificar a visibilidade da página em intervalos regulares
checkVisibilityPeriodically();
