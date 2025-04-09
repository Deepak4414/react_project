import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = ({ isLoggedIn }) => {
  return (
    <div className="container-fluid">
      {/* Hero Section */}
      <div className="row align-items-center" style={{ height: '450px' }}>
        <div className="col-md-6">
          <div className="text-center text-md-start">
            <h1 className="display-4 mb-4 fw-normal">Digital Education Platform</h1>
            
          </div>
        </div>
        <div className="col-md-6">
          <img
            src="./image/e-learning.png"
            alt="Digital Education Platform"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
