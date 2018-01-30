export function toUnsignedShort(val) {
  return Math.max(0, Math.min(Number(val), 65535));
}

export function toUnsignedLong(val) {
  return Math.max(0, Math.min(Number(val), 4294967295));
}

export function toString(val) {
  return '' + val;
}
