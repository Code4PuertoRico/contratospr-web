import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Head from '../components/head';
import Search from '../components/search';
import Pagination from '../components/pagination';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';
import { searchContractors } from '../lib/api';

const PAGE_SIZE = 12;

class Contratistas extends React.Component {
  static async getInitialProps({ query }) {
    let searchQuery = query.q || '';
    let page = (query.page && parseInt(query.page, 10)) || 1;
    let data = await searchContractors({
      query: searchQuery,
      page,
      pageSize: PAGE_SIZE,
    });

    return Object.assign({ query: searchQuery, page }, data);
  }

  constructor(props) {
    super(props);

    this.state = {
      query: props.query || '',
      page: props.page || 1,
      count: props.count || 0,
      total_pages: props.total_pages || 1,
      results: props.results || [],
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
      pathname: '/contratistas',
      query: { q: this.state.query, page },
    });

    window.scrollTo(0, 0);
    document.body.focus();
  };

  handleSubmit = ({ query }) => {
    Router.push({
      pathname: '/contratistas',
      query: { q: query },
    });
  };

  render() {
    return (
      <div>
        <Head title="Contratistas" />
        <div className="flex self-start justify-center">
          <div className="w-full max-w-3xl mb-4">
            <Search
              query={this.state.query}
              onSubmit={this.handleSubmit}
              placeholder="Busca contratos por contratista"
            />
            <div className="mt-4">
              <p>
                Se encontraron{' '}
                <span className="font-bold text-gray-800">
                  {intcomma(this.state.count)}
                </span>{' '}
                entidades.
              </p>
            </div>

            <div className="mt-2">
              {this.state.results.map((contractor) => (
                <Link
                  href={`/contratista?slug=${contractor.slug}`}
                  as={`/contratistas/${contractor.slug}`}
                  key={contractor.id.toString()}>
                  <a className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100">
                    <div className="text-xl font-bold text-gray-800">
                      {contractor.name}
                    </div>
                    <div className="text-gray-800">
                      Contratos: {intcomma(contractor.contracts_count)}
                    </div>
                    <div className="text-gray-800">
                      Cuantía: ${millify(contractor.contracts_total)}
                    </div>
                    <div className="text-gray-800">
                      Entidades:{' '}
                      {contractor.entities.map((entity) => (
                        <span key={entity.id.toString()}>{entity.name} </span>
                      ))}
                    </div>
                  </a>
                </Link>
              ))}

              {this.state.count > 0 && this.state.total_pages > 1 ? (
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

export default Contratistas;
