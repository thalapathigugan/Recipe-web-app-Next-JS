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
        <header>
        <nav className="header-nav">
            <div className="header-logo-container">
                        <div
                            className="header-logo-link"
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => onViewChange('home')}
                        >
                                {/* Replace with your logo image path */}
                                <Image src="/logo.png" alt="Recipe App Logo" width={68} height={68} className="header-logo" />
                                <h1>TYSON RECIPES</h1>
                        </div>
            </div>
            <div className="nav-view-buttons">
                <button type="button" className="view-favorites-btn" onClick={() => onViewChange('favorites')}>View Favorites</button>
                <button type="button" className="view-cart-btn" onClick={() => onViewChange('cart')}>
                    View Cart
                    <span className="cart-count-badge" suppressHydrationWarning>
                        {mounted && cartCount > 0 ? cartCount : ''}
                    </span>
                </button>
            </div>
        </nav>
        </header>
    );
}

export default Header;
