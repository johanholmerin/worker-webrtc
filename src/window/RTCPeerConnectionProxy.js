import proxyRTCDataChannel from './proxyRTCDataChannel.js';
import {
  addReference,
  getRef,
  call,
  set,
  construct,
  getRefId,
  getObjFromId,
  serialize
} from '../utils/com.js';

function getCertificates(config) {
  if (config && Array.isArray(config.certificates)) {
    config.certificates = config.certificates.map(id => getObjFromId(id));
  }
}

export default class RTCPeerConnectionProxy extends RTCPeerConnection {

  constructor(config) {
    getCertificates(config);
    super(config);

    // Workaround for Safari: https://bugs.webkit.org/show_bug.cgi?id=172867
    this.__proto__ = RTCPeerConnectionProxy.prototype;
    const self = this;

    Object.assign(this, {
      onconnectionstatechange(event) {
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type, {
            connectionState: event.connectionState
          })]
        });
      },
      ondatachannel(event) {
        const { channel } = event;
        const { scope } = getRef(self);
        addReference(channel, scope);
        construct(channel, {
          name: 'RTCDataChannel',
          args: [event.channel.label, {}]
        });
        proxyRTCDataChannel(channel);
        call(self, {
          name: '_ondatachannel',
          args: [getRefId(channel)]
        });
      },
      onicecandidate(event) {
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type, {
            candidate: event.candidate ?
              serialize(event.candidate, event.candidate.toJSON()) :
              event.candidate
          })]
        });
      },
      oniceconnectionstatechange(event) {
        set(self, {
          iceConnectionState: self.iceConnectionState,
          iceGatheringState: self.iceGatheringState
        });
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      },
      onicegatheringstatechange(event) {
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      },
      onnegotiationneeded(event) {
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      },
      onremovestream(event) {
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      },
      onsignalingstatechange(event) {
        set(self, {
          signalingState: self.signalingState
        });
        call(self, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      }
    });

    // XXX wait for reference add
    setTimeout(() => {
      self._setConfiguration();

      set(this, {
        canTrickleIceCandidates: this.canTrickleIceCandidates,
        connectionState: this.connectionState,
        defaultIceServers: this.defaultIceServers,
        iceConnectionState: this.iceConnectionState,
        iceGatheringState: this.iceGatheringState,
        signalingState: this.signalingState
      });
    });
  }

  createDataChannel(id, ...args) {
    const { scope } = getRef(this);
    const channel = super.createDataChannel(...args);
    addReference(channel, scope, id);
    proxyRTCDataChannel(channel);
  }

  createOffer(...args) {
    return super.createOffer(...args).then(desc => {
      if (desc && desc.toJSON) return desc.toJSON();
      return desc;
    });
  }

  createAnswer(...args) {
    return super.createAnswer(...args).then(desc => {
      if (desc && desc.toJSON) return desc.toJSON();
      return desc;
    });
  }

  getStats() {
    return super.getStats().then(stats => {
      const { scope } = getRef(this);
      addReference(stats, scope);
      construct(stats, {
        name: 'RTCStatsReport',
        args: [Array.from(stats)]
      });
      return getRefId(stats);
    });
  }

  setLocalDescription(...args) {
    return super.setLocalDescription(...args);
  }

  setRemoteDescription(...args) {
    return super.setRemoteDescription(...args);
  }

  setConfiguration(config) {
    getCertificates(config);
    super.setConfiguration(config);
    this._setConfiguration();
  }

  _setConfiguration() {
    if ('getConfiguration' in this) {
      set(this, {
        _config: this.getConfiguration()
      });
    }
  }

  static generateCertificate(algo, scope) {
    return RTCPeerConnection.generateCertificate(algo).then(cert => {
      addReference(cert, scope);
      construct(cert, {
        name: 'RTCCertificate',
        args: [cert.expires]
      });
      return getRefId(cert);
    });
  }

}
