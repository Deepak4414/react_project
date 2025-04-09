import React from 'react';
import Header from './Header';

const Terms = () => {
  return (
    <div className="container my-5">
      {/* Optional Header */}
      {/* <Header /> */}

      <div
        className="p-5 shadow rounded"
        style={{ backgroundColor: '#ffffff', maxWidth: '900px', margin: '0 auto' }}
      >
        <h1 className="mb-4 text-center" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#003366' }}>
          📄 Terms and Conditions
        </h1>

        <p className="mb-4" style={{ fontSize: '1.1rem' }}>
          Welcome to our Terms and Conditions page. Please read these terms carefully before using our website.
        </p>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>1. Introduction</h2>
          <p style={{ fontSize: '1.1rem' }}>
            These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full.
          </p>
        </section>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>2. License to use website</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website.
          </p>
        </section>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>3. Acceptable use</h2>
          <p style={{ fontSize: '1.1rem' }}>
            You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
          </p>
        </section>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>4. Restricted access</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Access to certain areas of this website is restricted. We reserve the right to restrict access to other areas of this website, or indeed this entire website, at our discretion.
          </p>
        </section>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>5. Variation</h2>
          <p style={{ fontSize: '1.1rem' }}>
            We may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the use of this website from the date of the publication of the revised terms and conditions on this website.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>6. Entire agreement</h2>
          <p style={{ fontSize: '1.1rem' }}>
            These terms and conditions constitute the entire agreement between you and us in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
