import React from 'react';
import './App.css';
import AuthPage from './pages/AuthPage';
import AppointmentPage from './pages/AppointmentPage';

function App() {
  return (
    <div className="App">
      <AuthPage />
      {/* Uncomment this below once auth is done */}
      {/* <AppointmentPage /> */}
    </div>
  );
}

export default App;
