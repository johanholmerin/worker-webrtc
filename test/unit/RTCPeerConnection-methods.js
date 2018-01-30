import test from '../worker/tape.js';

test('RTCPeerConnection', function (t) {
  // =================
  //  addIceCandidate
  // =================
  // test('addIceCandidate', function (t) {
  // });

  // =======
  //  close
  // =======
  t.test('close', function (tt) {
    tt.doesNotThrow(() => {
      const pc = new RTCPeerConnection();
      pc.close();
      tt.equals(pc.signalingState, 'closed', 'signalingState');
    });

    tt.end();
  });

  // =============
  //  createOffer
  // =============
  t.test('createOffer', function (tt) {
    const pc = new RTCPeerConnection();
    return pc.createOffer({}).then(offer => {
      tt.equals(typeof offer, 'object', 'typeof is object');
      tt.equals(offer.type, 'offer', 'property type is offer');
      tt.equals(typeof offer.sdp, 'string', 'typeof property sdp is string');
    });
  });

  // =============
  //  createAnswer
  // =============
  t.test('createAnswer', function (tt) {
    const pc = new RTCPeerConnection();
    return pc.createOffer({}).then(offer => {
      return pc.setRemoteDescription(offer);
    }).then(() => {
      return pc.createAnswer({});
    }).then(answer => {
      tt.equals(typeof answer, 'object', 'typeof is object');
      tt.equals(answer.type, 'answer', 'property type is answer');
      tt.equals(typeof answer.sdp, 'string', 'typeof property sdp is string');
    });
  });

  // =====================
  //  setLocalDescription
  // =====================
  t.test('setLocalDescription', function (tt) {
    const pc = new RTCPeerConnection();
    return pc.createOffer().then(offer => {
      return pc.setLocalDescription(offer).then(() => {
        tt.equals(pc.localDescription.type, offer.type, 'localDescription type');
        tt.equals(pc.localDescription.sdp, offer.sdp, 'localDescription sdp');
      });
    });
  });

  // ======================
  //  setRemoteDescription
  // ======================
  t.test('setRemoteDescription', function (tt) {
    const pc = new RTCPeerConnection();
    return pc.createOffer().then(offer => {
      return pc.setRemoteDescription(offer).then(() => {
        tt.equals(pc.remoteDescription.type, offer.type, 'remoteDescription type');
        tt.equals(pc.remoteDescription.sdp, offer.sdp, 'remoteDescription sdp');
      });
    });
  });

  // ==========
  //  getStats
  // ==========
  t.test('setRemoteDescription', function (tt) {
    const pc = new RTCPeerConnection();
    return pc.getStats().then(stats => {
      tt.ok(stats instanceof RTCStatsReport, 'instanceof RTCStatsReport');
    });
  });

});
