import React from 'react';
import Header from './Header';

const Privacy = () => {
  return (
    <div className="container my-5">
      {/* Optional Header */}
      {/* <Header /> */}

      <div
        className="p-5 shadow rounded"
        style={{ backgroundColor: '#ffffff', maxWidth: '900px', margin: '0 auto' }}
      >
        <h1 className="mb-4 text-center" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#003366' }}>
          🔒 Privacy Policy
        </h1>

        <p className="mb-4" style={{ fontSize: '1.1rem' }}>
          Your privacy is important to us. This privacy statement explains the personal data our application processes,
          how our application processes it, and for what purposes.
        </p>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>Information We Collect</h2>
          <p style={{ fontSize: '1.1rem' }}>We collect data to provide better services to all our users. The data we collect includes:</p>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem' }}>
            <li>Information you provide to us directly.</li>
            <li>Information we get from your use of our services.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>How We Use Information</h2>
          <p style={{ fontSize: '1.1rem' }}>We use the information we collect in various ways, including to:</p>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem' }}>
            <li>Provide, operate, and maintain our services.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our services.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', color: '#004080' }}>Contact Us</h2>
          <p style={{ fontSize: '1.1rem' }}>
            If you have any questions about this Privacy Policy, please contact us at 
            <a href="mailto:support@example.com" style={{ color: '#007bff', marginLeft: '5px' }}>support@example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
