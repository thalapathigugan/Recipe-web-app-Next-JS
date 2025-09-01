"use client";

import React from 'react';

const RecipeDetails = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure || ''}`);
    }
  }

  return (
    <div className="recipe-details">
      <button className="recipe-close-btn" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.strInstructions}</p>
    </div>
  );
};

export default RecipeDetails;