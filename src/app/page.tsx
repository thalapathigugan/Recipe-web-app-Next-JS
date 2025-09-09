"use client";

// STEP 1: Imports from next/navigation are included
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addToCart, removeFromCart } from './utils/cartManager';
import Pagination from './components/Pagination';
import RecipeDetailsModal from './components/RecipeDetailsModal';
import RecipeList from './components/RecipeList';
import SearchBar from './components/SearchBar';
import Toaster from './components/Toaster';
import { Category, Recipe } from './types';
import ContextualSearchManager from './utils/ContextualSearchManager';
import HomePageRecipeManager from './utils/HomePageRecipeManager';
import { getLocal, setLocal } from './utils/localStorage';

const RECIPES_PER_PAGE = 20;
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const MIN_HOME_RECIPES = 120;

function App() {
  // Initialize hooks
  const router = useRouter();

  // State initialization
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // These states still use localStorage as they are not in the URL
  const [cart, setCart] = useState<Record<string, { recipe: Recipe; qty: number }>>(
    () => getLocal('cart', {})
  );
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const storedFavorites = getLocal('favorites', null);
    return Array.isArray(storedFavorites) ? storedFavorites : [];
  });
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [homeRecipes, setHomeRecipes] = useState<Recipe[]>([]);
  const [isLoadingHome, setIsLoadingHome] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: string; key: number } | null>(null);




  const showToast = (message: string, type: string = 'default') => {
    setToast({ message, type, key: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories.php`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    const fetchHomeRecipes = async () => {
      const cachedHomeRecipes = getLocal('homeRecipes', null);
      const cacheTimestamp = getLocal('homeRecipesTimestamp', 0);
      const oneHour = 60 * 60 * 1000;

      if (cachedHomeRecipes &&
        cachedHomeRecipes.length >= MIN_HOME_RECIPES &&
        (Date.now() - cacheTimestamp < oneHour)) {
        setHomeRecipes(cachedHomeRecipes);
        return;
      }

      setIsLoadingHome(true);
      try {
        const fixedRecipes = await HomePageRecipeManager.fetchFixedHomeRecipes();
        setHomeRecipes(fixedRecipes);
        setLocal('homeRecipes', fixedRecipes);
        setLocal('homeRecipesTimestamp', Date.now());
      } catch (error) {
        console.error('Error fetching home recipes:', error);
      } finally {
        setIsLoadingHome(false);
      }
    };
    fetchHomeRecipes();
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      setIsSearching(true);
      let result: Recipe[] = [];

      try {
        if (currentView === 'favorites') {
          result = favorites;
        } else if (currentView === 'cart') {
          const ids = Object.keys(cart);
          const recipes = await Promise.all(ids.map(async id => {
            const r = cart[id].recipe;
            if (r.strInstructions) return r;
            const res = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
            const data = await res.json();
            return data.meals ? data.meals[0] : null;
          }));
          result = recipes.filter(r => r !== null) as Recipe[];
        } else if (currentView === 'home' && !currentCategory && !searchTerm) {
          result = homeRecipes;
        } else if (currentCategory && !searchTerm) {
          result = await HomePageRecipeManager.fetchCategoryRecipesWithDetails(currentCategory);
        } else if (searchTerm) {
          if (currentCategory) {
            const recipesWithDetails = await HomePageRecipeManager.fetchCategoryRecipesWithDetails(currentCategory);
            const searchLower = searchTerm.toLowerCase();
            result = recipesWithDetails.filter((recipe: Recipe) =>
              recipe.strMeal.toLowerCase().includes(searchLower) ||
              (recipe.strInstructions && recipe.strInstructions.toLowerCase().includes(searchLower)) ||
              (recipe.strArea && recipe.strArea.toLowerCase().includes(searchLower)) ||
              (recipe.strTags && recipe.strTags.toLowerCase().includes(searchLower))
            );
          } else {
            const res = await fetch(`${API_BASE_URL}/search.php?s=${searchTerm}`);
            const data = await res.json();
            result = data.meals || [];
          }
        } else {
          result = homeRecipes;
        }
      } catch (error) {
        console.error('Error in fetchRecipes:', error);
      } finally {
        setIsSearching(false);
      }
      setFilteredRecipes(result);
    }
    fetchRecipes();
  }, [currentView, currentCategory, searchTerm, favorites, cart, homeRecipes]);

  useEffect(() => { setLocal('favorites', favorites); }, [favorites]);
  useEffect(() => { setLocal('cart', cart); }, [cart]);

  const paginatedRecipes: Recipe[] = filteredRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );
  const totalPages: number = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);

  const handleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.some(r => r.idMeal === recipe.idMeal);
      showToast(exists ? 'Removed from Favorites' : 'Added to Favorites', exists ? 'error' : 'success');
      if (exists) return prev.filter(r => r.idMeal !== recipe.idMeal);
      return [...prev, recipe];
    });
  };

  const handleCartAdd = (recipe: Recipe) => {
    const newCart = addToCart(recipe);
    setCart(newCart);
    showToast('Added to Cart', 'success');
  };

  const handleCartRemove = (recipe: Recipe) => {
    const newCart = removeFromCart(recipe);
    setCart(newCart);
    showToast('Removed from Cart', 'error');
  };

  const handleViewRecipe = async (recipe: Recipe) => {
    if (recipe.strInstructions) {
      setSelectedRecipe(recipe);
    } else {
      const res = await fetch(`${API_BASE_URL}/lookup.php?i=${recipe.idMeal}`);
      const data = await res.json();
      if (data.meals && data.meals[0]) {
        setSelectedRecipe(data.meals[0]);
      }
    }
  };

  const handleCloseRecipe = () => setSelectedRecipe(null);

  // STEP 5: setLocal calls are removed from handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };



  const handleCategoryChange = (cat: string) => {
    const newCategory = cat === '__all__' ? null : cat;
    setCurrentCategory(newCategory);
    if (newCategory) {
      setCurrentView('category');
    } else {
      setCurrentView('home');
    }
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const searchPlaceholder = ContextualSearchManager.getSearchPlaceholder(currentView);

  const getDisplayMessage = () => {
    if (isLoadingHome && currentView === 'home') {
      return { type: 'loading', message: 'Loading recipes...' };
    }
    if (isSearching && searchTerm) {
      return { type: 'loading', message: 'Searching...' };
    }
    if (filteredRecipes.length === 0 && searchTerm) {
      const context = currentCategory ? ` in ${currentCategory}` : '';
      return { type: 'no-results', message: `No recipes found${context} for "${searchTerm}"`, showClearButton: true };
    }
    if (filteredRecipes.length === 0 && !searchTerm && currentCategory) {
      return { type: 'no-results', message: `No recipes found in ${currentCategory} category` };
    }
    return null;
  };
  const displayMessage = getDisplayMessage();
  
  return (
    <div className="app-container">
      <main>
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
            {searchTerm && !displayMessage && (
              <div className="search-results-message" style={{ padding: '10px 20px', fontSize: '14px', color: '#666', borderBottom: '1px solid #eee', backgroundColor: 'transparent' }}>
                Found {filteredRecipes.length} result(s){currentCategory ? ` in ${currentCategory}` : ''} for &quot;{searchTerm}&quot;
              </div>
            )}
          </>
        )}

        {displayMessage ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '16px', color: displayMessage.type === 'loading' ? '#666' : '#e74c3c' }}>
            <div style={{ marginBottom: displayMessage.showClearButton ? '20px' : '0' }}>
              {displayMessage.message}
            </div>
            {displayMessage.showClearButton && (
              <div>
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2980b9')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3498db')}
                >
                  Clear Search
                </button>
                {currentCategory && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#7f8c8d' }}>
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
        
        {toast && (
          <Toaster
            key={toast.key}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </main>
    </div>
  );
}

export default App;