import React, { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE;

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            }
        } catch (err) {
            toast.error('Network error.', {
                position: 'top-right',
            });
            setMessage('Network error');
        }
    };

    // Responsive styles using inline media queries
    const isMobile = window.innerWidth <= 600;
    const themeStyles = {
        container: {
            maxWidth: isMobile ? '98vw' : '700px',
            margin: isMobile ? '16px auto' : '40px auto',
            padding: isMobile ? '16px' : '30px',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff',
            color: '#333',
            width: '100%',
            boxSizing: 'border-box'
        },
        input: {
            padding: isMobile ? '8px' : '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '10px',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: isMobile ? '1em' : '1.05em'
        },
        select: {
            padding: isMobile ? '8px' : '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '10px',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: isMobile ? '1em' : '1.05em'
        },
        button: {
            padding: isMobile ? '10px' : '12px',
            width: '100%',
            backgroundColor: '#0056b3',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: isMobile ? '1em' : '1.1em'
        },
        alert: {
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            backgroundColor: '#e6f0ff',
            color: '#004085',
            border: '1px solid #b3d1ff',
            fontSize: isMobile ? '1em' : '1.05em'
        },
        label: {
            fontWeight: '600',
            marginBottom: '5px',
            display: 'block',
            fontSize: isMobile ? '1em' : '1.05em'
        },
        error: {
            color: 'red',
            fontSize: '0.95em',
            marginTop: '-8px',
            marginBottom: '8px'
        },
        altButton: {
            backgroundColor: '#e0e0e0',
            color: '#000',
            padding: isMobile ? '8px 10px' : '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: isMobile ? '1em' : '1.05em'
        }
    };

    return (
        <div style={themeStyles.container}>
            <h2 style={{ textAlign: 'center', fontSize: isMobile ? '1.3em' : '1.7em' }}>Sign Up</h2>
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
                    <select name="gender" value={formData.gender} onChange={handleChange} style={themeStyles.select}>
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
                    <select name="role" value={formData.role} onChange={handleChange} style={themeStyles.select}>
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
                    style={themeStyles.altButton}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default SignUp;
