import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
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
import Header from './OtherComponent/Header'; // ✅ Import header here
import LoginModal from './LoginModal'; // ✅ Import LoginModal here
import MannKiBaat from './Mann-Ki-Baat/MannKiBaat'; // ✅ Import MannKiBaat here
import AdminIndex from './AdminModule/AdminIndex'; // ✅ Import AdminIndex here
// 🧠 Custom wrapper to use location inside MainApp
const AppContent = ({ isLoggedIn, handleLogin, handleLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Show header only on public routes (not inside student/faculty dashboards)
  const showHeader = !currentPath.startsWith('/studentindex') && !currentPath.startsWith('/facultyindex');

  return (
    <div className="app-container">
      {/* ✅ Conditionally show Header */}
      {showHeader && <Header isLoggedIn={isLoggedIn} />}

      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path='/login-model' element={<LoginModal onLogin={handleLogin} />} />
          {/* Protected Routes - Student */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} role="student" />}>
            <Route path="/studentindex/*" element={<StudentIndex />}>
            <Route path="mann-ki-baat" element={<MannKiBaat />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Route>

          {/* Protected Routes - Faculty */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} role="faculty" />}>
            <Route path="/facultyindex/*" element={<FacultyIndex />}>
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Route>
            {/* Protected Routes - Admin */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} role="admin" />}>
            <Route path="/adminindex/*" element={<AdminIndex />}>
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
        </Route>

        </Routes>
      </div>
        {/* ✅ Make Login Modal globally available */}
        <LoginModal onLogin={handleLogin} />
      <Footer />
    </div>
  );
};

const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userState = JSON.parse(localStorage.getItem('userState'));
    if (token && userState) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userState');
  };

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
};

export default MainApp;