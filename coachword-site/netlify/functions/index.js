document.getElementById("year").textContent = new Date().getFullYear();

const interlinkLink = document.querySelector('.interlink-link');
const interlinkModal = document.getElementById('interlinkModal');
const closeBtn = document.getElementById('closeInterlink');

interlinkLink.addEventListener('click', () => {
  interlinkModal.style.display = "flex";
});

closeBtn.addEventListener('click', () => {
  interlinkModal.style.display = "none";
});

interlinkModal.addEventListener('click', (e) => {
  if(e.target === interlinkModal){
    interlinkModal.style.display = "none";
  }
});
