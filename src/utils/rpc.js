let n = 0;
const promises = {};

self.addEventListener('message', event => {
  if (!(
    event.data &&
    event.data.command &&
    event.data.command === 'RPC_CALLBACK'
  )) return;

  promises[event.data.id](event.data.msg);
  delete promises[event.data.id];
});

export default function rpc(msg) {
  return new Promise(res => {
    const id = n++;
    promises[id] = res;
    self.postMessage({
      command: 'RPC_CALL',
      id, msg
    });
  });
}
