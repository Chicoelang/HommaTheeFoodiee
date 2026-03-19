// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChefHat, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  CheckCircle, Star, UtensilsCrossed,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/uiStore';
import { motion } from '@/components/providers/MotionProvider';

const schema = z
  .object({
    fullName: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const PERKS = [
  'Simpan restoran favorit kamu',
  'Tulis & bagikan ulasan',
  'Dapatkan rekomendasi personal',
  'Akses ke fitur komunitas',
];

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1a0800] via-[#5c1a00] to-[#ea580c] p-12 relative overflow-hidden">
      {/* Bokeh */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Hooma<span className="text-amber-300">Foodie</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        <div className="flex gap-3 mb-8">
          {['🍜', '☕', '🦐', '🍦'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              className="text-3xl select-none"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
          Bergabung dengan<br />
          <span className="text-amber-300">komunitas foodie</span>
        </h2>
        <p className="text-white/70 text-base leading-relaxed mb-8 max-w-xs">
          Daftar gratis dan mulai menemukan pengalaman kuliner terbaik di Semarang.
        </p>

        {/* Perks */}
        <ul className="space-y-3">
          {PERKS.map((perk, i) => (
            <motion.li
              key={perk}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="text-white/85 text-sm font-medium">{perk}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Bottom stats */}
      <div className="relative z-10 flex gap-6">
        {[
          { icon: UtensilsCrossed, value: '250+', label: 'Restoran' },
          { icon: Star, value: '4.8★', label: 'Rating rata-rata' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-white">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className="w-4 h-4 text-amber-300" />
              <span className="text-xl font-extrabold">{value}</span>
            </div>
            <span className="text-xs text-white/60 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });

    if (error) {
      addToast('error', error.message);
      return;
    }

    addToast('success', 'Akun berhasil dibuat! Silakan masuk.');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Kiri: brand panel */}
      <BrandPanel />

      {/* Kanan: form */}
      <div className="flex items-center justify-center bg-white">
        <div className="flex flex-col justify-center px-8 py-12 lg:px-14 xl:px-20 w-full">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-gray-900">
                Hooma<span className="text-orange-500">Foodie</span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Buat akun gratis ✨
              </h1>
              <p className="text-gray-500 text-sm">
                Bergabung dan mulai eksplorasi kuliner Semarang.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Nama lengkap kamu"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="kamu@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[calc(50%+6px)] text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Konfirmasi Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ulangi password kamu"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-1">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full !py-3 !text-base !font-bold !rounded-xl 
                             !bg-gradient-to-r !from-orange-500 !to-orange-600 
                             hover:!from-orange-600 hover:!to-red-500
                             !shadow-lg !shadow-orange-200"
                  size="lg"
                >
                  {!isSubmitting && (
                    <span className="flex items-center gap-2">
                      Buat Akun <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                Masuk di sini →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}