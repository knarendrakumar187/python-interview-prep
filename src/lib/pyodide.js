// Shared lazy Pyodide loader (Python compiled to WebAssembly, from CDN).
let pyodidePromise = null;

async function loadPyodideRuntime() {
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-pyodide]");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load Python runtime"))
        );
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.dataset.pyodide = "1";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Python runtime"));
      document.head.appendChild(script);
    });
  }
  return window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
  });
}

export function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodideRuntime().catch((err) => {
      // Allow retries after a CDN blip or first-load failure
      pyodidePromise = null;
      throw err;
    });
  }
  return pyodidePromise;
}
