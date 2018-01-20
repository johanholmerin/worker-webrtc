import RTCSessionDescription from './RTCSessionDescription.js';
import RTCDataChannel from './RTCDataChannel.js';
import RTCCertificate from './RTCCertificate.js';
import * as check from '../utils/check.js';
import assert from '../utils/assert.js';
import {
  addReference,
  call,
  construct,
  getRefId,
  getRef,
  get,
  getObjFromId
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

function setCertificates(config) {
  if (config && Array.isArray(config.certificates)) {
    config.certificates = config.certificates.map(cert => getRefId(cert));
  }
}

export default class RTCPeerConnection extends EventTarget {

  constructor(config) {
    super();
    this._setConfiguration(config);

    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';
    this.signalingState = 'stable';

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
    const { scope } = getRef(this);
    addReference(channel, scope);
    call(this, {
      name: 'createDataChannel',
      args: [getRefId(channel), label, options]
    });
    return channel;
  }

  addIceCandidate(candidate, ...args) {
    return get(this, {
      name: 'addIceCandidate',
      args: [candidate]
    }).then(args[1], args[2]);
  }

  close() {
    call(this, {
      name: 'close',
      args: []
    });
  }

  createOffer(...args) {
    const options = check.function(args[args.length - 1]) ?
      undefined :
      args[args.length - 1];

    return get(this, {
      name: 'createOffer',
      args: [options]
    }).then(args[0], args[1]);
  }

  createAnswer(...args) {
    const options = check.function(args[args.length - 1]) ?
      undefined :
      args[args.length - 1];

    return get(this, {
      name: 'createAnswer',
      args: [options]
    }).then(args[0], args[1]);
  }

  setLocalDescription(localDescription, ...args) {
    this.localDescription = localDescription;
    return get(this, {
      name: 'setLocalDescription',
      args: [localDescription]
    }).then(args[1], args[2]);
  }

  setRemoteDescription(remoteDescription, ...args) {
    this.remoteDescription = remoteDescription;
    return get(this, {
      name: 'setRemoteDescription',
      args: [remoteDescription]
    }).then(args[1], args[2]);
  }

  getStats() {
    return get(this, {
      name: 'getStats',
      args: []
    });
  }

  getConfiguration() {
    return this._config;
  }

  setConfiguration(config) {
    this._setConfiguration(config);
    call(this, {
      name: 'setConfiguration',
      args: [config]
    });
  }

  _setConfiguration(config) {
    assert(
      check.object(config) || check.undefined(config),
      `'${config}' is not an object`
    );
    const {
      bundlePolicy,
      rtcpMuxPolicy,
      iceTransportPolicy,
      iceServers,
      peerIdentity,
      iceCandidatePoolSize,
      certificates
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
    assert(
      check.string(peerIdentity) || check.undefined(peerIdentity),
      `'${peerIdentity}' is not a valid value for peerIdentity`
    );
    assert(
      (check.number(iceCandidatePoolSize) &&
        iceCandidatePoolSize >= 0 &&
        iceCandidatePoolSize < 256) || check.undefined(iceCandidatePoolSize),
      `'${iceCandidatePoolSize}' is not a valid value for iceCandidatePoolSize`
    );

    assert(
      (
        check.array(certificates) &&
          certificates.every(cert => cert instanceof RTCCertificate)
      ) || check.undefined(certificates),
      `'${certificates}' is not a valid value for certificates`
    );
    // Map certificates to IDs
    setCertificates(config);

    this._config = {
      bundlePolicy,
      rtcpMuxPolicy,
      iceTransportPolicy,
      iceServers,
      peerIdentity,
      iceCandidatePoolSize
    };
  }

  static generateCertificate(algo) {
    return get('RTCPeerConnection', {
      name: 'generateCertificate',
      args: [algo]
    }).then(id => getObjFromId(id));
  }

  _ondatachannel(id) {
    const channel = getObjFromId(id);
    this.ondatachannel({ channel });
  }

}
