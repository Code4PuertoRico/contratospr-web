import React from 'react';
import PropTypes from 'prop-types';
import intcomma from '../../lib/intcomma';

const TrendsServicesColumn = (props) => (
  <div className="lg:w-1/2 mb-4 sm:mr-2 border rounded border-gray-200">
    <h3 className="text-xl font-bold p-2 text-center border-b border-gray-200">
      Año Fiscal - {props.fiscal_year}
    </h3>
    <div className="flex p-2 border-b border-gray-200 no-underline">
      <div className="flex-1 self-center">
        <div className="sm:h-12 font-bold text-gray-800">
          {props.services.title}
        </div>
        <div className="trends-services-max-h text-gray-800">
          {props.services.value.map((service) => (
            <a
              className="text-gray-800 no-underline"
              href="#"
              key={service.id.toString()}>
              <div className="text-gray-800 hover:bg-gray-100 p-2">
                <div>
                  <p>Servicio: {service.name}</p>
                  <p>Total: ${intcomma(service.contracts_total)}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="flex p-2 border-b border-gray-200 no-underline">
      <div className="flex-1 self-center">
        <div className="sm:h-12 font-bold text-gray-800">
          {props.service_groups.title}
        </div>
        <div className="trends-services-max-h text-gray-800">
          {props.service_groups.value.map((service) => (
            <a
              className="text-gray-800 no-underline"
              href="#"
              key={service.id.toString()}>
              <div className="text-gray-800 hover:bg-gray-100 p-2">
                <div>
                  <p>Servicio: {service.name}</p>
                  <p>Total: ${intcomma(service.contracts_total)}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

TrendsServicesColumn.propTypes = {
  fiscal_year: PropTypes.number,
  services: PropTypes.object,
  service_groups: PropTypes.object,
};

export default TrendsServicesColumn;
