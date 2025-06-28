import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Create this CSS file for custom styles

const Home = () => {
  // Check if user is logged in
  const isLoggedIn =
    localStorage.getItem("token") && localStorage.getItem("userState");
  const userState = localStorage.getItem("userState");
  let rolePath = "/";
  if (userState) {
    try {
      const { role } = JSON.parse(userState);
      if (role === "student") {
        rolePath = "/studentindex";
      } else if (role === "faculty") {
        rolePath = "/facultyindex";
      } else if (role === "admin") {
        rolePath = "/adminindex";
      }
    } catch (e) {
      console.error("Invalid userState in localStorage");
    }
  }
  return (
    <div className="home-container">
      {/* Hero Section with Gradient Background */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 order-2">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Digital Education Platform
                </h1>
                <p className="lead mb-5" style={{ color: "white" }}>
                  Transforming education through innovative technology and
                  personalized learning experiences.
                </p>
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1 mb-4 mb-lg-0">
              <div className="hero-image">
                <img
                  src="/image/e-learning.png"
                  alt="Digital Education Platform"
                  className="img-fluid"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card p-4 h-100">
                <div className="feature-icon mb-3">
                  <i className="bi bi-book"></i>
                </div>
                <h3>Comprehensive Courses</h3>
                <p>
                  Access a wide range of courses across various disciplines with
                  expert-curated content.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 h-100">
                <div className="feature-icon mb-3">
                  <i className="bi bi-people"></i>
                </div>
                <h3>Interactive Learning</h3>
                <p>
                  Engage with instructors and peers through discussion forums
                  and live sessions.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 h-100">
                <div className="feature-icon mb-3">
                  <i className="bi bi-graph-up"></i>
                </div>
                <h3>Progress Tracking</h3>
                <p>
                  Monitor your learning journey with detailed analytics and
                  performance metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Start Learning?</h2>
          <p className="lead mb-4">
            Join thousands of students already transforming their education.
          </p>
          {isLoggedIn ? (
            <Link to={rolePath} className="btn btn-primary btn-lg px-5">
              Browse Courses
            </Link>
          ) : (
            <a
              href="#"
              className="btn btn-primary btn-lg px-5"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Get Started Now
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
