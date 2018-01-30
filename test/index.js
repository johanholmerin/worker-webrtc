import polyfillWorker from '../window.js';

function start() {
  return new Promise((res, rej) => {
    let logs = [];
    const w = new Worker('../build/worker.js')
    w.onerror = () => rej('Failed to load worker');
    polyfillWorker(w);

    w.addEventListener('message', ({ data }) => {
      if (!data || !data.tap) return;

      switch (data.tap.event) {
        case 'data':
          logs.push(data.tap.data);
          break;
        case 'error':
          rej(data.tap.error);
          break;
        case 'end':
          res(logs);
          break;
      }
    });
  })
}

self.runTest = done => {
  start().then(res => {
    done([null, res]);
  }, err => {
    done([err]);
  });
};
