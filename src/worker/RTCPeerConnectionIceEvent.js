import RTCIceCandidate from './RTCIceCandidate.js';
import * as check from '../utils/check.js';
import assert from '../utils/assert.js';

export default class RTCPeerConnectionIceEvent extends Event {

  constructor(type, options) {
    super(type, options);

    assert(
      check.object(options) || check.undefined(options),
      `'${options}' is not an object`
    );

    const { candidate } = options || {};
    assert(
      check.undefined(candidate) ||
        check.null(candidate) ||
        candidate instanceof RTCIceCandidate,
      `'${candidate}' is not a valid value for candidate`
    );

    this.candidate = candidate || null;
  }

  get [Symbol.toStringTag]() {
    return 'RTCPeerConnectionIceEvent';
  }

}
