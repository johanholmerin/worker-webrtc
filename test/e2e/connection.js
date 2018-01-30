import test from 'blue-tape';

test('E2E - connect and send message back and forth', function (t) {
  t.plan(1);

  const iceServers = [{
    urls: 'stun:stun.l.google.com:19302'
  }, {
    urls: 'stun:global.stun.twilio.com:3478?transport=udp'
  }];

  const peer1 = new RTCPeerConnection({ iceServers });
  const peer2 = new RTCPeerConnection({ iceServers });

  peer1.onnegotiationneeded = () => {
    peer1.createOffer().then(offer => {
      return Promise.all([
        peer1.setLocalDescription(offer),
        peer2.setRemoteDescription(offer)
      ]);
    }).then(() => {
      return peer2.createAnswer();
    }).then(answer => {
      return Promise.all([
        peer2.setLocalDescription(answer),
        peer1.setRemoteDescription(answer)
      ]);
    }).catch(err => t.fail(err.message));
  };

  peer1.onicecandidate = ({ candidate }) => {
    if (!candidate) return;
    peer2.addIceCandidate(candidate);
  };

  peer2.onicecandidate = ({ candidate }) => {
    if (!candidate) return;
    peer1.addIceCandidate(candidate);
  };

  const channel1 = peer1.createDataChannel('label');

  channel1.onopen = () => {
    channel1.send('hey peer2, how is it going?');
  };

  channel1.onmessage = ({ data }) => {
    t.pass();
  };

  channel1.onerror = error => t.fail(error.message);

  peer2.ondatachannel = ({ channel }) => {
    channel.onmessage = ({ data }) => {
      channel.send('👍');
    };
    channel.onerror = error => t.fail(error.message);
  };
});
