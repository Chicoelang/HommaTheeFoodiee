// src/components/ui/Pagination.tsx
'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;  // opsional: tampilkan spinner saat fetching
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Bangun daftar halaman dengan ellipsis
  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visible = all.filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
    );

    let prev: number | null = null;
    for (const page of visible) {
      if (prev !== null && page - prev > 1) pages.push('...');
      pages.push(page);
      prev = page;
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-1.5" role="navigation" aria-label="Navigasi halaman">

      {/* Prev button */}
      <motion.button
        whileHover={currentPage > 1 ? { scale: 1.08 } : {}}
        whileTap={currentPage > 1 ? { scale: 0.92 } : {}}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
          'border font-medium text-sm',
          currentPage === 1 || isLoading
            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
            : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 bg-white'
        )}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-medium"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <motion.button
              key={page}
              onClick={() => !isLoading && onPageChange(page)}
              disabled={isLoading}
              whileHover={!isActive && !isLoading ? { scale: 1.08 } : {}}
              whileTap={!isActive && !isLoading ? { scale: 0.92 } : {}}
              className={cn(
                'relative w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200',
                'flex items-center justify-center',
                isActive
                  ? 'text-white shadow-md shadow-orange-200 cursor-default'
                  : isLoading
                  ? 'border border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 bg-white'
              )}
              aria-label={`Halaman ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Animated active background */}
              {isActive && (
                <motion.div
                  layoutId="pagination-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{page}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Next button */}
      <motion.button
        whileHover={currentPage < totalPages ? { scale: 1.08 } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.92 } : {}}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
          'border font-medium text-sm',
          currentPage === totalPages || isLoading
            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
            : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 bg-white'
        )}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Loading spinner — muncul di kanan saat fetching */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -8 }}
            animate={{ opacity: 1, scale: 1,   x: 0  }}
            exit={{   opacity: 0, scale: 0.8,  x: -8 }}
            transition={{ duration: 0.2 }}
            className="ml-1 flex items-center gap-1.5 text-xs font-medium text-orange-500"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Memuat...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}