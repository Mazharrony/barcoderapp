import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  href?: string;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  href, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 min-h-[44px] px-4 py-2.5';
  
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af]',
    secondary: 'border border-[#CBD5E1] text-[#0F172A] bg-transparent hover:bg-[#F8FAFC] active:bg-[#F1F5F9] dark:border-gray-700 dark:text-[#E5E7EB] dark:hover:bg-[#111827]',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}



