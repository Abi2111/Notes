const menu_btn = document.querySelector('.menu_bar');
const navbar = document.querySelector('.navbar');
// const hero = document.querySelector('.hero');
const loader = document.querySelector('.loader_container');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 4000);
});

menu_btn.addEventListener('click', () => {
  navbar.classList.toggle('active');
});
// hero.addEventListener('click', () => {
//   navbar.classList.toggle('active');
// });
