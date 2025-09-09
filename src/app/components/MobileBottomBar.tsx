"use client";

import React from "react";
import { useRouter } from 'next/navigation';

const MobileBottomBar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    if (route === 'home') {
      router.push('/');
    } else {
      router.push(`/${route}`);
    }
  };

  return (
    <div className="mobile-bottom-bar">
      <button type="button" onClick={() => handleNavigation('favorites')}>
        Favorites
      </button>
      <button type="button" onClick={() => handleNavigation('cart')}>
        Cart
      </button>
    </div>
  );
};

export default MobileBottomBar;