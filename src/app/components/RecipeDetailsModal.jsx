"use client";


const RecipeDetailsModal = ({ recipe, onClose }) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="recipe-details" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="recipe-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="recipe-details-content">
          <h2 className="recipeName">{(recipe.strMeal || '').toUpperCase()}</h2>

          <h3>Ingredients:</h3>
          <ul className="ingredientsList">
            {ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>

          <h3>Instructions:</h3>
          <div className="recipeInstructions">
            {recipe.strInstructions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;