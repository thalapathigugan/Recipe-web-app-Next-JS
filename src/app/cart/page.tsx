"use client";

import { useEffect, useState } from 'react';
import { Recipe } from '../types';
import { getLocal } from '../utils/localStorage';
import { addToCart, removeFromCart } from '../utils/cartManager';
import RecipeList from '../components/RecipeList';
import NotFound from '../components/NotFound';

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, { recipe: Recipe; qty: number }>>({});
  const [cartRecipes, setCartRecipes] = useState<Recipe[]>([]);

  // Initial load
  useEffect(() => {
    const savedCart = getLocal('cart', {}) as Record<string, { recipe: Recipe; qty: number }>;
    setCart(savedCart);
  }, []);

  // Update cartRecipes whenever cart changes
  useEffect(() => {
    const recipes: Recipe[] = [];
    Object.entries(cart).forEach(([, { recipe, qty }]) => {
      for (let i = 0; i < qty; i++) {
        recipes.push(recipe);
      }
    });
    setCartRecipes(recipes);
  }, [cart]);

  const handleCartAdd = (recipe: Recipe) => {
    const newCart = addToCart(recipe);
    setCart(newCart);
    updateCartRecipes(newCart);
  };

  const handleCartRemove = (recipe: Recipe) => {
    const newCart = removeFromCart(recipe);
    setCart(newCart);
    updateCartRecipes(newCart);
  };

  const updateCartRecipes = (cart: Record<string, { recipe: Recipe; qty: number }>) => {
    const recipes: Recipe[] = [];
    Object.entries(cart).forEach(([, { recipe, qty }]) => {
      for (let i = 0; i < qty; i++) {
        recipes.push(recipe);
      }
    });
    setCartRecipes(recipes);
  };

  const handleFavorite = (recipe: Recipe) => {
    const favorites = getLocal('favorites', []) as Recipe[];
    const exists = favorites.some(r => r.idMeal === recipe.idMeal);
    const newFavorites = exists
      ? favorites.filter(r => r.idMeal !== recipe.idMeal)
      : [...favorites, recipe];
    window.localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (cartRecipes.length === 0) {
    return (
      <NotFound
        title="Your Cart is Empty"
        message="Looks like you haven't added any recipes to your cart yet. Start exploring our delicious recipes!"
        image="/cart.svg"
      />
    );
  }

  return (
    <div className="page-content">
        <div className="page-title">
            <h1>Shopping Cart</h1>
        </div>
      <RecipeList
        recipes={cartRecipes}
        favorites={getLocal('favorites', [])}
        cart={cart}
        onFavorite={handleFavorite}
        onCartAdd={handleCartAdd}
        onCartRemove={handleCartRemove}
        onViewRecipe={(recipe: Recipe) => window.open(`/recipes/${recipe.idMeal}`, '_blank')}
      />
    </div>
  );
}
