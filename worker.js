import RTCPeerConnection from './src/worker/RTCPeerConnection.js';
import RTCDataChannel from './src/worker/RTCDataChannel.js';
import RTCSessionDescription from './src/worker/RTCSessionDescription.js';
import RTCIceCandidate from './src/worker/RTCIceCandidate.js';
import RTCCertificate from './src/worker/RTCCertificate.js';
import RTCPeerConnectionIceEvent from './src/worker/RTCPeerConnectionIceEvent.js';
import { addListener, setPort } from './src/utils/com.js';

function init(port) {
  setPort(port);
  addListener(port, {
    RTCPeerConnection,
    RTCDataChannel,
    RTCSessionDescription,
    RTCIceCandidate,
    RTCCertificate,
    RTCPeerConnectionIceEvent
  });
  if (isShared) port.start();
}

const isShared = 'SharedWorkerGlobalScope' in self &&
  self instanceof SharedWorkerGlobalScope;

if (!isShared) {
  init(self);
}

export {
  RTCPeerConnection,
  RTCDataChannel,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCCertificate,
  RTCPeerConnectionIceEvent,
  init as addListener
};
