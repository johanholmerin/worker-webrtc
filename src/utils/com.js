import getId from './id.js';
import * as rpc from './rpc.js';
import * as is from './is.js';

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

export function set(obj, msg) {
  return post({
    command: 'SET',
    msg, obj
  });
}

export function construct(obj, msg) {
  return post({
    command: 'CONSTRUCT',
    msg, obj
  });
}

function post({ obj, msg, command }) {
  const id = getRefId(obj);
  const { scope } = getRef(obj);
  return rpc.send({ id, msg, command }, scope);
}

export function call(obj, msg) {
  if (is.string(obj)) {
    return rpc.send({ id: obj, msg, command: 'CALL' }, port);
  }

  return post({ obj, msg, command: 'CALL' });
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
    if (item && is.object(item)) {
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
    const obj = is.string(id) ? wrtc[id] : getObjFromId(id);
    const args = deserialize(data.args, wrtc);

    // XXX add reference to scope when calling static methods
    if (is.string(id)) {
      args.push(scope);
    }

    if (typeof obj[data.name] === 'function') {
      return obj[data.name](...args);
    }
  },
  SET(data, id, scope, wrtc) {
    const { obj } = references[id];
    for (const key in deserialize(data)) {
      obj[key] = data[key];
    }
  }
};

function resolveFunction(func) {
  try {
    return Promise.resolve(func());
  } catch(error) {
    return Promise.reject(error);
  }
}

export function addListener(scope, wrtc) {
  scope.addEventListener('message', event => {
    if (!(
      event.data &&
      event.data.command &&
      event.data.command in functions
    )) {
      rpc.onmessage(event, wrtc);
      return;
    }

    event.stopImmediatePropagation();

    const { rpcId, command, msg, id } = event.data;

    resolveFunction(() =>
      functions[command](msg, id, scope, wrtc)
    ).then(msg => {
      rpc.respond({
        success: true,
        rpcId, msg, scope
      });
    }, error => {
      rpc.respond({
        success: false,
        msg: serialize(error, error.message),
        rpcId, scope
      });
    });
  });
}
