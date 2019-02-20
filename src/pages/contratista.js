import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import ContractsChart from '../components/contracts-chart';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';
import { getContractor, getChartData } from '../lib/api';

class Contratistas extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    let data = await getContractor({ slug });
    return data;
  }

  constructor(props) {
    super(props);

    this.state = {
      contractor: props.contractor,
      entities: props.entities,
      services: props.services,
      contracts: props.contracts,
      chartData: getChartData(props.contracts)
    };
  }

  render() {
    return (
      <div>
        <Head title="Contratistas" />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-grey-light text-lg text-grey-darkest">
                <h2 className="mb-2">{this.state.contractor.name}</h2>

                <p className="font-bold">Contratos</p>
                <p className="mb-2">
                  {intcomma(this.state.contractor.contracts_count)}
                </p>

                <p className="font-bold">Cuantía</p>
                <p className="mb-2">
                  ${intcomma(this.state.contractor.contracts_total)}
                </p>

                <h3 className="mt-4 mb-2">Servicios</h3>
                <ul className="list-reset">
                  {this.state.services.map((service) => (
                    <li key={service.id.toString()}>
                      <span className="text-grey-darkest hover:text-black">
                        {service.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-4 mb-2">Entidades</h3>
                <ul className="list-reset">
                  {this.state.entities.map((entity) => (
                    <li key={entity.id.toString()}>
                      <Link href={`/entidad/${entity.slug}`}>
                        <a className="text-grey-darkest hover:text-black">
                          {entity.name}
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

export default Contratistas;
