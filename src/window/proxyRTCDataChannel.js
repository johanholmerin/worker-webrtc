import { call, set, serialize } from '../utils/com.js';
import * as utils from '../utils/utils.js';

export default datachannel => {
  const { send } = datachannel;

  Object.assign(datachannel, {
    onbufferedamountlow(event) {
      set(this, {
        bufferedAmount: this.bufferedAmount
      });
      call(this, {
        name: 'dispatchEvent',
        args: [serialize(event, event.type)]
      });
    },
    onclose(event) {
      set(this, {
        readyState: this.readyState,
      });
      call(this, {
        name: 'dispatchEvent',
        args: [serialize(event, event.type)]
      });
    },
    onerror(event) {
      call(this, {
        name: 'dispatchEvent',
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
        name: 'dispatchEvent',
        args: [serialize(event, event.type, {
          data: event.data
        })]
      });
    },
    onopen(event) {
      set(this, {
        readyState: this.readyState
      });
      call(this, {
        name: 'dispatchEvent',
        args: [serialize(event, event.type)]
      });
    },
    send(data) {
      const { bufferedAmount } = this;
      send.call(this, data);
      set(this, {
        bufferedAmount: this.bufferedAmount
      });

      // Emit bufferedamountlow if the browser did
      // not increase bufferedAmount as expected.
      if (
        this.bufferedAmount <= this.bufferedAmountLowThreshold &&
        (bufferedAmount + utils.getSize(data)) > this.bufferedAmountLowThreshold
      ) {
        const event = new Event('bufferedamountlow');
        call(this, {
          name: 'dispatchEvent',
          args: [serialize(event, event.type)]
        });
      }
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
