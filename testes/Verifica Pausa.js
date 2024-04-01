
function checkVisibility() {
  if (document.hidden) {
    console.log('A página não está visível.');
  } else {
    console.log('A página está visível.');
  }
}


function checkVisibilityPeriodically() {
  checkVisibility(); 
  setInterval(checkVisibility, 1000); 
}


checkVisibilityPeriodically();
