/**
 * Stüdyo sahnesi. Üç obje karanlık zeminde, arkada amber ışık sütunu.
 * Durumlar: loading → lobby (seçim) → world (detay, 3 adım). Kamera ve obje hareketleri GSAP ile.
 * Yalnızca WebGL + transform; DOM tarafı ui.ts'te.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { worlds, type World } from '@/data/worlds';

export type StageState = 'loading' | 'lobby' | 'world';
export interface StageEvents {
  onProgress: (p: number) => void;
  onReady: () => void;
  onFocus: (index: number) => void;
}

const BG = 0x0a0a0b;
const isMobile = () => matchMedia('(max-width: 767px)').matches;

export class Stage {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  objects: THREE.Group[] = [];
  pivots: THREE.Group[] = [];
  state: StageState = 'loading';
  focus = 0;            // lobby'de ortadaki obje
  world = -1;           // aktif dünya
  step = 0;
  private key!: THREE.SpotLight;
  private column!: THREE.Mesh;
  private pointer = new THREE.Vector2();
  private pointerTarget = new THREE.Vector2();
  private clock = new THREE.Clock();
  private camTarget = new THREE.Vector3(0, 1.0, 0);
  private camPos = new THREE.Vector3(0, 1.4, 9);
  private raf = 0;
  private worldOrbit = { theta: 0, phi: 1.2, dist: 3, height: 1 };

  constructor(private canvas: HTMLCanvasElement, private events: StageEvents) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(BG);
    this.scene.fog = new THREE.Fog(BG, 14, 34);
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
    this.buildStudio();
    this.resize();
    addEventListener('resize', () => this.resize(), { passive: true });
    addEventListener('pointermove', (e) => { this.pointerTarget.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1); }, { passive: true });
    this.load();
  }

  private buildStudio() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;

    const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 72), new THREE.MeshStandardMaterial({ color: 0x0d0d10, roughness: 0.42, metalness: 0.15 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; this.scene.add(floor);

    // ana ışık (üstten, sıcak), kenar ışığı (soğuk), zemin doldurma
    this.key = new THREE.SpotLight(0xfff0d8, 320, 50, 0.42, 0.7, 1.7);
    this.key.position.set(3.5, 10, 6); this.key.castShadow = true;
    this.key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048); this.key.shadow.bias = -0.00025; this.key.shadow.radius = 4;
    this.scene.add(this.key, this.key.target);
    const rim = new THREE.SpotLight(0xcfdcff, 140, 50, 0.6, 0.8, 1.7); rim.position.set(-7, 6, -6); this.scene.add(rim);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.08));

    // ışık sütunu: dikey yumuşak gradyan, additive
    const cnv = document.createElement('canvas'); cnv.width = 64; cnv.height = 512; const ctx = cnv.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, 'rgba(255,198,107,1)'); g.addColorStop(0.75, 'rgba(255,198,107,0.9)'); g.addColorStop(1, 'rgba(255,198,107,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 512);
    const gh = ctx.createLinearGradient(0, 0, 64, 0); gh.addColorStop(0, 'rgba(0,0,0,1)'); gh.addColorStop(0.35, 'rgba(0,0,0,0)'); gh.addColorStop(0.65, 'rgba(0,0,0,0)'); gh.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = gh; ctx.fillRect(0, 0, 64, 512);
    const tex = new THREE.CanvasTexture(cnv); tex.colorSpace = THREE.SRGBColorSpace;
    const colMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.column = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 18), colMat); this.column.position.set(0, 8.4, -7); this.scene.add(this.column);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(7, 20), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    glow.position.set(0, 8.4, -7.2); this.scene.add(glow);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(4.5, 48), new THREE.MeshBasicMaterial({ color: 0xffc66b, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.01, -5.5); this.scene.add(pool);
  }

  private load() {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_u, loaded, total) => this.events.onProgress(loaded / total);
    const draco = new DRACOLoader(manager); draco.setDecoderPath(new URL('draco/', document.baseURI).href); draco.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader(manager); loader.setDRACOLoader(draco);
    let done = 0;
    worlds.forEach((w, i) => {
      const pivot = new THREE.Group(); this.pivots[i] = pivot; this.scene.add(pivot);
      loader.load(new URL(w.model.replace(/^\//, ''), document.baseURI).href, (gltf) => {
        const obj = gltf.scene;
        obj.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) {
            m.castShadow = true; m.receiveShadow = true;
            const mat = m.material as THREE.MeshStandardMaterial;
            if (mat && mat.transparent) { mat.alphaTest = 0.45; mat.transparent = false; mat.side = THREE.DoubleSide; mat.depthWrite = true; }
            if (mat) mat.envMapIntensity = 0.6;
          }
        });
        const box = new THREE.Box3().setFromObject(obj); const size = box.getSize(new THREE.Vector3()); const c = box.getCenter(new THREE.Vector3());
        const s = w.scale / Math.max(size.x, size.y, size.z);
        obj.scale.setScalar(s); obj.position.set(-c.x * s, -box.min.y * s + w.floorOffset, -c.z * s); obj.rotation.y = w.yaw;
        const holder = new THREE.Group(); holder.add(obj); holder.userData.height = size.y * s; holder.userData.radius = Math.max(size.x, size.z) * s * 0.5;
        pivot.add(holder); this.objects[i] = holder;
        if (++done === worlds.length) this.ready();
      });
    });
  }

  private ready() {
    this.state = 'lobby';
    this.layoutLobby(true);
    this.events.onReady();
    this.loop();
  }

  /** Lobi: odaktaki obje ortada, diğerleri yanlarda ve geride. */
  private layoutLobby(instant = false) {
    const mob = isMobile();
    const spread = mob ? 2.4 : 3.6, back = mob ? 1.8 : 1.4;
    worlds.forEach((_w, i) => {
      const rel = ((i - this.focus) % 3 + 3) % 3;             // 0 orta, 1 sağ, 2 sol
      const slot = rel === 0 ? 0 : rel === 1 ? 1 : -1;
      const target = { x: slot * spread, z: slot === 0 ? 0 : -back, s: slot === 0 ? 1 : 0.78 };
      const p = this.pivots[i];
      if (instant) { p.position.set(target.x, 0, target.z); p.scale.setScalar(target.s); }
      else { gsap.to(p.position, { x: target.x, z: target.z, duration: 1.1, ease: 'power3.inOut' }); gsap.to(p.scale, { x: target.s, y: target.s, z: target.s, duration: 1.1, ease: 'power3.inOut' }); }
      gsap.to(p, { duration: 0.01 });
    });
    const camZ = mob ? 11.5 : 9.2, camY = mob ? 1.5 : 1.6;
    const cp = { x: 0, y: camY, z: camZ }, ct = { x: 0, y: mob ? 1.2 : 1.1, z: 0 };
    if (instant) { this.camPos.set(cp.x, cp.y, cp.z); this.camTarget.set(ct.x, ct.y, ct.z); }
    else { gsap.to(this.camPos, { ...cp, duration: 1.3, ease: 'power3.inOut' }); gsap.to(this.camTarget, { ...ct, duration: 1.3, ease: 'power3.inOut' }); }
    gsap.to(this.key.target.position, { x: 0, y: 0.8, z: 0, duration: 1 });
    gsap.to(this.column.position, { x: 0, duration: 1.2, ease: 'power3.inOut' });
  }

  setFocus(i: number) {
    if (this.state !== 'lobby') return;
    this.focus = ((i % 3) + 3) % 3;
    this.layoutLobby();
    this.events.onFocus(this.focus);
  }
  next() { this.setFocus(this.focus + 1); }
  prev() { this.setFocus(this.focus - 1); }

  /** Dünyaya gir: diğer objeler uzaklaşır, kamera odağa yaklaşır. */
  enterWorld(i: number) {
    if (this.state !== 'lobby') return;
    this.state = 'world'; this.world = i; this.step = 0;
    worlds.forEach((_w, k) => {
      if (k === i) return;
      const p = this.pivots[k]; const dir = Math.sign(p.position.x) || 1;
      gsap.to(p.position, { x: dir * 14, z: -6, duration: 1.2, ease: 'power3.inOut' });
      gsap.to(p.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1.2, ease: 'power3.inOut' });
    });
    gsap.to(this.pivots[i].position, { x: 0, z: 0, duration: 1.2, ease: 'power3.inOut' });
    gsap.to(this.pivots[i].scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.inOut' });
    this.goStep(0, 1.4);
  }

  goStep(n: number, duration = 1.1) {
    if (this.state !== 'world') return;
    const w: World = worlds[this.world]; this.step = Math.max(0, Math.min(w.steps.length - 1, n));
    const c = w.steps[this.step].cam; const h = this.objects[this.world].userData.height as number; const r = this.objects[this.world].userData.radius as number;
    const dist = c.dist * Math.max(1, r / 1.3) * (isMobile() ? 1.35 : 1);
    gsap.to(this.worldOrbit, { theta: c.theta, phi: c.phi, dist, height: c.height * h, duration, ease: 'power3.inOut', onUpdate: () => this.applyOrbit() });
    gsap.to(this.camTarget, { x: 0, y: h * 0.45, z: 0, duration, ease: 'power3.inOut' });
  }
  private applyOrbit() {
    const o = this.worldOrbit;
    this.camPos.set(Math.sin(o.theta) * o.dist * Math.sin(o.phi), o.height + Math.cos(o.phi) * o.dist * 0.6 + 0.4, Math.cos(o.theta) * o.dist * Math.sin(o.phi));
  }

  exitWorld() {
    if (this.state !== 'world') return;
    this.state = 'lobby'; this.focus = this.world; this.world = -1;
    this.layoutLobby();
  }

  private resize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.fov = w < h ? 38 : 30; this.camera.updateProjectionMatrix();
    if (this.state === 'lobby') this.layoutLobby(true);
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    this.pointer.lerp(this.pointerTarget, 0.05);
    // idle: yavaş dönüş ve nefes
    this.objects.forEach((o, i) => {
      const active = this.state === 'lobby' ? i === this.focus : i === this.world;
      o.rotation.y += (active ? 0.0016 : 0.0006);
      o.position.y = Math.sin(t * 0.6 + i) * 0.03;
    });
    // kamera: hedef + hafif paralaks
    const px = this.pointer.x * (this.state === 'lobby' ? 0.5 : 0.25), py = -this.pointer.y * 0.2;
    this.camera.position.set(this.camPos.x + px, this.camPos.y + py, this.camPos.z);
    this.camera.lookAt(this.camTarget);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() { cancelAnimationFrame(this.raf); this.renderer.dispose(); }
}
