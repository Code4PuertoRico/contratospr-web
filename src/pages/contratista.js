import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import Pagination from '../components/pagination';
import PaginatedChart from '../components/paginated-chart';
import SpendingOverTimeChart from '../components/spending-over-time-chart';
import millify from '../lib/millify';
import intcomma from '../lib/intcomma';
import {
  getContractor,
  getServicesByContractorId,
  getContractsByContractorId,
  getSpendingOverTime,
} from '../lib/api';
import { formatDate } from '../lib/date';

class Contratistas extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    let result = await getContractor({ slug });

    return { ...result };
  }

  constructor(props) {
    super(props);
    this.state = {
      services: props.services,
      contracts: props.contracts,
      spendingOverTime: [],
    };
  }

  async componentDidMount() {
    let spendingOverTime = await getSpendingOverTime({
      contractorId: this.props.contractor.id,
    });
    this.setState({ spendingOverTime });
  }

  handlePageChange = async ({ page }) => {
    let contracts = await getContractsByContractorId(this.props.contractor.id, {
      page,
    });
    this.setState({ contracts });
  };

  handleServicesPageChange = async ({ page }) => {
    let services = await getServicesByContractorId(this.props.contractor.id, {
      page,
    });
    this.setState({ services });
  };

  render() {
    let { contractor, entities } = this.props;
    let { services, contracts, spendingOverTime } = this.state;
    return (
      <div>
        <Head title={contractor.name} />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <h2 className="mb-1 text-2xl font-semibold text-gray-800">
              {contractor.name}
            </h2>

            <h3 className="mb-2 text-xl font-bold text-gray-600">
              <span className="font-bold">
                {intcomma(contractor.contracts_count)}
              </span>{' '}
              contratos otorgados por un total de $
              <span className="font-bold">
                {intcomma(contractor.contracts_total)}
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
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-gray-200 text-lg text-gray-800">
                <h3 className="mb-2 text-2xl font-bold">Servicios</h3>
                <PaginatedChart
                  data={services}
                  onPageChange={this.handleContractorsPageChange}
                />
              </div>
              <div className="w-full sm:flex-1 px-4 py-2 m-2 text-lg text-gray-800">
                <h3 className="mt-4 mb-2 text-2xl font-bold">Entidades</h3>
                <ul className="list-reset">
                  {entities.map((entity) => (
                    <li key={entity.id.toString()}>
                      <Link
                        href={`/entidad?slug=${entity.slug}`}
                        as={`/entidades/${entity.slug}`}>
                        <a className="underline text-gray-800 hover:text-black">
                          {entity.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <div className="mt-2 mb-4">
                <h2 className="text-2xl font-bold">Contratos</h2>
              </div>

              <div id="contracts-list" className="mt-2 border-t border-b">
                {contracts.results.map((contract) => (
                  <Link
                    href={`/contrato?slug=${contract.slug}`}
                    as={`/contratos/${contract.slug}`}
                    key={contract.id.toString()}>
                    <a
                      className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100"
                      data-date={contract.date_of_grant}>
                      <div className="text-xl font-bold text-gray-800">
                        {contract.number}{' '}
                        <span className="text-base text-gray-600">
                          ${millify(contract.amount_to_pay)}
                        </span>
                      </div>
                      <div className="text-gray-800">
                        Tipo de servicio: {contract.service.name}
                      </div>
                      <div className="text-gray-800">
                        Entidad: {contract.entity.name}
                      </div>
                      <div className="text-gray-800">
                        Otorgado: {formatDate(contract.date_of_grant, 'short')}
                      </div>
                      <div className="text-gray-800">
                        Vigencia:{' '}
                        {formatDate(contract.effective_date_from, 'short')} -{' '}
                        {formatDate(contract.effective_date_to, 'short')}
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

export default Contratistas;
