import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Css/Home.css";

const storage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key),
};

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userState = storage.get("userState");
  const userData = JSON.parse(userState);
  const username = userData?.username;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user?username=${username}`
        );
        setUsers(response.data.results);
      } catch (err) {
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Welcome to the Student Information Portal</h1>
        <p style={{ color: "white" }}>Empowering Students for Success</p>
      </header>
      <section>
        <div>
          <ol>
            <li>
              To access materials for different subjects, click on{" "}
              <strong>"Explore the Content"</strong>.
              This portal offers content such as NPTEL videos, YouTube lectures,
              faculty-recorded sessions, class notes, relevant URLs, highlighted
              links, and LLM-generated content tailored to user needs.
            </li>
            <li>
              The <strong> Quick Links</strong> below provide access to Swayam courses broadcast
              via the Swayam Prabha channel. Three DTH receivers have been
              installed on campus to support load sharing. You can click on any
              of them.
            </li>
            <li>
              <strong>Mann Ki Baat</strong>, featuring the Honorable Prime
              Minister, is available.
              </li>
              <li> By clicking on
              <strong> TrueCon</strong>, you will be redirected to a server that
              connects to live conference sessions held on campus.
            </li>
            <li>
              By clicking on <strong>Campus Radio</strong>, you can access a
              service that allows you to listen to the campus radio and
              participate in ongoing interactive activities.
            </li>
          </ol>
        </div>
      </section>

      {/* Link Table Section */}
      <section className="link-section">
        <h2 className="section-title">Quick Links</h2>
        <div className="link-grid">
         
          <LinkItem
            to="http://192.168.68.12:9080"
            imgSrc="/image/cdot_logo.png"
            imgAlt="CDOT Logo"
            text="Live Content from server 1"
          />
          <LinkItem
            to="http://192.168.68.11:9080"
            imgSrc="/image/cdot_logo.png"
            imgAlt="CDOT Logo"
            text="Live Content from server 2"
          />
          <LinkItem
            to="http://192.168.68.10:9080"
            imgSrc="/image/cdot_logo.png"
            imgAlt="CDOT Logo"
            text="Live Content from server 3"
          />
          <LinkItem to="/studentindex/mann-ki-baat" text="Mann ki Baat" />
           <LinkItem
            to="#"
            imgSrc="/image/OIP.jpg"
            imgAlt="Logo"
            text="Main Portal"
          />
          <LinkItem to="#" text="Campus Radio" />
        </div>
      </section>

      {/* Student Profiles Section */}
      <section className="profile-section">
        <h2 className="section-title">Student Profile</h2>
        {loading ? (
          <div className="loading">Loading user details...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : users && users.length > 0 ? (
          users.map((user, index) => (
            <div className="profile-card" key={index}>
              <h3 className="profile-name">{user.name}</h3>
              <div className="profile-details">
                <p>
                  <span className="detail-label">Username:</span>{" "}
                  {user.username}
                </p>
                <p>
                  <span className="detail-label">Email:</span> {user.email}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No user details available</div>
        )}
      </section>
    </div>
  );
};

// Reusable LinkItem component
const LinkItem = ({ to, imgSrc, imgAlt, text }) => {
  const content = imgSrc ? (
    <>
      <img src={imgSrc} alt={imgAlt} className="link-image" />
      <span>{text}</span>
    </>
  ) : (
    <span>{text}</span>
  );

  return to.startsWith("http") ? (
    <a
      href={to}
      className="link-item"
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link to={to} className="link-item">
      {content}
    </Link>
  );
};

export default Home;
