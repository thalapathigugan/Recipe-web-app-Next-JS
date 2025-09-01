"use client";

import React from "react";

type MobileBottomBarProps = { onViewChange?: (view: string) => void };

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onViewChange = () => {} }) => {
  return (
    <div className="mobile-bottom-bar">
      <button type="button" onClick={() => onViewChange('favorites')}>
        Favorites
      </button>
      <button type="button" onClick={() => onViewChange('cart')}>
        Cart
      </button>
    </div>
  );
};

export default MobileBottomBar;