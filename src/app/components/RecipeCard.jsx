"use client";


import Image from 'next/image';

const RecipeCard = ({ recipe, isFavorite, onFavorite, onCartAdd, onCartRemove, onViewRecipe, cartQty }) => (
  <div className="recipe">
    <Image src={recipe.strMealThumb} alt={recipe.strMeal} width={600} height={400} />
    <h3>{recipe.strMeal}</h3>

    <p>
      Category: <span>{recipe.strCategory || 'Unknown'}</span>
    </p>

    <div className="recipe-buttons">
      <button type="button" onClick={() => onViewRecipe(recipe)}>View Recipe</button>
    </div>

    <div className="favorite-cart-controls">
      <button
        type="button"
        className="favorite-btn"
        onClick={() => onFavorite(recipe)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? (
                        <svg className='heart-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#ff6b6b"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ) : (
                        <svg className='heart-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ff6b6b" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 .81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    )}
      </button>

      <div className="cart-counter">
        <button
          type="button"
          className="cart-btn"
          onClick={() => onCartRemove(recipe)}
          aria-label="Decrease quantity"
          disabled={cartQty <= 0}
        >
          −
        </button>
        <span className="cart-count">{cartQty || 0}</span>
        <button
          type="button"
          className="cart-btn"
          onClick={() => onCartAdd(recipe)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

export default RecipeCard;