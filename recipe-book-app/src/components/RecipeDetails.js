import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../RecipeDetails.css';

const RecipeDetails = ({ userId, authenticated }) => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=da0bbd3f8e7b462f94df9ec2cc14020e`
        );

        const userFavorites = await axios.get(`http://localhost:5000/api/favorites/${userId}`);
        const isRecipeInFavorites = userFavorites.data.favorites.some((fav) => fav.recipeId === id);

        setRecipeDetails(response.data);
        setIsFavorite(isRecipeInFavorites);
      } catch (error) {
        console.error('Error fetching recipe details:', error.response?.data.message || error.message);
      }
    };

    fetchRecipeDetails();
  }, [id, userId]);

  useEffect(() => {
    const updateFavorites = async () => {
      if (authenticated) {
        try {
          if (isFavorite) {
            await axios.delete(`http://localhost:5000/api/favorites/${userId}/${id}`);
          } else {
            await axios.post(`http://localhost:5000/api/favorites/${userId}`, {
              recipeId: id,
              recipeTitle: recipeDetails?.title,
              preparation: recipeDetails?.instructions,
            });
          }
        } catch (error) {
          console.error('Error updating favorites:', error.response?.data.message || error.message);
        }
      }
    };

    updateFavorites();
  }, [isFavorite, userId, id, authenticated, recipeDetails]);

  const handleToggleFavorites = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  return (
    <div className="recipe-details-container">
      <h2>Recipe Details</h2>
      {recipeDetails ? (
        <div>
          <h3>{recipeDetails.title}</h3>
          <img src={recipeDetails.image} alt={recipeDetails.title} />
          <p>Servings: {recipeDetails.servings}</p>
          <p>Ready in Minutes: {recipeDetails.readyInMinutes}</p>
          <p>Source: <a href={recipeDetails.sourceUrl}>{recipeDetails.sourceName}</a></p>

          <h4>Ingredients</h4>
          <ul className="ingredients-list">
            {recipeDetails.extendedIngredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.amount} {ingredient.measures.metric.unitLong} of {ingredient.name}
              </li>
            ))}
          </ul>

          <h4>Preparation Instructions</h4>
          <ol>
            {recipeDetails.analyzedInstructions.length > 0 ? (
              recipeDetails.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))
            ) : (
              <li>No instructions available.</li>
            )}
          </ol>

          {authenticated ? (
            <div className="authenticated-actions">
              <button onClick={handleToggleFavorites}>
                {isFavorite ? 'Add to Favorites' : 'Remove from Favorites'}
              </button>
              <p>
                <Link to="/favorites">View Your Favorites</Link>
              </p>
            </div>
          ) : (
            <h4>Please log in to add recipes to your favorites.</h4>
          )}
        </div>
      ) : (
        <p>Loading recipe details...</p>
      )}
    </div>
  );
};

export default RecipeDetails;