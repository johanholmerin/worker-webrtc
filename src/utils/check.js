export function string(obj) {
  return typeof obj === 'string';
}

export function number(obj) {
  return typeof obj === 'number';
}

export function object(obj) {
  return typeof obj === 'object';
}

function _undefined(obj) {
  return typeof obj === 'undefined';
}
export { _undefined as undefined };

export function includes(arr, val) {
  return arr.includes(val);
}

export function url(string) {
  try {
    new URL(string);
    return true;
  } catch(_) {
    return false;
  }
}
