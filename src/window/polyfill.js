import RTCPeerConnection from './RTCPeerConnectionProxy.js';
export * from '../utils/com.js';
import { addListener } from '../utils/com.js';

const wrtc = {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
};

export default function polyfillWorker(worker) {
  addListener(worker, wrtc);
}
