import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import '../styles/react-dates.css';

import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Bar } from 'react-chartjs-2';
import { DateRangePicker, toMomentObject } from 'react-dates';
import Head from '../components/head';
import Pagination from '../components/pagination';
import intcomma from '../lib/intcomma';
import millify from '../lib/millify';
import { formatDate } from '../lib/date';
import {
  searchContracts,
  getEntitiesByIds,
  getContractorsByIds,
  geServicesByIds,
  getSpendingOverTime
} from '../lib/api';
import EntitySelect from '../components/select/entity';
import ContractorSelect from '../components/select/contractor';
import ServiceSelect from '../components/select/service';

const PAGE_SIZE = 12;

const chartOptions = {
  legend: {
    display: false
  },
  tooltips: {
    displayColors: false,
    callbacks: {
      label: function(item, data) {
        let count = data.datasets[0].data[item.index].count;
        return ['Contratos: ' + count, 'Total: $' + intcomma(item.yLabel)];
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          unit: 'year',
          tooltipFormat: 'MMM YYYY'
        }
      }
    ],
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return '$' + millify(value);
          }
        }
      }
    ]
  }
};

class Buscar extends React.Component {
  static async getInitialProps({ query }) {
    let searchQuery = query.q;
    let entityIds = query.entity;
    let contractorIds = query.contractor;
    let serviceIds = query.service;
    let dateOfGrantAfter = query.date_of_grant_after;
    let dateOfGrantBefore = query.date_of_grant_before;

    if (!searchQuery && !entityIds && !contractorIds && !serviceIds) {
      return {
        query: '',
        page: 1,
        count: 0,
        totalPages: 1,
        results: [],
        entities: [],
        contractors: [],
        services: [],
        spendingOverTime: {},
        startDate: null,
        endDate: null
      };
    }

    let page = (query.page && parseInt(query.page, 10)) || 1;

    let entities = [];
    let contractors = [];
    let services = [];

    if (entityIds) {
      let entitiesResponse = await getEntitiesByIds(entityIds);
      entities = entitiesResponse.results.map((entity) => {
        return {
          value: entity.id,
          label: entity.name
        };
      });
    }

    if (contractorIds) {
      let contractorsResponse = await getContractorsByIds(contractorIds);
      contractors = contractorsResponse.results.map((contractor) => {
        return {
          value: contractor.id,
          label: contractor.name
        };
      });
    }

    if (serviceIds) {
      let servicesResponse = await geServicesByIds(serviceIds);
      services = servicesResponse.results.map((service) => {
        return {
          value: service.id,
          label: service.name
        };
      });
    }

    let data = await searchContracts({
      query: searchQuery,
      entity: entityIds,
      contractor: contractorIds,
      service: serviceIds,
      date_of_grant_after: dateOfGrantAfter,
      date_of_grant_before: dateOfGrantBefore,
      page,
      pageSize: PAGE_SIZE
    });

    let spendingOverTimeResponse = await getSpendingOverTime({
      query: searchQuery,
      entity: entityIds,
      contractor: contractorIds,
      service: serviceIds,
      date_of_grant_after: dateOfGrantAfter,
      date_of_grant_before: dateOfGrantBefore
    });

    let spendingOverTime = {
      labels: spendingOverTimeResponse.map((point) => point.month),
      datasets: [
        {
          label: 'Spending Over Time (Monthly)',
          backgroundColor: 'rgba(52, 144, 220, 0.5)',
          borderColor: 'rgba(52, 144, 220, 1)',
          data: spendingOverTimeResponse.map((point) => {
            return { y: point.total, x: point.month, count: point.count };
          })
        }
      ]
    };

    return {
      query: searchQuery,
      page,
      count: data.count,
      totalPages: data.total_pages,
      results: data.results,
      entities,
      contractors,
      services,
      spendingOverTime,
      startDate: dateOfGrantAfter,
      endDate: dateOfGrantBefore
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      entities: props.entities,
      contractors: props.contractors,
      services: props.services,
      startDate: props.startDate,
      endDate: props.endDate
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.page !== prevProps.page ||
      this.props.query !== prevProps.query ||
      this.props.entities !== prevProps.entities ||
      this.props.contractors !== prevProps.contractors ||
      this.props.services !== prevProps.services
    ) {
      this.setState(Object.assign({}, this.props));
    }
  }

