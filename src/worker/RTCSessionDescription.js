export default class RTCSessionDescription {

  constructor(descriptionInitDict = {}) {
    this.type = descriptionInitDict.type || '';
    this.sdp = descriptionInitDict.sdp || '';
  }

  toJSON() {
    return {
      sdp: this.sdp,
      type: this.type
    };
  }

}
