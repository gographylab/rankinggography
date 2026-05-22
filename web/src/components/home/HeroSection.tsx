'use client';
import { useRouter } from 'next/navigation';
import type { Photo, Photographer } from '@/lib/types';

interface HeroSectionProps {
  banner: Photo;
  top: Photo;
  bannerPhotographer: Photographer | undefined;
  topPhotographer: Photographer | undefined;
}

export function HeroSection({ banner, top, bannerPhotographer, topPhotographer }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section className="relative">
      {/* Full-bleed banner */}
      <div
        className="relative overflow-hidden bg-black"
        style={{ height: '68vh', minHeight: 520, maxHeight: 760 }} // dynamic: viewport-relative height
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.src} alt={banner.title} className="w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.08) 35%, rgba(0,0,0,.1) 65%, rgba(0,0,0,.65) 100%)' }} // dynamic: multi-stop gradient
        />
        {/* Top bar */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-baseline text-white">
          <div className="mono text-[11px] tracking-[.22em] uppercase opacity-85">
            Gography Photo Awards
          </div>
          <div className="mono text-[11px] tracking-[.22em] uppercase opacity-85">
            Spring 2026 · Live
          </div>
        </div>
        {/* Bottom copy */}
        <div className="absolute left-10 right-10 bottom-12 text-white">
          <div className="wrap" style={{ padding: 0, maxWidth: 'none' }}> {/* dynamic: override wrap padding */}
            <h1
              className="th font-light leading-[.92] text-white m-0 max-w-[14ch]"
              style={{ fontSize: 'clamp(64px, 8vw, 128px)', letterSpacing: '-.035em' }} // dynamic: clamp fluid font
            >
              Photographs<br />that tell stories
            </h1>
            <div className="mt-7 flex items-end justify-between gap-10">
              <p className="th text-[16px] leading-[1.55] max-w-[460px] text-white/85 m-0">
                A photography ranking platform by photographers and travellers — vote, discover, and help choose the photo of the season.
              </p>
              <div className="flex gap-[10px] shrink-0">
                <button
                  onClick={() => router.push('/explore')}
                  className="px-[22px] py-3 bg-white text-black text-[11px] tracking-[.14em] uppercase font-medium cursor-pointer border-0"
                >
                  Explore the gallery
                </button>
                <button
                  onClick={() => router.push('/about-ranking')}
                  className="px-[22px] py-3 text-[11px] tracking-[.14em] uppercase font-medium cursor-pointer"
                  style={{ background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.45)' }} // dynamic: translucent tint
                >
                  How Pulse works
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Banner credit */}
        <div className="absolute bottom-3 right-10 text-white/55">
          <div className="mono text-[10px] tracking-[.18em] uppercase">
            Banner: &quot;{banner.title}&quot; by {bannerPhotographer?.name}
          </div>
        </div>
      </div>

      {/* Cover of the week — label */}
      <div className="pt-20 pb-6">
        <div className="wrap flex justify-between items-baseline pb-6">
          <div className="caps opacity-55">Cover of the week</div>
          <div className="mono text-[11px] tracking-[.18em] uppercase opacity-55">
            ★ #1 Pulse {top.pulse.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Cover photo */}
      <div className="pb-6">
        <div className="wrap">
          <div
            className="cursor-pointer bg-[var(--tile)] overflow-hidden"
            onClick={() => router.push(`/photo/${top.id}`)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={top.src}
              alt={top.title}
              className="w-full h-auto block mx-auto object-contain"
              style={{ maxHeight: '78vh' }} // dynamic: viewport-relative constraint
            />
          </div>
        </div>
      </div>

      {/* Cover caption */}
      <div className="pb-20">
        <div className="wrap flex justify-between items-end gap-10">
          <div>
            <h2
              className="th font-normal m-0 leading-[1.05]"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-.02em' }} // dynamic: clamp fluid font
            >
              &quot;{top.title}&quot;
            </h2>
            <div className="mt-4 flex gap-5 items-center caps">
              <span className="opacity-70">by {topPhotographer?.name}</span>
              <span className="opacity-35">·</span>
              <span className="opacity-55">
                {top.exif.camera} · {top.exif.focal}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/photo/${top.id}`)}
            className="caps cursor-pointer border-b border-[var(--fg)] pb-1 shrink-0"
          >
            View photo →
          </button>
        </div>
      </div>
    </section>
  );
}
