export default class RTCIceCandidate {

  constructor(candidateInitDict) {
    this.candidate = candidateInitDict.candidate;
    this.spdMid = candidateInitDict.spdMid;
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
