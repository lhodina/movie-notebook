import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import Review from './components/Review';
import UpdateReview from './components/UpdateReview';
import Director from './components/Director';
import FavoriteDirectorForm from './components/FavoriteDirectorForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Dashboard /> } path="/dashboard" />
          <Route element={ <ReviewForm location="newReview" /> } path="/reviews/add" />
          <Route element={ <Review /> } path="/reviews/:id" />
          <Route element={ <UpdateReview /> } path="/reviews/:id/update" />
          <Route element={ <Director /> } path="/directors/:id" />
          <Route element={ <FavoriteDirectorForm /> } path="/favorite_directors/add" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
