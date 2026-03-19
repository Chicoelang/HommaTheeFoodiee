// src/components/providers/ToastContainer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUIStore, Toast } from '@/store/uiStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from '@/components/providers/MotionProvider';
import { ConfirmModal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

// ─── Config per tipe toast ───────────────────────────────────────────────────

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-white',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    progressColor: 'bg-emerald-400',
    titleColor: 'text-gray-900',
  },
  error: {
    icon: XCircle,
    bg: 'bg-white',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    progressColor: 'bg-red-400',
    titleColor: 'text-gray-900',
  },
  info: {
    icon: Info,
    bg: 'bg-white',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    progressColor: 'bg-blue-400',
    titleColor: 'text-gray-900',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-white',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    progressColor: 'bg-amber-400',
    titleColor: 'text-gray-900',
  },
} as const;

// ─── Progress bar dengan requestAnimationFrame ────────────────────────────────

function ToastProgressBar({
  duration,
  createdAt,
  progressColor,
}: {
  duration: number;
  createdAt: number;
  progressColor: string;
}) {
  const [progress, setProgress] = useState(100);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - createdAt;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, createdAt]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100 rounded-b-2xl overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-none', progressColor)}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUIStore();
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -48, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.94,
        transition: { duration: 0.2, ease: 'easeIn' },
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 32,
        mass: 0.8,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative w-full max-w-sm rounded-2xl border shadow-lg shadow-black/8',
        'overflow-hidden cursor-default select-none',
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', config.iconBg)}>
          <Icon className={cn('w-4 h-4', config.iconColor)} />
        </div>

        {/* Message */}
        <p className={cn('text-sm font-semibold flex-1 leading-relaxed pt-1', config.titleColor)}>
          {toast.message}
        </p>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => removeToast(toast.id)}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 
                     hover:text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Progress bar — berhenti saat di-hover */}
      {!hovered && (
        <ToastProgressBar
          duration={toast.duration}
          createdAt={toast.createdAt}
          progressColor={config.progressColor}
        />
      )}
    </motion.div>
  );
}

// ─── Container utama ──────────────────────────────────────────────────────────

export function ToastContainer() {
  const { toasts, confirmModal, closeConfirmModal, setConfirmModalLoading } = useUIStore();

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
      {/* Toast stack — slide dari atas tengah */}
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] 
                   flex flex-col items-center gap-2.5 w-full px-4 pointer-events-none"
        style={{ maxWidth: '420px' }}
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <div key={toast.id} className="w-full pointer-events-auto">
              <ToastItem toast={toast} />
            </div>
          ))}
        </AnimatePresence>
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