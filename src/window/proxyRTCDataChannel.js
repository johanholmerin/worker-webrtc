import { call, set } from '../utils/com.js';

export default datachannel => {
  Object.assign(datachannel, {
    onbufferedamountlow(event) {
      call(this, {
        name: 'onbufferedamountlow',
        args: [{}]
      });
    },
    onclose(event) {
      set(datachannel, {
        readyState: this.readyState,
      });
      call(this, {
        name: 'onclose',
        args: [{}]
      });
    },
    onerror(event) {
      call(this, {
        name: '',
        args: [{ message: event.message }]
      });
    },
    onmessage(event) {
      call(this, {
        name: 'onmessage',
        args: [{ data: event.data }]
      });
    },
    onopen(event) {
      call(this, {
        name: 'onopen',
        args: [{}]
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
