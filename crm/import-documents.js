'use strict';
// One-time, local import of the ten explicitly supplied files. No network access.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = __dirname;
const entries = [
  ['NVGNW3NO-0001', '2687-7275', 8252, 0, 8252, 'Cline Pass · annual subscription', 'Annual subscription: $123.77 less $41.25 discount.'],
  ['NVGNW3NO-0003', '2002-6836', -7722, 7722, 0, 'Cline Pass · subscription credit', 'Monthly plan $10.60; unused annual time −$82.52; discount −$5.30. Credit applied to balance: $77.22. No cash payment.'],
  ['NVGNW3NO-0005', '2752-7996', 7722, -6637, 1085, 'Cline Pass · annual upgrade', 'Annual plan $123.77; unused monthly time −$5.30; discount −$41.25; balance applied −$66.37.'],
  ['T2OS92AN-0001', '2449-4835', 530, 0, 530, 'Cline Pass · monthly subscription', 'Monthly subscription $10.60 less first-month discount $5.30.'],
  ['T2OS92AN-0002', '2442-7615', 560, 0, 560, 'Credits & processing fee', 'Credits $5.00 plus processing fee $0.60.'],
];
const dataDir = path.join(root, 'data');
fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
fs.mkdirSync(path.join(root, 'documents'), { recursive: true, mode: 0o700 });
if (fs.existsSync(path.join(dataDir, 'database.json')) || fs.existsSync(path.join(dataDir, 'seed.json'))) throw new Error('Existing data found. Import stopped to avoid overwriting your records.');
const state = { customers: [{ id: 'customer-jay', name: 'Jay', email: 'jay.gohil@fibilabs.tech', company: '', phone: '', address: 'Guj\ntest\ndsjksjdk 380015\nGujarat\nIndia', status: 'Active', notes: 'Imported billing customer. Address preserved verbatim from supplied staging PDFs.' }], invoices: [], receipts: [], documents: [], deals: [], tasks: [], activity: [] };
for (const [number, receipt, total, balance, paid, description, notes] of entries) {
  const sourceFile = `Invoice-${number}.pdf`;
  state.invoices.push({ id: number, number, customerId: 'customer-jay', date: '2026-07-10', due: '2026-07-10', description, total, balance, amountDue: paid, paid, sourceFile, receiptId: receipt, notes, issuer: 'staging', currency: 'USD' });
  state.receipts.push({ id: receipt, invoiceId: number, customerId: 'customer-jay', date: '2026-07-10', amount: paid, method: paid ? 'Visa · 1111' : 'Balance credit · no cash payment', sourceFile: `Receipt-${receipt}.pdf` });
  for (const file of [sourceFile, `Receipt-${receipt}.pdf`]) {
    const source = path.join('/Users/jaygohil/Downloads', file);
    const text = execFileSync('osascript', ['-l', 'JavaScript', '-e', 'ObjC.import("PDFKit"); ObjC.import("Foundation"); function run(args) { return ObjC.unwrap($.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(args[0])).string); }', source], { encoding: 'utf8' });
    if (!text.includes(number) || !text.includes('staging')) throw new Error(`Unexpected document: ${file}`);
    fs.copyFileSync(source, path.join(root, 'documents', file));
    fs.chmodSync(path.join(root, 'documents', file), 0o600);
    state.documents.push({ id: file, file, type: file.startsWith('Invoice') ? 'Invoice' : 'Receipt', invoiceId: number, date: '2026-07-10', text });
  }
}
state.activity.push({ id: 'import', text: 'Imported 5 invoices and matched 5 receipts from your PDFs.', date: new Date().toISOString() });
fs.writeFileSync(path.join(dataDir, 'seed.json'), JSON.stringify(state, null, 2), { mode: 0o600 });
console.log('Imported 10 documents, 5 reconciled invoices, 1 customer. Cash receipts: $104.27 USD.');