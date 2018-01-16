import proxyRTCDataChannel from './proxyRTCDataChannel.js';
import { addReference, getRef, call, set, construct } from '../utils/com.js';

export default class RTCPeerConnectionProxy extends RTCPeerConnection {

  constructor(...args) {
    super(...args);

    Object.assign(this, {
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
        const { scope } = getRef(this);
        addReference(channel, scope);
        construct(channel, {
          name: 'RTCDataChannel',
          args: [event.channel.label, {}]
        });
        proxyRTCDataChannel(channel);
        call(this, {
          name: '_ondatachannel',
          args: [channel._id]
        });
      },
      onicecandidate(event) {
        const candidate = event.candidate && event.candidate.toJSON();
        call(this, {
          name: 'onicecandidate',
          args: [{ candidate }]
        });
      },
      oniceconnectionstatechange(event) {
        set(this, {
          iceConnectionState: this.iceConnectionState,
          iceGatheringState: this.iceGatheringState
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
          signalingState: this.signalingState
        });
        call(this, {
          name: 'onsignalingstatechange',
          args: [{}]
        });
      }
    });

    // XXX wait for reference add
    setTimeout(() => {
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

}
