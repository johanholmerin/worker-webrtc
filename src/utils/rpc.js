import { getObjFromId } from './com.js';
import * as check from './check.js';

let n = 0;
const promises = {};

const functions = {
  RPC_CALL(data, id, scope, wrtc) {
    const obj = check.string(data.id) ? wrtc[data.id] : getObjFromId(data.id);
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
  },
  RPC_CALLBACK(data, id, scope, wrtc) {
    promises[id](data);
    delete promises[id];
  }
};

export function onmessage(event, scope, wrtc) {
  if (!(
    event.data &&
    event.data.command &&
    event.data.command in functions
  )) return;

  functions[event.data.command](event.data.msg, event.data.id, scope, wrtc);
}

export function send(msg, scope) {
  return new Promise(res => {
    const id = n++;
    promises[id] = res;
    scope.postMessage({
      command: 'RPC_CALL',
      id, msg
    });
  });
}
