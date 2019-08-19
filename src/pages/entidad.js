import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import Pagination from '../components/pagination';
import PaginatedChart from '../components/paginated-chart';
import SpendingOverTimeChart from '../components/spending-over-time-chart';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';
import {
  getEntity,
  getSpendingOverTime,
  getContractsByEntityId,
  getServicesByEntityId,
  getContractorsByEntityId
} from '../lib/api';
import { formatDate } from '../lib/date';

class Entidad extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    let result = await getEntity({ slug });

    let spendingOverTime = await getSpendingOverTime({
      entity: result.entity.id
    });

    return {
      ...result,
      spendingOverTime
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      contracts: props.contracts,
      services: props.services,
      contractors: props.contractors
    };
  }

  handlePageChange = async ({ page }) => {
    let contracts = await getContractsByEntityId(this.props.entity.id, {
      page
    });

    this.setState({
      contracts
    });
  };

  handleServicesPageChange = async ({ page }) => {
    let services = await getServicesByEntityId(this.props.entity.id, { page });
    this.setState({ services });
  };

  handleContractorsPageChange = async ({ page }) => {
    let contractors = await getContractorsByEntityId(this.props.entity.id, {
      page
    });
    this.setState({ contractors });
  };

  render() {
    let { entity, spendingOverTime } = this.props;
    let { contracts, services, contractors } = this.state;

    return (
      <div>
        <Head title={entity.name} />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <h2 className="mb-1 text-grey-darkest">{entity.name}</h2>

            <h3 className="mb-2 text-grey-darker">
              <span className="font-bold">
                {intcomma(entity.contracts_count)}
              </span>{' '}
              contratos otorgados por un total de $
              <span className="font-bold">
                {intcomma(entity.contracts_total)}
              </span>
            </h3>

            <div className="mt-4 mb-2">
              <SpendingOverTimeChart
                dataPoints={spendingOverTime}
                width={100}
                height={25}
              />
            </div>

            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-grey-light">
                <h2 className="mt-2 mb-2 pb-2 border-b">Servicios</h2>
                <PaginatedChart
                  data={services}
                  onPageChange={this.handleServicesPageChange}
                />
              </div>
              <div className="w-full sm:flex-1 px-4 py-2 m-2">
                <h2 className="mt-2 mb-2 pb-2 border-b">Contratistas</h2>
                <PaginatedChart
                  data={contractors}
                  onPageChange={this.handleContractorsPageChange}
                />
              </div>
            </div>

            <div className="mt-4 mb-2">
              <h2 className="mt-2 mb-2 pb-2 border-b">Contratos</h2>
              <div id="contracts-list" className="mt-2">
                {contracts.results.map((contract) => (
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
                        Otorgado: {formatDate(contract.date_of_grant, 'short')}
                      </div>
                      <div className="text-grey-darkest">
                        Vigencia:{' '}
                        {formatDate(contract.effective_date_from, 'short')} -{' '}
                        {formatDate(contract.effective_date_to, 'short')}
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
              </div>
              {contracts.count > 0 && contracts.total_pages > 1 ? (
                <div className="text-center mt-4">
                  <Pagination
                    page={contracts.page}
                    pages={contracts.total_pages}
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

export default Entidad;
