import React from 'react';
import '../Home.css';
import { CSSTransition } from 'react-transition-group';
import RecipeSearch from './RecipeSearch';

const Home = () => {
    return (
        <CSSTransition in={true} appear={true} timeout={500} classNames="fade">
        <div className="home-container">
            <h1>Welcome to my recipebook App!</h1>
            <RecipeSearch />
        </div>
        </CSSTransition>
    );
    };

export default Home;