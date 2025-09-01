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
        {isFavorite ? '❤️' : '🤍'}
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