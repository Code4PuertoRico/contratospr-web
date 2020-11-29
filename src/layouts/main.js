import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Footer from '../components/footer';
import WorkInProgressNotice from '../components/wip-notice';

const MainLayout = ({ children }) => (
  <div>
    <WorkInProgressNotice />
    <div className="container mx-auto px-2 py-4 sm:p-0">
      <Header />
      {children}
      <Footer />
    </div>
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default React.memo(MainLayout);
