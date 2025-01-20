import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({isLoggedIn}) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/facultyindex">
                    Faculty Portal
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/facultyindex">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/facultyindex/add">
                                Add Course
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/facultyindex/update">
                                Update Course
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/facultyindex/livechannel">
                                Add Live Channel Time
                            </Link>
                        </li>
                        <li className="nav-item">
                            {isLoggedIn &&<Link className="nav-link" to="/logout">
                                Logout
                            </Link>}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
