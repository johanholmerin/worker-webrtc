import {
  RTCPeerConnection,
  RTCDataChannel,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCCertificate,
  RTCPeerConnectionIceEvent,
  RTCStatsReport
} from '../../worker.js';

self.RTCPeerConnection = RTCPeerConnection;
self.RTCDataChannel = RTCDataChannel;
self.RTCSessionDescription = RTCSessionDescription;
self.RTCIceCandidate = RTCIceCandidate;
self.RTCCertificate = RTCCertificate;
self.RTCPeerConnectionIceEvent = RTCPeerConnectionIceEvent;
self.RTCStatsReport = RTCStatsReport;
