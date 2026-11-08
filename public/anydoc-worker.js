// One anydoc conversion, off the page's main thread. app.js starts a fresh
// worker for every file and terminates it as soon as the answer arrives, which
// releases everything the conversion allocated: the WebAssembly memory, and
// the code V8's optimizing compiler produced for it. On some PDFs that
// compiler alone takes more than 1 GB (govdocs1-000325.pdf: a 1.7 GB tab
// against 0.3 GB with the optimizing tier off, identical output). Kept in the
// page, it stacked up across a batch until the tab ran out of memory.
//
// Loaded as a module worker from this origin, so the page's
// Content-Security-Policy header applies here as well.
import init, { toMarkdownBytes } from "./vendor/anydoc/anydoc_wasm.js";

self.onmessage = async ({ data }) => {
  try {
    await init(); // fetches anydoc_wasm_bg.wasm beside the module
    const markdown = toMarkdownBytes(new Uint8Array(data.bytes), data.format);
    self.postMessage({ markdown });
  } catch (err) {
    self.postMessage({
      error: {
        code: (err && err.code) || null,
        message: String((err && err.message) || err),
      },
    });
  }
};
