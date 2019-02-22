import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Head from '../components/head';
import Search from '../components/search';
import Pagination from '../components/pagination';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';
import { searchContracts } from '../lib/api';

const PAGE_SIZE = 12;

class Buscar extends React.Component {
  static async getInitialProps({ query }) {
    let searchQuery = query.q;

    if (!searchQuery) {
      return {
        query: '',
        page: 1,
        count: 0,
        totalPages: 1,
        results: []
      };
    }

    let page = (query.page && parseInt(query.page, 10)) || 1;

    let data = await searchContracts({
      query: searchQuery,
      page,
      pageSize: PAGE_SIZE
    });

    return {
      query: searchQuery,
      page,
      count: data.count,
      totalPages: data.total_pages,
      results: data.results
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
      pathname: '/buscar',
      query: { q: this.props.query, page }
    });

    window.scrollTo(0, 0);
    document.body.focus();
  };

  handleSubmit = ({ query }) => {
    Router.push({
      pathname: '/buscar',
      query: { q: query }
    });
  };

  render() {
    return (
      <div>
        <Head title="Buscar" />
        <div className="flex self-start justify-center">
          <div className="w-full max-w-lg mb-4">
            <Search
              query={this.props.query}
              onSubmit={this.handleSubmit}
              placeholder="Busca contratos por entidad gubernamental, contratista, o palabra clave"
            />
            <div className="mt-4">
              <p>
                Se encontraron{' '}
                <span className="font-bold text-grey-darkest">
                  {intcomma(this.props.count)}
                </span>{' '}
                contratos.
              </p>
            </div>

            <div className="mt-2">
              {this.props.results.map((contract) => (
                <Link
                  href={`/contratos?slug=${contract.slug}`}
                  as={`/contratos/${contract.slug}`}
                  key={contract.id.toString()}>
                  <a className="block py-4 border-b border-grey-light no-underline hover:bg-grey-lightest">
                    <div className="text-xl font-bold text-grey-darkest">
                      {contract.number}{' '}
                      <span className="text-base text-grey-darker">
                        ${millify(contract.amount_to_pay)}
                      </span>
                    </div>
                    <div className="text-grey-darkest">
                      Tipo de servicio: {contract.service.name}
                    </div>
                    <div className="text-grey-darkest">
                      Entidad: {contract.entity.name}
                    </div>
                    <div className="text-grey-darkest">
                      Otorgado: {contract.date_of_grant}
                    </div>
                    <div className="text-grey-darkest">
                      Contratistas:{' '}
                      {contract.contractors.map((contractor) => (
                        <span key={contractor.id.toString()}>
                          {contractor.name}
                        </span>
                      ))}
                    </div>
                  </a>
                </Link>
              ))}

              {this.props.count > 0 ? (
                <div className="text-center mt-4">
                  <Pagination
                    page={this.props.page}
                    pages={this.props.totalPages}
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

export default Buscar;
