// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Questionnaire from './pages/Questionnaire';
import Agent from './pages/Agent';
import SelectedWorkout from './pages/SelectedWorkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navigation from './components/Navigation';
import Demo from './pages/Demo';
import AgentDemo from './pages/AgentDemo';
import DemoSelection from './pages/DemoSelection';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navigation />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/demo-agent" element={<AgentDemo />} />
      <Route path="/demo-selection" element={<DemoSelection />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/results" element={<Agent />} />
      <Route path="/selected-workout" element={<SelectedWorkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);
