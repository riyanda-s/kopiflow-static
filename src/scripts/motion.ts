/** Presentation only: never changes products, filters, focus, cart data or checkout. */
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const targets = Array.from(document.querySelectorAll<HTMLElement>(
  '.story-image, .story-copy, #favorites .product-card, .bestsellers .heading-row, .bestsellers .product-card, .values-grid article, .gallery figure, .visit-section > *, .menu-section .product-card',
));
type Phase = 'armed' | 'running' | 'settled';
const phases = new Map<Element, Phase>(targets.map(target => [target, 'armed']));
const hidden = (target: Element) => !!target.closest('[hidden]') || target.getClientRects().length === 0;
const outside = (target: Element) => {
  const rect = target.getBoundingClientRect();
  return rect.bottom < -64 || rect.top > innerHeight + 64;
};
const settleTarget = (target: Element, phase: Phase = 'settled') => {
  phases.set(target, phase);
  target.classList.remove('motion-enter');
};
targets.forEach(target => {
  const siblings = Array.from(target.parentElement?.children ?? []);
  target.style.setProperty('--motion-delay', `${Math.min(siblings.indexOf(target) % 4, 3) * 120}ms`);
});
let reveals: IntersectionObserver | undefined;
let exits: IntersectionObserver | undefined;
function observe() {
  if (preference.matches) return;
  targets.forEach(target => { exits?.observe(target); reveals?.observe(target); });
}
if ('IntersectionObserver' in window) {
  // A generous outer boundary provides hysteresis. Threshold crossings inside
  // the viewport never re-arm a settled element; transforms are only 12px.
  exits = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting && !hidden(target) && outside(target)) settleTarget(target, 'armed');
    }
  }, { rootMargin: '64px 0px', threshold: 0 });
  reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target;
      if (preference.matches || hidden(target) || !entry.isIntersecting || entry.intersectionRatio < .08 || phases.get(target) !== 'armed') continue;
      // Never move a control already being used by keyboard or pointer.
      if (target.contains(document.activeElement) || (matchMedia('(hover: hover)').matches && target.matches(':hover'))) {
        settleTarget(target); continue;
      }
      phases.set(target, 'running');
      target.classList.add('motion-enter');
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  observe();

  // Filtering is not a scroll exit. Cancel hidden cards and suppress their
  // return until they subsequently leave the viewport by a real scroll.
  const catalogue = document.querySelector('.menu-section');
  if (catalogue) new MutationObserver(records => {
    for (const record of records) {
      if (record.target instanceof Element && phases.has(record.target)) settleTarget(record.target);
    }
  }).observe(catalogue, { subtree: true, attributes: true, attributeFilter: ['hidden'] });

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
  if (event.animationName === 'kf-reveal' && event.target instanceof Element) settleTarget(event.target, phases.get(event.target) === 'armed' ? 'armed' : 'settled');
  if (event.animationName === 'kf-count') document.querySelectorAll('.cart-updated').forEach(target => target.classList.remove('cart-updated'));
});
// Cancellation and completion settle the current entry without re-arming it.
document.addEventListener('animationcancel', event => {
  if (event.animationName === 'kf-reveal' && event.target instanceof Element) settleTarget(event.target, phases.get(event.target) === 'armed' ? 'armed' : 'settled');
});
document.addEventListener('focusin', event => {
  // Do not move a pointer's target between pointerdown and pointerup.
  if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
  const target = event.target.closest('.motion-enter');
  if (target) settleTarget(target);
  event.target.closest('.hero-buttons')?.getAnimations().forEach(animation => animation.finish());
});
function settle() {
  targets.forEach(target => settleTarget(target));
  document.querySelectorAll('.motion-enter,.cart-updated').forEach(target => target.classList.remove('motion-enter', 'cart-updated'));
  document.getAnimations?.().filter(animation => 'animationName' in animation && String(animation.animationName).startsWith('kf-')).forEach(animation => animation.finish());
}
preference.addEventListener('change', () => {
  reveals?.disconnect(); exits?.disconnect(); settle();
  if (!preference.matches) {
    targets.forEach(target => { if (!hidden(target) && outside(target)) phases.set(target, 'armed'); });
    observe();
  }
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  settle();
  // Restored visible content stays still; offscreen content can enter normally.
  if (!preference.matches) targets.forEach(target => {
    if (!hidden(target) && outside(target)) phases.set(target, 'armed');
  });
});
const count = document.querySelector('.cart-count');
if (count && 'MutationObserver' in window) {
  let previous = Number(count.textContent);
  new MutationObserver(() => {
    const current = Number(count.textContent);
    if (current > previous && !preference.matches) document.querySelectorAll('.cart-trigger').forEach(target => target.classList.add('cart-updated'));
    previous = current;
  }).observe(count, { childList: true, characterData: true, subtree: true });
}
