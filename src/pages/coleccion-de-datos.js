import React from 'react';
import NProgress from 'nprogress';
import Router, { withRouter } from 'next/router';
import Link from 'next/link';
import Head from '../components/head';
import Pagination from '../components/pagination';
import millify from '../lib/millify';
import { getCollectionJob, getCollectionArtifacts } from '../lib/api';
import { formatDate } from '../lib/date';
import { ucfirst } from '../lib/text';

class CollectionArtifactLink extends React.Component {
  render() {
    return (
      <Link href={this.props.linkHref} as={this.props.linkAs}>
        <a className="block py-4 border-b border-gray-200 no-underline hover:bg-gray-100">
          <div className="grid grid-cols-3">
            <div className="col-span-2 truncate">
              <div className="mr-4">{this.props.children}</div>
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
            key={artifact.data.id.toString()}
            linkHref={`/contrato?slug=${artifact.data.slug}`}
            linkAs={`/contratos/${artifact.data.slug}`}
            created={artifact.created}>
            <>
              <div className="text-xl font-bold text-gray-800">
                {`${artifact.data.number}${
                  artifact.data.amendment ? ` - ${artifact.data.amendment}` : ``
                }`}{' '}
                <span className="text-base text-gray-800">
                  ${millify(artifact.data.amount_to_pay)}
                </span>
              </div>
              <div className="text-gray-800">
                Otorgado: {formatDate(artifact.data.date_of_grant)}
              </div>
            </>
          </CollectionArtifactLink>
        );
      }
      case 'contractor': {
        return (
          <CollectionArtifactLink
            key={artifact.data.id.toString()}
            linkHref={`/contratista?slug=${artifact.data.slug}`}
            linkAs={`/contratistas/${artifact.data.slug}`}
            created={artifact.created}>
            <div className="text-xl font-bold text-gray-800">
              {artifact.data.name}
            </div>
          </CollectionArtifactLink>
        );
      }
      case 'service': {
        return (
          <CollectionArtifactLink
            key={artifact.data.id.toString()}
            linkHref={`/buscar?service=${artifact.data.id}`}
            text={artifact.data.name}
            created={artifact.created}>
            <div className="text-xl font-bold text-gray-800">
              {artifact.data.name}
            </div>
          </CollectionArtifactLink>
        );
      }
      case 'entity': {
        return (
          <CollectionArtifactLink
            key={artifact.data.id.toString()}
            linkHref={`/entidad?slug=${artifact.data.slug}`}
            linkAs={`/entidades/${artifact.data.slug}`}
            created={artifact.created}>
            <div className="text-xl font-bold text-gray-800">
              {artifact.data.name}
            </div>
          </CollectionArtifactLink>
        );
      }
      case 'document': {
        return (
          <CollectionArtifactLink
            key={artifact.data.id.toString()}
            linkHref={artifact.data.source_url}
            created={artifact.created}>
            <div className="text-xl font-bold text-gray-800">
              {`Documento ${artifact.data.source_id}`}
            </div>
          </CollectionArtifactLink>
        );
      }
      default: {
        return null;
      }
    }
  }
}

const TYPE_TO_LABEL = {
  contract: 'contratos',
  entity: 'entidades',
  contractor: 'contratistas',
  service: 'servicios',
  document: 'documentos',
};

const LABEL_TO_TYPE = {
  [TYPE_TO_LABEL.contract]: 'contract',
  [TYPE_TO_LABEL.entity]: 'entity',
  [TYPE_TO_LABEL.contractor]: 'contractor',
  [TYPE_TO_LABEL.service]: 'service',
  [TYPE_TO_LABEL.document]: 'document',
};

