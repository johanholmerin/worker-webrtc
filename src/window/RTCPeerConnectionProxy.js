import proxyRTCDataChannel from './proxyRTCDataChannel.js';
import { addReference, getRef, call, set, construct } from '../utils/com.js';

export default class RTCPeerConnectionProxy extends RTCPeerConnection {

  constructor(config) {
    super(config);

    // Workaround for Safari: https://bugs.webkit.org/show_bug.cgi?id=172867
    this.__proto__ = RTCPeerConnectionProxy.prototype;
    const self = this;

    Object.assign(this, {
      // TODO
      // onaddstream(event) {},
      // onconnectionstatechange(event) {},
      // onidentityresult(event) {},
      // onidpassertionerror(event) {},
      // onidpvalidationerror(event) {},
      // onpeeridentity(event) {},
      // onremovestream(event) {},
      // ontrack(event) {},
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
          args: [channel._id]
        });
      },
      onicecandidate(event) {
        const candidate = event.candidate && event.candidate.toJSON();
        call(self, {
          name: 'onicecandidate',
          args: [{ candidate }]
        });
      },
      oniceconnectionstatechange(event) {
        set(self, {
          iceConnectionState: self.iceConnectionState,
          iceGatheringState: self.iceGatheringState
        });
        call(self, {
          name: 'oniceconnectionstatechange',
          args: [{}]
        });
      },
      onicegatheringstatechange(event) {
        call(self, {
          name: 'onicegatheringstatechange',
          args: [{}]
        });
      },
      onnegotiationneeded(event) {
        call(self, {
          name: 'onnegotiationneeded',
          args: [{}]
        });
      },
      onremovestream(event) {
        call(self, {
          name: 'onremovestream',
          args: [{}]
        });
      },
      onsignalingstatechange(event) {
        set(self, {
          signalingState: self.signalingState
        });
        call(self, {
          name: 'onsignalingstatechange',
          args: [{}]
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
      return Array.from(stats.values());
    });
  }

  setLocalDescription(...args) {
    return super.setLocalDescription(...args);
  }

  setRemoteDescription(...args) {
    return super.setRemoteDescription(...args);
  }

  setConfiguration(config) {
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

}
