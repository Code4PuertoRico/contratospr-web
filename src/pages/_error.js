import React from 'react';

class Error extends React.Component {
  static getInitialProps({ err }) {
    return {
      code: (err && err.statusCode) || 500,
      text: (err && err.statusText) || 'Ha ocurrido un error inesperado'
    };
  }

  render() {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-full max-w-xs text-center">
          <h1>
            <strong>{this.props.code}</strong>: {this.props.text}
          </h1>
        </div>
      </div>
    );
  }
}

export default Error;
