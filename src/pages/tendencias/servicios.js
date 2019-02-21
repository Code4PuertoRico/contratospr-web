import React from 'react';
import Link from 'next/link';
import Head from '../../components/head';
import TrendsServicesColumn from '../../components/trends/services-column';
import { getServiceTrends } from '../../lib/api';

class Servicios extends React.Component {
  static async getInitialProps() {
    return getServiceTrends();
  }

  render() {
    return (
      <div>
        <Head title="Tendencias / Servicios" />
        <ul className="list-reset flex border-b">
          <li className="-mb-px mr-1">
            <Link href="/tendencias">
              <a className="no-underline bg-white inline-block py-2 px-4 text-blue hover:underline hover:text-blue-darker font-semibold">
                Datos Generales
              </a>
            </Link>
          </li>
          <li className="mr-1">
            <Link href="/tendencias/servicios">
              <a className="no-underline bg-white inline-block py-2 px-4 text-blue-darker hover:underline hover:text-blue-darker font-semibold">
                Servicios
              </a>
            </Link>
          </li>
        </ul>

        <h2 id="servicios" className="p-2 sm:mt-4">
          Servicios
        </h2>
        <div className="flex items-center justify-center mt-8 sm:mt-4">
          <div className="lg:flex w-full">
            <TrendsServicesColumn {...this.props.a} />
            <TrendsServicesColumn {...this.props.b} />
          </div>
        </div>
      </div>
    );
  }
}

export default Servicios;
