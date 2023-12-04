import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/SignUp';
import UserProfile from './components/UserProfile';
import RecipeSearch from './components/RecipeSearch';
import RecipeDetails from './components/RecipeDetails';
import UserFavorites from './components/UserFavorites';
import './App.css'; 

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    
      <Router>
        <div className="app-container">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
          <Link to="/" className="nav-link-home">Home</Link>
            {authenticated ? (
              <nav>
                <Link to={`/user/profile/${localStorage.getItem('userId')}`}>Profile</Link>
                <span style={{ margin: '0 5px' }}>&nbsp;</span>
                <Link to="/favorites">Favorites</Link>
                <span style={{ margin: '0 5px' }}>&nbsp;</span>
                <Link onClick={handleLogout}>Logout</Link>
              </nav>
            ) : (
              <nav>
                <Link to="/signup">Sign Up</Link>
                <span style={{ margin: '0 5px' }}>&nbsp;</span>
                <Link to="/login">Login</Link>
              </nav>
            )}
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/user/profile/:userId" element={<UserProfile authenticated={authenticated} />} />
            <Route path="/recipe-search/:recipeId" element={<RecipeSearch />} />
            <Route path="/recipe-details/:id" element={<RecipeDetails userId={localStorage.getItem('userId')} authenticated={authenticated} />} />
            <Route path="/favorites" element={<UserFavorites />} /> {/* Add this line for UserFavorites */}
          </Routes>
        </div>
      </Router>
    );
};

export default App;