// Runs Python (Pyodide) inside a Web Worker so an infinite loop can be killed
// without freezing the page. input() reads from a list of lines (the Input box),
// because real terminal input does not exist in a browser.
(() => {
  function workerFn() {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
    let py;
    const init = loadPyodide().then(p => { py = p; postMessage({ type: 'ready' }); });
    onmessage = async e => {
      await init;
      const lines = [...e.data.stdin];
      let out = '', err = '';
      py.setStdout({ batched: s => out += s + '\n' });
      py.setStderr({ batched: s => out += s + '\n' });
      py.setStdin({ stdin: () => lines.length ? lines.shift() : undefined }); // undefined = EOF
      try {
        const g = py.globals.get('dict')(); g.set('__name__', '__main__');
        await py.runPythonAsync(e.data.code, { globals: g });
      } catch (x) { err = String(x.message).trim().split('\n').slice(-4).join('\n'); }
      postMessage({ type: 'done', out, err });
    };
  }
  let worker, ready;
  function start() {
    worker = new Worker(URL.createObjectURL(new Blob(['(' + workerFn + ')()'], { type: 'text/javascript' })));
    ready = new Promise(res => { worker.onmessage = e => e.data.type === 'ready' && res(); });
    worker.onerror = () => { const l = document.getElementById('load'); if (l) l.textContent = '⚠ Could not load Python. Check your internet connection and reload.'; };
  }
  start();
  window.PyRunner = {
    ready: () => ready, onRestart: null,
    async run(code, stdin = [], ms = 8000) {
      await ready; const w = worker;
      return new Promise(resolve => {
        const t = setTimeout(() => {   // too slow: kill the worker and start a fresh one
          w.terminate(); start(); this.onRestart && this.onRestart();
          resolve({ out: '', timeout: true, err: 'Timed out after ' + ms / 1000 + 's. Does your loop ever stop?' });
        }, ms);
        w.onmessage = e => { clearTimeout(t); resolve(e.data); };
        w.postMessage({ code, stdin });
      });
    }
  };
})();
