import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Check if user is logged in by verifying token in localStorage
  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userState');

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

 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
       <Link className="navbar-brand" to="/facultyindex">          
       <img 
            src="/image/logo.svg" 
            alt="College Logo" 
            width="120px"
            height="50px"
            className="d-inline-block align-top me-2"
          />
          Faculty Portal
       
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/facultyindex">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/facultyindex/update">
                    <i className="bi bi-pencil-square me-1"></i> Update Course
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isLoggedIn && userData && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i> {userData.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/facultyindex/updatefacultydetails">
                      <i className="bi bi-person me-2"></i> Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <Link className="dropdown-item" to="/logout">
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;