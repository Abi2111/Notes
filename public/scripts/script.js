const menu_btn = document.querySelector('.menu_bar');
const navlinks = document.querySelector('.nav_main');
const hero = document.querySelector('.hero');
const loader = document.querySelector('.loader_container');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 4000);
});

menu_btn.addEventListener('click', () => {
  navlinks.classList.toggle('active');
});
hero.addEventListener('click', () => {
  navlinks.classList.toggle('active');
});
