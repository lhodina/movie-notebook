import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import Review from './components/Review';
import UpdateReview from './components/UpdateReview';
import Director from './components/Director';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Dashboard /> } path="/dashboard" />
          <Route element={ <ReviewForm /> } path="/reviews/add" />
          <Route element={ <Review /> } path="/reviews/:id" />
          <Route element={ <UpdateReview /> } path="/reviews/:id/update" />
          <Route element={ <Director /> } path="/directors/:id" />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
