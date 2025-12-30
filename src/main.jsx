// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import Agent from './pages/Agent';
import SelectedWorkout from './pages/SelectedWorkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/starting" element={<LandingPage />} />
      <Route path="/results" element={<Agent />} />
      <Route path="/selected-workout" element={<SelectedWorkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);
