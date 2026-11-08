// Текущий год в футере обновляется автоматически.
document.querySelector('#year').textContent = new Date().getFullYear();

// После завершения заставки удаляем её из документа.
const siteIntro = document.querySelector('.site-intro');
siteIntro.addEventListener('animationend', (event) => {
  if (event.animationName === 'intro-screen') siteIntro.remove();
});

// Мобильное меню. Без JavaScript ссылки остаются доступными.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobileScreen = window.matchMedia('(max-width: 480px)');

function closeMenu(returnFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  navigation.classList.remove('is-open');
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation.classList.toggle('is-open', !isOpen);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
mobileScreen.addEventListener('change', () => closeMenu());
document.documentElement.classList.add('menu-ready');

// Ненавязчивое однократное появление блоков при прокрутке.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('will-reveal');
    observer.observe(element);
  });
}

// Превью берёт название, описание и изображение прямо из карточки.
// Для настоящего проекта кнопку можно заменить ссылкой: см. README.md.
const dialog = document.querySelector('.project-dialog');
document.querySelectorAll('button.project-preview').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    const image = button.querySelector('img');
    document.querySelector('#dialog-title').textContent = card.querySelector('h3').textContent;
    document.querySelector('#dialog-description').textContent = card.querySelector('p').textContent;
    const previewImage = document.querySelector('#dialog-image');
    previewImage.src = image.getAttribute('src');
    previewImage.alt = image.alt;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
