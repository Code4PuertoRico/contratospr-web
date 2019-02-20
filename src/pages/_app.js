import React from 'react';
import App, { Container } from 'next/app';
import Layout from '../layouts/main';

export default class CustomApp extends App {
  render() {
    let { Component, pageProps } = this.props;

    return (
      <Layout>
        <Container>
          <Component {...pageProps} />
        </Container>
      </Layout>
    );
  }
}
