import { Recipe } from '../types';
import { getLocal, setLocal } from './localStorage';

type CartItem = {
  recipe: Recipe;
  qty: number;
};

export type Cart = Record<string, CartItem>;

// Function to update cart and notify all components
function updateCart(cart: Cart) {
  setLocal('cart', cart);
  window.dispatchEvent(new Event('cartUpdated'));
}

// Get current cart total
export function getCartTotal(): number {
  const cart = getLocal('cart', {}) as Cart;
  return Object.values(cart).reduce((sum, item) => sum + (item.qty || 0), 0);
}

// Add item to cart
export function addToCart(recipe: Recipe): Cart {
  const cart = getLocal('cart', {}) as Cart;
  const currentQty = cart[recipe.idMeal]?.qty || 0;
  const newCart = {
    ...cart,
    [recipe.idMeal]: { recipe, qty: currentQty + 1 }
  };
  updateCart(newCart);
  return newCart;
}

// Remove item from cart
export function removeFromCart(recipe: Recipe): Cart {
  const cart = getLocal('cart', {}) as Cart;
  const currentQty = cart[recipe.idMeal]?.qty || 0;
  
  if (currentQty <= 1) {
    const { [recipe.idMeal]: _, ...newCart } = cart;
    updateCart(newCart);
    return newCart;
  }
  
  const newCart = {
    ...cart,
    [recipe.idMeal]: { recipe, qty: currentQty - 1 }
  };
  updateCart(newCart);
  return newCart;
}
