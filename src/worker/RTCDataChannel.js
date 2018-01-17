import EventTarget from 'event-target';
import { call } from '../utils/com.js';
import * as check from '../utils/check.js';
import assert from '../utils/assert.js';

export default class RTCDataChannel extends EventTarget {

  constructor(label, options) {
    assert(arguments.length, 'Not enough arguments');
    assert(
      check.undefined(options) || check.object(options),
      `'${options}' is not a valid value for options`
    );
    const {
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol,
      negotiated,
      id,
    } = options || {};

    super();

    this.label = String(label);

    this.ordered = Boolean(ordered);
    this.maxPacketLifeTime = Number(maxPacketLifeTime) || null;
    this.maxRetransmits = Number(maxRetransmits) || null;
    this.protocol = String(protocol || '');
    this.negotiated = Boolean(negotiated);
    this.id = Number(id) || 65535;

    this.binaryType = 'blob';
    this.bufferedAmount = 0;
    this.bufferedAmountLowThreshold = 0;
    this.maxRetransmitTime = 65535;
    this.readyState = 'connecting';
    this.reliable = true;
  }

  get [Symbol.toStringTag]() {
    return 'RTCDataChannel';
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
