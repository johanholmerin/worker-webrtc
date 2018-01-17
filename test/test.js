import polyfillRTCWorker from '../src/window/polyfill.js';

const w = new Worker('../build/worker.js');
polyfillRTCWorker(w);
