/* eslint no-console: 0 no-undef: 0 */
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const dir = path.join(path.dirname(__dirname), 'src');
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let server = express();

  server.get('/about', (req, res) => {
    return res.redirect('/sobre-nosotros');
  });

  server.get('/entidades/:slug', (req, res) => {
    return app.render(req, res, '/entidad', { slug: req.params.slug });
  });

  server.get('/contratistas/:slug', (req, res) => {
    return app.render(req, res, '/contratista', { slug: req.params.slug });
  });

  server.get('/contratos/:slug', (req, res) => {
    return app.render(req, res, '/contrato', { slug: req.params.slug });
  });

  server.get('/colecciones-de-datos/:id', (req, res) => {
    return app.render(req, res, '/coleccion-de-datos', { id: req.params.id });
  });

  server.get('/_api/document', (req, res) => {
    // TODO Only proxy expected URLs
    let adapter = req.query.url.startsWith('https') ? https : http;
    let proxy = adapter.get(req.query.url, (response) => {
      response.pipe(res);
    });
    req.pipe(proxy);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
