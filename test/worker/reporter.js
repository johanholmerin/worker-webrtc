import test from 'tape';

function emit(tap) {
  self.postMessage({ tap });
}

test.createStream()
  .on('data', data => {
    emit({
      event: 'data',
      data
    });
  })
  .on('error', error => {
    emit({
      event: 'end',
      error: error.message
    });
  })
  .on('end', () => {
    emit({
      event: 'end'
    });
  });
