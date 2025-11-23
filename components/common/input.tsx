import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

export default function Input({ error, label, className, ...rest }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}