  handlePageChange = async ({ page }) => {
    let routeQuery = { q: this.props.query, page };

    if (this.state.entities.length > 0) {
      routeQuery.entity = this.state.entities.map((options) => options.value);
    }

    if (this.state.contractors.length > 0) {
      routeQuery.contractor = this.state.contractors.map(
        (options) => options.value
      );
    }

    if (this.state.services.length > 0) {
      routeQuery.service = this.state.services.map((options) => options.value);
    }

    await Router.push({
      pathname: '/buscar',
      query: routeQuery
    });

    window.scrollTo(0, 0);
    document.body.focus();
  };

  handleSubmit = () => {
    let routeQuery = { q: this.queryInput.value };

    if (this.state.entities.length > 0) {
      routeQuery.entity = this.state.entities.map((options) => options.value);
    }

    if (this.state.contractors.length > 0) {
      routeQuery.contractor = this.state.contractors.map(
        (options) => options.value
      );
    }

    if (this.state.services.length > 0) {
      routeQuery.service = this.state.services.map((options) => options.value);
    }

    if (this.state.startDate) {
      routeQuery.date_of_grant_after = this.state.startDate.format(
        'YYYY-MM-DD'
      );
    }

    if (this.state.startDate) {
      routeQuery.date_of_grant_before = this.state.endDate.format('YYYY-MM-DD');
    }

    Router.push({
      pathname: '/buscar',
      query: routeQuery
    });
  };

  render() {
    return (
      <div>
        <Head title="Buscar" />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:w-1/3 px-4 py-2 border-none border-r sm:border-solid sm:border-grey-light text-lg text-grey-darkest">
                <form
                  action="/buscar"
                  method="GET"
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleSubmit({ query: this.queryInput.value });
                  }}>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Palabra clave</p>
                    <input
                      className="w-full py-2 px-3 mr-4 appearance-none border rounded text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      defaultValue={this.props.query}
                      ref={(node) => (this.queryInput = node)}
                      placeholder="Busca contratos por entidad gubernamental, contratista, o palabra clave"
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Entidades</p>
                    <EntitySelect
                      entities={this.props.entities}
                      contractors={[]}
                      services={[]}
                      onChange={(options) => {
                        this.setState({
                          entities: options
                        });
                      }}
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Contratistas</p>
                    <ContractorSelect
                      contractors={this.props.contractors}
                      entities={[]}
                      services={[]}
                      onChange={(options) => {
                        this.setState({
                          contractors: options
                        });
                      }}
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Servicios</p>
                    <ServiceSelect
                      contractors={[]}
                      entities={[]}
                      services={this.props.services}
                      onChange={(options) => {
                        this.setState({
                          services: options
                        });
                      }}
                    />
                  </div>
                  <div className="mb-2 text-sm">
                    <p className="text-sm">Periodo de tiempo</p>
                    <DateRangePicker
                      noBorder={true}
                      small={true}
                      block={true}
                      showClearDates={true}
                      isOutsideRange={() => false}
                      startDate={toMomentObject(this.state.startDate)}
                      startDateId="your_unique_start_date_id"
                      endDate={toMomentObject(this.state.endDate)}
                      endDateId="your_unique_end_date_id"
                      onDatesChange={({ startDate, endDate }) =>
                        this.setState({ startDate, endDate })
                      }
                      focusedInput={this.state.focusedInput}
                      onFocusChange={(focusedInput) =>
                        this.setState({ focusedInput })
                      }
                    />
                  </div>
                  <div className="mt-4 text-sm">
                    <button
                      className="py-2 px-4 bg-blue hover:bg-blue-dark text-white font-bold rounded focus:outline-none focus:shadow-outline"
                      type="submit">
                      Buscar
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-full sm:w-2/3 px-4 py-2 text-lg text-grey-darkest">
                <div className="w-full max-w-lg mb-4">
                  <Bar
                    data={this.props.spendingOverTime}
                    width={100}
                    height={40}
                    options={chartOptions}
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
                            Otorgado: {formatDate(contract.date_of_grant)}
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
          </div>
        </div>
      </div>
    );
  }
}

export default Buscar;
