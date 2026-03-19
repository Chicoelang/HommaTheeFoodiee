import { useState, useEffect } from 'react';

/**
 * Menunda update nilai hingga delay berlalu tanpa perubahan baru.
 * Digunakan untuk search input agar tidak trigger query di setiap keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 400);
 * // debouncedSearch baru update 400ms setelah user berhenti mengetik
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timer jika value berubah lagi sebelum delay habis
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}