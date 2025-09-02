"use client";

import { useEffect, useState } from 'react';
import Header from './components/Header';
import MobileBottomBar from './components/MobileBottomBar';
import Pagination from './components/Pagination';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import RecipeList from './components/RecipeList';
import SearchBar from './components/SearchBar';
import Toaster from './components/Toaster';
import { Category, Recipe } from './types';
import ContextualSearchManager from './utils/ContextualSearchManager';
import HomePageRecipeManager from './utils/HomePageRecipeManager';
import { getLocal, setLocal } from './utils/localStorage';
import { useScrollLock } from './components/useScrollLock';

const RECIPES_PER_PAGE = 20;
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const MIN_HOME_RECIPES = 120;

function App() {
  // recipes state removed, use filteredRecipes only
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<string>(() => getLocal('recipe_current_view', 'home'));
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  // Initialize searchTerm from localStorage
  const [searchTerm, setSearchTerm] = useState<string>(() => getLocal('recipe_search_term', ''));
  const [cart, setCart] = useState<Record<string, { recipe: Recipe; qty: number }>>(
    getLocal('cart', {})
  );

  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const storedFavorites = getLocal('favorites', null);
    return Array.isArray(storedFavorites) ? storedFavorites : [];
  });
  const [currentPage, setCurrentPage] = useState<number>(() => getLocal('recipe_current_page', 1));
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toastMsg, setToastMsg] = useState<{ message: string; type: string } | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [homeRecipes, setHomeRecipes] = useState<Recipe[]>([]);
  const [isLoadingHome, setIsLoadingHome] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Helper function to show toast messages with proper reset
  const showToast = (message: string, type: string = 'default') => {
    // First clear any existing toast
    setToastMsg(null);
    setToastKey(prev => prev + 1);

    // Then show the new toast after a brief delay
    setTimeout(() => {
      setToastMsg({ message, type });
    }, 10);
  };

  // Helper function to hide toast
  const hideToast = () => {
    setToastMsg(null);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories.php`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  // Fetch and cache fixed home recipes on mount
  useEffect(() => {
    const fetchHomeRecipes = async () => {
      // Check if we have cached home recipes
      const cachedHomeRecipes = getLocal('homeRecipes', null);
      const cacheTimestamp = getLocal('homeRecipesTimestamp', 0);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      // Use cache if it's less than 1 hour old and has enough recipes
      if (cachedHomeRecipes &&
        cachedHomeRecipes.length >= MIN_HOME_RECIPES &&
        (Date.now() - cacheTimestamp < oneHour)) {
        setHomeRecipes(cachedHomeRecipes);
        return;
      }

      // Fetch fresh recipes
      setIsLoadingHome(true);
      try {
        const fixedRecipes = await HomePageRecipeManager.fetchFixedHomeRecipes();
        setHomeRecipes(fixedRecipes);

        // Cache the results
        setLocal('homeRecipes', fixedRecipes);
        setLocal('homeRecipesTimestamp', Date.now());
      } catch (error) {
        console.error('Error fetching home recipes:', error);
        setHomeRecipes([]);
      } finally {
        setIsLoadingHome(false);
      }
    };

    fetchHomeRecipes();
  }, []);

  // Fetch recipes based on view/search/category
  useEffect(() => {
    async function fetchRecipes() {
      setIsSearching(true);
      let result: Recipe[] = [];

      try {
        if (currentView === 'favorites') {
          result = favorites;
        } else if (currentView === 'cart') {
          // Fetch full details for each cart item
          const ids = Object.keys(cart);
          const recipes = await Promise.all(ids.map(async id => {
            const r = cart[id].recipe;
            if (r.strInstructions) return r;
            const res = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
            const data = await res.json();
            return data.meals ? data.meals[0] : null;
          }));
          result = recipes.filter(Boolean);
        } else if (currentView === 'home' && !currentCategory && !searchTerm) {
          // HOME PAGE: Use fixed cached recipes
          result = homeRecipes;
        } else if (currentCategory && !searchTerm) {
          // Category view without search
          result = await HomePageRecipeManager.fetchCategoryRecipesWithDetails(currentCategory);
        } else if (searchTerm) {
          // Search operations
          if (currentCategory) {
            // CATEGORY-SPECIFIC SEARCH
            try {
              const recipesWithDetails: Recipe[] = await HomePageRecipeManager.fetchCategoryRecipesWithDetails(currentCategory);

              // Then filter them by search term
              const searchLower = searchTerm.toLowerCase();
              const filteredResults: Recipe[] = recipesWithDetails.filter((recipe: Recipe) =>
                recipe.strMeal.toLowerCase().includes(searchLower) ||
                (recipe.strInstructions && recipe.strInstructions.toLowerCase().includes(searchLower)) ||
                (recipe.strArea && recipe.strArea.toLowerCase().includes(searchLower)) ||
                (recipe.strTags && recipe.strTags.toLowerCase().includes(searchLower))
              );

              result = filteredResults;

            } catch (error) {
              console.error('Category-specific search failed:', error);
              result = []; // Explicitly set empty array on error
            }
          } else {
            // GLOBAL SEARCH (no category selected)
            try {
              const res = await fetch(`${API_BASE_URL}/search.php?s=${searchTerm}`);
              const data = await res.json();
              result = data.meals || [];
            } catch (error) {
              console.error('Global search failed:', error);
              result = [];
            }
          }
        } else {
          // Default fallback - use home recipes
          result = homeRecipes;
        }

      } catch (error) {
        console.error('Error in fetchRecipes:', error);
        result = [];
      } finally {
        setIsSearching(false);
      }

  // setRecipes removed, use only setFilteredRecipes
      setFilteredRecipes(result); // Set both at the same time for simplicity
    }

    fetchRecipes();
  }, [currentView, currentCategory, searchTerm, favorites, cart, homeRecipes]);

  // Sync favorites/cart to localStorage
  useEffect(() => { setLocal('favorites', favorites); }, [favorites]);
  useEffect(() => { setLocal('cart', cart); }, [cart]);

  useScrollLock(!!selectedRecipe);

  // Pagination logic - use filteredRecipes
  const paginatedRecipes: Recipe[] = filteredRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );
  const totalPages: number = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);

  // Handlers
  const handleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.some(r => r.idMeal === recipe.idMeal);
      const message = exists ? 'Removed from Favorites' : 'Added to Favorites';
      const type = exists ? 'danger' : 'success';

      showToast(message, type);

      if (exists) return prev.filter(r => r.idMeal !== recipe.idMeal);
      return [...prev, recipe];
    });
  };

  const handleCartAdd = (recipe: Recipe) => {
    setCart(prev => {
      const qty = (prev[recipe.idMeal]?.qty || 0) + 1;
      return { ...prev, [recipe.idMeal]: { recipe, qty } };
    });

    showToast('Added to Cart', 'success');
  };

  const handleCartRemove = (recipe: Recipe) => {
    setCart(prev => {
      const qty = (prev[recipe.idMeal]?.qty || 0) - 1;
      if (qty > 0) return { ...prev, [recipe.idMeal]: { recipe, qty } };
      const { [recipe.idMeal]: omit, ...rest } = prev;
      return rest;
    });

    showToast('Removed from Cart', 'danger');
  };

  const handleViewRecipe = async (recipe: Recipe) => {
    // If recipe has instructions, it's already full details
    if (recipe.strInstructions) {
      setSelectedRecipe(recipe);
    } else {
      // Fetch full details by ID
      const res = await fetch(`${API_BASE_URL}/lookup.php?i=${recipe.idMeal}`);
      const data = await res.json();
      if (data.meals && data.meals[0]) {
        setSelectedRecipe(data.meals[0]);
      }
    }
  };

  const handleCloseRecipe = () => setSelectedRecipe(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLocal('recipe_current_page', page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setLocal('recipe_current_view', view);
    setCurrentPage(1);
    setLocal('recipe_current_page', 1);
    // Clear search when changing to non-contextual views
    if (view === 'home') {
      setSearchTerm('');
      setCurrentCategory(null);
    }
  };

  const handleCategoryChange = (cat: string) => {
    const newCategory = cat === '__all__' ? null : cat;
    setCurrentCategory(newCategory);

    // Update view based on category and search term
    if (newCategory && searchTerm) {
      setCurrentView('search');
    } else if (newCategory && !searchTerm) {
      setCurrentView('category');
    } else if (!newCategory && searchTerm) {
      setCurrentView('search');
    } else {
      setCurrentView('home');
    }

    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setLocal('recipe_search_term', term); // Persist search term
    setCurrentPage(1);
    // For favorites and cart views, don't change the view - just filter in context
    if (currentView === 'favorites' || currentView === 'cart') {
      return; // Stay in the same view, filtering will happen in useEffect
    }
    // For other views, update view based on search term and category
    if (term && currentCategory) {
      setCurrentView('search');
    } else if (term && !currentCategory) {
      setCurrentView('search');
    } else if (!term && currentCategory) {
      setCurrentView('category');
    } else {
      setCurrentView('home');
    }
  };

  // Get search placeholder based on current context
  const searchPlaceholder = ContextualSearchManager.getSearchPlaceholder(currentView);

  // Determine what message to show
  const getDisplayMessage = () => {
    if (isLoadingHome && currentView === 'home') {
      return { type: 'loading', message: 'Loading recipes...' };
    }

    if (isSearching && searchTerm) {
      return { type: 'loading', message: 'Searching...' };
    }

    if (filteredRecipes.length === 0 && searchTerm) {
      const context = currentCategory ? ` in ${currentCategory} category` : '';
      return {
        type: 'no-results',
        message: `No recipes found${context} for "${searchTerm}"`,
        showClearButton: true
      };
    }

    if (filteredRecipes.length === 0 && !searchTerm && currentCategory) {
      return {
        type: 'no-results',
        message: `No recipes found in ${currentCategory} category`,
        showClearButton: false
      };
    }

    return null;
  };

  const displayMessage = getDisplayMessage();

  return (
    <div className="app-container">
      <Header cart={cart} onViewChange={handleViewChange} />
      <main>
        {/* Hide SearchBar and category selection in favorites and cart views */}
        {currentView !== 'favorites' && currentView !== 'cart' && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              currentCategory={currentCategory ?? undefined}
              setCurrentCategory={handleCategoryChange}
              categories={categories}
              placeholder={searchPlaceholder}
            />
            {/* Show search results info */}
            {searchTerm && !displayMessage && (
              <div className="search-results-message" style={{
                padding: '10px 20px',
                fontSize: '14px',
                color: '#666',
                borderBottom: '1px solid #eee',
                backgroundColor: 'transparent'
              }}>
                Found {filteredRecipes.length} result(s){currentCategory ? ` in ${currentCategory}` : ''} for &quot;{searchTerm}&quot;
              </div>
            )}
          </>
        )}

        {/* Show loading, no results, or recipe list */}
        {displayMessage ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            fontSize: '16px',
            color: displayMessage.type === 'loading' ? '#666' : '#e74c3c'
          }}>
            <div style={{ marginBottom: displayMessage.showClearButton ? '20px' : '0' }}>
              {displayMessage.message}
            </div>
            {displayMessage.showClearButton && (
              <div>
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2980b9')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3498db')}
                >
                  Clear Search
                </button>
                {currentCategory && (
                  <div style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: '#7f8c8d'
                  }}>
                    Try a different search term or clear the search to see all {currentCategory} recipes.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <RecipeList
              recipes={paginatedRecipes}
              favorites={favorites}
              cart={cart}
              onFavorite={handleFavorite}
              onCartAdd={handleCartAdd}
              onCartRemove={handleCartRemove}
              onViewRecipe={handleViewRecipe}
            />

            {/* Show pagination only if there are recipes */}
            {filteredRecipes.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {selectedRecipe && (
          <RecipeDetailsModal recipe={selectedRecipe} onClose={handleCloseRecipe} />
        )}

        {/* Render Toaster only when there's a message */}
        {toastMsg && (
          <Toaster
            key={toastKey}
            message={toastMsg.message}
            type={toastMsg.type}
            onClose={hideToast}
          />
        )}

        <MobileBottomBar onViewChange={handleViewChange} />
      </main>
    </div>
  );
}

export default App;