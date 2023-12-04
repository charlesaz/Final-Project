// RecipeSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const SPOONACULAR_API_KEY = 'da0bbd3f8e7b462f94df9ec2cc14020e';

  const handleSearch = async () => {
    console.log('handleSearch function triggered');
    console.log('Search term:', searchTerm);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            query: searchTerm,
            apiKey: SPOONACULAR_API_KEY,
          },
        }
      );
      console.log('API Response:', response.status, response.data);
      setSearchResults(response.data.results);
      setError(null);
    } catch (error) {
      console.error('Error searching for recipes:', error.response?.data.message || error.message);
      setSearchResults([]);
      setError('Error searching for recipes. Please try again.');
    }
  };

  return (
    <div>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Recipe Search..."
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }} > 
        {searchResults.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipe-details/${recipe.id}`} style={{ color: 'yellow' }}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeSearch;