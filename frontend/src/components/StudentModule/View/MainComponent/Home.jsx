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
             {/* 🔗 Link Table Section */}
             <section className="link-table my-4 px-4">
                
                <div className="row row-cols-2 row-cols-md-4 g-3">
                    <div className="col">
                        <a href="#" className="btn btn-outline-primary w-100">TrueConf</a>
                    </div>
                    <div className="col">
                        <a href="http://192.168.68.12:9080" className="btn btn-outline-primary w-100">Live Channel 1 </a>
                    </div>
                    <div className="col">
                        <a href="http://192.168.68.11:9080" className="btn btn-outline-primary w-100">Live Channel 2</a>
                    </div>
                    <div className="col">
                        <a href="http://192.168.68.10:9080" className="btn btn-outline-primary w-100">Live Channel 3</a>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <header className="hero-section">
                <h1>Welcome to the Student Information Portal</h1>
                <p>Empowering Students for Success</p>
                
            </header>
           
        
           

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