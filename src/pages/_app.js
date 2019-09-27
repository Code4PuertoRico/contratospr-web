import React from 'react';
import Router from 'next/router';
import App from 'next/app';
import NProgress from 'nprogress';
import Layout from '../layouts/main';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
