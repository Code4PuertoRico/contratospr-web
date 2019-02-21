import React from 'react';
import Link from 'next/link';
import Head from '../../components/head';
import TrendsGeneralColumn from '../../components/trends/general-column';
import { getGeneralTrends } from '../../lib/api';

class Tendencias extends React.Component {
  static async getInitialProps() {
    return getGeneralTrends();
  }

  render() {
    return (
      <div>
        <Head title="Tendencias / Datos Generales" />
        <ul className="list-reset flex border-b">
          <li className="-mb-px mr-1">
            <Link href="/tendencias">
              <a className="no-underline bg-white inline-block py-2 px-4 text-blue-darker hover:underline hover:text-blue-darker font-semibold">
                Datos Generales
              </a>
            </Link>
          </li>
          <li className="mr-1">
            <Link href="/tendencias/servicios">
              <a className="no-underline bg-white inline-block py-2 px-4 text-blue hover:underline hover:text-blue-darker font-semibold">
                Servicios
              </a>
            </Link>
          </li>
        </ul>

        <h2 id="datos-generales" className="p-2 sm:mt-4">
          Datos Generales
        </h2>
        <div className="flex items-center justify-center mt-8 sm:mt-4">
          <div className="lg:flex w-full">
            <TrendsGeneralColumn {...this.props.a} />
            <TrendsGeneralColumn {...this.props.b} />
          </div>
        </div>
      </div>
    );
  }
}

export default Tendencias;
