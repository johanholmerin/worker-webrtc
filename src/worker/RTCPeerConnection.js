import RTCSessionDescription from './RTCSessionDescription.js';
import EventTarget from 'event-target';
import RTCDataChannel from './RTCDataChannel.js';
import {
  addReference,
  call,
  construct,
  getRefId,
  get,
  getRefFromId
} from '../utils/com.js';

export default class RTCPeerConnection extends EventTarget {

  constructor(configuration = {}) {
    super();

    this.bundlePolicy = configuration.bundlePolicy;
    this.iceTransportPolicy = configuration.iceTransportPolicy;
    this.rtcpMuxPolicy = configuration.rtcpMuxPolicy;

    this.remoteDescription = new RTCSessionDescription();

    addReference(this);
    construct(this, {
      name: 'RTCPeerConnection',
      args: [configuration]
    });
  }

  createDataChannel(...args) {
    const channel = new RTCDataChannel(...args);
    addReference(channel);
    call(this, {
      name: 'createDataChannel',
      args: [getRefId(channel), ...args]
    });
    return channel;
  }

  addTrack() {
    console.log('addTrack', ...arguments);
  }

  addIceCandidate(...args) {
    return get(this, {
      name: 'addIceCandidate',
      args: [args[0]]
    }).then(() => {
      if (typeof args[1] === 'function') args[1]();
    });
  }

  close() {
    console.log('close', ...arguments);
  }

  createOffer(...args) {
    return get(this, {
      name: 'createOffer',
      args: [args[args.length - 1]]
    }).then(offer => {
      if (typeof args[0] === 'function') args[0](offer);
      return offer;
    });
  }

  createAnswer(...args) {
    return get(this, {
      name: 'createAnswer',
      args: [args[args.length - 1]]
    }).then(answer => {
      if (typeof args[0] === 'function') args[0](answer);
      return answer;
    });
  }

  setLocalDescription(...args) {
    this.localDescription = args[0];
    return get(this, {
      name: 'setLocalDescription',
      args: [args[0]]
    }).then(() => {
      if (typeof args[1] === 'function') args[1]();
    });
  }

  setRemoteDescription(...args) {
    this.remoteDescription = args[0];
    return get(this, {
      name: 'setRemoteDescription',
      args: [args[0]]
    }).then(() => {
      if (typeof args[1] === 'function') args[1]();
    });
  }

  getStats() {
    return get(this, {
      name: 'getStats',
      args: []
    });
  }

  addStream() {
    console.log('addStream', ...arguments);
  }

  _ondatachannel(id) {
    const channel = getRefFromId(id).obj;
    this.ondatachannel({ channel });
  }

}
