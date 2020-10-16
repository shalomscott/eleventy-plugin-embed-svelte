---
layout: main
---

# Embedded Component Examples

- Here's an embedded component (`Greeter.svelte`):

{% embedSvelte 'Greeter.svelte', { name: 'Zach' } %}

- And here's that same component embeded once again, but with different `props`:

{% embedSvelte 'Greeter.svelte', { name: 'Rich' } %}

- Lastly, a second embedded component:

{% embedSvelte 'Counter.svelte' %}

---

## _Interesting notes on the output code_

- Although the same component is embedded here twice (`Greeter.svelte`), the component's source code is only generated _once_ (as is necessary).
- Two Svelte components exist on this page, but the svelte utility code exists once - deduped by Rollup. All component code for a single page is built in **one** Rollup build. This allows Rollup to properly dedupe and tree-shake the code. No unnecessary code bloating up the page.
