import React from 'react';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={ <Dashboard /> } path="/dashboard" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
