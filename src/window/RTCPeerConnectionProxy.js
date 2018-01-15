import { createCom } from './polyfill-worker.js';

function assignChannel(channel, com) {
  Object.assign(channel, {
    onbufferedamountlow(event) {
      console.log('onbufferedamountlow', event);
    },
    onclose(event) {
      console.log('onclose', event);
    },
    onerror(event) {
      console.log('onerror', event);
    },
    onmessage(event) {
      this._com.send('onmessage', { data: event.data });
    },
    onopen(event) {
      this._com.send('onopen', {});
    }
  });
}

export default class RTCPeerConnectionProxy extends RTCPeerConnection {

  constructor(...args) {
    super(...args);

    Object.assign(this, {
      onaddstream(event) {
        this._com.send('onaddstream', {});
      },
      ondatachannel(event) {
        const id = this._com.addReference(event.channel);
        assignChannel(event.channel, this._com);
        createCom(this._com.worker, event.channel, id);
        this._com.worker.postMessage({
          command: 'ondatachannel',
          connectionId: this._com.id,
          id,
          value: { label: event.channel.label }
        });
      },
      onicecandidate(event) {
        this._com.send('onicecandidate', {
          candidate: event.candidate ? event.candidate.toJSON() : undefined
        });
      },
      oniceconnectionstatechange(event) {
        this._com.set('iceConnectionState', this.iceConnectionState);
        this._com.set('iceGatheringState', this.iceGatheringState);
        this._com.send('oniceconnectionstatechange', {});
      },
      onicegatheringstatechange(event) {
        this._com.send('onicegatheringstatechange', {});
      },
      onnegotiationneeded(event) {
        this._com.send('onnegotiationneeded', {});
      },
      onremovestream(event) {
        this._com.send('onremovestream', {});
      },
      onsignalingstatechange(event) {
        this._com.set('signalingState', this.signalingState);
        this._com.send('onsignalingstatechange', {});
      }
    });
  }


  createDataChannel(...args) {
    const channel = super.createDataChannel(...args);
    assignChannel(channel, this._com);
    return channel;
  }

  createOffer(...args) {
    return super.createOffer(...args).then(desc => desc.toJSON());
  }

  createAnswer(...args) {
    return super.createAnswer(...args).then(desc => desc.toJSON());
  }

  getStats() {
    return super.getStats().then(stats => {
      const list = [];
      stats.forEach(stat => list.push(stat));
      return list;
    });
  }

}
