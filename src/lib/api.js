import queryString from 'query-string';
import fetch from 'isomorphic-unfetch';
import { ResponseError } from '../lib/errors';

const API_URL = process.env.API_URL;

async function fetchData(url, params = {}) {
  let res = await fetch(`${url}?${queryString.stringify(params)}`);
  let errorCode = res.status > 200 ? res.status : null;

  if (errorCode) {
    throw new ResponseError({
      statusCode: errorCode,
      statusText: res.statusText
    });
  }

  return res.json();
}

export function getHome({ fiscalYear }) {
  let url = `${API_URL}/pages/home`;

  if (fiscalYear) {
    return fetchData(url, { fiscal_year: fiscalYear });
  }

  return fetchData(url);
}

export function searchContracts({ query, page, pageSize }) {
  let url = `${API_URL}/contracts/`;
  return fetchData(url, { search: query, page, page_size: pageSize });
}

export async function getContractor({ slug }) {
  let contractor = await fetchData(`${API_URL}/contractors/${slug}/`);

  // TODO: Handle pagination
  let entities = await fetchData(`${API_URL}/entities/`, {
    contractor: contractor.id
  });

  // TODO: Handle pagination
  let services = await fetchData(`${API_URL}/services/`, {
    contractor: contractor.id
  });

  // TODO: Handle pagination
  let contracts = await fetchData(`${API_URL}/contracts/`, {
    contractor: contractor.id
  });

  return {
    contractor,
    entities: entities.results,
    services: services.results,
    contracts: contracts.results
  };
}

export async function searchContractors({ query, page, pageSize }) {
  return fetchData(`${API_URL}/contractors/`, {
    search: query,
    page,
    page_size: pageSize
  });
}

export async function getContract({ slug }) {
  let contract = await fetchData(`${API_URL}/contracts/${slug}/`);

  if (contract.document) {
    contract.document = await fetchData(contract.document);
  }

  return contract;
}

export async function getEntity({ slug }) {
  let entity = await fetchData(`${API_URL}/entities/${slug}/`);

  // TODO: Handle pagination
  let contractors = await fetchData(`${API_URL}/contractors/`, {
    entity: entity.id
  });

  // TODO: Handle pagination
  let contracts = await fetchData(`${API_URL}/contracts/`, {
    entity: entity.id
  });

  return {
    entity,
    contractors: contractors.results,
    contracts: contracts.results
  };
}

export function searchEntities({ query, page, pageSize }) {
  return fetchData(`${API_URL}/entities/`, {
    search: query,
    page,
    page_size: pageSize
  });
}

export function getGeneralTrends() {
  return fetchData(`${API_URL}/pages/trends/general/`);
}

export function getServiceTrends() {
  return fetchData(`${API_URL}/pages/trends/services/`);
}
