import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import intcomma from '../../lib/intcomma';

const TrendsGeneralColumn = (props) => (
  <div className="lg:w-1/2 mb-4 sm:mr-2 border rounded border-gray-200">
    <h3 className="p-2 text-center border-b border-gray-200">
      Año Fiscal - {props.fiscal_year}
    </h3>
    <div className="flex sm:h-32 p-2 border-b border-gray-200 hover:bg-gray-100">
      <div className="flex-1 self-center">
        <Link
          href={`/contrato?slug=${props.contract_min_amount.slug}`}
          as={`/contratos/${props.contract_min_amount.slug}`}>
          <a className="text-gray-800 hover:text-black no-underline">
            <div className="font-bold text-gray-800">
              Contrato con Menor Monto
            </div>
            <div className="text-gray-800">
              Numero de Contrato: {props.contract_min_amount.number}
            </div>
            <div className="text-gray-800">
              Monto: ${intcomma(props.contract_min_amount.amount_to_pay)}
            </div>
          </a>
        </Link>
      </div>
    </div>
    <div className="flex sm:h-32 p-2 border-b border-gray-200 hover:bg-gray-100">
      <div className="flex-1 self-center">
        <Link
          href={`/contrato?slug=${props.contract_max_amount.slug}`}
          as={`/contratos/${props.contract_max_amount.slug}`}>
          <a className="text-gray-800 hover:text-black no-underline">
            <div className="font-bold text-gray-800">
              Contrato con Mayor Monto
            </div>
            <div className="text-gray-800">
              Numero de Contrato: {props.contract_max_amount.number}
            </div>
            <div className="text-gray-800">
              Monto: ${intcomma(props.contract_max_amount.amount_to_pay)}
            </div>
          </a>
        </Link>
      </div>
    </div>
    {props.totals.map((item) => (
      <>
        <div className="flex sm:h-32 p-2 border-b border-gray-200 hover:bg-gray-100">
          <div className="flex-1 self-center">
            <div className="font-bold text-gray-800">{item.title}</div>
            <div className="text-gray-800">{item.value}</div>
          </div>
        </div>
      </>
    ))}
  </div>
);

TrendsGeneralColumn.propTypes = {
  fiscal_year: PropTypes.number,
  totals: PropTypes.array,
  contract_max_amount: PropTypes.object,
  contract_min_amount: PropTypes.object,
};

export default TrendsGeneralColumn;
