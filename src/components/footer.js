import React from 'react';

const Footer = () => (
  <footer className="text-center text-sm text-gray-500 mt-4 mb-8">
    <p>
      Esto es un proyecto de{' '}
      <a
        className="underline text-gray-500"
        href="https://github.com/TheIndexingProject/tracking-contratos-pr">
        código abierto
      </a>{' '}
      y no está afiliado al Gobierno de Puerto Rico.
    </p>
  </footer>
);

export default React.memo(Footer);
