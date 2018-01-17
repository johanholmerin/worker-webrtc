import RTCPeerConnection from './src/window/RTCPeerConnectionProxy.js';
export * from './src/utils/com.js';
import { addListener } from './src/utils/com.js';

const wrtc = {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
};

export default function polyfillWorker(worker) {
  addListener(worker, wrtc);
}
