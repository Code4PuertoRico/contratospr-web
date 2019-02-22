import React from 'react';

const WorkInProgressNotice = () => (
  <div className="p-1 px-2 border-b bg-yellow">
    <span className="font-bold">Nota: </span>
    Trabajo en progreso; datos pueden estár incompletos, confirmar en{' '}
    <a className="text-black" href="https://consultacontratos.ocpr.gov.pr/">
      consultacontratos.ocpr.gov.pr
    </a>
    .
  </div>
);

export default React.memo(WorkInProgressNotice);
