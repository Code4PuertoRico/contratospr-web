import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import ContractsChart from '../components/contracts-chart';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';

async function fetchData({ slug }) {
  let entity = await (await fetch(
    `${process.env.API_URL}/entities/${slug}/`
  )).json();

  // TODO: Handle pagination
  let contractors = await (await fetch(
    `${process.env.API_URL}/contractors/?entity=${entity.id}`
  )).json();

  // TODO: Handle pagination
  let contracts = await (await fetch(
    `${process.env.API_URL}/contracts/?entity=${entity.id}`
  )).json();

  return {
    entity,
    contractors: contractors.results,
    contracts: contracts.results
  };
}

function getChartData(contracts) {
  let chartData = [];
  let groups = {};

  for (let contract of contracts) {
    if (!groups[contract.date_of_grant]) {
      groups[contract.date_of_grant] = [];
    }
    groups[contract.date_of_grant].push(parseFloat(contract.amount_to_pay));
  }

  for (let [date, amounts] of Object.entries(groups)) {
    chartData.push({
      x: date,
      y: amounts.reduce((total, amount) => total + amount),
      contracts: amounts.length
    });
  }

  return chartData;
}

class Entidades extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    return fetchData({ slug });
  }

  constructor(props) {
    super(props);

    this.state = {
      entity: props.entity,
      contractors: props.contractors,
      contracts: props.contracts,
      chartData: getChartData(props.contracts)
    };
  }

  render() {
    return (
      <div>
        <Head title="Entidades" />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-grey-light text-lg text-grey-darkest">
                <h2 className="mb-2">{this.state.entity.name}</h2>

                <p className="font-bold">Contratos</p>
                <p className="mb-2">
                  {intcomma(this.state.entity.contracts_count)}
                </p>

                <p className="font-bold">Cuantía</p>
                <p className="mb-2">
                  ${intcomma(this.state.entity.contracts_total)}
                </p>

                <h3 className="mt-4 mb-2">Contratistas</h3>
                <ul className="list-reset">
                  {this.state.contractors.map((contractor) => (
                    <li key={contractor.id.toString()}>
                      <Link href={`/contratista/${contractor.slug}`}>
                        <a className="text-grey-darkest hover:text-black">
                          {contractor.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:flex-1 px-4 py-2 m-2 text-lg text-grey-darkest">
                <div className="mt-2 mb-4">
                  <h2>Contratos</h2>
                </div>
                <div className="mt-2 mb-4">
                  <ContractsChart data={this.state.chartData} height={100} />
                </div>
                <div
                  id="contracts-list"
                  className="sm:overflow-y-scroll sm:max-h-screen mt-2 border-t border-b">
                  {this.state.contracts.map((contract) => (
                    <Link
                      href={`/contratos/${contract.slug}`}
                      key={contract.id.toString()}>
                      <a
                        className="block py-4 border-b border-grey-light no-underline hover:bg-grey-lightest"
                        data-date={contract.date_of_grant}>
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
                          Otorgado: {contract.date_of_grant}
                        </div>
                        <div className="text-grey-darkest">
                          Contratistas:
                          {contract.contractors.map((contractor) => (
                            <span key={contractor.id.toString()}>
                              {contractor.name}
                            </span>
                          ))}
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Entidades;
