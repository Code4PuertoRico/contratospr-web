import React from 'react';

class Custom404 extends React.Component {
  render() {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-full max-w-xs text-center">
          <h1 className="text-4xl font-bold">
            <strong className="font-extrabold">404</strong>: Página no
            encontrada
          </h1>
        </div>
      </div>
    );
  }
}

export default Custom404;
