import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="font-sans font-normal text-black leading-normal">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
