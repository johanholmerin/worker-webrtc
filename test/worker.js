import './polyfill.js';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from '../worker.js';

const iceServers = [{
  urls: 'stun:stun.l.google.com:19302'
}, {
  urls: 'stun:global.stun.twilio.com:3478?transport=udp'
}];

const peer1 = new RTCPeerConnection({ iceServers });
const peer2 = new RTCPeerConnection({ iceServers });

peer1.onnegotiationneeded = async () => {
  const offer = await peer1.createOffer();
  await peer1.setLocalDescription(offer);
  await peer2.setRemoteDescription(offer);

  const answer = await peer2.createAnswer();
  await peer2.setLocalDescription(answer);
  await peer1.setRemoteDescription(answer);
};

peer1.onicecandidate = ({ candidate }) => {
  if (!candidate) return;
  peer2.addIceCandidate(candidate);
};

peer2.onicecandidate = ({ candidate }) => {
  if (!candidate) return;
  peer1.addIceCandidate(candidate);
};

const channel1 = peer1.createDataChannel('label');

channel1.onopen = () => {
  channel1.send('hey peer2, how is it going?');
};

channel1.onmessage = ({ data }) => {
  console.log('got a message from peer2: ' + data);
};

peer2.ondatachannel = ({ channel }) => {
  channel.onmessage = ({ data }) => {
    console.log('got a message from peer1: ' + data);
    channel.send('👍');
  };
};
