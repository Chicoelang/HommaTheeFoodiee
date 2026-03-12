'use client';

import { useUIStore } from '@/store/uiStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/Modal';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

export function ToastContainer() {
  const { toasts, removeToast, confirmModal, closeConfirmModal, setConfirmModalLoading } =
    useUIStore();

  const handleConfirm = async () => {
    if (!confirmModal.onConfirm) return;
    setConfirmModalLoading(true);
    try {
      await confirmModal.onConfirm();
    } finally {
      setConfirmModalLoading(false);
      closeConfirmModal();
    }
  };

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <div
              key={toast.id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-5 duration-300',
                colorMap[toast.type]
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColorMap[toast.type])} />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onClose={closeConfirmModal}
        isLoading={confirmModal.isLoading}
      />
    </>
  );
}
