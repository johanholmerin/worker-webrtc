import RTCPeerConnection from './RTCPeerConnection.js';
import RTCDataChannel from './RTCDataChannel.js';
import RTCSessionDescription from './RTCSessionDescription.js';
import RTCIceCandidate from './RTCIceCandidate.js';
import { addListener } from '../utils/com.js';

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
