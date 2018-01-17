import RTCPeerConnection from './src/window/RTCPeerConnectionProxy.js';
export * from './src/utils/com.js';
import { addListener } from './src/utils/com.js';

const wrtc = {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
};

export default function polyfillWorker(worker) {
  const isShared = 'SharedWorker' in self && worker instanceof SharedWorker;
  const port = isShared ? worker.port : worker;
  addListener(port, wrtc);
  if (isShared) port.start();
}
