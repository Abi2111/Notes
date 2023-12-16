const menu_btn = document.querySelector('.menu_bar');
const navlinks = document.querySelector('.nav_main');
const hero = document.querySelector('.hero');
menu_btn.addEventListener('click', () => {
  navlinks.classList.toggle('active');
});
hero.addEventListener('click', () => {
  navlinks.classList.toggle('active');
});
