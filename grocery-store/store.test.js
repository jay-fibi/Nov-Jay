'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { products, sanitizeCart, total, filterProducts } = require('./store.js');

test('catalog has unique IDs and positive integer prices', () => {
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  assert.ok(products.every(product => Number.isInteger(product.price) && product.price > 0));
});
test('search is case insensitive and trims whitespace', () => {
  assert.equal(filterProducts('  APPLES ', 'All')[0].id, 'apples');
});
test('search and category filters are combined', () => {
  assert.equal(filterProducts('milk', 'Produce').length, 0);
  assert.equal(filterProducts('', 'Dairy').length, 2);
  assert.equal(filterProducts('not a product', 'All').length, 0);
});
test('total uses cents and accounts for quantities', () => {
  assert.equal(total({ apples: 2, milk: 1 }), 1127);
  assert.equal(total({}), 0);
});
test('stored carts reject unknown products and invalid quantities', () => {
  assert.deepEqual(sanitizeCart({ apples: 2, bananas: -1, milk: '3', rice: 1.5, honey: 100, unknown: 4 }), { apples: 2 });
  for (const value of [null, [], 'invalid', 1]) assert.deepEqual(sanitizeCart(value), {});
  assert.deepEqual(sanitizeCart({ apples: 99 }), { apples: 99 });
});