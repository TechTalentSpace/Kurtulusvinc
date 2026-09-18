/**
 * Yol hero'su: scroll ile durak şeridi sola akar (kamyon sabit), tekerlekler alınan
 * mesafeye göre döner, yol çizgisi kayar, kamyon hafifçe sallanır. Duraklarda mola:
 * her segment power2.inOut, arada bekleme. Yalnızca transform.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ROAD_PERIOD = 96; // global.css'teki çizgi periyodu (px)

export function initRoad(): void {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const q = <T extends HTMLElement>(s: string) => hero.querySelector<T>(s);
  const track = q('[data-track]'), truck = q('[data-truck]'), roadLine = q('[data-road-line]');
  const wheels = Array.from(hero.querySelectorAll<HTMLElement>('[data-wheel]'));
  const stops = Array.from(hero.querySelectorAll<HTMLElement>('[data-stop]'));
  const clouds = Array.from(hero.querySelectorAll<HTMLElement>('[data-cloud]'));
  if (!track || !truck || !roadLine || stops.length < 2) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS: yatay kaydırılabilir şerit

  gsap.registerPlugin(ScrollTrigger);
  const isDesktop = matchMedia('(min-width: 768px)').matches;

  const state = { x: 0, entry: 0 };
  // Tekerlek dönüşü: alınan mesafe / çevre; giriş animasyonu ayrı sayaç ekler
  const apply = () => {
    const dist = -state.x;
    gsap.set(track, { x: state.x });
    for (const w of wheels) {
      const dia = w.offsetWidth || 40;
      gsap.set(w, { rotation: ((dist + state.entry) / (Math.PI * dia)) * 360 });
    }
    gsap.set(roadLine, { x: -((dist + state.entry) % ROAD_PERIOD) });
    gsap.set(truck, { y: Math.sin((dist + state.entry) / 11) * 1.6 });
    clouds.forEach((c, i) => gsap.set(c, { x: -dist * (0.06 + i * 0.03) }));
  };

  // Giriş: kamyon sağdan gelir, tekerlekler döner
  gsap.fromTo(truck, { xPercent: 120 }, { xPercent: 0, duration: 1.8, ease: 'power3.out' });
  gsap.to(state, { entry: 900, duration: 1.8, ease: 'power3.out', onUpdate: apply });

  // Her durağın ekran merkezine gelmesi için şerit konumu (px); refresh'te yeniden hesaplanır
  const targetX = (el: HTMLElement) => -(el.offsetLeft + el.offsetWidth / 2 - hero.clientWidth / 2);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: 'top top', end: isDesktop ? '+=420%' : '+=480%',
      pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  stops.forEach((s, i) => {
    if (i === 0) return;
    tl.to(state, { x: () => targetX(s), duration: 1, ease: 'power2.inOut', onUpdate: apply });
    if (i < stops.length - 1) tl.to({}, { duration: 0.45 }); // durakta mola
  });
  ScrollTrigger.addEventListener('refreshInit', apply);
}
