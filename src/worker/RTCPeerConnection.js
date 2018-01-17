import RTCSessionDescription from './RTCSessionDescription.js';
import EventTarget from 'event-target';
import RTCDataChannel from './RTCDataChannel.js';
import * as check from '../utils/check.js';
import assert from '../utils/assert.js';
import {
  addReference,
  call,
  construct,
  getRefId,
  get,
  getRefFromId
} from '../utils/com.js';
import {
  RTCBundlePolicy,
  RTCIceTransportPolicy,
  RTCRtcpMuxPolicy
} from './enums.js';

function validateIceServers(iceServers) {
  if (iceServers === undefined) return true;
  if (!Array.isArray(iceServers)) return false;

  return iceServers.every(iceServer => {
    if (check.url(iceServer.urls)) return true;

    return Array.isArray(iceServer.urls) &&
      iceServer.urls.every(url => check.url(url));
  });
}

export default class RTCPeerConnection extends EventTarget {

  constructor(config) {
    assert(
      check.object(config) || check.undefined(config),
      `'${config}' is not an object`
    );
    const {
      bundlePolicy,
      rtcpMuxPolicy,
      iceTransportPolicy,
      iceServers
    } = config || {};

    assert(
      check.undefined(bundlePolicy) ||
        check.includes(RTCBundlePolicy, bundlePolicy),
      `'${bundlePolicy}' is not a valid value for bundlePolicy`
    );
    assert(
      check.undefined(rtcpMuxPolicy) ||
        check.includes(RTCRtcpMuxPolicy, rtcpMuxPolicy),
      `'${rtcpMuxPolicy}' is not a valid value for rtcpMuxPolicy`
    );
    assert(
      check.undefined(iceTransportPolicy) ||
        check.includes(RTCIceTransportPolicy, iceTransportPolicy),
      `'${iceTransportPolicy}' is not a valid value for iceTransportPolicy`
    );
    assert(
      validateIceServers(iceServers),
      `'${iceServers}' is not a valid value for iceServers`
    );

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
      args: [config]
    });
  }

  get [Symbol.toStringTag]() {
    return 'RTCPeerConnection';
  }

  createDataChannel(label, options) {
    assert(arguments.length, 'Not enough arguments');
    assert(
      check.undefined(options) || check.object(options),
      `'${options}' is not a valid value for options`
    );

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
