export function string(obj) {
  return typeof obj === 'string';
}

export function number(obj) {
  return typeof obj === 'number' && !Number.isNaN(obj);
}

export function object(obj) {
  return typeof obj === 'object';
}

function _undefined(obj) {
  return typeof obj === 'undefined';
}
export { _undefined as undefined };

function _null(obj) {
  return obj === null;
}
export { _null as null };

export function _function(obj) {
  return typeof obj === 'function';
}
export { _function as function };

export function includes(arr, val) {
  return arr.includes(val);
}

export function array(arr) {
  return Array.isArray(arr);
}

export function url(string) {
  try {
    new URL(string);
    return true;
  } catch(_) {
    return false;
  }
}

export function blob(val) {
  return val instanceof Blob;
}

export function arrayBuffer(val) {
  return val instanceof ArrayBuffer;
}

export function arrayBufferView(val) {
  return ArrayBuffer.isView(val);
}
