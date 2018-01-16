import RTCPeerConnection from './RTCPeerConnectionProxy.js';
export * from '../utils/com.js';
import { addListener } from '../utils/com.js';

const wrtc = {
  RTCDataChannel,
  RTCDataChannelEvent,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCPeerConnectionIceEvent,
  RTCSessionDescription,
  RTCStatsReport
};

export default function polyfillWorker(worker) {
  addListener(worker, wrtc);
}
