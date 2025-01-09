import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userState');
        // Clear any authentication tokens or user data here
        localStorage.removeItem('authToken'); // Example: remove auth token from local storage
        // On Logout
        
        onLogout(); // Call the onLogout function to update the state in the parent component
        navigate('/'); // Redirect to the login page
    }, [navigate, onLogout]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;