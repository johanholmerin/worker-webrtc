import { serialize, deserialize } from './com.js';

let n = 0;
const promises = {};

export function onmessage(event, wrtc) {
  if (!(
    event.data &&
    event.data.command &&
    event.data.command === 'RPC_CALLBACK'
  )) return;

  event.stopImmediatePropagation();

  const { success, msg, rpcId } = event.data;
  const value = deserialize([msg], wrtc)[0];

  const { res, rej } = promises[rpcId];
  delete promises[rpcId];

  if (success) res(value);
  else rej(value);
}

export function send({ msg, id, command }, scope) {
  return new Promise((res, rej) => {
    const rpcId = n++;
    promises[rpcId] = { res, rej };
    scope.postMessage({ command, id, rpcId, msg });
  });
}

export function respond({ rpcId, success, msg, scope }) {
  scope.postMessage({
    command: 'RPC_CALLBACK',
    msg, success, rpcId
  });
}
