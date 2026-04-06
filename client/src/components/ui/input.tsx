import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`px-4 py-2 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded text-white placeholder-[oklch(0.45_0_0)] focus:outline-none focus:border-[oklch(0.45_0.25_25)] ${className}`}
      {...props}
    />
  )
);

Input.displayName = 'Input';
