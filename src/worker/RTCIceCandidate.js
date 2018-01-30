import * as is from '../utils/is.js';
import assert from '../utils/assert.js';

export default class RTCIceCandidate {

  constructor(config) {
    assert(arguments.length, 'Not enough arguments');
    assert(
      is.undefined(config) || is.object(config),
      `'${config}' is not an object`
    );
    const { candidate } = config || {};

    assert(
      !is.undefined(candidate),
      `'${candidate}' is not a valid value for candidate`
    );

    this.candidate = String(candidate);
    this.spdMid = null;
    this.sdpMLineIndex = 0;
  }

  get [Symbol.toStringTag]() {
    return 'RTCIceCandidate';
  }

  toJSON() {
    return {
      candidate: this.candidate,
      sdpMLineIndex: this.sdpMLineIndex,
      sdpMid: this.sdpMid
    };
  }

}
