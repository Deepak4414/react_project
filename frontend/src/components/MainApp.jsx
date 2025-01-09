import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Registration/Login';
import Logout from './Registration/Logout';
import StudentIndex from './StudentModule/StudentIndex';
import FacultyIndex from './FacultyModule/FacultyIndex'; // Assuming you have a FacultyIndex component
import Footer from './OtherComponent/Footer';
import Registration from './Registration/Registration';
import About from './OtherComponent/About';
import Contact from './OtherComponent/Contact';
import Terms from './OtherComponent/Terms';
import Privacy from './OtherComponent/Privacy';
const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container"> {/* Wrapper for the entire page */}
        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Registration />}/>
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="/studentindex/*" element={<StudentIndex isLoggedIn={isLoggedIn} />} />
            <Route path="/facultyindex/*" element={<FacultyIndex isLoggedIn={isLoggedIn} />} />


            {/* Additional Routes for Footer Links */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default MainApp;