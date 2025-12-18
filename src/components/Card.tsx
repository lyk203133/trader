import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-lg ${className}`}>
    {children}
  </div>
);

export default Card;

