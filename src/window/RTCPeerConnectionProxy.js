import proxyRTCDataChannel from './proxyRTCDataChannel.js';
import { addReference, getRef, call, set, construct } from '../utils/com.js';

export default class RTCPeerConnectionProxy extends RTCPeerConnection {

  constructor(...args) {
    super(...args);

    Object.assign(this, {
      onaddstream(event) {
        call(this, {
          name: 'onaddstream',
          args: [{}]
        });
      },
      ondatachannel(event) {
        const { channel } = event;
        const { scope } = getRef(this);
        proxyRTCDataChannel(channel);
        addReference(channel, scope);
        construct(channel, {
          name: 'RTCDataChannel',
          args: [event.channel.label, {}]
        });
        call(this, {
          name: '_ondatachannel',
          args: [channel._id]
        });
      },
      onicecandidate(event) {
        const candidate = event.candidate ? event.candidate.toJSON() : undefined;
        call(this, {
          name: 'onicecandidate',
          args: [{ candidate }]
        });
      },
      oniceconnectionstatechange(event) {
        set(this, {
          name: 'iceConnectionState',
          value: this.iceConnectionState
        });
        set(this, {
          name: 'iceGatheringState',
          value: this.iceGatheringState
        });
        call(this, {
          name: 'oniceconnectionstatechange',
          args: [{}]
        });
      },
      onicegatheringstatechange(event) {
        call(this, {
          name: 'onicegatheringstatechange',
          args: [{}]
        });
      },
      onnegotiationneeded(event) {
        call(this, {
          name: 'onnegotiationneeded',
          args: [{}]
        });
      },
      onremovestream(event) {
        call(this, {
          name: 'onremovestream',
          args: [{}]
        });
      },
      onsignalingstatechange(event) {
        set(this, {
          name: 'signalingState',
          value: this.signalingState
        });
        call(this, {
          name: 'onsignalingstatechange',
          args: [{}]
        });
      }
    });
  }

  createDataChannel(id, ...args) {
    const { scope } = getRef(this);
    const channel = super.createDataChannel(...args);
    proxyRTCDataChannel(channel);
    addReference(channel, scope, id);
  }

  createOffer(...args) {
    return super.createOffer(...args).then(desc => desc.toJSON());
  }

  createAnswer(...args) {
    return super.createAnswer(...args).then(desc => desc.toJSON());
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

}
