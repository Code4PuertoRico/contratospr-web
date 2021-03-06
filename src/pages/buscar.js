import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import SpendingOverTimeChart from '../components/spending-over-time-chart';
import Head from '../components/head';
import Pagination from '../components/pagination';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';
import { formatDate } from '../lib/date';
import {
  searchContracts,
  getEntitiesByIds,
  getServicesByIds,
  getSpendingOverTime,
} from '../lib/api';
import EntitySelect from '../components/select/entity';
import ServiceSelect from '../components/select/service';

const PAGE_SIZE = 12;

class Buscar extends React.Component {
  static async getInitialProps({ query }) {
    let searchQuery = query.q;
    let entityIds = query.entity;
    let contractorQuery = query.contractor;
    let serviceIds = query.service;

    if (!searchQuery && !entityIds && !contractorQuery && !serviceIds) {
      return {
        query: '',
        page: 1,
        count: 0,
        totalPages: 1,
        results: [],
        entities: [],
        contractor: '',
        services: [],
        spendingOverTime: [],
      };
    }

    let page = (query.page && parseInt(query.page, 10)) || 1;

    let entities = [];
    let services = [];
    let promises = [];

    if (entityIds) {
      promises.push(
        getEntitiesByIds(entityIds).then((r) => {
          entities = r.results.map((entity) => {
            return {
              value: entity.id,
              label: entity.name,
            };
          });
        })
      );
    }

    if (serviceIds) {
      promises.push(
        getServicesByIds(serviceIds).then((r) => {
          services = r.results.map((service) => {
            return {
              value: service.id,
              label: service.name,
            };
          });
        })
      );
    }

    let data;
    let spendingOverTime;

    await Promise.all([
      ...promises,
      searchContracts({
        query: searchQuery,
        entityIds: entityIds,
        contractor: contractorQuery,
        serviceIds: serviceIds,
        page,
        pageSize: PAGE_SIZE,
      }).then((r) => (data = r)),
      getSpendingOverTime({
        query: searchQuery,
        entityId: entityIds,
        serviceId: serviceIds,
        contractorName: contractorQuery,
      }).then((r) => (spendingOverTime = r)),
    ]);

    return {
      query: searchQuery,
      page,
      count: data.count,
      totalPages: data.total_pages,
      results: data.results,
      entities,
      contractor: contractorQuery,
      services,
      spendingOverTime,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      entities: props.entities,
      services: props.services,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.page !== prevProps.page ||
      this.props.query !== prevProps.query ||
      this.props.entities !== prevProps.entities ||
      this.props.contractor !== prevProps.contractor ||
      this.props.services !== prevProps.services
    ) {
      this.setState(Object.assign({}, this.props));
    }
  }

  handlePageChange = async ({ page }) => {
    let routeQuery = {
      q: this.props.query,
      page,
    };

    if (this.props.contractor) {
      routeQuery.contractor = this.props.contractor;
    }

    if (this.state.entities.length > 0) {
      routeQuery.entity = this.state.entities.map((options) => options.value);
    }

    if (this.state.services.length > 0) {
      routeQuery.service = this.state.services.map((options) => options.value);
    }

    await Router.push({
      pathname: '/buscar',
      query: routeQuery,
    });

    window.scrollTo(0, 0);
    document.body.focus();
  };

  handleSubmit = () => {
    let routeQuery = {
      q: this.queryInput.value,
    };

    if (this.contractorInput.value) {
      routeQuery.contractor = this.contractorInput.value;
    }

    if (this.state.entities.length > 0) {
      routeQuery.entity = this.state.entities.map((options) => options.value);
    }

    if (this.state.services.length > 0) {
      routeQuery.service = this.state.services.map((options) => options.value);
    }

    Router.push({
      pathname: '/buscar',
      query: routeQuery,
    });
  };

  render() {
    return (
      <div>
        <Head title="Buscar" />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:w-1/3 px-4 py-2 border-none border-r sm:border-solid sm:border-gray-200 text-lg text-gray-800">
                <form
                  action="/buscar"
                  method="GET"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleSubmit();
                  }}>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Palabra clave</p>
                    <input
                      className="w-full py-2 px-3 mr-4 appearance-none border rounded text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      defaultValue={this.props.query}
                      ref={(node) => (this.queryInput = node)}
                      placeholder="Busca contratos por palabra clave"
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Contratistas</p>
                    <input
                      className="w-full py-2 px-3 mr-4 appearance-none border rounded text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      defaultValue={this.props.contractor}
                      ref={(node) => (this.contractorInput = node)}
                      placeholder="Busca contratos por contratista"
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Entidades</p>
                    <EntitySelect
                      entities={this.props.entities}
                      onChange={(options) => {
                        this.setState({
                          entities: options,
                        });
                      }}
                    />
                  </div>

                  <div className="mb-2 text-sm">
                    <p className="text-sm">Servicios</p>
                    <ServiceSelect
                      services={this.props.services}
                      onChange={(options) => {
                        this.setState({
                          services: options,
                        });
                      }}
                    />
                  </div>
                  <div className="mt-4 text-sm">
                    <button
                      className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                      type="submit">
                      Buscar
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-full sm:w-2/3 px-4 py-2 text-lg text-gray-800">
                <div className="w-full max-w-3xl mb-4">
                  <SpendingOverTimeChart
                    dataPoints={this.props.spendingOverTime}
                    width={100}
                    height={40}
                  />
                  <div className="mt-4">
                    <p>
                      Se encontraron{' '}
                      <span className="font-bold text-gray-800">
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
                        <a className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100">
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
                            Otorgado: {formatDate(contract.date_of_grant)}
                          </div>
                          <div className="text-gray-800">
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

                    {this.props.count > 0 && this.props.totalPages > 1 ? (
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
          </div>
        </div>
      </div>
    );
  }
}

export default Buscar;
