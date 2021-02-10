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

  server.get('/colecciones-de-datos/:id/:type', (req, res) => {
    let type = req.params.type;
    switch (req.params.type) {
      case 'contratos':
        type = 'contract';
        break;
      case 'contratistas':
        type = 'contractor';
        break;
      case 'entidades':
        type = 'entity';
        break;
      case 'servicios':
        type = 'service';
        break;
      case 'documentos':
        type = 'document';
        break;
    }
    return app.render(req, res, '/coleccion-de-datos', {
      id: req.params.id,
      type,
      page: req.query.page,
    });
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
