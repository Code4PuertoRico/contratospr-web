import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import ContractsChart from '../components/contracts-chart';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';
import { getContractor } from '../lib/api';
import { formatDate } from '../lib/date';

class Contratistas extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    return getContractor({ slug });
  }

  render() {
    let { contractor, entities, services, contracts } = this.props;
    return (
      <div>
        <Head title={contractor.name} />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <h2 className="mb-1 text-grey-darkest">{contractor.name}</h2>

            <h3 className="mb-2 text-grey-darker">
              <span className="font-bold">
                {intcomma(contractor.contracts_count)}
              </span>{' '}
              contratos otorgados por un total de $
              <span className="font-bold">
                {intcomma(contractor.contracts_total)}
              </span>
            </h3>

            <div className="mt-4 mb-2">
              <ContractsChart contracts={contracts} height={100} />
            </div>

            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-grey-light text-lg text-grey-darkest">
                <h3 className="mb-2">Servicios</h3>
                <ul className="list-reset">
                  {services.map((service) => (
                    <li key={service.id.toString()}>
                      <span className="text-grey-darkest hover:text-black">
                        {service.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-4 mb-2">Entidades</h3>
                <ul className="list-reset">
                  {entities.map((entity) => (
                    <li key={entity.id.toString()}>
                      <Link
                        href={`/entidad?slug=${entity.slug}`}
                        as={`/entidades/${entity.slug}`}>
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

                <div
                  id="contracts-list"
                  className="sm:overflow-y-scroll sm:max-h-screen mt-2 border-t border-b">
                  {contracts.map((contract) => (
                    <Link
                      href={`/contrato?slug=${contract.slug}`}
                      as={`/contratos/${contract.slug}`}
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
                          Entidad: {contract.entity.name}
                        </div>
                        <div className="text-grey-darkest">
                          Otorgado:{' '}
                          {formatDate(contract.date_of_grant, 'short')}
                        </div>
                        <div className="text-grey-darkest">
                          Vigencia:{' '}
                          {formatDate(contract.effective_date_from, 'short')} -{' '}
                          {formatDate(contract.effective_date_to, 'short')}
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
