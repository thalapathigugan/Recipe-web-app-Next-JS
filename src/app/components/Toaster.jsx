"use client";

import React, { useState, useEffect } from 'react';

const Toaster = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleTransitionEnd = () => {
    if (!isVisible) onClose();
  };

  if (!message) return null;

  return (
    <div
      className={`toaster ${isVisible ? 'visible' : ''}`}
      onTransitionEnd={handleTransitionEnd}
      role="status"
      aria-live="assertive"
    >
      <div className="toast">{message}</div>
    </div>
  );
};

export default Toaster;