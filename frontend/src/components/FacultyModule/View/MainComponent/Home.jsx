import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingSpinner from "../SubComponent/LoadingSpinner";
import ErrorMessage from "../SubComponent/ErrorMessage";
import "../../Css/Home.css";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get username from localStorage
  const getUsernameFromStorage = () => {
    try {
      const userState = localStorage.getItem('userState');
      if (userState) {
        const parsedState = JSON.parse(userState);
        return parsedState.username;
      }
      return null;
    } catch (err) {
      console.error("Error parsing userState from localStorage:", err);
      return null;
    }
  };

  const username = getUsernameFromStorage();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!username) {
          throw new Error("No username found in storage");
        }
        
        const response = await axios.get(
          `http://localhost:5000/api/user?username=${username}`
        );
        
        if (response.data.results && response.data.results.length > 0) {
          setUserData(response.data.results[0]);
        } else {
          setError("No faculty data found");
        }
      } catch (err) {
        setError(err.message || "Error fetching faculty details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [username]);

  const facultyFeatures = [
    // { path: "/facultyindex/add", label: "Add Course", icon: "📚" },
    { path: "/facultyindex/update", label: "Update Course", icon: "✏️" },
    { path: "/facultyindex/addvfstrvideo", label: "Add VFSTR Video", icon: "🎥" },
    { path: "/facultyindex/addfacultydetails", label: "Add Faculty Details", icon: "👨‍🏫" },
    { path: "/facultyindex/livechannel", label: "Live Channel", icon: "📡" },
    { path: "/facultyindex/explore-material", label: "Preview Content", icon: "👀" },
    { path: "/facultyindex/live-channel-program-guide", label: "Program Guide", icon: "🔄" },
    { path : "/facultyindex/fetch-subject-for-question", label: "Add Question", icon: "❓" },
  ];

  return (
    <div className="faculty-home-container">
      {/* Hero Banner */}
      <header className="faculty-hero">
        <h1>Welcome to Faculty Portal</h1>
        <p>Empowering educators to shape the future</p>
      </header>

      

      {/* Quick Access Features */}
      <section className="faculty-features">
        <h2 className="section-title">Quick Access</h2>
        <div className="features-grid">
          {facultyFeatures.map((feature, index) => (
            <Link to={feature.path} key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.label}</h3>
            </Link>
          ))}
        </div>
      </section>
      {/* Faculty Profile Section */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : userData ? (
        <section className="faculty-profile">
          <div className="profile-card">
            <div className="profile-header">
              <h2>{userData.name}</h2>
              <span className="faculty-badge">Faculty</span>
            </div>

            
            <div className="profile-details">
              <p><span>Username:</span> {userData.username}</p>
              <p><span>Email:</span> {userData.email}</p>
              <p><span>Department:</span> {userData.department || "Not specified"}</p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Home;