class CollectionJob extends React.Component {
  static async getInitialProps({ res, query }) {
    let type = LABEL_TO_TYPE[query.type] || query.type;

    if (!query.type) {
      if (res) {
        res.writeHead(302, {
          Location: `/colecciones-de-datos/${query.id}/contratos`,
        });
        res.end();
        return;
      } else {
        await Router.push(
          {
            pathname: `/coleccion-de-datos`,
            query: { id: query.id, type: 'contract' },
          },
          `/colecciones-de-datos/${query.id}/contratos`
        );
      }
    }

    return getCollectionJob({
      collectionJobId: query.id,
      type,
      page: query.page,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      artifacts: props.artifacts,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.setState(Object.assign({}, this.props));
    }
  }

  handlePageChange = (type) => {
    return async ({ page }) => {
      let artifacts = await getCollectionArtifacts({
        collectionJobId: this.props.id,
        type,
        page,
      });
      this.setState({ artifacts });

      await Router.push(
        {
          pathname: `/coleccion-de-datos`,
          query: { id: this.props.id, type, page },
        },
        `/colecciones-de-datos/${this.props.id}/${TYPE_TO_LABEL[type]}?page=${page}`,
        { shallow: true }
      );

      window.scrollTo(0, 0);
    };
  };

  handleSectionChange = async ({ type }) => {
    NProgress.start();
    this.setState({ type, artifacts: { results: [] } });

    await Router.push(
      {
        pathname: `/coleccion-de-datos`,
        query: { id: this.props.id, type },
      },
      `/colecciones-de-datos/${this.props.id}/${TYPE_TO_LABEL[type]}`,
      { shallow: true }
    );

    let artifacts = await getCollectionArtifacts({
      collectionJobId: this.props.id,
      type,
    });

    this.setState({ artifacts });
    NProgress.done();
  };

  render() {
    let { type, artifacts } = this.state;
    return (
      <div>
        <Head title={`Colección de datos #${this.props.id}`} />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:w-1/3 px-4 py-2 border-none border-r sm:border-solid sm:border-gray-200 text-lg text-gray-800">
                <div className="mt-2 mb-4">
                  <h2 className="mb-1 text-3xl font-semibold text-gray-800">
                    Colección de datos #{this.props.id}
                  </h2>
                  <p>
                    Contratos otorgados entre{' '}
                    <strong>
                      {formatDate(this.props.date_of_grant_start)}
                    </strong>{' '}
                    y{' '}
                    <strong>{formatDate(this.props.date_of_grant_end)}</strong>
                  </p>
                  <p>
                    Procesado: {formatDate(this.props.created_at, 'shortTime')}
                  </p>
                </div>

                <a
                  className={
                    'block py-4 border-b border-gray-200 no-underline hover:bg-gray-100 text-2xl font-extrabold text-gray-800 cursor-pointer ' +
                    (this.props.router.asPath ===
                      `/colecciones-de-datos/${this.props.id}/contratos` &&
                      'bg-gray-100')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSectionChange({ type: 'contract' });
                  }}>
                  Contratos
                </a>

                <a
                  className={
                    'block py-4 border-b border-gray-200 no-underline hover:bg-gray-100 text-2xl font-extrabold text-gray-800 cursor-pointer ' +
                    (this.props.router.asPath ===
                      `/colecciones-de-datos/${this.props.id}/contratistas` &&
                      'bg-gray-100')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSectionChange({ type: 'contractor' });
                  }}>
                  Contratistas
                </a>

                <a
                  className={
                    'block py-4 border-b border-gray-200 no-underline hover:bg-gray-100 text-2xl font-extrabold text-gray-800 cursor-pointer ' +
                    (this.props.router.asPath ===
                      `/colecciones-de-datos/${this.props.id}/entidades` &&
                      'bg-gray-100')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSectionChange({ type: 'entity' });
                  }}>
                  Entidades
                </a>

                <a
                  className={
                    'block py-4 border-b border-gray-200 no-underline hover:bg-gray-100 text-2xl font-extrabold text-gray-800 cursor-pointer ' +
                    (this.props.router.asPath ===
                      `/colecciones-de-datos/${this.props.id}/servicios` &&
                      'bg-gray-100')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSectionChange({ type: 'service' });
                  }}>
                  Servicios
                </a>

                <a
                  className={
                    'block py-4 border-b border-gray-200 no-underline hover:bg-gray-100 text-2xl font-extrabold text-gray-800 cursor-pointer ' +
                    (this.props.router.asPath ===
                      `/colecciones-de-datos/${this.props.id}/documentos` &&
                      'bg-gray-100')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleSectionChange({ type: 'document' });
                  }}>
                  Documentos
                </a>
              </div>
              <div className="w-full sm:w-2/3 px-4 py-2 text-lg text-gray-800">
                <div className="w-full max-w-3xl mb-4">
                  <div className="my-8">
                    <h3 className="mb-1 text-2xl font-extrabold text-gray-800">
                      {ucfirst(TYPE_TO_LABEL[type])}
                    </h3>
                    <div className="mt-2">
                      {artifacts.results.map((artifact) => (
                        <CollectionArtifact
                          key={artifact.data.id.toString()}
                          data={artifact}
                        />
                      ))}
                    </div>
                    {artifacts.count > 0 && artifacts.total_pages > 1 ? (
                      <div className="text-center mt-4">
                        <Pagination
                          page={artifacts.page}
                          pages={artifacts.total_pages}
                          onPageChange={this.handlePageChange(type)}
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

export default withRouter(CollectionJob);
