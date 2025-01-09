import React from "react";
import { Link } from "react-router-dom";
import "../../Css/Navbar.css";

function Navbar({isLoggedIn}) {

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/image/logo.png" alt="Vignan Logo" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/studentindex" state={{ username: 'john_doe' }}>Home</Link></li>
        <li><Link to="/studentindex/explore-material">Explore Material</Link></li>
        <li><Link to="#">#</Link></li>
        <li><Link to="/studentindex/view-course">Details</Link></li>
        <li>{isLoggedIn && <Link to="/logout" >Logout</Link>}</li>
      </ul>
    </nav>
  );
}

export default Navbar;
