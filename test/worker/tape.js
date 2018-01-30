import tape from 'blue-tape';

function test(parentName, tt) {
  return function (name, opts, func) {
    if (typeof opts === 'function') {
      func = opts;
      opts = undefined;
    }
    const fullname = parentName ? [parentName, name].join(' - ') : name;

    tt(fullname, opts, function (t) {
      t.test = test(fullname, t.test);
      return func(t);
    });
  }
};

export default test(undefined, tape);
