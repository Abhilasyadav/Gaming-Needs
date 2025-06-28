import React, { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITEP_API_BASE;

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        gender: 'MALE',
        dateOfBirth: '',
        role: 'USER',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            console.log(formData);
            if (res.ok) {
                setMessage('User registered successfully!');
                toast.success('User registered successfully!');

                setFormData({
                    username: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    password: '',
                    gender: 'MALE',
                    dateOfBirth: '',
                    role: 'USER',
                    phoneNumber: ''
                });
            } else {
                const data = await res.json();
                setMessage(data.message || 'Registration failed');
                toast.error(data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error('Network error.');
            setMessage('Network error');
        }
    };

    const themeStyles = {
        container: {
            maxWidth: '700px',
            margin: '40px auto',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(0,0,0,0.1)',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#f5f5f5' : '#333'
        },
        input: {
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '10px',
            backgroundColor: darkMode ? '#2a2a2a' : '#fff',
            color: darkMode ? '#f5f5f5' : '#333'
        },
        select: {
            ...this?.input,
            backgroundColor: darkMode ? '#2a2a2a' : '#fff',
            color: darkMode ? '#f5f5f5' : '#333'
        },
        button: {
            padding: '12px',
            width: '100%',
            backgroundColor: darkMode ? '#007bff' : '#0056b3',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
        },
        alert: {
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            backgroundColor: darkMode ? '#333' : '#e6f0ff',
            color: darkMode ? '#e0e0e0' : '#004085',
            border: darkMode ? '1px solid #555' : '1px solid #b3d1ff'
        },
        label: {
            fontWeight: '600',
            marginBottom: '5px',
            display: 'block'
        },
        error: {
            color: 'red',
            fontSize: '0.85em',
            marginTop: '-8px',
            marginBottom: '8px'
        },
        themeSwitch: {
            textAlign: 'right',
            marginBottom: '10px'
        }
    };

    return (
        <div style={themeStyles.container}>
            <div style={themeStyles.themeSwitch}>
                <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
                    Switch to {darkMode ? 'Light' : 'Dark'} Mode
                </button>
            </div>
            <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
            {message && <div style={themeStyles.alert}>{message}</div>}
            <form onSubmit={handleSubmit}>
                {[
                    ['username', 'Username'],
                    ['email', 'Email'],
                    ['firstName', 'First Name'],
                    ['lastName', 'Last Name'],
                    ['password', 'Password', 'password'],
                    ['phoneNumber', 'Phone Number']
                ].map(([key, label, type = 'text']) => (
                    <div key={key}>
                        <label style={themeStyles.label}>{label}</label>
                        <input
                            type={type}
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            style={themeStyles.input}
                        />
                        {errors[key] && <div style={themeStyles.error}>{errors[key]}</div>}
                    </div>
                ))}

                <div>
                    <label style={themeStyles.label}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={themeStyles.input}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
                    </select>
                </div>

                <div>
                    <label style={themeStyles.label}>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        style={themeStyles.input}
                    />
                    {errors.dateOfBirth && <div style={themeStyles.error}>{errors.dateOfBirth}</div>}
                </div>

                <div>
                    <label style={themeStyles.label}>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={themeStyles.input}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <button type="submit" style={themeStyles.button}>Register</button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span style={{ marginRight: '10px' }}>Already have an account?</span>
                <button
                    type="button"
                    onClick={() => window.location.href = '/signin'}
                    style={{
                        backgroundColor: darkMode ? '#444' : '#e0e0e0',
                        color: darkMode ? '#fff' : '#000',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default SignUp;
