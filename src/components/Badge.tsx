import React from 'react';

interface BadgeProps {
  type: 'red' | 'yellow';
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ type, text }) => {
  const colors = type === 'red' 
    ? "bg-rose-900/50 text-rose-400 border-rose-500/30" 
    : "bg-yellow-900/50 text-yellow-400 border-yellow-500/30";
  
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border ${colors} ml-2 animate-pulse`}>
      {text}
    </span>
  );
};

export default Badge;

