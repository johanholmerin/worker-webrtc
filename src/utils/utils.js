import * as is from './is.js';

export function getSize(obj) {
  if (!obj) return 0;
  if (is.string(obj) || is.array(obj)) return obj.length;
  if (is.blob(obj)) return obj.size;
  if (is.arrayBuffer(obj) || is.arrayBufferView(obj)) return obj.byteLength;
  return 0;
}

export function addPropertyListeners(cls, names) {
  names.forEach(name => {
    const key = `_${name}`;

    Object.defineProperty(cls.prototype, `on${name}`, {
      set(func) {
        if (is.function(this[key])) {
          this.removeEventListener(name, this[key]);
        }

        this[key] = func;

        if (is.function(func)) {
          this.addEventListener(name, func);
        }
      },
      get() {
        return this[key];
      }
    })
  });
}
