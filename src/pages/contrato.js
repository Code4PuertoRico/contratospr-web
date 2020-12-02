import React from 'react';
import Link from 'next/link';
import Head from '../components/head';
import PDFViewer from '../components/pdf-viewer';
import intcomma from '../lib/intcomma';
import { getContract } from '../lib/api';
import { formatDate } from '../lib/date';

class Contratos extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    return getContract({ slug });
  }

  render() {
    return (
      <div>
        <Head title={`Contrato: ${this.props.number}`} />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-gray-200 text-lg text-gray-800">
                <h2 className="mb-2 text-2xl font-bold">{this.props.number}</h2>

                {this.props.parent ? (
                  <>
                    <p className="font-bold">Enmienda</p>
                    <p className="mb-2">
                      {this.props.amendment} -{' '}
                      <Link
                        href={`/contrato?slug=${this.props.parent.slug}`}
                        as={`/contratos/${this.props.parent.slug}`}>
                        <a className="text-gray-800 underline hover:text-black">
                          Contrato original
                        </a>
                      </Link>
                    </p>
                  </>
                ) : null}

                <p className="font-bold">Cuantía</p>
                <p className="mb-2">${intcomma(this.props.amount_to_pay)}</p>

                <p className="font-bold">Categoría de servicio</p>
                <p className="mb-2">{this.props.service.group.name}</p>

                <p className="font-bold">Tipo de servicio</p>
                <p className="mb-2">{this.props.service.name}</p>

                <p className="font-bold">Entidad</p>
                <p className="mb-2">
                  <Link
                    href={`/entidad?slug=${this.props.entity.slug}`}
                    as={`/entidades/${this.props.entity.slug}`}>
                    <a className="text-gray-800 underline hover:text-black">
                      {this.props.entity.name}
                    </a>
                  </Link>
                </p>

                <p className="font-bold">Otorgado</p>
                <p className="mb-2">{formatDate(this.props.date_of_grant)}</p>

                <p className="font-bold">Vigencia</p>
                <p className="mb-2">
                  {formatDate(this.props.effective_date_from)} -{' '}
                  {formatDate(this.props.effective_date_to)}
                </p>

                {this.props.has_amendments ? (
                  <>
                    <p className="font-bold">Enmiendas</p>
                    <ul className="list-reset">
                      {this.props.amendments.map((contract) => (
                        <li key={this.props.id.toString()}>
                          <Link
                            href={`/contrato?slug=${contract.slug}`}
                            as={`/contratos/${contract.slug}`}>
                            <a className="text-gray-800 underline hover:text-black">
                              {contract.number} - {contract.amendment}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <p className="font-bold">Contratistas</p>
                <ul className="list-reset">
                  {this.props.contractors.map((contractor) => (
                    <li key={contractor.id.toString()}>
                      <Link
                        href={`/contratista?slug=${contractor.slug}`}
                        as={`/contratistas/${contractor.slug}`}>
                        <a className="text-gray-800 underline hover:text-black">
                          {contractor.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:flex-1 px-4 py-2 m-2 text-lg text-gray-800">
                <div className="flex justify-between items-center mb-2 border-b">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">Documento</h2>
                  </div>

                  {this.props.document ? (
                    <div className="text-right">
                      <a
                        href={this.props.document.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block no-underline bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 mb-2 rounded">
                        <svg
                          className="fill-current w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                        </svg>
                      </a>
                    </div>
                  ) : null}
                </div>
                <div className="sm:max-h-screen mt-2">
                  {this.props.document && this.props.document.file ? (
                    <PDFViewer src={this.props.document.file} />
                  ) : (
                    <div
                      className="bg-yellow-100 border-l-4 border-yellow-500 text-sm text-yellow-700 p-4"
                      role="alert">
                      <p>Aún no tenemos copia del contrato.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Contratos;
