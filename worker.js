import RTCPeerConnection from './src/worker/RTCPeerConnection.js';
import RTCDataChannel from './src/worker/RTCDataChannel.js';
import RTCSessionDescription from './src/worker/RTCSessionDescription.js';
import RTCIceCandidate from './src/worker/RTCIceCandidate.js';
import { addListener } from './src/utils/com.js';

addListener(self, {
  RTCPeerConnection,
  RTCDataChannel,
  RTCSessionDescription,
  RTCIceCandidate
});

export {
  RTCPeerConnection,
  RTCDataChannel,
  RTCSessionDescription,
  RTCIceCandidate
};
