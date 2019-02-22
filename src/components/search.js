import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func
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
            className="w-full py-2 px-3 mr-4 appearance-none border rounded text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            defaultValue={this.props.query}
            ref={(node) => (this.input = node)}
            placeholder={this.props.placeholder}
          />
          <button
            className="py-2 px-4 flex-no-shrink bg-blue hover:bg-blue-dark text-white font-bold rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Buscar
          </button>
        </div>
      </form>
    );
  }
}

export default Search;
