/**
 * Hero: pinned fotoğraf. Scroll ile vinç yaklaşır ve sola kayar (kamera itişi),
 * ton koyulaşır, metin yukarı süzülür. Yalnızca transform + opacity.
 * Reduced motion: ScrollTrigger kurulmaz, her şey statik.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHero(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const photo = hero.querySelector<HTMLElement>('[data-hero-photo]');
  const shade = hero.querySelector<HTMLElement>('[data-hero-shade]');
  const text = hero.querySelector<HTMLElement>('[data-hero-text]');
  const hint = hero.querySelector<HTMLElement>('[data-scroll-hint]');
  if (!photo || !shade || !text) return;

  if (hint) addEventListener('scroll', () => (hint.style.opacity = '0'), { once: true, passive: true });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  const isDesktop = matchMedia('(min-width: 768px)').matches;

  // Giriş: fotoğraf hafifçe yerine oturur, metin süzülür
  gsap.from(photo, { scale: 1.14, xPercent: 3, duration: 1.6, ease: 'power3.out' });
  gsap.from(text.children, { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.15 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: isDesktop ? '+=140%' : '+=120%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  // Vinç yaklaşır ve ekranın soluna doğru geçer
  tl.to(photo, { scale: 1.28, xPercent: isDesktop ? -6 : -9, yPercent: -3, duration: 1 }, 0);
  tl.to(shade, { backgroundColor: 'rgba(12,14,17,0.55)', duration: 1 }, 0);
  tl.to(text, { yPercent: -18, duration: 1 }, 0);
  tl.to(text, { opacity: 0.15, duration: 0.35 }, 0.65);
}
