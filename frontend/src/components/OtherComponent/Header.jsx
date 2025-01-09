import React from 'react';

const Header = ({ isLoggedIn }) => {
    return (
        <header className="d-flex justify-content-between align-items-center py-3">
            <img src="/image/logo.png" alt="Logo" className="img-fluid" style={{ maxHeight: '60px' }} />
            <ul className="nav">
                {!isLoggedIn && (
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
                    </li>
                )}
                {isLoggedIn && (
                    <li className="nav-item">
                        <a className="nav-link" href="/logout">Logout</a>
                    </li>
                )}
            </ul>
        </header>
    );
};

export default Header;