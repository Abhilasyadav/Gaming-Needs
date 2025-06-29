import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600);
  const [otpExpired, setOtpExpired] = useState(false);

  const otpInputs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0 && !otpExpired) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    if (timer === 0 && step === 'otp') {
      setOtpExpired(true);
    }
    return () => clearInterval(interval);
  }, [step, timer, otpExpired]);

  const formatTimer = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setStep('otp');
    setTimer(600);
    setOtp(['', '', '', '', '', '']);
    setOtpExpired(false);
    setTimeout(() => {
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    }, 100);
  };

  const handleOtpChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      otpInputs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpInputs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (otpExpired) {
      setError('OTP has expired. Please resend.');
      return;
    }
    if (otp.some(d => d === '')) {
      setError('Please enter all 6 digits.');
      return;
    }
    toast.success('OTP verified! You can now reset your password.');
  };

  const handleResendOtp = () => {
    setTimer(600);
    setOtp(['', '', '', '', '', '']);
    setOtpExpired(false);
    setTimeout(() => {
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    }, 100);
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '60px auto',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 0 15px rgba(0,0,0,0.08)',
      background: '#fff',
      color: '#222',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      width: '90vw',
      minWidth: '0',
      boxSizing: 'border-box',
    },
    title: {
      textAlign: 'center',
      marginBottom: '18px',
      fontWeight: 700,
      fontSize: '1.5em'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      marginBottom: '16px',
      fontSize: '1em',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: '#007bff',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1em',
      cursor: 'pointer',
      marginBottom: '10px'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 28px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      background: '#f5f5f5',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '1em',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'background 0.2s, border 0.2s',
      outline: 'none',
      minHeight: '44px',
      minWidth: '110px',
      justifyContent: 'center'
    },
    error: {
      color: '#d32f2f',
      marginBottom: '12px',
      fontSize: '0.98em'
    },
    success: {
      color: '#388e3c',
      background: '#e8f5e9',
      padding: '14px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '10px'
    },
    otpRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '18px',
      flexWrap: 'wrap'
    },
    otpInput: {
      width: '40px',
      height: '48px',
      fontSize: '1.5em',
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#f9f9f9',
      marginBottom: '8px'
    },
    timer: {
      textAlign: 'center',
      marginBottom: '12px',
      color: otpExpired ? '#d32f2f' : '#007bff',
      fontWeight: 500,
      letterSpacing: '1px'
    },
    resend: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      cursor: otpExpired ? 'pointer' : 'not-allowed',
      fontSize: '1em',
      margin: '0 auto',
      display: 'block'
    }
  };

  // Responsive overrides for small screens
  const isMobile = window.innerWidth <= 500;
  const responsiveContainer = isMobile
    ? { ...styles.container, padding: '16px', margin: '20px auto', maxWidth: '98vw' }
    : styles.container;
  const responsiveOtpInput = isMobile
    ? { ...styles.otpInput, width: '32px', height: '38px', fontSize: '1.1em' }
    : styles.otpInput;
  const responsiveBackButton = isMobile
    ? { ...styles.backButton, fontSize: '0.98em', padding: '10px 12px', minHeight: '40px', minWidth: '90px' }
    : styles.backButton;

  return (
    <div style={responsiveContainer}>
      <button style={responsiveBackButton} onClick={() => navigate(-1)}>
        <span style={{ fontSize: '1.2em', lineHeight: 1 }}>&larr;</span>
        Back
      </button>
      <div style={styles.title}>Forgot Password</div>
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit}>
          <label style={styles.label} htmlFor="email">Enter your email address</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.button} type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            Enter the 6-digit OTP sent to <b>{email}</b>
          </div>
          <div style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                style={responsiveOtpInput}
                value={digit}
                ref={el => otpInputs.current[idx] = el}
                onChange={e => handleOtpChange(idx, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(idx, e)}
                disabled={otpExpired}
              />
            ))}
          </div>
          <div style={styles.timer}>
            {otpExpired
              ? "OTP expired."
              : `OTP expires in ${formatTimer(timer)}`}
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.button} type="submit" disabled={otpExpired}>Verify OTP</button>
          <button
            type="button"
            style={styles.resend}
            onClick={handleResendOtp}
            disabled={!otpExpired}
          >
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
}





