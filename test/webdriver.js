require('./server.js');

const wd = require('selenium-webdriver');

function getDriver(name) {
  const browser = require(`selenium-webdriver/${name}`);
  const builder = new wd.Builder();
  const options = new browser.Options();
  const prefs = new wd.logging.Preferences();

  prefs.setLevel(wd.logging.Type.BROWSER, wd.logging.Level.ALL);
  options.setLoggingPrefs(prefs);
  if (typeof options.addArguments === 'function') {
    options.addArguments('--headless');
    if (name === 'chrome') {
      options.addArguments('--no-sandbox');
    }
  }

  return builder
    .forBrowser(wd.Browser[name.toUpperCase()])
    [`set${name.charAt(0).toUpperCase() + name.slice(1)}Options`](options)
    .build();
}

const driver = getDriver('chrome');
process.on('exit', () => driver.quit());

driver
  .get('http://localhost:3000/test/index.html')
  .then(() => driver.executeAsyncScript('runTest(...arguments)'))
  .then(([err, res]) => {
    if (err) throw new Error(err);
    process.stdout.write(res.join(''));
  })
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    process.stderr.write(err);
    process.exit(1);
  });
