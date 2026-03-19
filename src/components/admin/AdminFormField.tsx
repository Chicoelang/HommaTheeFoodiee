// src/components/admin/AdminFormField.tsx
// Shared primitive untuk render label + error di form admin.
// Mengurangi boilerplate di semua form admin.

import { cn } from '@/lib/utils';

interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  required,
  error,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function AdminSelect({ error, className, children, ...props }: AdminSelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white transition-colors',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}