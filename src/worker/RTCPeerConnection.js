import RTCSessionDescription from './RTCSessionDescription.js';
import RTCDataChannel from './RTCDataChannel.js';
import RTCCertificate from './RTCCertificate.js';
import * as is from '../utils/is.js';
import * as utils from '../utils/utils.js';
import assert from '../utils/assert.js';
import {
  addReference,
  call,
  construct,
  getRefId,
  getRef,
  getObjFromId
} from '../utils/com.js';
import {
  RTCBundlePolicy,
  RTCIceTransportPolicy,
} from './enums.js';

function checkIceServerURL(string, iceServer) {
  if (!is.url(string)) return false;
  const { protocol } = new URL(string);
  if (protocol === 'stun:') return true;
  if (protocol !== 'turn:' && protocol !== 'turns:') return false;
  return 'username' in iceServer && 'credential' in iceServer;
}

function validateIceServers(iceServers) {
  if (iceServers === undefined) return true;
  if (!Array.isArray(iceServers)) return false;

  return iceServers.every(iceServer => {
    if (Array.isArray(iceServer.urls)) {
      return iceServer.urls.every(url => checkIceServerURL(url, iceServer));
    }

    return checkIceServerURL(iceServer.urls, iceServer);
  });
}

function setCertificates(config) {
  if (config && Array.isArray(config.certificates)) {
    config.certificates = config.certificates.map(cert => getRefId(cert));
  }
}

export default class RTCPeerConnection extends EventTarget {

  constructor() {
    const [config] = arguments;
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

  createDataChannel(label) {
    const [,options] = arguments;
    assert(
      this.signalingState !== 'closed',
      new DOMException('Connection is closed', 'InvalidStateError')
    );

    const channel = new RTCDataChannel(...arguments);
    const { scope } = getRef(this);
    addReference(channel, scope);
    call(this, {
      name: 'createDataChannel',
      args: [getRefId(channel), ...arguments]
    });
    return channel;
  }

  addIceCandidate(candidate) {
    return call(this, {
      name: 'addIceCandidate',
      args: [candidate]
    });
  }

  close() {
    this.signalingState = 'closed';
    call(this, {
      name: 'close',
      args: []
    });
  }

  createOffer(options) {
    return call(this, {
      name: 'createOffer',
      args: [options]
    });
  }

  createAnswer(options) {
    return call(this, {
      name: 'createAnswer',
      args: [options]
    });
  }

  setLocalDescription(localDescription) {
    this.localDescription = localDescription;
    return call(this, {
      name: 'setLocalDescription',
      args: [localDescription]
    });
  }

  setRemoteDescription(remoteDescription) {
    this.remoteDescription = remoteDescription;
    return call(this, {
      name: 'setRemoteDescription',
      args: [remoteDescription]
    });
  }

  getStats() {
    return call(this, {
      name: 'getStats',
      args: []
    }).then(id => getObjFromId(id));
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
      is.object(config) || is.undefined(config),
      new TypeError(`'${config}' is not an object`)
    );
    const {
      bundlePolicy,
      iceTransportPolicy,
      iceServers,
      iceCandidatePoolSize,
      certificates
    } = config || {};

    assert(
      (
        is.array(certificates) &&
          certificates.every(cert => {
            return cert instanceof RTCCertificate && cert.expires > Date.now();
          })
      ) || is.undefined(certificates),
      new TypeError(`'${certificates}' is not a valid value for certificates`)
    );
    // Map certificates to IDs
    setCertificates(config);

    assert(
      is.undefined(bundlePolicy) ||
        is.includes(RTCBundlePolicy, bundlePolicy),
      new TypeError(`'${bundlePolicy}' is not a valid value for bundlePolicy`)
    );
    assert(
      is.undefined(iceTransportPolicy) ||
        is.includes(RTCIceTransportPolicy, iceTransportPolicy),
      new TypeError(`'${iceTransportPolicy}' is not a valid value for iceTransportPolicy`)
    );
    assert(
      validateIceServers(iceServers),
      new TypeError(`'${iceServers}' is not a valid value for iceServers`)
    );
    assert(
      (is.number(iceCandidatePoolSize) &&
        iceCandidatePoolSize >= 0 &&
        iceCandidatePoolSize < 256) || is.undefined(iceCandidatePoolSize),
      new TypeError(`'${iceCandidatePoolSize}' is not a valid value for iceCandidatePoolSize`)
    );

    this._config = {
      bundlePolicy,
      iceTransportPolicy,
      iceServers,
      iceCandidatePoolSize
    };
  }

  static generateCertificate(algo) {
    return call('RTCPeerConnection', {
      name: 'generateCertificate',
      args: [algo]
    }).then(id => getObjFromId(id));
  }

  _ondatachannel(id) {
    const event = new Event('datachannel');
    event.channel = getObjFromId(id);
    this.dispatchEvent(event);
  }

}

utils.addPropertyListeners(RTCPeerConnection, [
  'connectionstatechange',
  'datachannel',
  'icecandidate',
  'iceconnectionstatechange',
  'icegatheringstatechange',
  'negotiationneeded',
  'removestream',
  'signalingstatechange'
]);
