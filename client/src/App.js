import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Dashboard /> } path="/dashboard" />
          <Route element={ <ReviewForm /> } path="/reviews/add" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
