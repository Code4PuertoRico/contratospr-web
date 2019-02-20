import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import WorkInProgressNotice from '../components/wip-notice';

import '../styles/app.css';

export default function MainLayout({ children }) {
  return (
    <div>
      <WorkInProgressNotice />
      <div className="container mx-auto px-2 py-4 sm:p-0">
        <Header />
        {children}
        <div className="text-center text-sm text-grey-dark mt-4 mb-8">
          <p>
            This website is{' '}
            <a
              className="text-grey-dark"
              href="https://github.com/TheIndexingProject/tracking-contratos-pr">
              open-source
            </a>{' '}
            and not affiliated with the Government of Puerto Rico.
          </p>
        </div>
      </div>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired
};
