// Ambassadors — list of trusted curators (invite-only)

import { getAmbassadors, getPhotos } from '@/lib/data';
import { Footer } from '@/components/layout/Footer';
import type { Photographer } from '@/lib/types';
import { ProfileButton, PhotoThumb } from './_components';

// ─── page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const ambassadors: Photographer[] = getAmbassadors();
  const allPhotos = getPhotos();

  return (
    <div className="page-fade">
      <section className="pt-[80px] pb-[64px]">
        <div className="wrap">
          <div className="caps opacity-55 mb-[24px]">Curators</div>
          <div className="grid grid-cols-[2fr_1fr] gap-[80px] items-end">
            <h1 className="display-hero th text-[clamp(60px,7vw,104px)] m-0">
              Ambassadors
            </h1>
            <p className="th text-[16px] leading-[1.7] text-[var(--fg-soft)] m-0">
              ช่างภาพรับเชิญที่ Gography ไว้วางใจให้คัดเลือก &ldquo;Ambassador Pick&rdquo; —
              เพิ่ม Pulse Score +50 ต่อภาพ
            </p>
          </div>
        </div>
      </section>

      <section className="pt-[40px] pb-[96px] rule-top">
        <div className="wrap">
          {ambassadors.map((a, i) => {
            const theirPicks = allPhotos
              .filter((p) => p.by === a.username || p.picks.includes('ambassador'))
              .slice(0, 4);
            return (
              <div
                key={a.username}
                className="grid grid-cols-[300px_1fr_1fr] gap-[48px] py-[56px] border-b border-[var(--rule)] items-start"
              >
                <div>
                  <div className="mono text-[11px] tracking-[.16em] uppercase opacity-55 mb-[24px]">
                    {String(i + 1).padStart(2, '0')} of {ambassadors.length}
                  </div>
                  <div
                    className="w-[120px] h-[120px] rounded-full overflow-hidden bg-[var(--tile)] mb-[20px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.avatar}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-[28px] font-normal tracking-[-0.02em] m-0">{a.name}</h3>
                  <div className="caps opacity-55 mt-[8px]">
                    {a.loc} · @{a.username}
                  </div>
                  <ProfileButton username={a.username} />
                </div>
                <div>
                  <div className="caps opacity-55 mb-[16px]">Statement</div>
                  <p className="th text-[18px] leading-[1.55] m-0 tracking-[-0.005em]">
                    {a.bio}
                  </p>
                  <p className="th text-[14px] leading-[1.7] text-[var(--fg-soft)] mt-[20px]">
                    คัดเลือกภาพในแนว{' '}
                    <strong className="text-[var(--fg)] font-medium">
                      {a.username === 'wattana'
                        ? 'Black & White'
                        : a.username === 'kanthorn'
                          ? 'Landscape'
                          : 'Portrait'}
                    </strong>{' '}
                    — เน้นที่ composition และจังหวะของแสง
                  </p>
                </div>
                <div>
                  <div className="caps opacity-55 mb-[16px]">Recent picks</div>
                  <div className="grid grid-cols-[1fr_1fr] gap-[8px]">
                    {theirPicks.slice(0, 4).map((p) => (
                      <PhotoThumb key={p.id} id={p.id} src={p.src} title={p.title} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pt-[80px] pb-[120px] bg-[var(--cream)] rule-top rule-bot">
        <div className="wrap-narrow text-center">
          <div className="caps opacity-55 mb-[24px]">Become an Ambassador</div>
          <h2
            className="th text-[40px] font-normal tracking-[-0.02em] m-0 leading-[1.15]"
          >
            Ambassador programme is invite-only by the Gography team
          </h2>
          <p className="th text-[15px] text-[var(--fg-soft)] mt-[24px] leading-[1.7]">
            หากคุณมีผลงานต่อเนื่องและได้รับ Editor&apos;s Pick มากกว่า 3 ครั้ง
            คุณอาจได้รับคำเชิญในฤดูกาลถัดไป
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
