'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('./server');
test('CRUD, validation, source protection, origin protection and restart persistence', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbit-test-'));
  fs.copyFileSync(path.join(__dirname, 'data/seed.json'), path.join(dir, 'seed.json'));
  let server = createServer(dir);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let base = `http://127.0.0.1:${server.address().port}`;
  const request = async (route, method = 'GET', body, headers = {}) => {
    const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
  };
  try {
    let result = await request('/api/state');
    assert.equal(result.data.invoices.reduce((n, i) => n + i.paid, 0), 10427);
    assert.equal(result.data.documents.length, 10);
    assert.equal(result.data.invoices.reduce((n, i) => n + i.amountDue - i.paid, 0), 0);
    for (const i of result.data.invoices) assert.equal(i.total + i.balance, i.amountDue);
    assert.equal((await request('/api/invoices/NVGNW3NO-0001', 'DELETE')).status, 400);
    assert.equal((await request('/api/state', 'GET', undefined, { Origin: 'https://example.com' })).status, 403);
    assert.equal((await request('/api/customers', 'POST', { name: 'Invalid', email: 'bad', status: 'Lead' })).status, 400);
    result = await request('/api/customers', 'POST', { name: 'Test Customer', email: 'test@example.com', status: 'Lead' });
    assert.equal(result.status, 200);
    const c = result.data.customers.at(-1);
    assert.equal((await request('/api/customers', 'POST', c)).status, 400);
    const invoice = { number: 'TEST-001', customerId: c.id, date: '2026-11-19', due: '2026-12-19', description: 'Test service', total: 10000, balance: -2000, amountDue: 8000, paid: 0 };
    assert.equal((await request('/api/invoices', 'POST', { ...invoice, paid: 9000 })).status, 400);
    result = await request('/api/invoices', 'POST', invoice);
    assert.equal(result.status, 200);
    const i = result.data.invoices.at(-1);
    assert.equal((await request(`/api/customers/${c.id}`, 'DELETE')).status, 400);
    result = await request(`/api/invoices/${i.id}`, 'PUT', { ...i, paid: 8000 });
    assert.equal(result.data.invoices.at(-1).paid, 8000);
    await new Promise(resolve => server.close(resolve));
    server = createServer(dir);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await request('/api/state')).data.invoices.at(-1).paid, 8000);
    assert.equal((await request(`/api/invoices/${i.id}`, 'DELETE')).status, 200);
    assert.equal((await request(`/api/customers/${c.id}`, 'DELETE')).status, 200);
    assert.equal((await request('/api/export')).data.documents.length, 10);
  } finally { await new Promise(resolve => server.close(resolve)); fs.rmSync(dir, { recursive: true, force: true }); }
});