// src/app/login/page.tsx
'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChefHat, Mail, Lock, Eye, EyeOff, ArrowRight, Star, UtensilsCrossed } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { motion } from '@/components/providers/MotionProvider';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type FormValues = z.infer<typeof schema>;

// Testimonials singkat untuk panel kanan
const TESTIMONIALS = [
  { text: 'Temukan hidden gem kuliner Semarang yang tidak akan kamu sesali.', author: 'Anissa R.' },
  { text: 'Ulasan jujur dari komunitas foodie yang passionate.', author: 'Dimas K.' },
  { text: 'Dari warung lokal hingga fine dining, semua ada di sini.', author: 'Sari W.' },
];

// Panel kiri — ilustrasi & brand
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

      {/* Headline */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        {/* Floating food icons */}
        <div className="flex gap-4 mb-8">
          {['🍜', '🥘', '🍱', '☕', '🦐'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              className="text-3xl select-none"
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
          Kuliner Semarang<br />
          <span className="text-amber-300">Terbaik</span> ada di sini
        </h2>
        <p className="text-white/70 text-base leading-relaxed max-w-xs">
          Bergabung dengan ribuan foodie yang sudah menemukan tempat makan favorit mereka di Semarang.
        </p>

        {/* Stats mini */}
        <div className="flex gap-6 mt-8">
          {[
            { icon: UtensilsCrossed, value: '250+', label: 'Restoran' },
            { icon: Star, value: '12K+', label: 'Ulasan' },
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

      {/* Testimonial */}
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-white/90 text-sm leading-relaxed italic mb-3">
            "{TESTIMONIALS[0].text}"
          </p>
          <p className="text-white/60 text-xs font-semibold">— {TESTIMONIALS[0].author}</p>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectedFrom') ?? null;
  const { addToast } = useUIStore();
  const { fetchProfile } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      addToast('error', error.message);
      return;
    }

    if (!data.user) {
      router.push(redirectTo ?? '/');
      return;
    }

    addToast('success', 'Selamat datang kembali!');
    await fetchProfile(data.user.id);

    const currentProfile = useAuthStore.getState().profile;
    if (currentProfile?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push(redirectTo ?? '/');
    }
    router.refresh();
  };

  return (
    <div className="flex flex-col justify-center px-8 py-12 lg:px-14 xl:px-20">
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
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Selamat datang kembali 👋
          </h1>
          <p className="text-gray-500 text-sm">
            Masuk untuk melanjutkan perjalanan kulinermu.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="••••••••"
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

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
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
                  Masuk <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">atau</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Register CTA */}
        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
          >
            Daftar gratis →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Kiri: brand panel */}
      <BrandPanel />
      {/* Kanan: form */}
      <div className="flex items-center justify-center bg-white">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}