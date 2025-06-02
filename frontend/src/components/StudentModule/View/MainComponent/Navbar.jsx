import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../Css/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in by verifying token and userState in localStorage
  const isLoggedIn = () => {
    try {
      const token = localStorage.getItem('token');
      const userState = localStorage.getItem('userState');
      return !!token && !!userState;
    } catch (err) {
      console.error("Error checking login status:", err);
      return false;
    }
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userState = localStorage.getItem('userState');
      return userState ? JSON.parse(userState) : null;
    } catch (err) {
      console.error("Error parsing userState:", err);
      return null;
    }
  };

  const userData = getUserData();
  const loggedIn = isLoggedIn();

  

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        
          <img className="navbar-logo"
            src="/image/logo.svg" 
            alt="Vignan Logo" 
            width="120"
            height="40"
          />

        <h1 className="navbar-title">E-Content from Local server of the Institute</h1>
      </div>

      <div className="navbar-menu">
        <ul className="navbar-links">
          <li className={location.pathname === '/studentindex' ? 'active' : ''}>
            <Link to="/studentindex">Home</Link>
          </li>
          <li className={location.pathname.includes('explore-material') ? 'active' : ''}>
            <Link to="/studentindex/explore-material">Explore the Content</Link>
          </li>
          
          {loggedIn && userData && (
            <li className="navbar-user">
              <span className="username">{userData.username} ({userData.role})</span>
            </li>
          )}
          
          <li className="logout-button">{ <Link to="/logout" >Logout</Link>}</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;