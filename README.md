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
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate
} from 'worker-webrtc/worker.js';

const connection = new RTCPeerConnection();
const datachannel = connection.createDataChannel('label');
...
```

## Babel

If using Babel < 7, [babel-plugin-transform-builtin-classes](https://www.npmjs.com/package/babel-plugin-transform-builtin-classes) is required.

## Streams

Media streams, accessible through `getUserMedia()` and `captureStream()`, are not
supported by the polyfill.
