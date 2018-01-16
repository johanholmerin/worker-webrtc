import getId from './id.js';
import rpc from './rpc.js';

export const references = {};

export function addReference(obj, scope = self, id = getId()) {
  obj._id = id;
  references[id] = { scope, obj };
}

export function getRefFromId(id) {
  const ref = references[id];
  if (!ref) throw new Error('Reference not found');
  return ref;
}

export function getRefId(obj) {
  return obj._id;
}

export function getRef(obj) {
  return getRefFromId(getRefId(obj));
}

export function call(obj, msg) {
  post({
    command: 'CALL',
    msg, obj
  });
}

export function set(obj, msg) {
  post({
    command: 'SET',
    msg, obj
  });
}

export function construct(obj, msg) {
  post({
    command: 'CONSTRUCT',
    msg, obj
  });
}

function post({ obj, msg, command }) {
  const id = getRefId(obj);
  const { scope } = getRef(obj);
  scope.postMessage({
    command, id, msg
  });
}

export function get(obj, msg) {
  const id = getRefId(obj);
  return rpc({ id, msg });
}

export const functions = {
  CONSTRUCT(msg, id, scope, wrtc) {
    const obj = new wrtc[msg.name](...msg.args);
    addReference(obj, scope, id);
  },
  CALL(data, id) {
    const { obj } = references[id];
    obj[data.name](...data.args);
  },
  SET(data, id) {
    const { obj } = references[id];
    for (const key in data) {
      obj[key] = data[key];
    }
  },
  RPC_CALL(data, id, scope) {
    const { msg } = data;
    const { obj } = references[data.id];
    const promise = obj[msg.name](...msg.args);

    Promise.resolve(promise).then(res => {
      scope.postMessage({
        command: 'RPC_CALLBACK',
        id,
        msg: res
      });
    });
  }
};

export function addListener(scope, wrtc) {
  scope.addEventListener('message', event => {
    if (!(
      event.data &&
      event.data.command &&
      event.data.command in functions
    )) return;

    functions[event.data.command](event.data.msg, event.data.id, scope, wrtc);
  });
}
