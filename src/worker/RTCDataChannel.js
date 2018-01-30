import { call } from '../utils/com.js';
import * as is from '../utils/is.js';
import assert from '../utils/assert.js';
import * as convert from '../utils/convert.js';
import * as utils from '../utils/utils.js';

export default class RTCDataChannel extends EventTarget {

  constructor(label, options) {
    assert(arguments.length, new TypeError('Not enough arguments'));
    assert(
      is.undefined(options) || is.object(options),
      `'${options}' is not a valid value for options`
    );
    const {
      maxRetransmits,
      ordered = true,
      protocol = '',
      negotiated = false,
      id
    } = options || {};

    super();

    this.label = convert.toString(label);
    assert(this.label.length <= 65535, new TypeError('Label too long'));

    this.readyState = 'connecting';
    this.maxRetransmits = is.undefined(maxRetransmits) ?
      null :
      convert.toUnsignedShort(maxRetransmits);
    this.ordered = Boolean(ordered);

    this.protocol = convert.toString(protocol);
    assert(this.protocol.length <= 65535, new TypeError('Protocol too long'));

    this.negotiated = Boolean(negotiated);
    this.id = this.negotiated && !is.undefined(id) ?
      convert.toUnsignedShort(id) :
      null;

    assert(
      !this.negotiated || this.id !== null,
      new TypeError('Id required when negotiated is true')
    );

    assert(this.id !== 65535, new TypeError(`Id can't be 65535`));

    this.binaryType = 'blob';
    this.bufferedAmount = 0;
    this.bufferedAmountLowThreshold = 0;
    this.maxRetransmitTime = 65535;
    this.reliable = true;
  }

  get [Symbol.toStringTag]() {
    return 'RTCDataChannel';
  }

  send(data) {
    assert(
      is.string(data) ||
        is.blob(data) ||
        is.arrayBuffer(data) ||
        is.arrayBufferView(data),
      new TypeError('Invalid type')
    );

    // bufferedAmount needs to be set synchronously
    this.bufferedAmount += utils.getSize(data);

    call(this, {
      name: 'send',
      args: [data]
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

utils.addPropertyListeners(RTCDataChannel, [
  'bufferedamountlow',
  'close',
  'error',
  'message',
  'open'
]);
