import React, { useState } from 'react';
import { useScrollLock } from './useScrollLock';

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock(isOpen);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsOpen(false)}
        >
          <div style={{ background: 'white', padding: 20, borderRadius: 8 }}>Modal Content</div>
        </div>
      )}
    </>
  );
}