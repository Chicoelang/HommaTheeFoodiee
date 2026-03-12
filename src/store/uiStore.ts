import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  toasts: Toast[];
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    isLoading: boolean;
  };
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  openConfirmModal: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmModal: () => void;
  setConfirmModalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isLoading: false,
  },
  addToast: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  openConfirmModal: (title, message, onConfirm) =>
    set({
      confirmModal: {
        isOpen: true,
        title,
        message,
        onConfirm,
        isLoading: false,
      },
    }),
  closeConfirmModal: () =>
    set({
      confirmModal: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        isLoading: false,
      },
    }),
  setConfirmModalLoading: (isLoading) =>
    set((state) => ({
      confirmModal: { ...state.confirmModal, isLoading },
    })),
}));
