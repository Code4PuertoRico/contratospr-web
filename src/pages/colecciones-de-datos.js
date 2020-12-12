import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import { getCollectionJobs } from '../lib/api';
import { formatDate } from '../lib/date';

class CollectionJobs extends React.Component {
  static async getInitialProps() {
    return getCollectionJobs();
  }

  render() {
    return (
      <div>
        <Head title="Colecciones de datos" />
        <div className="flex self-start justify-center">
          <div className="w-full max-w-3xl mb-4">
            <div className="mt-2 mb-4">
              <h2 className="mb-1 text-3xl font-semibold text-gray-800">
                Colecciones de datos
              </h2>
              <p>
                Periódicamente coleccionamos y procesamos datos de la{' '}
                <a
                  className="text-black"
                  href="https://consultacontratos.ocpr.gov.pr/">
                  Oficina del Contralor de Puerto Rico
                </a>
                .
              </p>
            </div>
            <div className="mt-2">
              {this.props.results.map((collectionJob) => (
                <Link
                  href={`/coleccion-de-datos?id=${collectionJob.id}`}
                  as={`/colecciones-de-datos/${collectionJob.id}`}
                  key={collectionJob.id.toString()}>
                  <a className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100">
                    <div className="text-xl font-bold text-gray-800">
                      Colección de datos #{collectionJob.id}
                    </div>
                    <p>
                      Contratos otorgados entre{' '}
                      <strong>
                        {formatDate(collectionJob.date_of_grant_start)}
                      </strong>{' '}
                      y{' '}
                      <strong>
                        {formatDate(collectionJob.date_of_grant_end)}
                      </strong>
                    </p>
                    <p>
                      Procesado:{' '}
                      {formatDate(collectionJob.created_at, 'shortTime')}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionJobs;
