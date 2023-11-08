import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import Review from './components/Review';
import UpdateReview from './components/UpdateReview';
import CollectionForm from './components/CollectionForm';
import Director from './components/Director';
import Critic from './components/Critic';
import FavoriteDirectorForm from './components/FavoriteDirectorForm';
import FavoriteCriticForm from './components/FavoriteCriticForm';
import AddFanForm from './components/AddFanForm';

function App() {
  const user = {
    "id": 1,
    "first_name": "Luke",
    "last_name": "Hodina"
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Dashboard user={user} /> } path="/dashboard" />
          <Route element={ <ReviewForm user={user} location="newReview" /> } path="/reviews/add" />
          <Route element={ <Review user={user} /> } path="/reviews/:id" />
          <Route element={ <UpdateReview user={user}  /> } path="/reviews/:id/update" />
          <Route element={ <CollectionForm user={user}  /> } path="/collections/add" />
          <Route element={ <Director user={user} /> } path="/directors/:id" />
          <Route element={ <Critic user={user} /> } path="/critics/:id" />
          <Route element={ <FavoriteDirectorForm user={user} /> } path="/favorite_directors/add" />
          <Route element={ <FavoriteCriticForm user={user} /> } path="/favorite_critics/add" />
          <Route element={ <AddFanForm user={user} /> } path="/movies/:movie_id/add_fan" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
