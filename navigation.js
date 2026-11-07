const header = document.querySelector('header');
const hero = document.querySelector('.hero');

function updateHeader() {
  const height = header.offsetHeight;
  document.documentElement.style.setProperty('--header-height', height + 'px');
  header.classList.toggle('scrolled', hero.getBoundingClientRect().bottom <= height);
}

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

const portraitFrame = document.querySelector('.portrait-frame');

if (portraitFrame) {
  const observer = new IntersectionObserver(([entry]) => {
    portraitFrame.classList.toggle('is-visible', entry.isIntersecting);
  });
  observer.observe(portraitFrame);
}
