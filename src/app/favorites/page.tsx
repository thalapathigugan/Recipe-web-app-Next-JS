"use client";

import { useEffect, useState } from "react";
import React from "react";
import { getLocal, setLocal } from "../utils/localStorage";
import NotFound from "../components/NotFound";
import { Recipe } from "../types";
import RecipeList from "../components/RecipeList";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [cart, setCart] = useState<
    Record<string, { recipe: Recipe; qty: number }>
  >({});

  useEffect(() => {
    const savedFavorites = getLocal("favorites", []) as Recipe[];
    const savedCart = getLocal("cart", {}) as Record<
      string,
      { recipe: Recipe; qty: number }
    >;
    setFavorites(savedFavorites);
    setCart(savedCart);
  }, []);

  const handleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((r) => r.idMeal !== recipe.idMeal);
      setLocal("favorites", newFavorites);
      return newFavorites;
    });
  };

  const handleCartAdd = (recipe: Recipe) => {
    setCart((prev) => {
      const qty = (prev[recipe.idMeal]?.qty || 0) + 1;
      const newCart = { ...prev, [recipe.idMeal]: { recipe, qty } };
      setLocal("cart", newCart);
      return newCart;
    });
  };

  const handleCartRemove = (recipe: Recipe) => {
    setCart((prev) => {
      const qty = (prev[recipe.idMeal]?.qty || 0) - 1;
      let newCart;
      if (qty > 0) {
        newCart = { ...prev, [recipe.idMeal]: { recipe, qty } };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [recipe.idMeal]: removed, ...rest } = prev;
        newCart = rest;
      }
      setLocal("cart", newCart);
      return newCart;
    });
  };

  if (favorites.length === 0) {
    return (
      <NotFound
        title="No Favorites Yet"
        message="You haven't saved any favorite recipes. Start exploring and save the recipes you love!"
        image="/heart.svg"
      />
    );
  }

  return (
    <div className="page-content">
        <div className="page-title">
            <h1 >Favorite Recipes</h1>
        </div>
      <RecipeList
        recipes={favorites}
        favorites={favorites}
        cart={cart}
        onFavorite={handleFavorite}
        onCartAdd={handleCartAdd}
        onCartRemove={handleCartRemove}
        onViewRecipe={(recipe: Recipe) =>
          window.open(`/recipes/${recipe.idMeal}`, "_blank")
        }
      />
    </div>
  );
}
