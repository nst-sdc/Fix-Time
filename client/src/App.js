import React from 'react';
import './App.css';

import Navbar from './comopents/navbar';
import Register from './pages/register';
import AppointmentPage from './pages/AppointmentPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Register />
      <AppointmentPage /> {/* ✅ Add this line to show your booking UI */}
    </div>
  );
}

export default App;