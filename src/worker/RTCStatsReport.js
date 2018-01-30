export default class RTCStatsReport {

  constructor(entries) {
    this._entries = new Map(entries);
  }

  entries() {
    return this._entries.entries();
  }

  forEach(...args) {
    return this._entries.forEach(...args);
  }

  get(...args) {
    return this._entries.get(...args);
  }

  has(...args) {
    return this._entries.has(...args);
  }

  keys(...args) {
    return this._entries.keys(...args);
  }

  values(...args) {
    return this._entries.values(...args);
  }

  get [Symbol.iterator]() {
    return this.entries;
  }

  get[Symbol.toStringTag]() {
    return 'RTCStatsReport';
  }

  get size() {
    return this._entries.size;
  }

}
