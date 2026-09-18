/** DOM katmanı: yükleyici, lobi (seçim), dünya paneli; tekerlek/klavye/dokunma girişleri. */
import { Stage } from './stage';
import { worlds } from '@/data/worlds';

export function initUI() {
  const canvas = document.getElementById('stage-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;
  const loader = $('[data-loader]'), bar = $('[data-loader-bar]'), pct = $('[data-loader-pct]');
  const lobby = $('[data-lobby]'), lobbyTitle = $('[data-lobby-title]'), lobbyIntro = $('[data-lobby-intro]'), lobbyEyebrow = $('[data-lobby-eyebrow]');
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const panel = $('[data-world]'), pEyebrow = $('[data-world-eyebrow]'), pHead = $('[data-world-headline]'), pStepTitle = $('[data-step-title]'), pStepText = $('[data-step-text]'), pDots = Array.from(document.querySelectorAll<HTMLElement>('[data-dot]'));
  const pServices = $('[data-world-services]'), back = $('[data-back]'), nextBtn = $('[data-next]'), enterBtn = $('[data-enter]');
  const hint = $('[data-hint]');

  const setLobbyText = (i: number) => {
    const w = worlds[i];
    lobbyEyebrow.textContent = w.eyebrow; lobbyTitle.textContent = w.headline; lobbyIntro.textContent = w.intro;
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    enterBtn.textContent = `${w.label} dünyasına gir`;
  };
  const showWorld = (i: number, step: number) => {
    const w = worlds[i]; const s = w.steps[step];
    pEyebrow.textContent = w.eyebrow; pHead.textContent = w.headline; pStepTitle.textContent = s.title; pStepText.textContent = s.text;
    pDots.forEach((d, k) => d.classList.toggle('bg-ink', k === step));
    pServices.innerHTML = w.services.map((sv) => `<a class="block border-b border-line py-3 text-ink-2 hover:text-ink" href="${sv.href}">${sv.name} <span aria-hidden="true">→</span></a>`).join('');
    nextBtn.textContent = step < w.steps.length - 1 ? 'Devam' : 'Başa dön';
  };

  document.documentElement.classList.add('stage-lock');
  const textLink = document.querySelector<HTMLElement>('[data-text-version]');
  textLink?.addEventListener('click', () => { document.documentElement.classList.remove('stage-lock'); document.getElementById('icerik-metin')?.scrollIntoView({ behavior: 'smooth' }); });
  const stage = new Stage(canvas, {
    onProgress: (p) => { bar.style.transform = `scaleX(${p})`; pct.textContent = String(Math.round(p * 100)).padStart(3, '0'); },
    onReady: () => {
      loader.classList.add('is-hidden'); setTimeout(() => (loader.style.display = 'none'), 700);
      lobby.classList.remove('is-hidden'); hint.classList.remove('is-hidden');
      setLobbyText(0);
    },
    onFocus: (i) => setLobbyText(i),
  });
  (window as any).__stage = stage; // hata ayıklama

  // Girişler: tekerlek / ok tuşları / yatay kaydırma → odak; tıkla → dünya
  let wheelLock = 0;
  addEventListener('wheel', (e) => {
    if (!document.documentElement.classList.contains('stage-lock')) return;
    const now = performance.now(); if (now - wheelLock < 900) return; wheelLock = now;
    if (stage.state === 'lobby') { Math.abs(e.deltaX) > Math.abs(e.deltaY) ? (e.deltaX > 0 ? stage.next() : stage.prev()) : (e.deltaY > 0 ? stage.next() : stage.prev()); }
    else if (stage.state === 'world') { stepWorld(e.deltaY > 0 ? 1 : -1); }
  }, { passive: true });
  addEventListener('keydown', (e) => {
    if (stage.state === 'lobby') { if (e.key === 'ArrowRight') stage.next(); if (e.key === 'ArrowLeft') stage.prev(); if (e.key === 'Enter') enter(); }
    else if (stage.state === 'world') { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') stepWorld(1); if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') stepWorld(-1); if (e.key === 'Escape') leave(); }
  });
  let tx = 0, ty = 0, tt = 0;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = performance.now(); }, { passive: true });
  addEventListener('touchend', (e) => {
    if (!document.documentElement.classList.contains('stage-lock')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (performance.now() - tt > 800) return;
    if (stage.state === 'lobby' && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? stage.next() : stage.prev(); }
    else if (stage.state === 'world' && Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) { stepWorld(dy < 0 ? 1 : -1); }
  }, { passive: true });

  const enter = () => {
    if (stage.state !== 'lobby') return;
    const i = stage.focus; stage.enterWorld(i); showWorld(i, 0);
    lobby.classList.add('is-hidden'); hint.classList.add('is-hidden');
    setTimeout(() => panel.classList.remove('is-hidden'), 500);
    history.replaceState(null, '', `#${worlds[i].key}`);
  };
  const leave = () => {
    if (stage.state !== 'world') return;
    panel.classList.add('is-hidden'); stage.exitWorld(); setLobbyText(stage.focus);
    setTimeout(() => { lobby.classList.remove('is-hidden'); hint.classList.remove('is-hidden'); }, 500);
    history.replaceState(null, '', location.pathname);
  };
  const stepWorld = (dir: number) => {
    const w = worlds[stage.world]; let n = stage.step + dir;
    if (n >= w.steps.length) n = 0; if (n < 0) n = w.steps.length - 1;
    stage.goStep(n); showWorld(stage.world, n);
  };

  tabs.forEach((t, i) => t.addEventListener('click', () => { if (stage.state === 'lobby') stage.setFocus(i); }));
  enterBtn.addEventListener('click', enter);
  canvas.addEventListener('click', (e) => { if (stage.state === 'lobby' && Math.abs(e.clientX - innerWidth / 2) < innerWidth * 0.3) enter(); });
  back.addEventListener('click', leave);
  nextBtn.addEventListener('click', () => stepWorld(1));
  pDots.forEach((d, k) => d.addEventListener('click', () => { if (stage.state === 'world') { stage.goStep(k); showWorld(stage.world, k); } }));

  // #deniz gibi doğrudan gelişte odağı ayarla
  const hash = location.hash.replace('#', ''); const hi = worlds.findIndex((w) => w.key === hash);
  if (hi >= 0) { const wait = setInterval(() => { if (stage.state === 'lobby') { clearInterval(wait); stage.setFocus(hi); } }, 100); }
}
