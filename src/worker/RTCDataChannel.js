import EventTarget from 'event-target';
import { call } from '../utils/com.js';

export default class RTCDataChannel extends EventTarget {

  constructor(label, options = {}) {
    if (options === null) options = {};

    super();

    this.label = String(label);

    this.ordered = Boolean(options.ordered);
    this.maxPacketLifeTime = Number(options.maxPacketLifeTime) || null;
    this.maxRetransmits = Number(options.maxRetransmits) || null;
    this.protocol = String(options.protcol || '');
    this.negotiated = Boolean(this.negotiated);
    this.id = Number(options.id) || 65535;

    this.binaryType = 'blob';
    this.bufferedAmount = 0;
    this.bufferedAmountLowThreshold = 0;
    this.maxRetransmitTime = 65535;
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
    this.readyState = 'closing';
    call(this, {
      name: 'args',
      args: []
    });
  }

}
