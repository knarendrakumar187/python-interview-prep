// Shared lazy Pyodide loader (Python compiled to WebAssembly, from CDN).
let pyodidePromise = null;

export function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.onload = async () => {
        try {
          resolve(
            await window.loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
            })
          );
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = () => reject(new Error("Failed to load Python runtime"));
      document.head.appendChild(script);
    });
  }
  return pyodidePromise;
}
