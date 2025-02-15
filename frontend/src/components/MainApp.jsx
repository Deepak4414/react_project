import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Registration/Login';
import Logout from './Registration/Logout';
import StudentIndex from './StudentModule/StudentIndex';
import FacultyIndex from './FacultyModule/FacultyIndex';
import Footer from './OtherComponent/Footer';
import Registration from './Registration/Registration';
import About from './OtherComponent/About';
import Contact from './OtherComponent/Contact';
import Terms from './OtherComponent/Terms';
import Privacy from './OtherComponent/Privacy';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token and user state in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userState = JSON.parse(localStorage.getItem('userState'));

    if (token && userState) {
      setIsLoggedIn(true); // Set isLoggedIn to true if token and user state exist
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Remove the token on logout
    localStorage.removeItem('userState'); // Remove the user state on logout
  };

  return (
    <Router>
      <div className="app-container" >
        {/* Main Content */}
        <div className="main-content" >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected Routes */}
            <Route
              element={<ProtectedRoute isLoggedIn={isLoggedIn} role="student" />}
            >
              <Route path="/studentindex/*" element={<StudentIndex />} />
            </Route>

            <Route
              element={<ProtectedRoute isLoggedIn={isLoggedIn} role="faculty" />}
            >
              <Route path="/facultyindex/*" element={<FacultyIndex />} />
            </Route>
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default MainApp;