import React from 'react';

export const Logo = ({ className = "w-11 h-11", alt = "SS Trendy Mart Logo" }) => {
  return (
    <img
      src="/logo.svg"
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback to /logo.jpg if available
        if (!e.target.src.endsWith('/logo.jpg')) {
          e.target.src = '/logo.jpg';
        }
      }}
    />
  );
};

export default Logo;
