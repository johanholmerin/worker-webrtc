import test from '../worker/tape.js';

test('RTCPeerConnection', function (t) {

  // =============
  //  Constructor
  // =============
  t.test('constructor', function (tt) {

    tt.test('should have a length of 0', function (ttt) {
      ttt.plan(1);
      ttt.equal(RTCPeerConnection.length, 0);
    });

    tt.test('should return a RTCPeerConnection instance', function (ttt) {
      ttt.plan(1);
      ttt.ok(new RTCPeerConnection() instanceof RTCPeerConnection);
    });

    tt.test('should accept an object', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({});
      });
    });

    tt.test('should not accept a primitive', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection(1);
      }, TypeError);
    });

  });


  // ==============
  //  certificates
  // ==============
  t.test('certificates', function (tt) {

    tt.test('should not accept a primitive', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ certificates: 1 });
      }, TypeError);
    });

    tt.test('should accept an array', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({ certificates: [] });
      });
    });

    tt.test('should not accept an array of objects', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ certificates: [{}] });
      }, TypeError);
    });

    tt.test('should accept an array of certificates', function () {
      return RTCPeerConnection.generateCertificate({
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1])
      }).then(cert => {
        new RTCPeerConnection({ certificates: [cert] });
      });
    });

  });


  // ==============
  //  bundlePolicy
  // ==============
  t.test('bundlePolicy', function (tt) {

    tt.test('should not accept an empty string', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ bundlePolicy: '' });
      }, TypeError);
    });

    tt.test('should not accept a primitive', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ bundlePolicy: 1 });
      }, TypeError);
    });

    tt.test('should accept undefined', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          bundlePolicy: undefined
        });
      });
    });

    tt.test('should accept balanced', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          bundlePolicy: 'balanced'
        });
      });
    });

    tt.test('should accept max-compat', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          bundlePolicy: 'max-compat'
        });
      });
    });

    tt.test('should accept max-bundle', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          bundlePolicy: 'max-bundle'
        });
      });
    });

  });


  // ======================
  //  iceCandidatePoolSize
  // ======================
  t.test('iceCandidatePoolSize', function (tt) {

    tt.test('should accept 0', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceCandidatePoolSize: 0
        });
      });
    });

    tt.test('should accept 255', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceCandidatePoolSize: 255
        });
      });
    });

    tt.test('should not accept -1', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({
          iceCandidatePoolSize: -1
        });
      }, TypeError);
    });

    tt.test('should not accept 256', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({
          iceCandidatePoolSize: 256
        });
      }, TypeError);
    });

    tt.test('should not accept an object', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({
          iceCandidatePoolSize: {}
        });
      }, TypeError);
    });

  });


  // ============
  //  iceServers
  // ============
  t.test('iceServers', function (tt) {

    tt.test('should accept empty array', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceServers: []
        });
      });
    });

    tt.test('should not accept object', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({
          iceServers: {}
        });
      });
    });

    tt.test('invalid arrays', function (ttt) {
      ttt.plan(4);
      ttt.throws(() => {
        new RTCPeerConnection({
          iceServers: ['foo']
        });
      });
      ttt.throws(() => {
        new RTCPeerConnection({
          iceServers: [1]
        });
      });
      ttt.throws(() => {
        new RTCPeerConnection({
          iceServers: [undefined, false]
        });
      });
      ttt.throws(() => {
        new RTCPeerConnection({
          iceServers: [{}]
        });
      });
    });

    tt.test('valid values', function (ttt) {
      ttt.plan(3);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceServers: [{
            urls: 'stun:example.com'
          }]
        });
      }, 'One stun url');
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceServers: [{
            urls: ['stun:example.com']
          }]
        });
      }, 'Array of stun server');
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceServers: [{
            urls: ['turn:example.com', 'turns:example.com'],
            username: 'username',
            credential: 'credential'
          }]
        });
      }, 'turn and turns with username and credential');
    });

  });


  // ====================
  //  iceTransportPolicy
  // ====================
  t.test('iceTransportPolicy', function (tt) {

    tt.test('should not accept an empty string', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ iceTransportPolicy: '' });
      }, TypeError);
    });

    tt.test('should not accept 1', function (ttt) {
      ttt.plan(1);
      ttt.throws(() => {
        new RTCPeerConnection({ iceTransportPolicy: 1 });
      }, TypeError);
    });

    tt.test('should accept undefined', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceTransportPolicy: undefined
        });
      });
    });

    tt.test('should accept all', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceTransportPolicy: 'all'
        });
      });
    });

    tt.test('should accept relay', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({
          iceTransportPolicy: 'relay'
        });
      });
    });

  });


  // ==============
  //  peerIdentity
  // ==============
  t.test('peerIdentity', function (tt) {

    tt.test('should accept a string', function (ttt) {
      ttt.plan(1);
      ttt.doesNotThrow(() => {
        new RTCPeerConnection({ peerIdentity: 'peerIdentity' });
      });
    });

  });

});
