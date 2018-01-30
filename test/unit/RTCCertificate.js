import test from '../worker/tape.js';

test('RTCPeerConnection.generateCertificate', function (t) {
  return RTCPeerConnection.generateCertificate({
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1])
  }).then(cert => {
    t.ok(cert instanceof RTCCertificate, 'instanceof RTCCertificate');
    t.ok(typeof cert.expires === 'number', 'expires property');
  });
});
