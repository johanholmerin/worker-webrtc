import { RTCSdpType } from './enums.js';
import * as check from '../utils/check.js';
import assert from '../utils/assert.js';

export default class RTCSessionDescription {

  constructor(config) {
    assert(
      check.undefined(config) || check.object(config),
      `'${config}' is not an object`
    );
    const { type, sdp } = config || {};

    assert(
      check.undefined(type) ||
        check.includes(RTCSdpType, type),
      `'${type}' is not a valid value for type`
    );

    this.type = type || '';
    this.sdp = String(sdp || '');
  }

  get [Symbol.toStringTag]() {
    return 'RTCSessionDescription';
  }

  toJSON() {
    return {
      sdp: this.sdp,
      type: this.type
    };
  }

}
