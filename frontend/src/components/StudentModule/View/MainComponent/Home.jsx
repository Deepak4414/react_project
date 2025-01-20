import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/Home.css'; // Import CSS for styling

const Home = ({ username }) => {
    // Extract the actual username string if passed as an object
    const user = username && username.username ? username.username : username;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user?username=${user}`);
                setUsers(response.data.results); // Access the 'results' array from the response
            } catch (err) {
                setError('Error fetching user details'); // Handle error
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user]);

    // Render loading, error, or user details
    return (
        <div className="home-container">
            {/* <header className="header">
                <h1>Welcome to the Student Information Portal</h1>
                <p>Empowering Students for Success</p>
            </header> */}
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
