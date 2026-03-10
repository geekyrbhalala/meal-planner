import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white/90 rounded-xl shadow-sm border border-slate-200/60 backdrop-blur-sm ${
        onClick
          ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 active:scale-[0.98]'
          : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}
