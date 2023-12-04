import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useLogout from './useLogout';
import '../UserFavorites.css';

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      logout();
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favorites/${userId}`);
        const enhancedFavorites = await Promise.all(
          response.data.favorites.map(async (fav) => {
            const recipeDetails = await axios.get(`https://api.spoonacular.com/recipes/${fav.recipeId}/information`, {
              params: {
                includeNutrition: false,
                apiKey: 'da0bbd3f8e7b462f94df9ec2cc14020e',
              },
            });
            return {
              recipeId: fav.recipeId,
              recipeTitle: fav.recipeTitle,
              recipeImage: recipeDetails.data.image,
            };
          })
        );
        setFavorites(enhancedFavorites);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user favorites:', error.response?.data.message || error.message);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [logout]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRemoveFromFavorites = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${localStorage.getItem('userId')}/${recipeId}`);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.recipeId !== recipeId));
    } catch (error) {
      console.error('Error removing recipe from favorites:', error.response?.data.message || error.message);
    }
  };

  return (
    <div className="user-favorites-container">
      <h2>Favorites</h2>

      {loading ? (
        <p>Loading favorites...</p>
      ) : favorites.length > 0 ? (
        <ul className="favorites-list">
          {favorites.map((fav) => (
            <li key={fav.recipeId} className="favorite-item">
              <div>
                <Link to={`/recipe-details/${fav.recipeId}`} className="recipe-link">
                  <img
                    src={fav.recipeImage}
                    alt={fav.recipeTitle}
                    className="recipe-image"
                  />
                  <span className="recipe-title">{fav.recipeTitle}</span>
                </Link>
              </div>
              <button onClick={() => handleRemoveFromFavorites(fav.recipeId)} className="remove-button">
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorites found.</p>
      )}
    </div>
  );
};

export default UserFavorites;
