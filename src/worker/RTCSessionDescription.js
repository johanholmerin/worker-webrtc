import { RTCSdpType } from './enums.js';
import * as is from '../utils/is.js';
import assert from '../utils/assert.js';

export default class RTCSessionDescription {

  constructor(config) {
    assert(
      is.undefined(config) || is.object(config),
      `'${config}' is not an object`
    );
    const { type, sdp } = config || {};

    assert(
      is.undefined(type) ||
        is.includes(RTCSdpType, type),
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
