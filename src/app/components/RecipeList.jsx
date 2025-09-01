"use client";

import { useMemo } from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({
  recipes,
  favorites,
  cart,
  onFavorite,
  onCartAdd,
  onCartRemove,
  onViewRecipe,
}) => {
  const favoriteIds = useMemo(() => new Set(favorites.map(r => r.idMeal)), [favorites]);

  return (
    <div className="recipe-container">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          isFavorite={favoriteIds.has(recipe.idMeal)}
          onFavorite={onFavorite}
          onCartAdd={onCartAdd}
          onCartRemove={onCartRemove}
          onViewRecipe={onViewRecipe}
          cartQty={cart[recipe.idMeal]?.qty || 0}
        />
      ))}
    </div>
  );
};

export default RecipeList;