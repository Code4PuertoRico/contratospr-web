import React from 'react';
import Router from 'next/router';
import App from 'next/app';
import NProgress from 'nprogress';
import Layout from '../layouts/main';
import { pageview } from '../lib/gtag';

import '../styles/app.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeError', () => NProgress.done());
Router.events.on('routeChangeComplete', (url) => {
  NProgress.done();
  setTimeout(() => {
    pageview({ url, title: document.title });
  }, 0);
});

export default class CustomApp extends App {
  render() {
    let { Component, pageProps } = this.props;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}
