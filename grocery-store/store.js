/* Shared storefront logic; prices are integer cents. */
(function (root) {
  'use strict';
  const products = [
    { id: 'apples', name: 'Crisp Red Apples', category: 'Produce', unit: '1 lb bag', price: 349, icon: '🍎' },
    { id: 'bananas', name: 'Golden Bananas', category: 'Produce', unit: '1 bunch', price: 199, icon: '🍌' },
    { id: 'avocado', name: 'Hass Avocados', category: 'Produce', unit: '2 pieces', price: 399, icon: '🥑' },
    { id: 'broccoli', name: 'Fresh Broccoli', category: 'Produce', unit: '1 head', price: 249, icon: '🥦' },
    { id: 'milk', name: 'Whole Milk', category: 'Dairy', unit: '1 half gallon', price: 429, icon: '🥛' },
    { id: 'cheese', name: 'Cheddar Cheese', category: 'Dairy', unit: '8 oz block', price: 459, icon: '🧀' },
    { id: 'bread', name: 'Sourdough Loaf', category: 'Bakery', unit: '1 fresh loaf', price: 549, icon: '🍞' },
    { id: 'croissant', name: 'Butter Croissants', category: 'Bakery', unit: 'Pack of 2', price: 399, icon: '🥐' },
    { id: 'rice', name: 'Long Grain Rice', category: 'Pantry', unit: '2 lb bag', price: 329, icon: '🍚' },
    { id: 'pasta', name: 'Italian Pasta', category: 'Pantry', unit: '16 oz pack', price: 229, icon: '🍝' },
    { id: 'honey', name: 'Golden Honey', category: 'Pantry', unit: '12 oz jar', price: 649, icon: '🍯' },
    { id: 'carrots', name: 'Garden Carrots', category: 'Produce', unit: '1 lb bag', price: 179, icon: '🥕' }
  ];
  function sanitizeCart(value) {
    const cart = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return cart;
    for (const product of products) {
      const quantity = value[product.id];
      if (Number.isInteger(quantity) && quantity > 0 && quantity <= 99) cart[product.id] = quantity;
    }
    return cart;
  }
  function total(cart) {
    const safe = sanitizeCart(cart);
    return products.reduce((sum, product) => sum + product.price * (safe[product.id] || 0), 0);
  }
  function filterProducts(query, category) {
    return products.filter(product => (category === 'All' || product.category === category) && product.name.toLowerCase().includes(query.trim().toLowerCase()));
  }
  const api = { products, sanitizeCart, total, filterProducts };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GroceryStore = api;
})(globalThis);