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
    command, id,
    msg
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

// Serialize class instance, with arguments to call constructor with
export function serialize(cls, ...args) {
  // cls.constructor.name should work, but
  // RTC*Events have no constructor in Safari.
  const [,name] = cls.toString().match(/\[object (.*)\]/) ||
    [,cls.constructor.name];

  return {
    _type: name,
    args
  };
}

export function deserialize(obj, wrtc) {
  for (const key in obj) {
    const item = obj[key];
    if (item && check.object(item)) {
      if ('_type' in item) {
        const cls = wrtc[item._type] || self[item._type];
        const args = deserialize(item.args, wrtc);
        obj[key] = new cls(...args);
      } else {
        obj[key] = deserialize(item, wrtc);
      }
    }
  }

  return obj;
}

export const functions = {
  CONSTRUCT(msg, id, scope, wrtc) {
    const obj = new wrtc[msg.name](...deserialize(msg.args, wrtc));
    addReference(obj, scope, id);
  },
  CALL(data, id, scope, wrtc) {
    const { obj } = references[id];
    if (typeof obj[data.name] === 'function') {
      obj[data.name](...deserialize(data.args, wrtc));
    }
  },
  SET(data, id, scope, wrtc) {
    const { obj } = references[id];
    for (const key in deserialize(data)) {
      obj[key] = data[key];
    }
  }
};

export function addListener(scope, wrtc) {
  scope.addEventListener('message', event => {
    if (!(
      event.data &&
      event.data.command &&
      event.data.command in functions
    )) {
      rpc.onmessage(event, scope, wrtc);
      return;
    }

    functions[event.data.command](event.data.msg, event.data.id, scope, wrtc);
  });
}
