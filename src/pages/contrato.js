import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Head from '../components/head';
import linebreaksbr from '../lib/linebreaksbr';

async function fetchData({ slug }) {
  let url = `${process.env.API_URL}/contracts/${slug}/`;
  let contract = await (await fetch(url)).json();

  if (contract.document) {
    contract.document = await (await fetch(contract.document)).json();
  }

  return contract;
}

class Contratos extends React.Component {
  static async getInitialProps({ query }) {
    let slug = query.slug;
    let data = await fetchData({ slug });
    return data;
  }

  constructor(props) {
    super(props);

    this.state = {
      contract: props
    };
  }

  render() {
    return (
      <div>
        <Head title="Contratos" />
        <div className="flex self-start justify-center">
          <div className="w-full mb-4">
            <div className="flex flex-wrap">
              <div className="w-full sm:flex-1 px-4 py-2 m-2 border-none border-r sm:border-solid sm:border-grey-light text-lg text-grey-darkest">
                <h2 className="mb-2">{this.state.contract.number}</h2>

                {this.state.contract.parent ? (
                  <>
                    <p className="font-bold">Enmienda</p>
                    <p className="mb-2">
                      {this.state.contract.amendment} -
                      <Link
                        href={`/contratos?slug=${
                          this.state.contract.parent.slug
                        }`}>
                        <a className="text-grey-darkest hover:text-black">
                          Contrato original
                        </a>
                      </Link>
                    </p>
                  </>
                ) : null}

                <p className="font-bold">Cuantía</p>
                <p className="mb-2">${this.state.contract.amount_to_pay}</p>

                <p className="font-bold">Categoría de servicio</p>
                <p className="mb-2">{this.state.contract.service.group.name}</p>

                <p className="font-bold">Tipo de servicio</p>
                <p className="mb-2">{this.state.contract.service.name}</p>

                <p className="font-bold">Entidad</p>
                <p className="mb-2">
                  <Link href={`/entidad/${this.state.contract.entity.slug}`}>
                    <a className="text-grey-darkest hover:text-black">
                      {this.state.contract.entity.name}
                    </a>
                  </Link>
                </p>

                <p className="font-bold">Otorgado</p>
                <p className="mb-2">{this.state.contract.date_of_grant}</p>

                <p className="font-bold">Vigencia</p>
                <p className="mb-2">
                  {this.state.contract.effective_date_from} -{' '}
                  {this.state.contract.effective_date_to}
                </p>

                {this.state.contract.has_amendments ? (
                  <>
                    <p className="font-bold">Enmiendas</p>
                    <ul className="list-reset">
                      {this.state.contract.amendments.map((contract) => (
                        <li key={contract.id.toString()}>
                          <Link href={`/contratos/${contract.slug}`}>
                            <a className="text-grey-darkest hover:text-black">
                              {contract.number}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <h3 className="mt-4 mb-2">Contratistas</h3>
                <ul className="list-reset">
                  {this.state.contract.contractors.map((contractor) => (
                    <li key={contractor.id.toString()}>
                      <Link href={`/contratista/${contractor.slug}`}>
                        <a className="text-grey-darkest hover:text-black">
                          {contractor.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:flex-1 px-4 py-2 m-2 text-lg text-grey-darkest">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <h2>Documento</h2>
                  </div>

                  {this.state.contract.document ? (
                    <div className="flex-1 text-right">
                      <a
                        href={this.state.contract.document.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline bg-grey-light hover:bg-grey text-grey-darkest font-bold py-1 px-2 rounded">
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
                <div className="sm:overflow-y-scroll sm:max-h-screen mt-2 border-t border-b">
                  {this.state.contract.document ? (
                    <>
                      {this.state.contract.document.pages.map((page) => (
                        <p
                          className="font-serif text-base"
                          key={page.number}
                          dangerouslySetInnerHTML={{
                            __html: linebreaksbr(page.text)
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <div
                      className="bg-orange-lightest border-l-4 border-orange text-sm text-orange-dark p-4"
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
