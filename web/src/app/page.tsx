'use client';
import { useApp } from '@/providers/AppProvider';
import { getPhotos, getPhoto, getPhotographer, getPhotographers, getVoyageurUsernames } from '@/lib/data';
import { HeroSection } from '@/components/home/HeroSection';
import { LeaderboardSection } from '@/components/home/LeaderboardSection';
import { AlltimeSection } from '@/components/home/AlltimeSection';
import { FeaturedPhotographersSection } from '@/components/home/FeaturedPhotographersSection';
import { VoyageursSection } from '@/components/home/VoyageursSection';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  const { bannerPhotoId, heroPhotoId } = useApp();
  const allPhotos = getPhotos();
  const photographers = getPhotographers();
  const voyageurUsernames = getVoyageurUsernames();

  // Hero photo: explicit pick or fallback to rank #1 (index 0, already sorted by pulse)
  const top = ((heroPhotoId !== 'auto' ? getPhoto(heroPhotoId) : undefined) ?? allPhotos[0])!;
  // Banner photo: explicit pick or fallback to p010, then rank #1
  const banner = (getPhoto(bannerPhotoId) ?? getPhoto('p010') ?? allPhotos[0])!;

  const bannerPhotographer = getPhotographer(banner.by);
  const topPhotographer = getPhotographer(top.by);
  const featuredVoyageurPhoto = getPhoto('p015');

  return (
    <div className="page-fade">
      <HeroSection
        banner={banner}
        top={top}
        bannerPhotographer={bannerPhotographer}
        topPhotographer={topPhotographer}
      />
      <LeaderboardSection allPhotos={allPhotos} voyageurUsernames={voyageurUsernames} />
      <AlltimeSection allPhotos={allPhotos} voyageurUsernames={voyageurUsernames} />
      <FeaturedPhotographersSection photographers={photographers} allPhotos={allPhotos} />
      <VoyageursSection featuredPhoto={featuredVoyageurPhoto} />
      <Footer />
    </div>
  );
}
