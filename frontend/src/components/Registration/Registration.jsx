    import React, { useState } from 'react';
    import axios from 'axios';
    import './Registration.css';
    import { useNavigate } from 'react-router-dom';

    const Registration = () => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        });
        const [role, setRole] = useState('student'); // State to manage the selected role

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleRoleChange = (e) => {
            setRole(e.target.value);
        };
        
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            try {
                const response = await axios.post('http://localhost:5000/api/register', { ...formData, role });
                alert("User registered successfully");
                navigate('/');
            } catch (error) {
                alert("User already exists");
            }
        };

        return (
            <div className="registration-container">
                <h2>Register</h2>
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
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
            </div>
        );
    };

    export default Registration;