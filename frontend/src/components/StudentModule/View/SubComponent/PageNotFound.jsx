import React from 'react';
import PropTypes from 'prop-types';

const PageNotFound = ({ message }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '200px' }}>
            {/* <h1>404 - Page Not Found</h1> */}
            <h2>{message}</h2>
        </div>
    );
};

PageNotFound.propTypes = {
    message: PropTypes.string.isRequired,
};

export default PageNotFound;