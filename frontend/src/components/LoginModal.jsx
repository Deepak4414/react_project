// components/LoginModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginModal = ({ onLogin }) => {
  const [loginType, setLoginType] = useState('student');
  const [formData, setFormData] = useState({ username: '', password: '' });
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
        document.querySelector('#loginModal .btn-close').click();
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userState', JSON.stringify({ username: formData.username, role: loginType }));
        onLogin();

        if (loginType === 'student') navigate('/studentindex');
        else if (loginType === 'admin') navigate('/adminindex');
        else navigate('/facultyindex');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  const handleRegister = () => {
    document.querySelector('#loginModal .btn-close').click();
    navigate('/register');
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Login</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="btn-group w-100 mb-3">
              <button type="button" className={`btn btn-outline-primary ${loginType === 'student' ? 'active' : ''}`} onClick={() => setLoginType('student')}>Student</button>
              <button type="button" className={`btn btn-outline-primary ${loginType === 'faculty' ? 'active' : ''}`} onClick={() => setLoginType('faculty')}>Faculty</button>
              <button type="button" className={`btn btn-outline-primary ${loginType === 'admin' ? 'active' : ''}`} onClick={() => setLoginType('admin')}>Admin</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
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
  );
};

export default LoginModal;
