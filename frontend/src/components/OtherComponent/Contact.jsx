import React from 'react';
import Header from './Header';

const contactInfo = {
  address: "Vignan's Foundation for Science, Technology & Research",
  city: 'Vadlamudi',
  state: 'Guntur - 522 213',
  country: 'Andhra Pradesh, India',
  phone: '+91-863-2344 700 / 701',
  email: 'info@vignan.ac.in',
};

const Contact = () => {
  return (
    <div className="container my-5">
      {/* Optional Header */}
      {/* <Header /> */}

      <div
        className="p-5 shadow rounded"
        style={{ backgroundColor: '#ffffff', maxWidth: '700px', margin: '0 auto' }}
      >
        <h1 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: '600', color: '#004080' }}>
          📞 Contact Us
        </h1>

        <div className="contact-detail mb-3">
          <h5 className="mb-1 text-muted">Address:</h5>
          <p style={{ fontSize: '1.1rem' }}>{contactInfo.address}</p>
          <p style={{ fontSize: '1.1rem' }}>
            {contactInfo.city}, {contactInfo.state}
          </p>
          <p style={{ fontSize: '1.1rem' }}>{contactInfo.country}</p>
        </div>

        <div className="contact-detail mb-3">
          <h5 className="mb-1 text-muted">Phone:</h5>
          <p style={{ fontSize: '1.1rem' }}>{contactInfo.phone}</p>
        </div>

        <div className="contact-detail">
          <h5 className="mb-1 text-muted">Email:</h5>
          <p style={{ fontSize: '1.1rem' }}>{contactInfo.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
