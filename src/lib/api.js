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
      statusText: res.statusText,
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
  entityIds,
  contractor,
  serviceIds,
  page,
  pageSize,
}) {
  let url = `${API_URL}/contracts/`;
  return fetchData(url, {
    search: query,
    entity_id: entityIds,
    contractor_name: contractor,
    service_id: serviceIds,
    page,
    page_size: pageSize,
  });
}

export function getSpendingOverTime({
  query,
  entityId,
  contractorName,
  contractorId,
  serviceId,
}) {
  let url = `${API_URL}/contracts/spending_over_time/`;
  return fetchData(url, {
    search: query,
    entity_id: entityId,
    service_id: serviceId,
    contractor_name: contractorName,
    contractor_id: contractorId,
  });
}

export function getServicesByContractorId(contractorId, { page }) {
  return fetchData(`${API_URL}/services/`, {
    contractor_id: contractorId,
    ordering: '-contracts_total',
    page_size: 12,
    page,
  });
}

export function getContractsByContractorId(contractorId, { page }) {
  return fetchData(`${API_URL}/contracts/`, {
    contractor_id: contractorId,
    exclude_amendments: true,
    page_size: 12,
    page,
  });
}

export async function getContractor({ slug }) {
  let contractor = await fetchData(`${API_URL}/contractors/${slug}/`);
  let services;
  let contracts;

  await Promise.all([
    getServicesByContractorId(contractor.id, { page: 1 }).then(
      (r) => (services = r)
    ),
    getContractsByContractorId(contractor.id, { page: 1 }).then(
      (r) => (contracts = r)
    ),
  ]);

  return {
    contractor,
    entities: contractor.entities,
    services: services,
    contracts: contracts,
  };
}

export async function searchContractors({
  query,
  entity,
  service,
  page,
  pageSize,
}) {
  return fetchData(`${API_URL}/contractors/`, {
    search: query,
    entity,
    service,
    page,
    page_size: pageSize,
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
    id: entityIds,
  });
}

export function getServicesByIds(serviceIds) {
  return fetchData(`${API_URL}/services/`, {
    id: serviceIds,
  });
}

export function getServicesByEntityId(entityId, { page }) {
  return fetchData(`${API_URL}/services/`, {
    entity_id: entityId,
    ordering: '-contracts_total',
    page_size: 12,
    page,
  });
}

export function getContractsByEntityId(entityId, { page }) {
  return fetchData(`${API_URL}/contracts/`, {
    entity_id: entityId,
    exclude_amendments: true,
    page_size: 12,
    page,
  });
}

export function getContractorsByEntityId(entityId, { page }) {
  return fetchData(`${API_URL}/contractors/`, {
    entity_id: entityId,
    ordering: '-contracts_total',
    page_size: 12,
    page,
  });
}

export async function getEntity({ slug }) {
  let entity = await fetchData(`${API_URL}/entities/${slug}/`);
  let contractors;
  let contracts;
  let services;

  await Promise.all([
    getContractorsByEntityId(entity.id, { page: 1 }).then(
      (r) => (contractors = r)
    ),
    getContractsByEntityId(entity.id, { page: 1 }).then((r) => (contracts = r)),
    getServicesByEntityId(entity.id, { page: 1 }).then((r) => (services = r)),
  ]);

  return {
    entity,
    contractors,
    contracts,
    services,
  };
}

export function searchEntities({ query, page, pageSize }) {
  return fetchData(`${API_URL}/entities/`, {
    search: query,
    page,
    page_size: pageSize,
  });
}

export function searchServices({ query, page, pageSize }) {
  return fetchData(`${API_URL}/services/`, {
    search: query,
    page,
    page_size: pageSize,
  });
}

export function getGeneralTrends() {
  return fetchData(`${API_URL}/pages/trends/general/`);
}

export function getServiceTrends() {
  return fetchData(`${API_URL}/pages/trends/services/`);
}
