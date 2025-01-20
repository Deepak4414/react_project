import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import "./Footer.css";
const Footer = () => {
  return (
    <>
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        <ul className="list-inline mb-3">
          <li className="list-inline-item">
            <Link to="/about" className="text-white">About Us</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/contact" className="text-white">Contact Us</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/terms" className="text-white">Terms of Service</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/privacy" className="text-white">Privacy Policy</Link>
          </li>
        </ul>
        <p>&copy; 2024 Vignan University. All rights reserved.</p>
        <div>
          <a href="https://www.facebook.com/vignanuniversity" target="_blank" className="text-white mx-2" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://twitter.com/Vignanuniv" target="_blank" className="text-white mx-2" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.instagram.com/vignanuniversity/" target="_blank" className="text-white mx-2" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.linkedin.com/school/vignan-university/" target="_blank" className="text-white mx-2" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
