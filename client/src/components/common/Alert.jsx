import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Alert banner for validation/server error and success messages
 */
const Alert = ({
  type = 'error', // 'error' | 'success' | 'info' | 'warning'
  message,
  onClose,
  className = '',
}) => {
  if (!message) return null;

  const config = {
    error: {
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-800',
      iconColor: 'text-rose-600',
      Icon: AlertCircle,
    },
    success: {
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      iconColor: 'text-emerald-600',
      Icon: CheckCircle2,
    },
    info: {
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800',
      iconColor: 'text-indigo-600',
      Icon: Info,
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
      Icon: AlertTriangle,
    },
  };

  const { bgColor, borderColor, textColor, iconColor, Icon } =
    config[type] || config.error;

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs font-medium ${bgColor} ${borderColor} ${textColor} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
        <span className="leading-relaxed">{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
