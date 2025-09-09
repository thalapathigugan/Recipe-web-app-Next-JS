"use client";
import { useEffect, useState } from 'react';
import { Recipe } from '../types';
import { getLocal } from '../utils/localStorage';
import { addToCart, removeFromCart } from '../utils/cartManager';
import RecipeList from '../components/RecipeList';
import NotFound from '../components/NotFound';
import Toaster from '../components/Toaster';

export default function CartPage() {
    const [cart, setCart] = useState<Record<string, { recipe: Recipe; qty: number }>>({});
    const [cartRecipes, setCartRecipes] = useState<Recipe[]>([]);
    const [favorites, setFavorites] = useState<Recipe[]>(() => getLocal('favorites', []));
    const [toast, setToast] = useState<{ message: string; type: string; key: number } | null>(null);

    const showToast = (message: string, type: string = 'default') => {
        setToast({ message, type, key: Date.now() });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Initial load of cart
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
    };

    const handleCartRemove = (recipe: Recipe) => {
        const newCart = removeFromCart(recipe);
        setCart(newCart);
    };

    // Corrected function to toggle favorites with toast notification
    const handleFavorite = (recipe: Recipe) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.some((favRecipe) => favRecipe.idMeal === recipe.idMeal);
            let newFavorites;

            if (isFavorite) {
                // If it is a favorite, remove it
                newFavorites = prevFavorites.filter((r) => r.idMeal !== recipe.idMeal);
                showToast('Removed from Favorites', 'error');
            } else {
                // If it's not a favorite, add it
                newFavorites = [...prevFavorites, recipe];
                showToast('Added to Favorites', 'success');
            }

            // Update local storage
            window.localStorage.setItem('favorites', JSON.stringify(newFavorites));
            
            // Return the new state
            return newFavorites;
        });
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
                favorites={favorites}
                cart={cart}
                onFavorite={handleFavorite}
                onCartAdd={handleCartAdd}
                onCartRemove={handleCartRemove}
                onViewRecipe={(recipe: Recipe) => window.open(`/recipes/${recipe.idMeal}`, '_blank')}
            />
            {toast && (
                <Toaster
                    key={toast.key}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
}