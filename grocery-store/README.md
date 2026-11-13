# Fresh Basket

A responsive, dependency-free grocery storefront built with HTML, CSS, and JavaScript. All application files and tests are contained in this directory.

## Run

Open `/Users/jaygohil/Desktop/13Nov-JB/grocery-store/index.html` in a modern browser. No installation or build step is required.

## Features

- Twelve sample products across four categories
- Case-insensitive search and category filtering
- Basket quantities, removal, clear action, and totals calculated in integer cents
- Local browser storage, with graceful fallback when unavailable
- Responsive layouts, labeled controls, keyboard focus styles, and live status messages
- Demo checkout that clears the basket and explicitly confirms no payment or delivery

This is a frontend demo: there is no backend, inventory synchronization, payment processing, tax calculation, or real order fulfillment. Prices are sample USD prices. Basket persistence depends on browser support for local storage (behavior for local files varies).

## Test

With Node.js 18 or newer:

```sh
node --test /Users/jaygohil/Desktop/13Nov-JB/grocery-store/store.test.js
node --check /Users/jaygohil/Desktop/13Nov-JB/grocery-store/app.js
```

Browser smoke check: search for apples, select Dairy, reset to All, add products, change quantities, reload to check persistence, remove products, and complete a demo checkout. Check the layout on a narrow viewport as well.