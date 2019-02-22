import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  render() {
    return (
      <html>
        <Head />
        <body className="font-sans font-normal text-black leading-normal">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
