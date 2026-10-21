import { business } from '../config/business';
import { menu } from '../data/menu';
import { CART_KEY, addItem, restoreCart, total, rupiah, unitPrice, productFor, describeItem, type CartItem } from '../utils/cart';
import { launchCheckout, canCheckout } from '../utils/checkout';

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const productDialog = $<HTMLDialogElement>('#product-modal');
const cartDialog = $<HTMLDialogElement>('#cart-drawer');
let cart: CartItem[] = [];
let selection: CartItem | null = null;
let storageAvailable = true;
try { cart = restoreCart(localStorage.getItem(CART_KEY)); } catch { storageAvailable = false; }
let toastTimer: ReturnType<typeof setTimeout>;
function announce(message: string) { const el = $('#announcement'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200); }
function make<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = '') { const el = document.createElement(tag); el.textContent = text; el.className = className; return el; }
function save() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { storageAvailable = false; }
  renderCart();
  if (!storageAvailable) announce('Keranjang Anda is available for this page session. Browser storage is unavailable.');
}
function renderCart() {
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = String(cart.reduce((sum, i) => sum + i.quantity, 0)); });
  const host = $('#cart-items'); host.replaceChildren();
  $('#cart-filled').hidden = cart.length === 0;
  if (!cart.length) { const empty = make('div', '', 'empty-state'); empty.append(make('h3', 'Keranjang masih kosong.'), make('p', 'Pilih minuman atau makanan favorit Anda dari menu.')); const link = make('a', 'Lihat menu →', 'text-link'); link.href = '/menu/'; empty.append(link); host.append(empty); }
  cart.forEach((item, index) => {
    const p = productFor(item); const row = make('article', '', 'cart-row');
    const image = make('img'); image.src = p.image; image.alt = p.name; image.width = 80; image.height = 80;
    const info = make('div', '', 'cart-item-info'); info.append(make('h3', p.name), make('p', describeItem(item)), make('strong', rupiah(unitPrice(item) * item.quantity)));
    const controls = make('div', '', 'cart-row-controls');
    const stepper = make('div', '', 'quantity-control');
    for (const delta of [-1, 1]) { const button = make('button', delta === 1 ? '+' : '−'); button.type = 'button'; button.dataset.delta = String(delta); button.setAttribute('aria-label', `${delta === 1 ? 'Tambah' : 'Kurangi'} jumlah ${p.name}`); button.disabled = delta === -1 ? item.quantity === 1 : item.quantity === 99; button.addEventListener('click', () => { item.quantity += delta; save(); cartDialog.querySelector<HTMLButtonElement>(`[data-row="${index}"] [data-delta="${delta}"]`)?.focus(); }); stepper.append(button); if (delta === -1) stepper.append(make('span', String(item.quantity))); }
    controls.dataset.row = String(index);
    const remove = make('button', 'Hapus', 'quiet-button'); remove.setAttribute('aria-label', `Hapus ${p.name}`); remove.addEventListener('click', () => { cart.splice(index, 1); save(); cartDialog.querySelector<HTMLButtonElement>('[data-close]')?.focus(); });
    controls.append(stepper, remove); info.append(controls); row.append(image, info); host.append(row);
  });
  $('#cart-total').textContent = rupiah(total(cart));
  $('#checkout-status').textContent = '';
  $('#checkout-fallback').hidden = true;
}
function updateSelection() {
  if (!selection) return;
  const data = new FormData($<HTMLFormElement>('#product-form'));
  const p = productFor(selection);
  selection.variants = Object.fromEntries(p.variants.map(g => [g.id, String(data.get(g.id))]));
  selection.addons = data.getAll('addon').map(String);
  $('#product-price').textContent = rupiah(unitPrice(selection) * selection.quantity);
  $('#product-quantity').textContent = String(selection.quantity);
}
function openProduct(id: string) {
  const p = menu.find(p => p.id === id && p.available); if (!p) return;
  selection = { productId: p.id, variants: Object.fromEntries(p.variants.map(g => [g.id, g.options[0]!.id])), addons: [], quantity: 1 };
  $('#product-title').textContent = p.name; $('#product-category').textContent = p.category; $('#product-description').textContent = p.description; $('#product-error').textContent = '';
  const photo = $<HTMLImageElement>('#modal-photo'); photo.src = p.image; photo.alt = p.imageAlt;
  const options = $('#product-options'); options.replaceChildren();
  p.variants.forEach(group => {
    const fieldset = make('fieldset'); fieldset.append(make('legend', group.label));
    const row = make('div', '', 'option-row');
    group.options.forEach((option, i) => { const label = make('label', '', 'option-label'); const input = make('input'); input.type = 'radio'; input.name = group.id; input.value = option.id; input.checked = i === 0; input.required = true; label.append(input, make('span', `${option.label}${option.price ? ` +${rupiah(option.price)}` : ''}`)); row.append(label); }); fieldset.append(row); options.append(fieldset);
  });
  if (p.addons.length) {
    const fieldset = make('fieldset'); fieldset.append(make('legend', 'Tambahan (opsional)'));
    p.addons.forEach(option => { const label = make('label', '', 'addon-label'); const input = make('input'); input.type = 'checkbox'; input.name = 'addon'; input.value = option.id; label.append(input, make('span', option.label), make('span', `+${rupiah(option.price)}`)); fieldset.append(label); }); options.append(fieldset);
  }
  updateSelection(); productDialog.showModal();
}
document.querySelectorAll<HTMLButtonElement>('[data-product]').forEach(button => button.addEventListener('click', () => openProduct(button.dataset.product!)));
document.querySelectorAll('.cart-trigger').forEach(button => button.addEventListener('click', () => { renderCart(); cartDialog.showModal(); }));
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
});
$('#product-form').addEventListener('change', updateSelection);
document.querySelectorAll<HTMLButtonElement>('[data-quantity]').forEach(button => button.addEventListener('click', () => { if (selection) { selection.quantity = Math.max(1, Math.min(99, selection.quantity + Number(button.dataset.quantity))); updateSelection(); } }));
$('#product-form').addEventListener('submit', event => {
  event.preventDefault(); if (!selection) return;
  try { updateSelection(); cart = addItem(cart, selection); save(); productDialog.close(); announce(`${productFor(selection).name} ditambahkan ke keranjang.`); } catch (error) { $('#product-error').textContent = error instanceof Error ? error.message : 'Produk belum dapat ditambahkan.'; }
});
$('#clear-cart').addEventListener('click', () => { cart = []; save(); cartDialog.querySelector<HTMLButtonElement>('[data-close]')?.focus(); });
$('#checkout').addEventListener('click', () => {
  if (!canCheckout(business)) return;
  try {
    const url = launchCheckout(business, cart, $<HTMLTextAreaElement>('#customer-notes').value, window);
    const fallback = $<HTMLAnchorElement>('#checkout-fallback'); fallback.href = url; fallback.hidden = false;
    $('#checkout-status').textContent = 'Send the message in WhatsApp and wait for shop confirmation. Keranjang Anda has been kept. If the tab did not open, use the link below.';
  } catch (error) { $('#checkout-status').textContent = error instanceof Error ? error.message : 'Pesan pemesanan belum dapat disiapkan.'; }
});
window.addEventListener('storage', event => { if (event.key === CART_KEY || event.key === null) { cart = restoreCart(event.newValue); renderCart(); } });
const search = $<HTMLInputElement>('#menu-search');
let activeCategory = 'Semua';
function filterMenu() {
  const query = search.value.trim().toLowerCase(); let count = 0;
  document.querySelectorAll<HTMLElement>('[data-product-card]').forEach(card => { const show = (activeCategory === 'Semua' || card.dataset.category === activeCategory) && card.dataset.search!.includes(query); card.hidden = !show; if (show) count++; });
  $('#result-count').textContent = String(count); $('#no-results').hidden = count !== 0; $('#filter-status').textContent = `${count} produk ditemukan.`;
}
if (search) {
  search.addEventListener('input', filterMenu);
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.filter!; document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); filterMenu(); }));
  $('#reset-filters').addEventListener('click', () => { search.value = ''; activeCategory = 'Semua'; document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'Semua'))); filterMenu(); search.focus(); });
}
$('#nav-toggle').addEventListener('click', () => { const toggle = $('#nav-toggle'); const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Tutup navigasi' : 'Buka navigasi'); $('#main-nav').classList.toggle('open', open); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { $('#main-nav').classList.remove('open'); $('#nav-toggle').setAttribute('aria-expanded', 'false'); $('#nav-toggle').setAttribute('aria-label', 'Buka navigasi'); } });
document.querySelector('#print-qr')?.addEventListener('click', () => window.print());
renderCart();
