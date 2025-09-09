"use client";

import { useEffect, useState } from 'react';
import { getLocal } from '../utils/localStorage';
import Header from './Header';
import MobileBottomBar from './MobileBottomBar';
import { Recipe } from '../types';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Record<string, { recipe: Recipe; qty: number }>>({});

  // Update cart when localStorage changes
  useEffect(() => {
    const updateCart = () => {
      const savedCart = getLocal('cart', {}) as Record<string, { recipe: Recipe; qty: number }>;
      console.log('Cart updated:', savedCart);  // Debug log
      setCart(savedCart);
    };

    // Initial load
    updateCart();

    // Listen for storage events
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'cart') {
        updateCart();
      }
    };
    
    // Custom event for cart updates
    const handleCartUpdate = () => {
      updateCart();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Check for updates every second as a fallback
    const interval = setInterval(updateCart, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Header cart={cart} />
      <main className="min-h-screen pt-16 pb-16">
        {children}
      </main>
      <MobileBottomBar />
    </>
  );
}
