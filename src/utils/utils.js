import * as is from './is.js';

export function getSize(obj) {
  if (!obj) return 0;
  if (is.string(obj) || is.array(obj)) return obj.length;
  if (is.blob(obj)) return obj.size;
  if (is.arrayBuffer(obj) || is.arrayBufferView(obj)) return obj.byteLength;
  return 0;
}
