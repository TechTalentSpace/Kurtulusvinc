/**
 * Hero: pinned vinç, scroll ile teleskopik bom açılır, kanca CTA'yı kaldırır.
 * Yalnızca transform + opacity anime edilir.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const EXT = 130; // segment başına uzama (SVG birimi) — CraneSvg.astro ile aynı
const ANGLE = (35 * Math.PI) / 180;
const COS = Math.cos(ANGLE);
const SIN = Math.sin(ANGLE);
const CABLE = 40; // kablo başlangıç uzunluğu
const DROP = 140; // kanca iniş mesafesi

export function initHero(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const segs = [1, 2, 3, 4].map((i) => hero.querySelector<SVGGElement>(`#boom-${i}`));
  const hook = hero.querySelector<SVGGElement>('#hook');
  const hookBody = hero.querySelector<SVGGElement>('#hook-body');
  const cable = hero.querySelector<SVGLineElement>('#cable');
  const labels = [1, 2, 3, 4].map((i) => hero.querySelector<SVGGElement>(`[data-label="${i}"]`));
  const cta = hero.querySelector<HTMLElement>('[data-hero-cta]');
  const hint = hero.querySelector<HTMLElement>('[data-scroll-hint]');
  if (segs.some((s) => !s) || !hook || !hookBody || !cable || labels.some((l) => !l) || !cta) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll ipucu ilk scroll'da kaybolur
  if (hint) {
    addEventListener('scroll', () => hint.style.opacity = '0', { once: true, passive: true });
  }

  if (reduce) {
    // Statik açık hal: ScrollTrigger kurma, bom açık, kanca inmiş, etiketler görünür
    segs.forEach((s) => s!.setAttribute('transform', `translate(${EXT} 0)`));
    const tipX = 230 + 228 * COS + 4 * EXT * COS;
    const tipY = 520 - 228 * SIN - 4 * EXT * SIN;
    hook.setAttribute('transform', `translate(${tipX.toFixed(1)} ${tipY.toFixed(1)})`);
    cable.setAttribute('y2', String(CABLE + DROP));
    hookBody.setAttribute('transform', `translate(0 ${CABLE + DROP})`);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Başlangıç: etiketler ve CTA gizli (JS yoksa CSS'te görünür kalırlar)
  gsap.set(labels, { opacity: 0, y: 14 });
  gsap.set(cta, { opacity: 0, y: 40 });

  const isDesktop = matchMedia('(min-width: 768px)').matches;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: isDesktop ? '+=300%' : '+=220%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Her segment 0.2 birim; toplam 0.8. Kanca 0.85–1.0.
  const SEG = 0.2;
  segs.forEach((seg, i) => {
    const t = i * SEG;
    tl.to(seg, { x: EXT, duration: SEG }, t);
    // kanca bom ucunu takip eder
    tl.to(hook, { x: `+=${EXT * COS}`, y: `-=${EXT * SIN}`, duration: SEG }, t);
    // etiket segment sonunda belirir
    tl.to(labels[i], { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, t + SEG - 0.06);
  });

  // Son %15: kanca iner, CTA yukarı kayar
  const scale = (CABLE + DROP) / CABLE;
  tl.to(cable, { scaleY: scale, duration: 0.15, ease: 'power1.inOut' }, 0.85);
  tl.to(hookBody, { y: DROP, duration: 0.15, ease: 'power1.inOut' }, 0.85);
  tl.to(cta, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.88);
}
