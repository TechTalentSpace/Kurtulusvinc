/**
 * Hero: katmanlı gerçek vinç. Scroll ile 2. ve 3. bom bölümü bom ekseninde uzar,
 * kanca iner ve CTA'yı kaldırır. Yalnızca transform + opacity.
 * Kapalı hal başlangıçtır (CSS'te .js-motion ile), JS yoksa bom açık statik görünür.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// scripts/crane-layers.py çıktısı: tuval yüzdesi olarak geri çekilme
const R2 = { x: 11.4, y: 21.8 }; // boom2 kapalı konum (xPercent, yPercent): tabana doğru (sağ-aşağı)
const R3 = { x: 10.7, y: 20.4 }; // boom3'ün boom2'ye göre kapalı konumu
const DROP = 34; // kanca iniş (tuval yüksekliği %)

export function initHero(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const q = (s: string) => hero.querySelector<HTMLElement>(s);
  const boom2 = q('[data-layer="boom2"]'), boom3 = q('[data-layer="boom3"]'), hook = q('[data-layer="hook"]');
  const cable = q('[data-cable]'), cableWrap = q('[data-cable-wrap]'), text = q('[data-hero-text]'), cta = q('[data-hero-cta]'), hint = q('[data-scroll-hint]');
  if (!boom2 || !boom3 || !hook || !cable || !cableWrap || !text || !cta) return;

  if (hint) addEventListener('scroll', () => (hint.style.opacity = '0'), { once: true, passive: true });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // açık, statik

  gsap.registerPlugin(ScrollTrigger);
  const isDesktop = matchMedia('(min-width: 768px)').matches;

  // Kapalı başlangıç
  // CSS'teki (.js-motion) kapalı hal ile aynı değerler; x/y sıfırlanır ki matris çift sayılmasın
  gsap.set(boom2, { x: 0, y: 0, xPercent: R2.x, yPercent: R2.y });
  gsap.set([boom3, hook, cableWrap], { x: 0, y: 0, xPercent: R2.x + R3.x, yPercent: R2.y + R3.y });
  gsap.set(cable, { scaleY: 1 });
  gsap.set(cta, { opacity: 0, y: 40 });
  gsap.from(text.children, { y: 18, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero, start: 'top top', end: isDesktop ? '+=260%' : '+=220%',
      pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  // 1. kademe: boom2 açılır (boom3 ve kanca onunla taşınır)
  tl.to(boom2, { xPercent: 0, yPercent: 0, duration: 0.4 }, 0);
  tl.to([boom3, hook, cableWrap], { xPercent: R3.x, yPercent: R3.y, duration: 0.4 }, 0);
  // 2. kademe: boom3 açılır
  tl.to([boom3, hook, cableWrap], { xPercent: 0, yPercent: 0, duration: 0.38 }, 0.38);
  // metin bom yaklaşınca çekilir
  tl.to(text, { yPercent: -30, opacity: 0, duration: 0.25 }, 0.12);
  // 3. kademe: kanca iner, CTA yükselir
  tl.to(hook, { yPercent: DROP, duration: 0.22, ease: 'power1.inOut' }, 0.78);
  tl.to(cable, { scaleY: 1 + DROP / 3.4, duration: 0.22, ease: 'power1.inOut' }, 0.78);
  tl.to(cta, { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.84);
}
