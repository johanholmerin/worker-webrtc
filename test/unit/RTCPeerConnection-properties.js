import test from '../worker/tape.js';

test('RTCPeerConnection - properties', function (t) {

  t.test('default values', function (tt) {
    const pc = new RTCPeerConnection();

    tt.equal(pc.iceConnectionState, 'new', 'iceConnectionState');
    tt.equal(pc.iceGatheringState, 'new', 'iceGatheringState');
    tt.equal(pc.signalingState, 'stable', 'signalingState');
    tt.equal(pc.localDescription, null, 'localDescription');
    tt.equal(pc.remoteDescription, null, 'remoteDescription');

    tt.end();
  });

  t.end();
});
