import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';
import Head from '../components/head';
import Search from '../components/search';

async function fetchData(fiscalYear) {
  let url = `${process.env.API_URL}/pages/home`;

  if (fiscalYear) {
    url = `${url}?fiscal_year=${fiscalYear}`;
  }

  return (await fetch(url)).json();
}

class Index extends React.Component {
  static async getInitialProps() {
    return fetchData();
  }

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props);
  }

  handleChangeFiscalYear = async (value) => {
    this.setState((state) => {
      return {
        fiscal_year: {
          ...state.fiscal_year,
          current: parseInt(value, 10)
        }
      };
    });

    let data = await fetchData(value);

    this.setState(data);
  };

  handleSubmit = async ({ query }) => {
    if (query) {
      Router.push(`/buscar?q=${query}`);
    }
  };

  render() {
    return (
      <div>
        <Head title="Contratos de Puerto Rico" />
        <div className="my-4 mt-8 sm:mt-16">
          <div className="text-xl text-center">
            Durante el año fiscal
            <div className="inline-block relative">
              <div className="inline-block relative">
                <select
                  className="block text-lg appearance-none w-full bg-white border-b border-grey-light hover:border-grey px-2 pr-6 rounded-none focus:outline-none focus:shadow-outline"
                  value={this.state.fiscal_year.current}
                  onChange={(e) => this.handleChangeFiscalYear(e.target.value)}>
                  {this.state.fiscal_year.choices.map((choice) => (
                    <option value={choice} key={choice.toString()}>
                      {choice}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            se otorgaron{' '}
            <span className="font-bold text-grey-darkest">
              {intcomma(this.state.contracts_count)}
            </span>{' '}
            contratos por un total de{' '}
            <span className="font-bold text-grey-darkest">
              ${millify(this.state.contracts_total)}
            </span>
            .
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <Search
              onSubmit={this.handleSubmit}
              placeholder="Busca contratos por entidad gubernamental, contratista, o palabra clave"
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-8 sm:mt-16">
          <div className="lg:flex w-full">
            <div className="lg:w-1/3 mb-4 sm:mr-2 border rounded border-grey-light">
              <h3 className="p-2 text-center border-b border-grey-light">
                Contratos
              </h3>
              {this.state.recent_contracts.map((contract) => (
                <Link
                  href={`/contrato?slug=${contract.slug}`}
                  as={`/contratos/${contract.slug}`}
                  key={contract.id.toString()}>
                  <a className="flex sm:h-32 p-2 border-b border-grey-light no-underline hover:bg-grey-lightest">
                    <div className="flex-1 self-center">
                      <div className="font-bold text-grey-darkest">
                        {contract.number}{' '}
                        <span className="text-base text-grey-darker">
                          ${millify(contract.amount_to_pay)}
                        </span>
                      </div>
                      <div className="text-grey-darkest">
                        Otorgado: {contract.date_of_grant}
                      </div>
                      <div className="text-grey-darkest">
                        Entidad: {contract.entity.name}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            <div className="lg:w-1/3 mb-4 sm:mr-2 border rounded border-grey-light">
              <h3 className="p-2 text-center border-b border-grey-light">
                Contratistas
              </h3>
              {this.state.contractors.map((contractor) => (
                <Link
                  href={`/contratista?slug=${contractor.slug}`}
                  as={`/contratistas/${contractor.slug}`}
                  key={contractor.id.toString()}>
                  <a className="flex sm:h-32 p-2 border-b border-grey-light no-underline hover:bg-grey-lightest">
                    <div className="flex-1 self-center">
                      <div className="font-bold text-grey-darkest">
                        {contractor.name}
                      </div>
                      <div className="text-grey-darkest">
                        Contratos: {intcomma(contractor.contracts_count)}
                      </div>
                      <div className="text-grey-darkest">
                        Cuantía: ${millify(contractor.contracts_total)}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            <div className="lg:w-1/3 mb-4 border rounded border-grey-light">
              <h3 className="p-2 text-center border-b border-grey-light">
                Entidades
              </h3>
              {this.state.entities.map((entity) => (
                <Link
                  href={`/entidad?slug=${entity.slug}`}
                  as={`/entidades/${entity.slug}`}
                  key={entity.id.toString()}>
                  <a className="flex sm:h-32 p-2 border-b border-grey-light no-underline hover:bg-grey-lightest">
                    <div className="flex-1 self-center">
                      <div className="font-bold text-grey-darkest">
                        {entity.name}
                      </div>
                      <div className="text-grey-darkest">
                        Contratos: {intcomma(entity.contracts_count)}
                      </div>
                      <div className="text-grey-darkest">
                        Cuantía: ${millify(entity.contracts_total)}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
