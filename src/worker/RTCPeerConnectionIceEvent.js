import RTCIceCandidate from './RTCIceCandidate.js';
import * as is from '../utils/is.js';
import assert from '../utils/assert.js';

export default class RTCPeerConnectionIceEvent extends Event {

  constructor(type, options) {
    super(type, options);

    assert(
      is.object(options) || is.undefined(options),
      `'${options}' is not an object`
    );

    const { candidate } = options || {};
    assert(
      is.undefined(candidate) ||
        is.null(candidate) ||
        candidate instanceof RTCIceCandidate,
      `'${candidate}' is not a valid value for candidate`
    );

    this.candidate = candidate || null;
  }

  get [Symbol.toStringTag]() {
    return 'RTCPeerConnectionIceEvent';
  }

}
