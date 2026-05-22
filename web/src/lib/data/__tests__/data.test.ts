import { describe, it, expect } from 'vitest';
import {
  getPhotos, getPhoto, getPhotographer, getAmbassadors,
  getSeasons, getCommentsFor, getVoyageurUsernames,
} from '@/lib/data';

describe('data access', () => {
  it('returns photos ranked by pulse desc', () => {
    const photos = getPhotos();
    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0]!.rank).toBe(1);
    for (let i = 1; i < photos.length; i++) {
      expect(photos[i - 1]!.pulse).toBeGreaterThanOrEqual(photos[i]!.pulse);
    }
  });
  it('filters by category', () => {
    expect(getPhotos({ category: 'BW' }).every((p) => p.cat === 'BW')).toBe(true);
  });
  it('finds a photo and photographer by id/username', () => {
    expect(getPhoto('p001')?.id).toBe('p001');
    expect(getPhoto('nope')).toBeUndefined();
    expect(getPhotographer('kanthorn')?.username).toBe('kanthorn');
  });
  it('returns only ambassadors', () => {
    expect(getAmbassadors().every((p) => p.isAmbassador)).toBe(true);
  });
  it('falls back to default comments', () => {
    expect(getCommentsFor('p004').length).toBeGreaterThan(0);
  });
  it('lists voyageur usernames', () => {
    expect(getVoyageurUsernames().has('pim.travels')).toBe(true);
  });
  it('exposes seasons', () => {
    expect(getSeasons().some((s) => s.status === 'live')).toBe(true);
  });
});
