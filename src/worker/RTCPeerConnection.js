import RTCSessionDescription from './RTCSessionDescription.js';
import EventTarget from 'event-target';
import RTCDataChannel from './RTCDataChannel.js';
import * as com from './com.js';

export default class RTCPeerConnection extends EventTarget {

  constructor(configuration = {}) {
    super();

    this.bundlePolicy = configuration.bundlePolicy;
    this.iceTransportPolicy = configuration.iceTransportPolicy;
    this.rtcpMuxPolicy = configuration.rtcpMuxPolicy;

    this.remoteDescription = new RTCSessionDescription();

    this._id = com.addReference(this);
    self.postMessage({
      command: 'CONSTRUCT',
      name: 'RTCPeerConnection',
      id: this._id,
      args: [configuration]
    });
  }

  createDataChannel(...args) {
    const channel = new RTCDataChannel(...args);
    channel._id = com.addReference(channel);
    self.postMessage({
      command: 'createDataChannel',
      connectionId: this._id,
      id: channel._id,
      args
    });
    return channel;
  }

  addTrack() {
    console.log('addTrack', ...arguments);
  }

  setRemoteDescription(...args) {
    const options = args[0];
    this.remoteDescription = options;
    return com.call(this._id, 'setRemoteDescription', [options]).then(() => {
      if (typeof args[1] === 'function') {
        args[1]();
      }
    });
  }

  createAnswer(...args) {
    const options = args[args.length - 1];
    return com.call(this._id, 'createAnswer', [options]).then(desc => {
      if (typeof args[0] === 'function') {
        args[0](desc);
      }
      return desc;
    });
  }

  addIceCandidate(...args) {
    const options = args[0];
    return com.call(this._id, 'addIceCandidate', [options]).then(() => {
      if (typeof args[1] === 'function') {
        args[1]();
      }
    });
  }

  close() {
    console.log('close', ...arguments);
  }

  createOffer(...args) {
    const options = args[args.length - 1];
    return com.call(this._id, 'createOffer', [options]).then(desc => {
      if (typeof args[0] === 'function') {
        args[0](desc);
      }
      return desc;
    });
  }

  setLocalDescription(...args) {
    const options = args[0];
    return com.call(this._id, 'setLocalDescription', [options]).then(() => {
      if (typeof args[1] === 'function') {
        args[1]();
      }
    });
  }

  getStats() {
    return com.call(this._id, 'getStats', []);
  }

  addStream() {
    console.log('addStream', ...arguments);
  }

  // oniceconnectionstatechange
  // onicegatheringstatechange
  // onsignalingstatechange
  // onicecandidate
  // onnegotiationneeded
  // ondatachannel
  // ontrack
  // onaddstream

  // remoteDescription
  // localDescription
  // iceConnectionState
  // iceGatheringState
  // signalingState

}
