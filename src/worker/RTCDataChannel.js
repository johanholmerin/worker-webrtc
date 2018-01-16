import EventTarget from 'event-target';
import { call } from '../utils/com.js';

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

  send(...args) {
    call(this, {
      name: 'send',
      args: [...args]
    });
  }

  close() {
    call(this, {
      name: 'args',
      args: []
    });
  }

}
