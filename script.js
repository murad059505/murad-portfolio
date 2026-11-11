document.querySelector('#year').textContent = new Date().getFullYear();

const intro = document.querySelector('.site-intro');
intro?.addEventListener('animationend', (event) => {
  if (event.animationName === 'intro-away') intro.remove();
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  navigation.classList.toggle('is-open', !open);
});
navigation.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', (event) => { if (!event.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

const progress = document.querySelector('.scroll-progress span');
function updateProgress() {
  const available = document.documentElement.scrollHeight - innerHeight;
  progress.style.height = `${available > 0 ? (scrollY / available) * 100 : 0}%`;
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

const dialog = document.querySelector('.project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogImage = document.querySelector('#dialog-image');
function openProject(project) {
  const image = project.querySelector('.project-image img');
  dialogTitle.textContent = project.querySelector('h3').textContent;
  dialogDescription.textContent = project.querySelector('.project-copy > p:not(.project-type)').textContent;
  dialogImage.src = image.getAttribute('src');
  dialogImage.alt = image.alt;
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('.project').forEach((project) => {
  project.querySelector('.project-image').addEventListener('click', () => openProject(project));
  project.querySelector('.text-button').addEventListener('click', () => openProject(project));
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const box = dialog.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

