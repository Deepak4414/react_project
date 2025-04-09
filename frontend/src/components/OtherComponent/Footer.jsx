import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  // Get the base path dynamically for different user roles
  const getBasePath = (pathname) => {
    if (pathname.startsWith('/studentindex')) return '/studentindex';
    if (pathname.startsWith('/facultyindex')) return '/facultyindex';
    return '';
  };

  const basePath = getBasePath(location.pathname);

  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        {/* Navigation Links */}
        <ul className="list-inline mb-3">
          <li className="list-inline-item mx-2">
            <Link to={`${basePath}`} className="footer-link">Home</Link>
          </li>
          <li className="list-inline-item mx-2">
            <Link to={`${basePath}/contact`} className="footer-link">Contact Us</Link>
          </li>
          <li className="list-inline-item mx-2">
            <Link to={`${basePath}/terms`} className="footer-link">Terms of Service</Link>
          </li>
          <li className="list-inline-item mx-2">
            <Link to={`${basePath}/privacy`} className="footer-link">Privacy Policy</Link>
          </li>
        </ul>

        {/* Copyright */}
        <p className="mb-3">&copy; 2024 Vignan University. All rights reserved.</p>

        {/* Social Media Icons */}
        <div>
          <a href="https://www.facebook.com/vignanuniversity" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://twitter.com/Vignanuniv" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.instagram.com/vignanuniversity/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.linkedin.com/school/vignan-university/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
