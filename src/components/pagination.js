import React from 'react';
import PropTypes from 'prop-types';

function getPageRange(size) {
  return [...Array(size).keys()].map((i) => i + 1);
}

class Pagination extends React.PureComponent {
  static propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
  };

  handlePageChange = (e, { page }) => {
    e.preventDefault();
    this.props.onPageChange({ page });
  };

  showCurrentPage(page) {
    return this.props.page === page;
  }

  showAdjacentPage(page) {
    return page > this.props.page - 3 && page < this.props.page + 3;
  }

  render() {
    let showPrevious = this.props.page > 1;
    let showNext = this.props.page < this.props.pages;

    return (
      <>
        {showPrevious ? (
          <a
            href="#"
            className="no-underline text-blue-700 hover:text-blue-800 mr-2"
            onClick={(e) =>
              this.handlePageChange(e, { page: this.props.page - 1 })
            }>
            &larr; anterior
          </a>
        ) : null}

        {getPageRange(this.props.pages).map((page) => (
          <React.Fragment key={page.toString()}>
            {this.showCurrentPage(page) ? (
              <span className="font-bold text-blue-800 mr-2">{page}</span>
            ) : this.showAdjacentPage(page) ? (
              <a
                href="#"
                className="no-underline text-blue-700 hover:text-blue-800 mr-2"
                onClick={(e) => this.handlePageChange(e, { page })}>
                {page}
              </a>
            ) : null}
          </React.Fragment>
        ))}

        {showNext ? (
          <a
            href="#"
            className="no-underline text-blue-700 hover:text-blue-800"
            onClick={(e) =>
              this.handlePageChange(e, { page: this.props.page + 1 })
            }>
            siguiente &rarr;
          </a>
        ) : null}
      </>
    );
  }
}

export default Pagination;
