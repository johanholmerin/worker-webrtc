import * as check from '../utils/check.js';
import assert from '../utils/assert.js';

export default class RTCIceCandidate {

  constructor(config) {
    assert(arguments.length, 'Not enough arguments');
    assert(
      check.undefined(config) || check.object(config),
      `'${config}' is not an object`
    );
    const { candidate } = config || {};

    assert(
      !check.undefined(candidate),
      `'${candidate}' is not a valid value for candidate`
    );

    this.candidate = String(candidate);
    this.spdMid = null;
    this.sdpMLineIndex = 0;
  }

  toJSON() {
    return {
      candidate: this.candidate,
      sdpMLineIndex: this.sdpMLineIndex,
      sdpMid: this.sdpMid
    };
  }

}
