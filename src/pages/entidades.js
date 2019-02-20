import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';
import Head from '../components/head';
import Search from '../components/search';
import Pagination from '../components/pagination';

const PAGE_SIZE = 12;

async function fetchData({ query, page }) {
  return await (await fetch(
    `${
      process.env.API_URL
    }/entities/?search=${query}&page=${page}&page_size=${PAGE_SIZE}`
  )).json();
}

class Entities extends React.Component {
  static async getInitialProps({ query }) {
    let searchQuery = query.q || '';
    let page = (query.page && parseInt(query.page, 10)) || 1;
    let data = await fetchData({ query: searchQuery, page });
    return Object.assign({ query: searchQuery, page }, data);
  }

  constructor(props) {
    super(props);

    this.state = {
      query: props.query || '',
      page: props.page || 1,
      count: props.count || 0,
      total_pages: props.total_pages || 1,
      results: props.results || []
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.page !== prevProps.page ||
      this.props.query !== prevProps.query
    ) {
      this.setState(Object.assign({}, this.props));
    }
  }

  handlePageChange = async ({ page }) => {
    await Router.push({
      pathname: '/entidades',
      query: { q: this.state.query, page }
    });

    window.scrollTo(0, 0);
    document.body.focus();
  };

  handleSubmit = ({ query }) => {
    Router.push({
      pathname: '/entidades',
      query: { q: query }
    });
  };

  render() {
    return (
      <div>
        <Head title="Entidades" />
        <div className="flex self-start justify-center">
          <div className="w-full max-w-lg mb-4">
            <Search
              query={this.state.query}
              onSubmit={this.handleSubmit}
              placeholder="Busca contratos por entidad gubernamental"
            />
            <div className="mt-4">
              <p>
                Se encontraron{' '}
                <span className="font-bold text-grey-darkest">
                  {intcomma(this.state.count)}
                </span>{' '}
                entidades.
              </p>
            </div>

            <div className="mt-2">
              {this.state.results.map((entity) => (
                <Link
                  href={`/entidad?slug=${entity.slug}`}
                  as={`/entidades/${entity.slug}`}
                  key={entity.id.toString()}>
                  <a className="block py-4 border-b border-grey-light no-underline hover:bg-grey-lightest">
                    <div className="text-xl font-bold text-grey-darkest">
                      {entity.name}
                    </div>
                    <div className="text-grey-darkest">
                      Contratos: {intcomma(entity.contracts_count)}
                    </div>
                    <div className="text-grey-darkest">
                      Cuantía: ${millify(entity.contracts_total)}
                    </div>
                  </a>
                </Link>
              ))}

              {this.state.count > 0 ? (
                <div className="text-center mt-4">
                  <Pagination
                    page={this.state.page}
                    pages={this.state.total_pages}
                    onPageChange={this.handlePageChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Entities;
