// Search.js
import React, { useState } from 'react';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = () => {
    
    console.log('Searching for:', searchTerm);
};

    return (
    <div>
        <h2>Search for Recipes</h2>
        <input
                type="text"
                placeholder="Enter search term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
  
    </div>
    );
};

export default Search;