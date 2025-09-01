"use client";


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

      <div className="categories-container">
        <select
          className="categories-select"
          value={currentCategory || ''}
          onChange={(e) => setCurrentCategory(e.target.value || '__all__')}
        >
          <option value="__all__">All Categories</option>
          {Array.isArray(categories) && categories.map((c) => (
            <option key={c.idCategory || c.strCategory} value={c.strCategory}>
              {c.strCategory}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;