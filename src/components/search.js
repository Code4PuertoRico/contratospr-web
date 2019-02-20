import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      query: props.query,
      placeholder: props.placeholder,
      onSubmit: props.onSubmit
    };
  }

  render() {
    return (
      <form
        action="/buscar"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          this.state.onSubmit({ query: this.state.query });
        }}>
        <div className="flex items-center">
          <input
            className="w-full py-2 px-3 mr-4 appearance-none border rounded text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={this.state.query}
            onChange={(e) => {
              this.setState({ query: e.target.value });
            }}
            placeholder={this.state.placeholder}
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
