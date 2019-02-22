import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import intcomma from '../../lib/intcomma';

const TrendsGeneralColumn = (props) => (
  <div className="lg:w-1/2 mb-4 sm:mr-2 border rounded border-grey-light">
    <h3 className="p-2 text-center border-b border-grey-light">
      Año Fiscal - {props.fiscal_year}
    </h3>
    <div className="flex sm:h-32 p-2 border-b border-grey-light hover:bg-grey-lightest">
      <div className="flex-1 self-center">
        <Link
          href={`/contrato?slug=${props.contract_min_amount.slug}`}
          as={`/contratos/${props.contract_min_amount.slug}`}>
          <a className="text-grey-darkest hover:text-black no-underline">
            <div className="font-bold text-grey-darkest">
              Contrato con Menor Monto
            </div>
            <div className="text-grey-darkest">
              Numero de Contrato: {props.contract_min_amount.number}
            </div>
            <div className="text-grey-darkest">
              Monto: ${intcomma(props.contract_min_amount.amount_to_pay)}
            </div>
          </a>
        </Link>
      </div>
    </div>
    <div className="flex sm:h-32 p-2 border-b border-grey-light hover:bg-grey-lightest">
      <div className="flex-1 self-center">
        <Link
          href={`/contrato?slug=${props.contract_max_amount.slug}`}
          as={`/contratos/${props.contract_max_amount.slug}`}>
          <a className="text-grey-darkest hover:text-black no-underline">
            <div className="font-bold text-grey-darkest">
              Contrato con Mayor Monto
            </div>
            <div className="text-grey-darkest">
              Numero de Contrato: {props.contract_max_amount.number}
            </div>
            <div className="text-grey-darkest">
              Monto: ${intcomma(props.contract_max_amount.amount_to_pay)}
            </div>
          </a>
        </Link>
      </div>
    </div>
    {props.totals.map((item) => (
      <>
        <div className="flex sm:h-32 p-2 border-b border-grey-light hover:bg-grey-lightest">
          <div className="flex-1 self-center">
            <div className="font-bold text-grey-darkest">{item.title}</div>
            <div className="text-grey-darkest">{item.value}</div>
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
  contract_min_amount: PropTypes.object
};

export default TrendsGeneralColumn;
