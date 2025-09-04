"use client";
import { useState, useEffect, useRef } from 'react';



/**
 * @param {{
 *  searchTerm?: string,
 *  setSearchTerm?: (v: string) => void,
 *  currentCategory?: string,
 *  setCurrentCategory?: (v) => void,
 *  categories?: any[],
 *  placeholder?: string,
 * }} props
 */
const SearchBar = ({
  searchTerm = '',
  setSearchTerm = (v) => {},
  currentCategory = '',
  setCurrentCategory = (v) => {},
  categories = [],
  placeholder = 'Search recipes...'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef(null);

  // This closes the dropdown when you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (categoryValue) => {
    setCurrentCategory(categoryValue);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const selectedCategoryName =
    categories.find(c => c.strCategory === currentCategory)?.strCategory || 'All Categories';
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm);
  };

  return (
    <div className="search-and-category-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            id="search-input"
            type="search"
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <button type="submit">
          <span className="material-symbols-outlined">search</span>
        </button>
      </form>

      {/* Custom Category Dropdown */}
      <div className="categories-container" ref={dropdownContainerRef} style={{ position: 'relative' }}>
        <button
          type="button" // Important: prevents form submission
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            cursor: 'pointer',
            padding: '14px 15px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '8px',
            width: '200px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{selectedCategoryName}</span>
          <span style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </button>
        {/* Dropdown options list */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '105%', // Positioned just below the button
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10,
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div
              onClick={() => handleSelectCategory('__all__')}
              style={{ padding: '12px 15px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              All Categories
            </div>
            {Array.isArray(categories) && categories.map(category => (
              <div
                key={category.idCategory || category.strCategory}
                onClick={() => handleSelectCategory(category.strCategory)}
                style={{ padding: '12px 15px', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {category.strCategory}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;