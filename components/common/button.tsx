import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'border-transparent bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950',
    secondary:
      'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100',
    danger:
      'border-transparent bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
    ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...rest}
    >
      {iconLeft && <span className="mr-1.5 flex items-center">{iconLeft}</span>}
      {children}
      {iconRight && (
        <span className="ml-1.5 flex items-center">{iconRight}</span>
      )}
    </button>
  );
}