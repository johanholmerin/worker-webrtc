import { call } from '../utils/com.js';

export default datachannel => Object.assign(datachannel, {
  onbufferedamountlow(event) {
    call(this, {
      name: 'onbufferedamountlow',
      args: [{}]
    });
  },
  onclose(event) {
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
