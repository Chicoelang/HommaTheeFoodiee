// src/components/ui/EmptyState.tsx
// Reusable illustrated empty state component dengan SVG kuliner inline.

import Link from 'next/link';
import { motion } from '@/components/providers/MotionProvider';
import { cn } from '@/lib/utils';

// ─── SVG Illustrations ──────────────────────────────────────────────────────

function NoFavoritesIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-44"
      aria-hidden="true"
    >
      {/* Piring */}
      <ellipse cx="100" cy="130" rx="62" ry="10" fill="#FEE2E2" opacity="0.6" />
      <ellipse cx="100" cy="105" rx="55" ry="55" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />
      <ellipse cx="100" cy="105" rx="42" ry="42" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1.5" />
      {/* Garpu */}
      <rect x="56" y="55" width="3" height="40" rx="1.5" fill="#FB923C" />
      <rect x="53" y="55" width="1.5" height="16" rx="0.75" fill="#FB923C" />
      <rect x="59" y="55" width="1.5" height="16" rx="0.75" fill="#FB923C" />
      <rect x="62" y="55" width="1.5" height="16" rx="0.75" fill="#FB923C" />
      {/* Sendok */}
      <rect x="141" y="70" width="3" height="28" rx="1.5" fill="#FB923C" />
      <ellipse cx="142.5" cy="62" rx="6" ry="9" fill="#FDBA74" stroke="#FB923C" strokeWidth="1.5" />
      {/* Heart melayang */}
      <motion.g
        animate={{ y: [0, -8, 0], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M100 88 C100 88, 88 78, 88 70 C88 65, 93 61, 100 68 C107 61, 112 65, 112 70 C112 78, 100 88, 100 88Z"
          fill="#FCA5A5"
          stroke="#F87171"
          strokeWidth="1"
        />
      </motion.g>
      {/* Tanda tanya */}
      <text x="92" y="112" fontSize="22" fontWeight="bold" fill="#FDBA74" fontFamily="system-ui">?</text>
      {/* Bintang kecil */}
      <motion.g
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      >
        <circle cx="60" cy="75" r="3" fill="#FCD34D" />
      </motion.g>
      <motion.g
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.1, repeat: Infinity, delay: 0.8 }}
      >
        <circle cx="140" cy="68" r="2.5" fill="#FCD34D" />
      </motion.g>
      <motion.g
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.1 }}
      >
        <circle cx="130" cy="85" r="2" fill="#FCA5A5" />
      </motion.g>
    </svg>
  );
}

function NoResultsIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-44"
      aria-hidden="true"
    >
      {/* Kaca pembesar */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '110px', originY: '95px' }}
      >
        <circle cx="90" cy="82" r="38" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="3" />
        <circle cx="90" cy="82" r="28" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1.5" />
        {/* Sendok garpu dalam kaca */}
        <line x1="80" y1="70" x2="80" y2="96" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="77" y1="70" x2="77" y2="80" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="83" y1="70" x2="83" y2="80" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="97" y="68" width="2.5" height="28" rx="1.25" fill="#FB923C" />
        <ellipse cx="98.25" cy="62" rx="5" ry="8" fill="#FDBA74" stroke="#FB923C" strokeWidth="1.5" />
        {/* Tanda X */}
        <line x1="82" y1="78" x2="100" y2="90" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="78" x2="82" y2="90" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
        {/* Handle */}
        <rect
          x="118"
          y="108"
          width="32"
          height="8"
          rx="4"
          transform="rotate(45 118 108)"
          fill="#FB923C"
          stroke="#EA580C"
          strokeWidth="1"
        />
      </motion.g>
      {/* Titik-titik dekoratif */}
      <circle cx="40" cy="60" r="3" fill="#FCD34D" opacity="0.7" />
      <circle cx="155" cy="75" r="2.5" fill="#FCA5A5" opacity="0.7" />
      <circle cx="48" cy="120" r="2" fill="#FDBA74" opacity="0.6" />
      <circle cx="160" cy="130" r="3.5" fill="#FCD34D" opacity="0.5" />
    </svg>
  );
}

function NoReviewsIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-44"
      aria-hidden="true"
    >
      {/* Chat bubble besar */}
      <rect x="30" y="30" width="130" height="90" rx="20" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />
      <path d="M55 120 L45 145 L80 120Z" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" strokeLinejoin="round" />
      {/* Bintang-bintang rating */}
      {[60, 82, 104, 126, 148].map((x, i) => (
        <motion.path
          key={i}
          d={`M${x} 65 L${x + 5} 78 L${x + 14} 78 L${x + 7} 86 L${x + 10} 100 L${x} 93 L${x - 10} 100 L${x - 7} 86 L${x - 14} 78 L${x - 5} 78Z`}
          transform={`scale(0.5) translate(${x * 0.9}, 35)`}
          fill={i < 3 ? '#FCD34D' : '#FEE2E2'}
          stroke={i < 3 ? '#F59E0B' : '#FECACA'}
          strokeWidth="1"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      {/* Teks placeholder lines */}
      <rect x="50" y="88" width="90" height="6" rx="3" fill="#FED7AA" opacity="0.6" />
      <rect x="60" y="100" width="70" height="5" rx="2.5" fill="#FED7AA" opacity="0.4" />
      {/* Pensil */}
      <motion.g
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '158px', originY: '148px' }}
      >
        <rect x="148" y="130" width="10" height="30" rx="2" transform="rotate(-30 148 130)" fill="#FB923C" />
        <path d="M154 155 L150 165 L158 161Z" fill="#FCD34D" />
        <rect x="148" y="130" width="10" height="6" rx="2" transform="rotate(-30 148 130)" fill="#EA580C" />
      </motion.g>
    </svg>
  );
}

function NoProfileIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-36"
      aria-hidden="true"
    >
      {/* Avatar circle */}
      <circle cx="100" cy="70" r="45" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />
      {/* Person silhouette */}
      <circle cx="100" cy="58" r="18" fill="#FDBA74" />
      <path d="M65 105 C65 85, 135 85, 135 105" fill="#FDBA74" />
      {/* Lock icon overlay */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="82" y="100" width="36" height="28" rx="6" fill="#FB923C" />
        <path d="M88 100 C88 89, 112 89, 112 100" stroke="#FB923C" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="114" r="5" fill="white" />
        <rect x="98" y="114" width="4" height="7" rx="2" fill="white" />
      </motion.g>
    </svg>
  );
}

// ─── Tipe & komponen utama ────────────────────────────────────────────────

type EmptyStateVariant =
  | 'no-favorites'
  | 'no-results'
  | 'no-reviews'
  | 'no-profile'
  | 'not-logged-in';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const DEFAULTS: Record<
  EmptyStateVariant,
  { title: string; description: string; illustration: React.ReactNode }
> = {
  'no-favorites': {
    title: 'Belum Ada Favorit',
    description: 'Kamu belum menyimpan restoran apapun. Mulai jelajahi dan klik ❤ untuk menyimpan restoran favoritmu.',
    illustration: <NoFavoritesIllustration />,
  },
  'no-results': {
    title: 'Restoran Tidak Ditemukan',
    description: 'Tidak ada restoran yang cocok dengan pencarian atau filter kamu. Coba ubah kata kunci atau hapus filter.',
    illustration: <NoResultsIllustration />,
  },
  'no-reviews': {
    title: 'Belum Ada Ulasan',
    description: 'Jadilah yang pertama berbagi pengalaman makan di sini!',
    illustration: <NoReviewsIllustration />,
  },
  'no-profile': {
    title: 'Masuk untuk Melanjutkan',
    description: 'Kamu perlu masuk untuk melihat halaman ini.',
    illustration: <NoProfileIllustration />,
  },
  'not-logged-in': {
    title: 'Masuk untuk Melihat Favorit',
    description: 'Simpan restoran-restoran terbaik pilihanmu dengan masuk terlebih dahulu.',
    illustration: <NoFavoritesIllustration />,
  },
};

export function EmptyState({
  variant,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const defaults = DEFAULTS[variant];
  const finalTitle = title ?? defaults.title;
  const finalDescription = description ?? defaults.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col items-center justify-center py-20 px-4 text-center', className)}
    >
      {/* Illustration */}
      <div className="mb-6 select-none">{defaults.illustration}</div>

      {/* Text */}
      <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {finalTitle}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-7">
        {finalDescription}
      </p>

      {/* Action button */}
      {actionLabel && (
        <>
          {actionHref ? (
            <Link href={actionHref}>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 
                           text-white font-bold text-sm px-6 py-3 rounded-xl 
                           shadow-lg shadow-orange-200 cursor-pointer transition-all"
              >
                {actionLabel}
              </motion.div>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 
                         text-white font-bold text-sm px-6 py-3 rounded-xl 
                         shadow-lg shadow-orange-200 cursor-pointer transition-all"
            >
              {actionLabel}
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  );
}