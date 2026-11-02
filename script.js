const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
menu?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
