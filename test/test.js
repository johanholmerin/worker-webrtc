import polyfillRTCWorker from '../window.js';

const w = new Worker('../build/worker.js');
polyfillRTCWorker(w);
