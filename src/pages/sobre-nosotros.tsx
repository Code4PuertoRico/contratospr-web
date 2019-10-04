import React from 'react';
import Head from '../components/head';

class SobreNosotros extends React.Component {
  render() {
    return (
      <div>
        <Head title="Sobre Nosotros" />
        <div className="my-4">
          <div className="w-full px-4 py-2">
            <h1 className="mb-4 text-2xl">Sobre Nosotros</h1>

            <p className="mb-2">
              Este proyecto es una acción comunitaría que intenta hacer la data
              del sistema de{' '}
              <a href="https://consultacontratos.ocpr.gov.pr">
                Consulta de Contratos
              </a>{' '}
              más accesible.
            </p>

            <h2 className="mb-2 text-xl">Recursos</h2>
            <ul className="mb-2">
              <li>
                <a href="https://github.com/theindexingproject/contratospr-api">
                  GitHub (contratospr-api)
                </a>
              </li>
              <li>
                <a href="https://github.com/theindexingproject/contratospr">
                  GitHub (contratospr)
                </a>
              </li>
              <li>
                <a href="https://spectrum.chat/contratospr">Spectrum</a>
              </li>
              <li>
                <a href="http://api.contratospr.com/v1/">API v1</a>
              </li>
              <li>
                <a href="https://api.contratospr.com/v1/docs/">Docs API v1</a>
              </li>
            </ul>

            <h2 className="mb-2 text-xl">
              ¿Comó hacemos que la data sea mas accesible?
            </h2>
            <p className="mb-2">
              Para empezar, hacemos un &quot;scrape&quot; de la pagina Consulta
              de Contratos y le ponemos un API delante de ella. En adición
              hacemos el pedido de los documentos asociados a los contratos para
              que tu no lo tengas que hacer. A estos documentos les intentamos
              extraer el contenido programáticamente.
            </p>
            <p className="mb-2">
              La union de la data de Consulta de Contratos, con la extraida del
              archivo y su meta data, es utilizada en nuestra busqueda.
            </p>

            <h2 className="mb-2 text-xl">¿Cuán maduro esta el proyecto?</h2>
            <p className="mb-2">
              Estamos en los comienzos del mismo. Aunque sacamos nuestra data
              diractamente de Consulta de Contratos, no somos la fuente oficial
              ni los custodios de la misma. Toda duda debería ser confirmada con
              Consulta de Contratos.
            </p>
            <p className="mb-2">
              Nuestra meta es proveer otra manera de acceder la data provista,
              en especial de una manera programatica.
            </p>

            <h2 className="mb-2 text-xl">
              ¿Que planes se tienen con este proyecto?
            </h2>
            <p className="mb-2">
              Lo mejor sería ir a nuestro repositorio para{' '}
              <a href="https://github.com/theindexingproject/contratospr-api">
                nuestro API
              </a>{' '}
              y{' '}
              <a href="https://github.com/theindexingproject/contratospr">
                nuestro frontend
              </a>
              .
            </p>

            <h2 className="mb-2 text-xl">¿Comó puedo ayudar?</h2>
            <p className="mb-2">
              Utiliza nuestros proyectos y dejanos saber como mejorar o que
              errores encuentras. Si quieres trabajar sobre el codigo visita los
              proyectos:
            </p>
            <ul className="mb-2">
              <li>
                <a href="https://github.com/theindexingproject/contratospr-api">
                  nuestro API
                </a>
              </li>
              <li>
                <a href="https://github.com/theindexingproject/contratospr">
                  nuestro frontend
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SobreNosotros;
