let n = 0;
const promises = {};

export function onmessage(event) {
  if (!(
    event.data &&
    event.data.command &&
    event.data.command === 'RPC_CALLBACK'
  )) return;

  promises[event.data.id](event.data.msg);
  delete promises[event.data.id];
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
