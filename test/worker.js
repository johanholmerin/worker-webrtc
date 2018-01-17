import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from '../src/worker/polyfill.js';
import SimplePeer from 'simple-peer/simplepeer.min.js';

// SimplePeer.prototype._debug = console.log;

const peer1 = new SimplePeer({
  initiator: true,
  wrtc: { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate }
});
const peer2 = new SimplePeer({
  wrtc: { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate }
});

peer1.on('signal', data => {
  // console.log(1, 'signal', data);
  // when peer1 has signaling data, give it to peer2 somehow
  peer2.signal(data);
})

peer2.on('signal', data => {
  // console.log(2, 'signal', data);
  // when peer2 has signaling data, give it to peer1 somehow
  peer1.signal(data);
})

peer1.on('connect', () => {
  // console.log(1, 'connect');
  // wait for 'connect' event before using the data channel
  peer1.send('hey peer2, how is it going?');
})

peer1.on('data', data => {
  // got a data channel message
  console.log('got a message from peer2: ' + data);
})

peer2.on('data', data => {
  // got a data channel message
  console.log('got a message from peer1: ' + data);
  peer2.send('👍');
})
