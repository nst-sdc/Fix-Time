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
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate min and max dates for age validation (10 years minimum age)
  const calculateDateLimits = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()); // Reasonable upper limit
    
    return {
      max: maxDate.toISOString().split('T')[0],
      min: minDate.toISOString().split('T')[0]
    };
  };

  const dateLimits = calculateDateLimits();

  // Update local state when prop changes and reset form fields
  useEffect(() => {
    setIsLogin(initialIsLogin);
    // Reset form fields when switching between login/register
    setEmail('');
    setPasswd('');
    setConfirmPasswd('');
    setFullName('');
    setPhoneNumber('');
    setAddress('');
    setDateOfBirth('');
    setGender('');
    setError('');
    setSuccess('');
    setShowPass(false);
    setShowConfirmPass(false);
  }, [initialIsLogin]);

  const toggleForm = () => {
    // Navigate to the respective route instead of just toggling the form
    navigate(isLogin ? '/register' : '/login');
  };

  const validateAge = (dateString) => {
    if (!dateString) return null; // Date of birth is optional
    
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    if (actualAge < 10) {
      return 'You must be at least 10 years old to register.';
    }
    
    if (actualAge > 120) {
      return 'Please enter a valid date of birth.';
    }
    
    return null;
  };

  const validateForm = () => {
    if (!email || !passwd || (!isLogin && !confirmPasswd)) {
      return 'All fields are required.';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        return 'Full name is required.';
      }
      if (!phoneNumber.trim()) {
        return 'Phone number is required.';
      }
      if (!address.trim()) {
        return 'Address is required.';
      }
      if (!gender) {
        return 'Please select your gender.';
      }
      if (passwd !== confirmPasswd) {
        return 'Passwords do not match.';
      }
      if (passwd.length < 6) {
        return 'Password must be at least 6 characters long.';
      }
      
      // Validate age if date of birth is provided
      const ageError = validateAge(dateOfBirth);
      if (ageError) {
        return ageError;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        // Handle login
        const res = await axios.post('http://localhost:5001/auth/login', { 
          email, 
          password: passwd 
        });

        if (res.data.token) {
          setSuccess(res.data.message || 'Login successful');
          localStorage.setItem('token', res.data.token);
          
          // Set logged in state with user data and redirect
          if (setIsLoggedIn) {
            setIsLoggedIn(res.data.user);
          }
          
          // Short delay before redirect to show success message
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError('Invalid credentials or missing token');
        }
      } else {
        // Handle registration
        const registrationData = {
          email,
          password: passwd,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          gender
        };

        // Add dateOfBirth if provided
        if (dateOfBirth) {
          registrationData.dateOfBirth = dateOfBirth;
        }

        await axios.post('http://localhost:5001/auth/register', registrationData);
        
        setSuccess('Registration successful! Please log in with your credentials.');
        
        // Redirect to login page after successful registration
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

          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <input
                type="tel"
                placeholder="Enter your Phone Number"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <textarea
                placeholder="Enter your Address"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <select
                className="form-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Date of Birth (Optional - Must be at least 10 years old)</label>
              <input
                type="date"
                placeholder="Date of Birth (Optional)"
                className="form-input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                min={dateLimits.min}
                max={dateLimits.max}
              />
            </div>
          )}

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
