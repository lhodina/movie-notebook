import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReviewForm from './components/ReviewForm';
import Review from './components/Review';
import CollectionForm from './components/CollectionForm';
import Director from './components/Director';
import Critic from './components/Critic';
import FavoriteDirectorForm from './components/FavoriteDirectorForm';
import FavoriteCriticForm from './components/FavoriteCriticForm';
import AddFanForm from './components/AddFanForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Login /> } path="/login" />
          <Route element={ <Dashboard /> } path="/dashboard" />
          <Route element={ <Review /> } path="/reviews/:id" />
          <Route element={ <CollectionForm /> } path="/collections/add" />
          <Route element={ <Director /> } path="/directors/:id" />
          <Route element={ <Critic /> } path="/critics/:id" />
          <Route element={ <FavoriteDirectorForm /> } path="/favorite_directors/add" />
          <Route element={ <FavoriteCriticForm /> } path="/favorite_critics/add" />
          <Route element={ <AddFanForm /> } path="/movies/:movie_id/add_fan" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
