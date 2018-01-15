import rpc from './rpc.js';
import getId from '../utils/id.js';
import RTCDataChannel from './RTCDataChannel.js';

const references = {};

const functions = {
  CALL(data) {
    if (typeof references[data.id][data.name] === 'function') {
      references[data.id][data.name](...data.args);
    }
  },
  SET(data) {
    references[data.id][data.name] = data.value;
  },
  ondatachannel(data) {
    const channel = new RTCDataChannel(data.value.label);
    references[data.id] = channel;
    channel._id = data.id;
    references[data.connectionId].ondatachannel({ channel });
  }
};

self.addEventListener('message', event => {
  if (!event.data || !event.data.command) return;
  const func = functions[event.data.command];
  if (!func) return;
  func(event.data);
});

export function call(id, name, args) {
  return rpc({ id, name, args });
}

export function addReference(cls) {
  const id = getId();;
  references[id] = cls;
  return id;
}
