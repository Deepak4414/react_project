import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './OtherComponent/Header';

const Home = ({ isLoggedIn, onLogin }) => {
  const [loginType, setLoginType] = useState('student');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { ...formData, role: loginType });
      alert(response.data.message);
      if (response.data.success) {
        document.querySelector('#loginModal .btn-close').click(); // Close the modal
        onLogin(); // Update the login status in the parent component
        const userState = { username: formData.username };
        if (loginType === 'student') {
          localStorage.setItem('userState', JSON.stringify(userState));
          navigate('/studentindex', { state: userState }); // Redirect to student index page with username
        } else if (loginType === 'faculty') {
          localStorage.setItem('userState', JSON.stringify(userState));
          navigate('/facultyindex', { state: userState }); // Redirect to faculty index page with username
        }
      }
    } catch (error) {
      alert('Error logging in');
    }
  };
  const handleRegister = () => {
    document.querySelector('#loginModal .btn-close').click(); // Close the modal
    navigate('/register'); // Navigate to the registration page
  };
  return (
    <div className="container-fluid">
      
      <Header isLoggedIn={isLoggedIn} />

      {/* Main Content Section */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="text-center text-md-start">
            <h1 className="display-4 mb-4">Digital Education Platform</h1>
            <p className="lead mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt</p>
            <a href="#" className="btn btn-primary btn-lg">Go Live</a>
          </div>
        </div>
        <div className="col-md-6">
          <img src="./image/e-learning.png" alt="Digital Education Platform" className="img-fluid" />
        </div>
      </div>

      {/* Bootstrap Modal for Login */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="btn-group w-100 mb-3" role="group" aria-label="Login Type">
                <button type="button" className={`btn btn-outline-primary ${loginType === 'student' ? 'active' : ''}`} onClick={() => setLoginType('student')}>Student</button>
                <button type="button" className={`btn btn-outline-primary ${loginType === 'faculty' ? 'active' : ''}`} onClick={() => setLoginType('faculty')}>Faculty</button>
              </div>
              <form id="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" id="username" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              <div className="mt-3">
                <p>Don't have an account? <button className="btn btn-link link-primary" onClick={handleRegister}>Register here</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
