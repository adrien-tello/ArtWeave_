import React from 'react';

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wood grain background circle */}
      <circle cx="50" cy="50" r="45" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
      
      {/* Tree/Wood symbol */}
      <path 
        d="M35 25 Q50 15 65 25 Q60 35 50 40 Q40 35 35 25Z" 
        fill="#D2B48C"
      />
      <path 
        d="M40 35 Q50 25 60 35 Q55 45 50 50 Q45 45 40 35Z" 
        fill="#F5DEB3"
      />
      <rect x="47" y="50" width="6" height="25" fill="#654321"/>
      
      {/* Decorative elements */}
      <circle cx="30" cy="30" r="2" fill="#D2B48C"/>
      <circle cx="70" cy="30" r="2" fill="#D2B48C"/>
      <circle cx="30" cy="70" r="2" fill="#D2B48C"/>
      <circle cx="70" cy="70" r="2" fill="#D2B48C"/>
      
      {/* Text curve */}
      <path 
        d="M 20 80 Q 50 90 80 80" 
        stroke="#F5DEB3" 
        strokeWidth="1" 
        fill="none"
      />
    </svg>
  );
}