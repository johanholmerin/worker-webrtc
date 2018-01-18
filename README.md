# Worker WebRTC Polyfill

## Installation

```shell
npm install worker-webrtc
```

## Usage

```javascript
// in window
import workerRTC from 'worker-webrtc/window.js';

const worker = new Worker('worker.js');
workerRTC(worker);
```

```javascript
// worker.js
// NOTE: EventTarget polyfill needed here
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from 'worker-webrtc/worker.js';

const connection = new RTCPeerConnection();
const datachannel = connection.createDataChannel('label');
...
```

## Notes - read before using

### EventTarget

The polyfill extends EventTarget, which is not yet supported in all browsers.
You are going to need a EventTarget polyfill, such as
[event-target](https://github.com/WebReflection/event-target).

This is only needed in the Worker.

### Babel

If using Babel < 7, [babel-plugin-transform-builtin-classes](
https://github.com/WebReflection/babel-plugin-transform-builtin-classes) is
required.

### Streams

Media streams, accessible through `getUserMedia()` and `captureStream()`, are
not supported by the polyfill.
