"use client";

import React, { useState, useEffect } from 'react';
const Toaster = ({ message, type = 'default', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // This effect controls the toaster's appearance and disappearance.
  useEffect(() => {
    // If there's no message, do nothing.
    if (!message) {
      setIsVisible(false);
      return;
    }

    // Show the toaster and set a timer to hide it.
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger the fade-out animation
    }, 3000); // Toaster remains visible for 3 seconds

    // Clean up the timer if the component is unmounted or the message changes.
    return () => clearTimeout(timer);
  }, [message]); // This effect re-runs whenever the message prop changes.

  // This function is called after the CSS fade-out transition ends.
  const handleTransitionEnd = () => {
    // Once faded out, call the parent's onClose function to remove it from the DOM.
    if (!isVisible) {
      onClose();
    }
  };

  // The component won't render anything if there's no message string.
  if (!message) {
    return null;
  }

  return (
    <div
      // The `visible` class triggers the CSS for showing the toaster.
      className={`toaster-container ${isVisible ? 'visible' : ''}`}
      onTransitionEnd={handleTransitionEnd}
      role="alert"
      aria-live="assertive"
    >
      {/* The `type` class applies different background colors. */}
      <div className={`toast-content ${type}`}>
        {message}
      </div>
    </div>
  );
};

export default Toaster;