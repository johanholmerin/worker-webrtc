import test from '../worker/tape.js';

const pc = new RTCPeerConnection();

test('RTCDataChannel', function (t) {

  t.test('createDataChannel label', function (tt) {
    tt.throws(() => {
      pc.createDataChannel();
    }, TypeError, 'without label');
    tt.throws(() => {
      pc.createDataChannel(' '.repeat(65536));
    }, TypeError, 'too long label');
    tt.throws(() => {
      pc.createDataChannel(Symbol());
    }, TypeError, 'Symbol label');

    tt.doesNotThrow(() => {
      const channel = pc.createDataChannel('label');
      tt.equals(channel.label, 'label');
    }, 'string label');
    tt.doesNotThrow(() => {
      const channel = pc.createDataChannel([]);
      tt.equals(channel.label, '');
    }, 'array label');
    tt.doesNotThrow(() => {
      const channel = pc.createDataChannel({});
      tt.equals(channel.label, '[object Object]');
    }, 'object label');
    tt.doesNotThrow(() => {
      const channel = pc.createDataChannel(1);
      tt.equals(channel.label, '1');
    }, 'number label');

    tt.end();
  });

  t.test('createDataChannel properties', function (tt) {
    tt.test('default values', function (ttt) {
      const channel = pc.createDataChannel('');

      ttt.equals(channel.readyState, 'connecting', 'readyState');
      ttt.equals(channel.ordered, true, 'ordered');
      ttt.equals(channel.maxRetransmits, null, 'maxRetransmits');
      ttt.equals(channel.protocol, '', 'protocol');
      ttt.equals(channel.negotiated, false, 'negotiated');
      ttt.equals(channel.id, null, 'id');

      ttt.end();
    });

    tt.test('set values', function (ttt) {
      const channel = pc.createDataChannel('label', {
        ordered: false,
        maxRetransmits: 1,
        protocol: 'protocol',
        negotiated: true,
        id: 1
      });

      ttt.equals(channel.label, 'label', 'label');
      ttt.equals(channel.ordered, false, 'ordered');
      ttt.equals(channel.maxRetransmits, 1, 'maxRetransmits');
      ttt.equals(channel.protocol, 'protocol', 'protocol');
      ttt.equals(channel.negotiated, true, 'negotiated');
      ttt.equals(channel.id, 1, 'id');

      ttt.end();
    });
  });

  t.test('close', function (tt) {
    const channel = pc.createDataChannel('label');
    channel.close();
    tt.equals(channel.readyState, 'closing', 'readyState');

    tt.end();
  });

});
