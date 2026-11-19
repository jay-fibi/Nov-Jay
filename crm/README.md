# Orbit CRM

A dark-themed, single-user local CRM. Built with plain HTML/CSS/JavaScript and Node.js standard libraries, matching the repository's dependency-free application pattern.

## Start

```sh
node /Users/jaygohil/Desktop/19Nov-JB/crm/server.js
open http://127.0.0.1:4310
```

Node.js 22 recommended. No install or build step is required for the application. The server only listens on loopback. Use the exact `127.0.0.1` URL, not `localhost`. Set `PORT` to change the port.

## Features

- Dashboard with cash collected, outstanding balances, customer counts, activity, and invoice reconciliation.
- Customer creation, editing, deletion, notes, status, and search.
- Manual invoice creation/editing, balance adjustments, recording cash paid, and computed overdue/paid status.
- Original imported invoices are read-only, with linked receipt and PDF access.
- Five-stage deal board with editable values, close dates, notes, and stage changes.
- Customer-linked tasks with priorities, due dates, notes, and completion tracking.
- Search/filter controls, responsive layouts, accessible native forms/dialogs, full JSON backup export.
- Atomic disk persistence; restarting the app does not reset records. Customer deletion is blocked while linked records exist.

## Imported source data

The ten supplied PDFs contain one billing customer, five invoices, and five matching receipts. They are **staging/sandbox documents**, not verified production transactions. Recorded cash paid is **$104.27 USD**, net invoice total **$93.42**, net applied balance adjustment **$10.85**, and outstanding balance **$0.00**. Invoice NVGNW3NO-0003 is a negative $77.22 credit with no cash payment. The application does not count receipts a second time as revenue.

PDFs and extracted text remain on this device. Original PDFs are stored under `/Users/jaygohil/Desktop/19Nov-JB/crm/documents`; seed and live database are under `/Users/jaygohil/Desktop/19Nov-JB/crm/data`. Both directories are gitignored because they contain personal data. Back up both directories; JSON export alone does not include PDF binaries. To restore a JSON export, stop the server, back up the existing database, and replace `/Users/jaygohil/Desktop/19Nov-JB/crm/data/database.json` with the exported JSON.

The one-time importer `/Users/jaygohil/Desktop/19Nov-JB/crm/import-documents.js` uses macOS PDFKit through JXA and reads only the ten explicitly named files from Downloads. It refuses to overwrite an existing seed/database. Import mappings were reviewed against the extracted PDF text; this is not a general-purpose arbitrary-PDF parser.

## Tests

```sh
node --test /Users/jaygohil/Desktop/19Nov-JB/crm/server.test.js
node /Users/jaygohil/Desktop/19Nov-JB/crm/browser.test.js
```

Browser tests use the already-installed Playwright package and Google Chrome, with an isolated temporary database. Screenshots go to the gitignored `/Users/jaygohil/Desktop/19Nov-JB/crm/test-results` directory. Application runtime has no third-party dependencies.

## Scope and security

This is a functional local CRM, **not a production multi-user service**. There is no authentication, cloud synchronization, email delivery, live payment processing, automated recurring billing, or accounting/tax certification. Recording a payment only updates a local ledger; it never charges a card. Keep it bound to loopback and do not expose it publicly. Other processes/users with access to your local machine may access the app. Local files are not encrypted. The server rejects cross-origin requests and non-loopback Host headers; source PDFs are served through an allowlist.