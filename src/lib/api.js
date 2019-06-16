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

export function searchContracts({
  query,
  entity,
  contractor,
  service,
  date_of_grant_after,
  date_of_grant_before,
  page,
  pageSize
}) {
  let url = `${API_URL}/contracts/`;
  return fetchData(url, {
    search: query,
    entity,
    contractor,
    service,
    date_of_grant_after,
    date_of_grant_before,
    page,
    page_size: pageSize
  });
}

export function getSpendingOverTime({
  query,
  entity,
  contractor,
  service,
  date_of_grant_after,
  date_of_grant_before
}) {
  let url = `${API_URL}/contracts/spending_over_time/`;
  return fetchData(url, {
    search: query,
    entity,
    contractor,
    service,
    date_of_grant_after,
    date_of_grant_before
  });
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

export async function searchContractors({
  query,
  entity,
  service,
  page,
  pageSize
}) {
  return fetchData(`${API_URL}/contractors/`, {
    search: query,
    entity,
    service,
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

export async function getEntitiesByIds(entityIds) {
  return fetchData(`${API_URL}/entities/`, {
    id: entityIds
  });
}

export async function getContractorsByIds(contractorIds) {
  return fetchData(`${API_URL}/contractors/`, {
    id: contractorIds
  });
}

export function geServicesByIds(serviceIds) {
  return fetchData(`${API_URL}/services/`, {
    id: serviceIds
  });
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

  // TODO: Handle pagination
  let services = await fetchData(`${API_URL}/services/`, {
    entity: entity.id
  });

  return {
    entity,
    contractors: contractors.results,
    contracts: contracts.results,
    services: services.results
  };
}

export function searchEntities({ query, contractor, service, page, pageSize }) {
  return fetchData(`${API_URL}/entities/`, {
    search: query,
    contractor,
    service,
    page,
    page_size: pageSize
  });
}

export function searchServices({ query, contractor, entity, page, pageSize }) {
  return fetchData(`${API_URL}/services/`, {
    search: query,
    contractor,
    entity,
    page,
    page_size: pageSize
  });
}

export function searchServiceGroups({ query, page, pageSize }) {
  return fetchData(`${API_URL}/service-groups/`, {
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
