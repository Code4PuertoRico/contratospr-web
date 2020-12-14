import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import { getCollectionJob } from '../lib/api';
import { formatDate } from '../lib/date';

class CollectionArtifactLink extends React.Component {
  render() {
    return (
      <Link
        href={this.props.linkHref}
        as={this.props.linkAs}
        key={this.props.key}>
        <a className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100">
          <div className="grid grid-cols-3">
            <div className="col-span-2 truncate">
              <div className="inline text-xl font-bold text-gray-800 mr-4">
                {this.props.text}
              </div>
            </div>
            <div className="col-auto text-right">
              <div
                className={
                  'inline px-4 py-2 text-white text-center text-xs  font-extrabold rounded-full ' +
                  (this.props.created ? 'bg-green-500' : 'bg-gray-300')
                }>
                {this.props.created ? 'nuevo' : 'actualizado'}
              </div>
            </div>
          </div>
        </a>
      </Link>
    );
  }
}

class CollectionArtifact extends React.Component {
  render() {
    let artifact = this.props.data;
    switch (artifact.type) {
      case 'contract': {
        return (
          <CollectionArtifactLink
            key={this.props.key}
            linkHref={`/contrato?slug=${artifact.data.slug}`}
            linkAs={`/contratos/${artifact.data.slug}`}
            text={`${artifact.data.number}${
              artifact.data.amendment ? ` - ${artifact.data.amendment}` : ``
            }`}
            created={artifact.created}
          />
        );
      }
      case 'contractor': {
        return (
          <CollectionArtifactLink
            key={this.props.key}
            linkHref={`/contratista?slug=${artifact.data.slug}`}
            linkAs={`/contratistas/${artifact.data.slug}`}
            text={artifact.data.name}
            created={artifact.created}
          />
        );
      }
      case 'service': {
        return (
          <CollectionArtifactLink
            key={this.props.key}
            linkHref={`/buscar?service=${artifact.data.id}`}
            text={artifact.data.name}
            created={artifact.created}
          />
        );
      }
      case 'entity': {
        return (
          <CollectionArtifactLink
            key={this.props.key}
            linkHref={`/entidad?slug=${artifact.data.slug}`}
            linkAs={`/entidades/${artifact.data.slug}`}
            text={artifact.data.name}
            created={artifact.created}
          />
        );
      }
      case 'document': {
        return (
          <CollectionArtifactLink
            key={this.props.key}
            linkHref={artifact.data.source_url}
            text={`Documento ${artifact.data.source_id}`}
            created={artifact.created}
          />
        );
      }
      default: {
        return null;
      }
    }
  }
}

class CollectionJob extends React.Component {
  static async getInitialProps({ query }) {
    let collectionJobId = query.id;
    return getCollectionJob({ collectionJobId });
  }

  render() {
    return (
      <div>
        <Head title={`Colección de datos #${this.props.id}`} />
        <div className="flex self-start justify-center">
          <div className="w-full max-w-3xl mb-4">
            <div className="mt-2 mb-4">
              <h2 className="mb-1 text-3xl font-semibold text-gray-800">
                Colección de datos #{this.props.id}
              </h2>
              <p>
                Contratos otorgados entre{' '}
                <strong>{formatDate(this.props.date_of_grant_start)}</strong> y{' '}
                <strong>{formatDate(this.props.date_of_grant_end)}</strong>
              </p>
              <p>Procesado: {formatDate(this.props.created_at, 'shortTime')}</p>
            </div>

            <div className="my-8">
              <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                Contratos
              </h3>
              {this.props.artifacts
                .filter((artifact) => artifact.type === 'contract')
                .map((artifact) => (
                  <CollectionArtifact
                    key={artifact.data.id.toString()}
                    data={artifact}
                  />
                ))}
            </div>

            <div className="my-8">
              <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                Contratistas
              </h3>
              {this.props.artifacts
                .filter((artifact) => artifact.type === 'contractor')
                .map((artifact) => (
                  <CollectionArtifact
                    key={artifact.data.id.toString()}
                    data={artifact}
                  />
                ))}
            </div>

            <div className="my-8">
              <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                Entidades
              </h3>
              {this.props.artifacts
                .filter((artifact) => artifact.type === 'entity')
                .map((artifact) => (
                  <CollectionArtifact
                    key={artifact.data.id.toString()}
                    data={artifact}
                  />
                ))}
            </div>

            <div className="my-8">
              <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                Servicios
              </h3>
              {this.props.artifacts
                .filter((artifact) => artifact.type === 'service')
                .map((artifact) => (
                  <CollectionArtifact
                    key={artifact.data.id.toString()}
                    data={artifact}
                  />
                ))}
            </div>

            <div className="my-8">
              <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                Documentos
              </h3>
              {this.props.artifacts
                .filter((artifact) => artifact.type === 'document')
                .map((artifact) => (
                  <CollectionArtifact
                    key={artifact.data.id.toString()}
                    data={artifact}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionJob;
