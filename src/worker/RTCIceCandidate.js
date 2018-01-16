export default class RTCIceCandidate {

  constructor(candidateInitDict) {
    if (arguments.length < 1) {
      throw new TypeError(
        `Failed to construct 'RTCIceCandidate': 1 argument required, but only 0 present.`
      );
    }
    if (candidateInitDict === null) candidateInitDict = {};
    if (typeof candidateInitDict !== 'object') {
      throw new TypeError(
        `Failed to construct 'RTCIceCandidate': parameter 1 ('candidateInitDict') is not an object.`
      );
    }
    if (typeof candidateInitDict.candidate !== 'string' || !candidateInitDict.candidate) {
      throw new DOMException(
        `Failed to construct 'RTCIceCandidate': The 'candidate' property is not a string, or is empty.`
      );
    }

    this.candidate = candidateInitDict.candidate;
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
