// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Category } from '../types';

// interface CategoryDropdownProps {
//   currentCategory: string | null;
//   setCurrentCategory: (category: string) => void;
//   categories: Category[];
// }

// const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ currentCategory, setCurrentCategory, categories }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Effect to close the dropdown if you click outside of it
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (categoryValue: string) => {
//     setCurrentCategory(categoryValue);
//     setIsOpen(false);
//   };

//   const selectedCategoryName = categories.find(c => c.strCategory === currentCategory)?.strCategory || 'All Categories';

//   return (
//     <div ref={dropdownRef} style={{ position: 'relative', width: '200px' }}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           width: '100%',
//           padding: '10px 15px',
//           backgroundColor: '#f0f0f0',
//           border: '1px solid #ddd',
//           borderRadius: '8px',
//           textAlign: 'left',
//           cursor: 'pointer',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '16px',
//         }}
//       >
//         <span>{selectedCategoryName}</span>
//         {/* Chevron icon that rotates */}
//         <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
//       </button>

//       {/* The list of options, positioned directly below the button */}
//       {isOpen && (
//         <div style={{
//           position: 'absolute',
//           top: '105%',
//           left: 0,
//           right: 0,
//           backgroundColor: 'white',
//           border: '1px solid #ddd',
//           borderRadius: '8px',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//           zIndex: 10,
//           maxHeight: '300px',
//           overflowY: 'auto'
//         }}>
//           <div
//             onClick={() => handleSelect('__all__')}
//             style={{ padding: '12px 15px', cursor: 'pointer' }}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
//           >
//             All Categories
//           </div>
//           {categories.map(category => (
//             <div
//               key={category.idCategory}
//               onClick={() => handleSelect(category.strCategory)}
//               style={{ padding: '12px 15px', cursor: 'pointer' }}
//               onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
//               onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
//             >
//               {category.strCategory}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryDropdown;
