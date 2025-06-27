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

  const handleGoogleLogin = async (credentialResponse) => {
    setError('');
    setSuccess('');
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        setError('Google login failed: No credential received.');
        return;
      }
      let userData;
      try {
        userData = jwtDecode(credentialResponse.credential);
      } catch (decodeErr) {
        setError('Google login failed: Unable to decode credential.');
        return;
      }
      const res = await axios.post('http://localhost:5001/auth/google', {
        email: userData.email,
        name: userData.name,
        sub: userData.sub
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn && setIsLoggedIn(res.data.user);
        navigate('/');
      } else {
        setError(res.data.error || 'Google login failed');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError('Google login failed: ' + err.response.data.error);
      } else {
        setError('Google login failed: Unexpected error.');
      }
      console.error('Google login error:', err);
    }
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
          setIsLoggedIn && setIsLoggedIn(res.data.user);
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

        setSuccess('Registration successful. Please log in.');
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
            <span onClick={() => setShowPass(!showPass)} className="eye-toggle">
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
              <span onClick={() => setShowConfirmPass(!showConfirmPass)} className="eye-toggle">
                {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              setError('Google Login Failed: Unable to authenticate with Google.');
              console.log('Google Login Failed');
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
