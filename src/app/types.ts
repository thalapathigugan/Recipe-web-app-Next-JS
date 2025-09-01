export interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions?: string;
  strMealThumb?: string;
  strCategory?: string;
  strArea?: string;
  strTags?: string;
  // Add other recipe properties here as needed
  [key: string]: unknown; // Allow other properties, as the data structure isn't fully defined
}

export interface Category {
  idCategory?: string;
  strCategory: string;
}
