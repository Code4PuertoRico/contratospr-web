import React from 'react';
import PropTypes from 'prop-types';

function getPageRange(size) {
  return [...Array(size).keys()].map((i) => i + 1);
}

class Pagination extends React.Component {
  static propTypes = {
    page: PropTypes.number,
    pages: PropTypes.number,
    onPageChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      pages: props.pages,
      onPageChange: props.onPageChange
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.page !== prevProps.page ||
      this.props.pages !== prevProps.pages
    ) {
      this.setState({
        page: this.props.page,
        pages: this.props.pages
      });
    }
  }

  handlePageChange = (e, { page }) => {
    e.preventDefault();
    this.setState({ page });
    this.state.onPageChange({ page });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.page > 1 ? (
          <a
            href="#"
            className="no-underline text-blue hover:text-blue-darker mr-2"
            onClick={(e) =>
              this.handlePageChange(e, { page: this.state.page - 1 })
            }>
            &larr; anterior
          </a>
        ) : null}

        {getPageRange(this.state.pages).map((page) => (
          <React.Fragment key={page.toString()}>
            {this.state.page == page ? (
              <span className="font-bold text-blue-darker mr-2">{page}</span>
            ) : page > this.state.page - 3 && page < this.state.page + 3 ? (
              <a
                href="#"
                className="no-underline text-blue hover:text-blue-darker mr-2"
                onClick={(e) => this.handlePageChange(e, { page })}>
                {page}
              </a>
            ) : null}
          </React.Fragment>
        ))}

        {this.state.page < this.state.pages ? (
          <a
            href="#"
            className="no-underline text-blue hover:text-blue-darker"
            onClick={(e) =>
              this.handlePageChange(e, { page: this.state.page + 1 })
            }>
            siguiente &rarr;
          </a>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Pagination;
