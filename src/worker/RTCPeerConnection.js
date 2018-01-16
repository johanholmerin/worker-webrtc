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

function isURL(string) {
  try {
    new URL(string);
  } catch(_) {
    return false;
  }

  return true;
}

function validateIceServers(iceServers) {
  if (iceServers === undefined) return true;
  if (!Array.isArray(iceServers)) return false;
  return iceServers.every(iceServer => {
    return iceServer && (
      isURL(iceServer.urls) || (
        Array.isArray(iceServer.urls) &&
        iceServer.urls.every(url => isURL(url))
      )
    );
  });
}

const RTCBundlePolicy = ['balanced', 'max-compat', 'max-bundle'];
const RTCIceTransportPolicy = ['all', 'relay'];
const RTCPeerConnectionState = [
  'new',
  'connecting',
  'connected',
  'disconnected',
  'failed',
  'closed'
];

export default class RTCPeerConnection extends EventTarget {

  constructor(configuration = {}) {
    if (configuration === null) configuration = {};
    if (typeof configuration !== 'object') {
      throw new TypeError(
        `Argument 1 of RTCPeerConnection.constructor can't be converted to a dictionary.`
      );
    }
    if (
      configuration.bundlePolicy !== undefined &&
      !RTCBundlePolicy.includes(configuration.bundlePolicy)
    ) {
      throw new TypeError(
        `'bundlePolicy' member of RTCConfiguration '${configuration.bundlePolicy}' is not a valid value for enumeration RTCBundlePolicy.`
      );
    }
    if (
      configuration.rtcpMuxPolicy !== undefined &&
      !RTCRtcpMuxPolicy.includes(configuration.rtcpMuxPolicy)
    ) {
      throw new TypeError(
        `'rtcpMuxPolicy' member of RTCConfiguration '${configuration.rtcpMuxPolicy}' is not a valid value for enumeration RTCRtcpMuxPolicy.`
      );
    }
    if (
      configuration.iceTransportPolicy !== undefined &&
      !RTCIceTransportPolicy.includes(configuration.iceTransportPolicy)
    ) {
      throw new TypeError(
        `'iceTransportPolicy' member of RTCConfiguration '${configuration.iceTransportPolicy}' is not a valid value for enumeration RTCIceTransportPolicy.`
      );
    }
    if (!validateIceServers(configuration.iceServers)) {
      throw new TypeError(
        `Failed to construct 'RTCPeerConnection': Malformed RTCIceServer`
      );
    }

    super();

    // TODO
    // this.canTrickleIceCandidates;
    // this.connectionState;
    // this.currentLocalDescription;
    // this.currentRemoteDescription;
    // this.defaultIceServers;
    // this.iceConnectionState;
    // this.iceGatheringState ;
    // this.pendingLocalDescription;
    // this.pendingRemoteDescription;
    // this.sctp;
    // this.signalingState;

    this.remoteDescription = null;
    this.localDescription = null;

    addReference(this);
    construct(this, {
      name: 'RTCPeerConnection',
      args: [configuration]
    });
  }

  createDataChannel(label, options) {
    if (arguments.length < 1) {
      throw new TypeError(
        'Not enough arguments to RTCPeerConnection.createDataChannel.'
      );
    }
    if (arguments.length > 1 && !(typeof options === 'object')) {
      throw new TypeError(
        `Argument 2 of RTCPeerConnection.createDataChannel can't be converted to a dictionary.`
      );
    }

    const channel = new RTCDataChannel(label, options);
    addReference(channel);
    call(this, {
      name: 'createDataChannel',
      args: [getRefId(channel), label, options]
    });
    return channel;
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
    call(this, {
      name: 'close',
      args: []
    });
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

  // addStream() {
  // }

  // addTrack() {
  // }

  // generateCertificate() {
  // }

  // getConfiguration() {
  // }

  // getIdentityAssertion() {
  // }

  // getLocalStreams() {
  // }

  // getReceivers() {
  // }

  // getRemoteStreams() {
  // }

  // getSenders() {
  // }

  // getStreamById() {
  // }

  // removeStream() {
  // }

  // removeTrack() {
  // }

  // setConfiguration() {
  // }

  // setIdentityProvider() {
  // }

  _ondatachannel(id) {
    const channel = getRefFromId(id).obj;
    this.ondatachannel({ channel });
  }

}
