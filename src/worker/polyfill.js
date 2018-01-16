import RTCPeerConnection from './RTCPeerConnection.js';
import RTCDataChannel from './RTCDataChannel.js';
import RTCSessionDescription from './RTCSessionDescription.js';
import RTCIceCandidate from './RTCIceCandidate.js';
import { addListener } from '../utils/com.js';

self.RTCPeerConnection = RTCPeerConnection;
self.RTCDataChannel = RTCDataChannel;
self.RTCSessionDescription = RTCSessionDescription;
self.RTCIceCandidate = RTCIceCandidate;

addListener(self, self);
