/* eslint no-console: 0 no-undef: 0 */
const path = require('path');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = path.join(path.dirname(__dirname), 'src');
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let server = express();

  server.get('/entidades/:slug', (req, res) => {
    return app.render(req, res, '/entidad', { slug: req.params.slug });
  });

  server.get('/contratistas/:slug', (req, res) => {
    return app.render(req, res, '/contratista', { slug: req.params.slug });
  });

  server.get('/contratos/:slug', (req, res) => {
    return app.render(req, res, '/contratos', { slug: req.params.slug });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
