import fetch from 'isomorphic-unfetch';

const API_URL = process.env.API_URL;

async function fetchData(url) {
  return (await fetch(url)).json();
}

export function getHome({ fiscalYear }) {
  let url = `${API_URL}/pages/home`;

  if (fiscalYear) {
    url = `${url}?fiscal_year=${fiscalYear}`;
  }

  return fetchData(url);
}

export function searchContracts({ query, page, pageSize }) {
  let url = `${API_URL}/contracts/?search=${query}&page=${page}&page_size=${pageSize}`;
  return fetchData(url);
}

export async function getContractor({ slug }) {
  let contractor = await (await fetch(
    `${API_URL}/contractors/${slug}/`
  )).json();

  // TODO: Handle pagination
  let entities = await (await fetch(
    `${API_URL}/entities/?contractor=${contractor.id}`
  )).json();

  // TODO: Handle pagination
  let services = await (await fetch(
    `${API_URL}/services/?contractor=${contractor.id}`
  )).json();

  // TODO: Handle pagination
  let contracts = await (await fetch(
    `${API_URL}/contracts/?contractor=${contractor.id}`
  )).json();

  return {
    contractor,
    entities: entities.results,
    services: services.results,
    contracts: contracts.results
  };
}

export function getChartData(contracts) {
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

export async function searchContractors({ query, page, pageSize }) {
  let url = `${API_URL}/contractors/?search=${query}&page=${page}&page_size=${pageSize}`;
  return fetchData(url);
}

export async function getContract({ slug }) {
  let url = `${API_URL}/contracts/${slug}/`;
  let contract = await (await fetch(url)).json();

  if (contract.document) {
    contract.document = await (await fetch(contract.document)).json();
  }

  return contract;
}

export async function getEntity({ slug }) {
  let entity = await (await fetch(`${API_URL}/entities/${slug}/`)).json();

  // TODO: Handle pagination
  let contractors = await (await fetch(
    `${API_URL}/contractors/?entity=${entity.id}`
  )).json();

  // TODO: Handle pagination
  let contracts = await (await fetch(
    `${API_URL}/contracts/?entity=${entity.id}`
  )).json();

  return {
    entity,
    contractors: contractors.results,
    contracts: contracts.results
  };
}

export function searchEntities({ query, page, pageSize }) {
  let url = `${API_URL}/entities/?search=${query}&page=${page}&page_size=${pageSize}`;
  return fetchData(url);
}
