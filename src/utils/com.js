import getId from './id.js';
import * as rpc from './rpc.js';
import * as check from './check.js';

export const references = {};

// Only in Worker
let port;
export const setPort = _port => port = _port;

export function addReference(obj, scope = port, id = getId()) {
  obj._id = id;
  references[id] = { scope, obj };
}

export function getRefFromId(id) {
  const ref = references[id];
  if (!ref) throw new Error('Reference not found');
  return ref;
}

export function getObjFromId(id) {
  return getRefFromId(id).obj;
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
  if (check.string(obj)) {
    return rpc.send({ id: obj, msg }, port);
  }

  const id = getRefId(obj);
  const { scope } = getRef(obj);
  return rpc.send({ id, msg }, scope);
}

export const functions = {
  CONSTRUCT(msg, id, scope, wrtc) {
    const obj = new wrtc[msg.name](...msg.args);
    addReference(obj, scope, id);
  },
  CALL(data, id) {
    const { obj } = references[id];
    if (typeof obj[data.name] === 'function') {
      obj[data.name](...data.args);
    }
  },
  SET(data, id) {
    const { obj } = references[id];
    for (const key in data) {
      obj[key] = data[key];
    }
  },
  RPC_CALL(data, id, scope, wrtc) {
    const obj = check.string(data.id) ? wrtc[data.id] : references[data.id].obj;
    const { msg } = data;

    // XXX add reference to scope when calling static methods
    if (check.string(data.id)) {
      msg.args.push(scope);
    }

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
    )) {
      rpc.onmessage(event);
      return;
    }

    functions[event.data.command](event.data.msg, event.data.id, scope, wrtc);
  });
}
