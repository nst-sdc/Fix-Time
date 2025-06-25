import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const GoogleLoginButton = ({ onLogin }) => {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      // Send token to backend to verify and get profile + JWT
      const res = await axios.post('http://localhost:5001/auth/google-login', {
        token,
      });

      const { user, jwt } = res.data;

      // Save JWT and login user
      localStorage.setItem('token', jwt);
      onLogin(user);

      console.log('✅ Google login successful:', user);
    } catch (error) {
      console.error('❌ Backend Google login failed:', error.response?.data || error.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log('Google Sign In Failed');
      }}
    />
  );
};

export default GoogleLoginButton;
