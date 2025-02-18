import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/Home.css'; // Import CSS for styling
const storage = {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
};
const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch username from local storage
    const userState = storage.get('userState');
    const userData = JSON.parse(userState);
    const username = userData.username;

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user?username=${username}`);
                setUsers(response.data.results); // Access the 'results' array from the response
            } catch (err) {
                setError('Error fetching user details'); // Handle error
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        if (username) {
            fetchUserDetails();
        }
    }, [username]);

    // Render loading, error, or user details
    return (
        <div className="home-container">
            {/* Hero Section */}
            <header className="hero-section">
                <h1>Welcome to the Student Information Portal</h1>
                <p>Empowering Students for Success</p>
                
            </header>

            {/* Features Section */}
            {/* <section className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Easy Access</h3>
                        <p>Access your student profile anytime, anywhere.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Secure Data</h3>
                        <p>Your data is safe and secure with us.</p>
                    </div>
                    <div className="feature-card">
                        <h3>24/7 Support</h3>
                        <p>We are here to help you round the clock.</p>
                    </div>
                </div>
            </section> */}

            {/* Student Profiles Section */}
            <main className="student-profiles">
                {loading ? (
                    <p>Loading user details...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : users && users.length > 0 ? (
                    users.map((user, index) => (
                        <div className="student-card" key={index}>
                            <h1>Student Profile: {user.username}</h1>
                            <h3>{user.name}</h3>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    ))
                ) : (
                    <p>No user details available</p>
                )}
            </main>

        </div>
    );
};

export default Home;