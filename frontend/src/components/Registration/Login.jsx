import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [role, setRole] = useState('student'); // State to manage the selected role

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { ...formData, role });
            if (response.data.success) {
                onLogin();
                if (role === 'student') {
                    navigate('/studentindex'); // Redirect to student index page
                } else if (role === 'faculty') {
                    navigate('/facultyindex'); // Redirect to faculty index page
                }
            }
        } catch (error) {
            alert("Error logging in");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="student"
                            checked={role === 'student'}
                            onChange={handleRoleChange}
                        />
                        Student
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="faculty"
                            checked={role === 'faculty'}
                            onChange={handleRoleChange}
                        />
                        Faculty
                    </label>
                </div>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;