import RTCPeerConnection from './RTCPeerConnectionProxy.js';
import getId from '../utils/id.js';

const wrtc = { RTCPeerConnection };

export function createCom(worker, obj, id, extra = {}) {
  obj._com = {
    id,
    worker,
    ...extra,
    send(name, ...args) {
      worker.postMessage({
        command: 'CALL',
        id: id,
        name, args
      });
    },
    set(name, value) {
      worker.postMessage({
        command: 'SET',
        id: id,
        name, value
      });
    }
  };
}

export default function polyfillWorker(worker) {
  const references = {};

  function addReference(cls) {
    const id = getId();
    references[id] = cls;
    return id;
  }

  const functions = {
    CONSTRUCT(data) {
      references[data.id] = new wrtc[data.name](...data.args);
      createCom(worker, references[data.id], data.id, { addReference });
    },
    CALL(data) {
      const { id, name, args } = event.data.msg;
      const res = references[id][name](...args);

      Promise.resolve(res).then(msg => {
        worker.postMessage({
          command: 'CALLBACK',
          id: data.id,
          msg
        });
      });
    },
    createDataChannel(data) {
      references[data.id] = references[data.connectionId].createDataChannel(...data.args);
      createCom(worker, references[data.id], data.id);
    }
  };

  worker.addEventListener('message', event => {
    if (!event.data || !event.data.command) return;
    functions[event.data.command](event.data);
  });
}
