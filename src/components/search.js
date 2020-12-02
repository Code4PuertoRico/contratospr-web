import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  render() {
    return (
      <form
        action="/buscar"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          this.props.onSubmit({ query: this.input.value });
        }}>
        <div className="flex items-center">
          <input
            className="w-full py-2 px-3 mr-4 appearance-none border border-gray-300 rounded text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            defaultValue={this.props.query}
            ref={(node) => (this.input = node)}
            placeholder={this.props.placeholder}
          />
          <button
            className="py-2 px-4 flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Buscar
          </button>
        </div>
      </form>
    );
  }
}

export default Search;
