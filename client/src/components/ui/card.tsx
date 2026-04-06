import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg ${className}`}
      {...props}
    />
  )
);

Card.displayName = 'Card';
