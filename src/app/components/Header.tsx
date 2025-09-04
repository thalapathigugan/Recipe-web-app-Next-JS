type HeaderProps = {
    cart: Record<string, { qty?: number }>;
    onViewChange: (view: string) => void;
};

import Image from 'next/image';
import { useEffect, useState } from 'react';

function Header({ cart, onViewChange }: HeaderProps) {
    // Calculate cart count (sum of qty for each cart item)
    const cartCount = Object.values(cart).reduce((sum, item) => sum + (item.qty || 0), 0);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <header style={{ pointerEvents: 'auto' }}>
        <nav className="header-nav" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
            <div className="header-logo-container" style={{ pointerEvents: 'auto' }}>
                <a 
                    className="header-logo-link" 
                    onClick={() => onViewChange('home')} 
                    style={{ 
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        display: 'block',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        console.log('Mouse entered logo link');
                        e.currentTarget.style.cursor = 'pointer';
                    }}
                >
                    {/* Replace with your logo image path */}
                    <Image 
                        src="/logo.png" 
                        alt="Recipe App Logo" 
                        width={68} 
                        height={68} 
                        className="header-logo"
                        style={{ pointerEvents: 'none' }} // Let parent handle clicks
                    />
                    <h1 style={{ pointerEvents: 'none' }}>TYSON RECIPES</h1>
                </a>
            </div>
            <div className="nav-view-buttons" style={{ pointerEvents: 'auto' }}>
                <button 
                    type="button" 
                    className="view-favorites-btn" 
                    onClick={() => onViewChange('favorites')}
                    style={{ 
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        console.log('Mouse entered favorites button');
                        e.currentTarget.style.cursor = 'pointer';
                    }}
                >
                    View Favorites
                </button>
                <button 
                    type="button" 
                    className="view-cart-btn" 
                    onClick={() => onViewChange('cart')}
                    style={{ 
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        console.log('Mouse entered cart button');
                        e.currentTarget.style.cursor = 'pointer';
                    }}
                >
                    View Cart
                    <span 
                        className="cart-count-badge" 
                        suppressHydrationWarning
                        style={{ pointerEvents: 'none' }} // Let parent handle clicks
                    >
                        {mounted && cartCount >= 0 ? cartCount : ''}
                    </span>
                </button>
            </div>
        </nav>
        </header>
    );
}

export default Header;