'use strict';
const { products, sanitizeCart, total, filterProducts } = globalThis.GroceryStore;
const storageKey = 'fresh-basket-cart-v1';
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const element = id => document.getElementById(id);
let cart = {};
let category = 'All';
try { cart = sanitizeCart(JSON.parse(localStorage.getItem(storageKey))); }
catch { element('status').textContent = 'Saved basket unavailable. You can still shop in this tab.'; }

function saveCart(message) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    element('status').textContent = message;
  } catch {
    element('status').textContent = `${message} Your basket cannot be saved on this device.`;
  }
  renderCart();
}

function renderProducts() {
  const matches = filterProducts(element('search').value, category);
  element('result-count').textContent = `${matches.length} fresh finds`;
  element('products').innerHTML = matches.map(product => `
    <article class="product"><div class="product-art" aria-hidden="true">${product.icon}</div>
    <h3>${product.name}</h3><p class="muted">${product.unit}</p>
    <div class="product-bottom"><strong>${money(product.price)}</strong><button class="add" data-add="${product.id}" aria-label="Add ${product.name} to basket">+ Add</button></div></article>
  `).join('') || '<p class="empty">No products found. Try another search or category.</p>';
}

function renderCart() {
  const selected = products.filter(product => cart[product.id]);
  element('cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  element('cart-items').innerHTML = selected.map(product => `
    <div class="cart-item"><div class="cart-item-top"><strong>${product.icon} ${product.name}</strong><span>${money(product.price * cart[product.id])}</span></div>
    <div class="quantity"><button data-id="${product.id}" data-change="-1" aria-label="Decrease ${product.name}">−</button><span>${cart[product.id]}</span><button data-id="${product.id}" data-change="1" aria-label="Increase ${product.name}" ${cart[product.id] >= 99 ? 'disabled' : ''}>+</button><button class="remove" data-id="${product.id}" data-change="remove" aria-label="Remove ${product.name}">Remove</button></div></div>
  `).join('') || '<p class="empty">Your basket is waiting for something fresh. Add a favorite to get started.</p>';
  element('cart-total').textContent = money(total(cart));
  element('checkout').disabled = selected.length === 0;
  element('clear-cart').disabled = selected.length === 0;
}

element('categories').innerHTML = ['All', ...new Set(products.map(product => product.category))].map(name => `<button aria-pressed="${name === category}" data-category="${name}">${name}</button>`).join('');
element('categories').addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  category = button.dataset.category;
  for (const item of element('categories').querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
  renderProducts();
});
element('search').addEventListener('input', renderProducts);
element('products').addEventListener('click', event => {
  const button = event.target.closest('button[data-add]');
  if (!button) return;
  const product = products.find(item => item.id === button.dataset.add);
  if ((cart[product.id] || 0) >= 99) {
    element('status').textContent = 'Maximum quantity is 99 per product.';
    return;
  }
  cart[product.id] = (cart[product.id] || 0) + 1;
  saveCart(`${product.name} added to your basket.`);
});
element('cart-items').addEventListener('click', event => {
  const button = event.target.closest('button[data-change]');
  if (!button) return;
  const { id, change } = button.dataset;
  if (change === 'remove') delete cart[id];
  else {
    cart[id] = Math.min(99, cart[id] + Number(change));
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart('Basket updated.');
});
element('clear-cart').addEventListener('click', () => { cart = {}; saveCart('Basket cleared.'); });
element('checkout').addEventListener('click', () => {
  if (!Object.keys(cart).length) return;
  const amount = money(total(cart));
  cart = {};
  saveCart(`Thank you! Your demo order of ${amount} is complete. No payment was taken and no delivery will be made.`);
});
renderProducts();
renderCart();