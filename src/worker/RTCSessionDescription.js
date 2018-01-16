const RTCSdpType = ['answer', 'offer', 'pranswer', 'rollback'];

export default class RTCSessionDescription {

  constructor(descriptionInitDict = {}) {
    if (descriptionInitDict === null) descriptionInitDict = {};
    if (typeof descriptionInitDict !== 'object') {
      throw new TypeError(
        `Argument 1 of RTCSessionDescription.constructor can't be converted to a dictionary.`
      );
    }
    if (!RTCSdpType.includes(descriptionInitDict.type)) {
      throw new TypeError(
        `'type' member of RTCSessionDescriptionInit '${descriptionInitDict.type}' is not a valid value for enumeration RTCSdpType.`
      );
    }

    this.type = descriptionInitDict.type || '';
    this.sdp = String(descriptionInitDict.sdp || '');
  }

  toJSON() {
    return {
      sdp: this.sdp,
      type: this.type
    };
  }

}
