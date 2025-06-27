import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AuthPage = ({ isLogin: initialIsLogin = true, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = (credentialResponse) => {
    const userData = jwtDecode(credentialResponse.credential);
    console.log("✅ Google User Info:", userData);

    // Optional: Call your backend API to handle Google login
    // axios.post('http://localhost:5001/auth/google', userData)
    //   .then(res => {
    //     localStorage.setItem('token', res.data.token);
    //     setIsLoggedIn && setIsLoggedIn(res.data.user);
    //     navigate('/');
    //   })
    //   .catch(err => setError('Google login failed'));
  };

  useEffect(() => {
    setIsLogin(initialIsLogin);
    setEmail('');
    setPasswd('');
    setConfirmPasswd('');
    setError('');
    setSuccess('');
    setShowPass(false);
    setShowConfirmPass(false);
  }, [initialIsLogin]);

  const toggleForm = () => {
    navigate(isLogin ? '/register' : '/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !passwd || (!isLogin && !confirmPasswd)) {
      return setError('All fields are required.');
    }

    if (!email.includes('@')) {
      return setError('Please enter a valid email address');
    }

    if (!isLogin && passwd !== confirmPasswd) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post('http://localhost:5001/auth/login', {
          email,
          password: passwd
        });

        if (res.data.token) {
          setSuccess(res.data.message || 'Login successful');
          localStorage.setItem('token', res.data.token);
          if (setIsLoggedIn) setIsLoggedIn(res.data.user);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError('Invalid credentials or missing token');
        }
      } else {
        const res = await axios.post('http://localhost:5001/auth/register', {
          email,
          password: passwd
        });

        setSuccess('Registration successful! Please log in with your credentials.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isLogin ? 'login-mode' : 'register-mode'}`}>
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Register'} Here!</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your Password"
              className="form-input"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="eye-toggle"
            >
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {!isLogin && (
            <div className="form-group" style={{ position: 'relative' }}>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Confirm your Password"
                className="form-input"
                value={confirmPasswd}
                onChange={(e) => setConfirmPasswd(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="eye-toggle"
              >
                {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* ✅ Google Sign-In Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log('❌ Google Login Failed');
            }}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button onClick={toggleForm} className="toggle-button">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
