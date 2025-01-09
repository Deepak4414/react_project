import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../../Css/Home.css'; // Import CSS for styling

const Home = ({ username }) => {
    // Ensure 'username' is correctly extracted if passed as an object
    const user = username && username.username ? username.username : username;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user details on component mount or when 'username' changes
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Fetch user details from API using the 'user' extracted from 'username'
                const response = await axios.get(`http://localhost:5000/api/user?username=${user}`);
                setUsers(response.data.results); // Assuming 'results' contains the data
            } catch (err) {
                setError('Error fetching user details'); // Handle error
            } finally {
                setLoading(false); // Set loading to false after request completes
            }
        };

        // Only call the API if 'user' is defined
        if (user) {
            fetchUserDetails();
        }
    }, [user]); // Dependency array includes 'user' to re-fetch when it changes

    // Render loading, error, or user details
    return (
        <div className="home-container">
            <header className="header">
                <h1>Welcome to the Faculty Information Portal</h1>
                <p>Faculty is the way to achieve success</p>
            </header>
            <main className="student-profiles">
                {loading ? (
                    <p>Loading user details...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : users && users.length > 0 ? (
                    users.map((user, index) => (
                        <div className="student-card" key={index}>
                            <h1>Faculty Profile: {user.username}</h1>
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
