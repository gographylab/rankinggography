'use client';
import { useRouter } from 'next/navigation';
import { PHOTOGRAPHERS } from '@/lib/data';
import { PickBadge } from './Icons';

export function PhotoCard({ photo, showRank = false, showRankDelta = false, leaderTopScore = null, uniform = false, pulseLabel = 'Pulse' }) {
  const router = useRouter();
  const photographer = PHOTOGRAPHERS.find(p => p.username === photo.by);
  const delta = (showRankDelta && leaderTopScore != null && photo.rank > 1) ? (photo.pulse - leaderTopScore) : null;
  return (
    <div className="pcard" onClick={() => router.push(`/photo/${photo.id}`)}>
      <div className="pimg" style={{ aspectRatio: uniform ? '4/5' : `${photo.w}/${photo.h}` }}>
        <img src={photo.src} alt={photo.title} loading="lazy" />

        {/* Hover overlay: photo metadata fades in from bottom */}
        <div className="pimg-overlay">
          <div className="pimg-overlay-grad" />
          <div className="pimg-overlay-content">
            <div className="pimg-overlay-cat">{photo.cat}</div>
            <div className="pimg-overlay-title">{photo.title}</div>
            <div className="pimg-overlay-meta">
              <span>{photographer ? photographer.name : photo.by}</span>
              <span className="pimg-overlay-sep">·</span>
              <span>{photo.exif.camera}</span>
            </div>
            <div className="pimg-overlay-pulse">
              <span className="pimg-overlay-pulse-num">{photo.pulse.toFixed(0)}</span>
              <span className="pimg-overlay-pulse-lab">PULSE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pmeta">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flex: 1, minWidth: 0 }}>
          {showRank && <span className="rank" style={{ flexShrink: 0 }}>{String(photo.rank).padStart(2,'0')}</span>}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ptitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.title}</div>
            <div className="pby">{photographer ? photographer.name : photo.by}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, marginLeft: 16, textAlign: 'right' }}>
          <div className="pulse">
            <span className="big">{photo.pulse.toFixed(0)}</span>
            <span className="lab">{pulseLabel}</span>
          </div>
          {delta !== null && (
            <div className="mono" style={{ fontSize: 10, color: 'var(--fg-soft)', marginTop: 4, letterSpacing: '.04em' }}>
              {delta.toFixed(1)} from #1
            </div>
          )}
        </div>
      </div>
      {photo.picks.length > 0 && (
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
          {photo.picks.includes('editor') && photo.picks.includes('ambassador') ? (
            <PickBadge kind="both" />
          ) : (
            <>
              {photo.picks.includes('editor') && <PickBadge kind="editor" />}
              {photo.picks.includes('ambassador') && <PickBadge kind="ambassador" />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function PhotoGrid({ photos, cols = 3, showRank = false, showRankDelta = false, uniform = false, pulseLabel = 'Pulse' }) {
  const leaderTopScore = (showRankDelta && photos.length > 0) ? Math.max(...photos.map(p => p.pulse)) : null;
  if (uniform) {
    return (
      <div className="pgrid pgrid-stagger" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
        {photos.map((p, i) => (
          <div key={p.id} style={{ '--i': i }}>
            <PhotoCard photo={p} showRank={showRank} showRankDelta={showRankDelta} leaderTopScore={leaderTopScore} uniform pulseLabel={pulseLabel} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="pgrid pgrid-stagger" style={{ columnCount: cols, columnGap: 24 }}>
      {photos.map((p, i) => (
        <div key={p.id} style={{ breakInside: 'avoid', marginBottom: 32, '--i': i }}>
          <PhotoCard photo={p} showRank={showRank} showRankDelta={showRankDelta} leaderTopScore={leaderTopScore} pulseLabel={pulseLabel} />
        </div>
      ))}
    </div>
  );
}
