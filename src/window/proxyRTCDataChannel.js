import { call, set, serialize } from '../utils/com.js';

export default datachannel => {
  Object.assign(datachannel, {
    onbufferedamountlow(event) {
      call(this, {
        name: 'onbufferedamountlow',
        args: [serialize(event, event.type)]
      });
    },
    onclose(event) {
      set(datachannel, {
        readyState: this.readyState,
      });
      call(this, {
        name: 'onclose',
        args: [serialize(event, event.type)]
      });
    },
    onerror(event) {
      call(this, {
        name: 'onerror',
        args: [serialize(event, event.type, {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: serialize(event.error, event.error.message)
        })]
      });
    },
    onmessage(event) {
      call(this, {
        name: 'onmessage',
        args: [serialize(event, event.type, {
          data: event.data
        })]
      });
    },
    onopen(event) {
      set(datachannel, {
        readyState: datachannel.readyState
      });
      call(this, {
        name: 'onopen',
        args: [serialize(event, event.type)]
      });
    }
  });

  set(datachannel, {
    label: datachannel.label,
    ordered: datachannel.ordered,
    macPacketLifeTime: datachannel.maxPacketLifeTime,
    maxRetransmits: datachannel.maxRetransmits,
    protocol: datachannel.protocol,
    negotiated: datachannel.negotiated,
    id: datachannel.id,
    binaryType: datachannel.binaryType,
    bufferedAmount: datachannel.bufferedAmount,
    bufferedAmountLowThreshold: datachannel.bufferedAmountLowThreshold,
    maxRetransmitTime: datachannel.maxRetransmitTime,
    readyState: datachannel.readyState,
    reliable: datachannel.reliable
  });
};
