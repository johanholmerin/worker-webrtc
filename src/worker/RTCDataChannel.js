import EventTarget from 'event-target';
import * as com from './com.js';

export default class RTCDataChannel extends EventTarget {

  constructor(label, options) {
    super();

    this.binaryType = 'arraybuffer';
    this.bufferedAmount = 0;
    this.bufferedAmountLowThreshold = 0;
    this.id = 65535;
    this.label = label;
    this.maxRetransmitTime = 65535;
    this.maxRetransmits = 65535;
    this.negotiated = false;
    this.ordered = true;
    this.protocol = '';
    this.readyState = 'connecting';
    this.reliable = true;
  }

  send(data) {
    com.call(this._id, 'send', [data]);
  }

  close() {
    console.log('close');
  }

}
