import React from 'react';

const Footer = () => (
  <footer className="text-center text-sm text-grey-dark mt-4 mb-8">
    <p>
      Esto es un proyecto de{' '}
      <a
        className="text-grey-dark"
        href="https://github.com/TheIndexingProject/tracking-contratos-pr">
        código abierto
      </a>{' '}
      y no está afiliado al Gobierno de Puerto Rico.
    </p>
  </footer>
);

export default React.memo(Footer);
