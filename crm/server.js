'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const collections = ['customers', 'invoices', 'deals', 'tasks'];
const fail = message => { throw Object.assign(new Error(message), { status: 400 }); };
function validate(type, item, state) {
  const text = key => { if (typeof item[key] !== 'string' || !item[key].trim() || item[key].length > 1000) fail(`${key} is required (maximum 1000 characters).`); };
  const choice = (key, choices) => { if (!choices.includes(item[key])) fail(`Invalid ${key}.`); };
  const cents = key => { if (!Number.isSafeInteger(item[key]) || Math.abs(item[key]) > 100000000000) fail(`Invalid ${key}.`); };
  const date = key => { text(key); if (!/^\d{4}-\d{2}-\d{2}$/.test(item[key]) || new Date(item[key]).toISOString().slice(0, 10) !== item[key]) fail(`Invalid ${key}.`); };
  if (type === 'customers') {
    text('name'); text('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) fail('Enter a valid email address.');
    if (state.customers.some(c => c.id !== item.id && c.email.toLowerCase() === item.email.toLowerCase())) fail('A customer with this email already exists.');
    choice('status', ['Active', 'Lead', 'Inactive']);
  } else {
    if (!state.customers.some(c => c.id === item.customerId)) fail('Choose an existing customer.');
    if (type === 'invoices') {
      text('number'); text('description'); date('date'); date('due');
      for (const key of ['total', 'balance', 'amountDue', 'paid']) cents(key);
      if (item.amountDue < 0 || item.paid < 0 || item.paid > item.amountDue || item.total + item.balance !== item.amountDue) fail('Invoice total + balance must equal amount due; payment must be between zero and amount due.');
      if (state.invoices.some(i => i.id !== item.id && i.number === item.number)) fail('Invoice number must be unique.');
    } else if (type === 'deals') {
      text('title'); cents('value'); if (item.value < 0) fail('Deal value cannot be negative.');
      choice('stage', ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost']); date('closeDate');
    } else { text('title'); date('due'); choice('priority', ['Low', 'Medium', 'High']); if (typeof item.done !== 'boolean') fail('Invalid task status.'); }
  }
  if (item.notes !== undefined && (typeof item.notes !== 'string' || item.notes.length > 10000)) fail('Notes must be text, up to 10000 characters.');
}
function createServer(dataDir = process.env.CRM_DATA_DIR || path.join(root, 'data')) {
  fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const database = path.join(dataDir, 'database.json');
  let state = JSON.parse(fs.readFileSync(fs.existsSync(database) ? database : path.join(dataDir, 'seed.json'), 'utf8'));
  const persist = next => { fs.writeFileSync(database + '.tmp', JSON.stringify(next, null, 2), { mode: 0o600 }); fs.renameSync(database + '.tmp', database); state = next; };
  if (!fs.existsSync(database)) persist(state);
  return http.createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
    try {
      if (!/^127\.0\.0\.1:\d+$/.test(req.headers.host || '')) return send(403, { error: 'Use the 127.0.0.1 address.' });
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return send(403, { error: 'Cross-origin requests are not allowed.' });
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname === '/api/state' && req.method === 'GET') return send(200, state);
      if (url.pathname === '/api/export' && req.method === 'GET') {
        res.setHeader('Content-Disposition', 'attachment; filename="orbit-backup.json"'); return send(200, state);
      }
      if (url.pathname.startsWith('/api/')) {
        const [, , type, id] = url.pathname.split('/');
        if (!collections.includes(type)) return send(404, { error: 'Not found.' });
        if (!['POST', 'PUT', 'DELETE'].includes(req.method)) return send(405, { error: 'Method not allowed.' });
        let body = '';
        for await (const chunk of req) { body += chunk; if (body.length > 100000) return send(413, { error: 'Request too large.' }); }
        let input = {};
        if (req.method !== 'DELETE') { try { input = JSON.parse(body); } catch { fail('Invalid JSON.'); } if (!input || Array.isArray(input) || typeof input !== 'object') fail('Expected a record.'); }
        const next = structuredClone(state);
        const existing = next[type].find(item => item.id === id);
        if (req.method !== 'POST' && !existing) return send(404, { error: 'Record not found.' });
        if (req.method === 'DELETE') {
          if (existing.sourceFile) fail('Imported financial records cannot be deleted.');
          if (type === 'customers' && ['invoices', 'tasks', 'deals'].some(key => next[key].some(record => record.customerId === id))) fail('Remove linked invoices, deals and tasks before deleting this customer.');
          next[type] = next[type].filter(item => item.id !== id);
        } else {
          if (existing?.sourceFile) fail('Imported financial records are read-only to preserve source accuracy.');
          const fields = {
            customers: ['name', 'email', 'company', 'phone', 'address', 'status', 'notes'],
            invoices: ['number', 'customerId', 'description', 'date', 'due', 'total', 'balance', 'amountDue', 'paid', 'notes'],
            deals: ['title', 'customerId', 'value', 'stage', 'closeDate', 'notes'],
            tasks: ['title', 'customerId', 'due', 'priority', 'done', 'notes'],
          }[type];
          const record = { ...existing, ...Object.fromEntries(fields.filter(key => Object.hasOwn(input, key)).map(key => [key, input[key]])), id: existing?.id || crypto.randomUUID() };
          validate(type, record, next);
          if (existing) next[type][next[type].indexOf(existing)] = record; else next[type].push(record);
        }
        next.activity.unshift({ id: crypto.randomUUID(), text: `${req.method === 'DELETE' ? 'Deleted' : req.method === 'POST' ? 'Created' : 'Updated'} ${type.slice(0, -1)}: ${existing?.name || existing?.title || existing?.number || input.name || input.title || input.number}`, date: new Date().toISOString() });
        next.activity = next.activity.slice(0, 100);
        persist(next); return send(200, state);
      }
      if (req.method !== 'GET') return send(405, { error: 'Method not allowed.' });
      let file;
      if (url.pathname.startsWith('/documents/')) {
        const name = decodeURIComponent(url.pathname.slice(11));
        if (!state.documents.some(doc => doc.file === name)) return send(404, { error: 'Document not found.' });
        file = path.join(root, 'documents', path.basename(name));
      } else {
        const name = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
        if (!['index.html', 'app.js', 'styles.css'].includes(name)) return send(404, { error: 'Not found.' });
        file = path.join(root, 'public', name);
      }
      const content = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.pdf': 'application/pdf' }[path.extname(file)], 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'self'; frame-ancestors 'none'" });
      res.end(content);
    } catch (error) { send(error.status || 500, { error: error.status ? error.message : 'Unable to complete the request. Check the local server.' }); }
  });
}
if (require.main === module) createServer().listen(Number(process.env.PORT || 4310), '127.0.0.1', () => console.log(`Orbit CRM: http://127.0.0.1:${process.env.PORT || 4310}`));
module.exports = { createServer, validate };