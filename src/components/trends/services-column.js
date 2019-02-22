import React from 'react';
import PropTypes from 'prop-types';
import intcomma from '../../lib/intcomma';

const TrendsServicesColumn = (props) => (
  <div className="lg:w-1/2 mb-4 sm:mr-2 border rounded border-grey-light">
    <h3 className="p-2 text-center border-b border-grey-light">
      Año Fiscal - {props.fiscal_year}
    </h3>
    <div className="flex p-2 border-b border-grey-light no-underline">
      <div className="flex-1 self-center">
        <div className="sm:h-12 font-bold text-grey-darkest">
          {props.services.title}
        </div>
        <div className="trends-services-max-h text-grey-darkest">
          {props.services.value.map((service) => (
            <a
              className="text-grey-darkest no-underline"
              href="#"
              key={service.id.toString()}>
              <div className="text-grey-darkest hover:bg-grey-lightest p-2">
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
    <div className="flex p-2 border-b border-grey-light no-underline">
      <div className="flex-1 self-center">
        <div className="sm:h-12 font-bold text-grey-darkest">
          {props.service_groups.title}
        </div>
        <div className="trends-services-max-h text-grey-darkest">
          {props.service_groups.value.map((service) => (
            <a
              className="text-grey-darkest no-underline"
              href="#"
              key={service.id.toString()}>
              <div className="text-grey-darkest hover:bg-grey-lightest p-2">
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
  service_groups: PropTypes.object
};

export default TrendsServicesColumn;
