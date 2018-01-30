const http = require('http');
const serveStatic = require('serve-static');

const serve = serveStatic('.');

const server = http.createServer((req, res) => {
  serve(req, res, () => {
    res.writeHead(404);
    res.end();
  });
});

server.listen(3000)

process.on('exit', () => server.close());
