import React from 'react';

/**
 * Reusable Input component with label, error display, dark mode, and icon integration
 */
const Input = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 bg-white dark:bg-slate-800/80 border ${
            error
              ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-200 dark:border-slate-700/80 focus:ring-indigo-500 focus:border-transparent'
          } rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xs ${className}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>}
    </div>
  );
};

export default Input;
