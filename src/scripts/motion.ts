/** Presentation only: never changes products, filters, focus, cart data or checkout. */
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const targets = Array.from(document.querySelectorAll<HTMLElement>(
  '.story-image, .story-copy, #favorites .product-card, .bestsellers .heading-row, .bestsellers .product-card, .values-grid article, .gallery figure, .visit-section > *, .menu-section .product-card',
));
const seen = new WeakSet<Element>();
targets.forEach(target => {
  const siblings = Array.from(target.parentElement?.children ?? []);
  target.style.setProperty('--motion-delay', `${Math.min(siblings.indexOf(target) % 4, 3) * 70}ms`);
});
let reveals: IntersectionObserver | undefined;
if ('IntersectionObserver' in window) {
  reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || preference.matches || seen.has(entry.target)) continue;
      seen.add(entry.target);
      entry.target.classList.add('motion-enter');
      reveals?.unobserve(entry.target);
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  if (!preference.matches) targets.forEach(target => reveals?.observe(target));

  const header = document.querySelector('.site-header');
  if (header) {
    const sentinel = document.createElement('span');
    sentinel.className = 'motion-nav-sentinel'; sentinel.setAttribute('aria-hidden', 'true');
    header.after(sentinel);
    const navigation = new IntersectionObserver(([entry]) => header.classList.toggle('is-scrolled', !entry?.isIntersecting));
    navigation.observe(sentinel);
  }
}
document.addEventListener('animationend', event => {
  if (event.animationName === 'kf-reveal' && event.target instanceof Element) event.target.classList.remove('motion-enter');
  if (event.animationName === 'kf-count') document.querySelectorAll('.cart-updated').forEach(target => target.classList.remove('cart-updated'));
});
// Filtering can cancel an entrance before animationend; never replay it on return.
document.addEventListener('animationcancel', event => {
  if (event.animationName === 'kf-reveal' && event.target instanceof Element) event.target.classList.remove('motion-enter');
});
document.addEventListener('focusin', event => {
  // Do not move a pointer's target between pointerdown and pointerup.
  if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
  event.target.closest('.motion-enter')?.classList.remove('motion-enter');
  event.target.closest('.hero-buttons')?.getAnimations().forEach(animation => animation.finish());
});
function settle() {
  document.querySelectorAll('.motion-enter,.cart-updated').forEach(target => target.classList.remove('motion-enter', 'cart-updated'));
  document.getAnimations?.().filter(animation => 'animationName' in animation && String(animation.animationName).startsWith('kf-')).forEach(animation => animation.finish());
}
preference.addEventListener('change', () => {
  if (preference.matches) { reveals?.disconnect(); targets.forEach(target => seen.add(target)); settle(); }
});
window.addEventListener('pageshow', event => { if (event.persisted) settle(); });
const count = document.querySelector('.cart-count');
if (count && 'MutationObserver' in window) {
  let previous = Number(count.textContent);
  new MutationObserver(() => {
    const current = Number(count.textContent);
    if (current > previous && !preference.matches) document.querySelectorAll('.cart-trigger').forEach(target => target.classList.add('cart-updated'));
    previous = current;
  }).observe(count, { childList: true, characterData: true, subtree: true });
}
