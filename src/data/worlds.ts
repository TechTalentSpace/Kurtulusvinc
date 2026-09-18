/** Üç dünya: sahnedeki üç obje ve her birinin hizmet hikâyesi. */
export interface WorldStep { title: string; text: string; cam: { theta: number; phi: number; dist: number; height: number } }
export interface World {
  key: 'deniz' | 'bag' | 'yol';
  label: string;
  eyebrow: string;
  headline: string;
  intro: string;
  model: string;
  scale: number;        // sahnede hedef en büyük boyut (birim)
  yaw: number;          // giriş açısı
  floorOffset: number;  // modelin zemine oturması için ek kaydırma
  steps: WorldStep[];
  services: { name: string; href: string }[];
}
export const worlds: World[] = [
  {
    key: 'deniz', label: 'Deniz', eyebrow: '01 — Marina', headline: 'Marinadan kızağa.',
    intro: 'Yat, tekne ve filika: indiririz, bindiririz, taşırız. Çeşme Marina, Dalyan, Sığacık.',
    model: '/models/tekne.glb', scale: 3.4, yaw: 0.7, floorOffset: 0,
    steps: [
      { title: 'Askı ve dengeleme', text: 'Teknenin boyu ve ağırlığına göre askı noktaları önceden planlanır; kaldırma tek hamlede, sarsıntısız yapılır.', cam: { theta: 0.9, phi: 1.25, dist: 3.2, height: 0.9 } },
      { title: 'Marina koordinasyonu', text: 'Marina ve barınak kurallarına uygun saat, iskele yaklaşımı ve karaya alma sırası bizim tarafımızdan yönetilir.', cam: { theta: -0.7, phi: 1.1, dist: 2.6, height: 1.1 } },
      { title: 'Gece operasyon', text: 'Sezon yoğunluğunda gece nakliye ve indirme yapılır; sabah tekneniz suda ya da kızakta olur.', cam: { theta: 2.4, phi: 1.35, dist: 3.6, height: 0.6 } },
    ],
    services: [{ name: 'İnşaat & Tekne Vinç Hizmeti', href: '/hizmetler/insaat-tekne-vinc' }, { name: 'Mobil Vinç Kiralama', href: '/hizmetler/mobil-vinc-kiralama' }],
  },
  {
    key: 'bag', label: 'Bağ', eyebrow: '02 — Bağ ve villa', headline: 'Köküyle taşınan ağaç.',
    intro: 'Zeytin ve peyzaj ağaçları, prefabrik bağ evi, tiny house ve konteyner: Urla, Alaçatı, Karaburun.',
    model: '/models/agac.glb', scale: 3.6, yaw: 0.3, floorOffset: 0,
    steps: [
      { title: 'Köküyle söküm', text: 'Yüzyıllık zeytin, kök topuyla sökülür, bağlanır ve hasarsız taşınır; yeni yerinde vinçle dikilir.', cam: { theta: 0.6, phi: 1.2, dist: 3.4, height: 1.2 } },
      { title: 'Bağ evi ve tiny house', text: 'Prefabrik yapı ve tiny house hiyap ile tek seferde getirilir, parsele indirilir, temele oturtulur.', cam: { theta: -1.1, phi: 1.05, dist: 3.0, height: 1.4 } },
      { title: 'Kırsal erişim', text: 'Stabilize yol, eğimli parsel ve dar geçişler önceden keşfedilir; zemin plakası ve uygun araç seçilir.', cam: { theta: 2.6, phi: 1.3, dist: 3.8, height: 0.9 } },
    ],
    services: [{ name: 'Hiyap ile Nakliye', href: '/hizmetler/hiyap-nakliye' }, { name: 'Sepetli Vinç / Personel Platformu', href: '/hizmetler/sepetli-vinc' }],
  },
  {
    key: 'yol', label: 'Yol', eyebrow: '03 — Yol', headline: 'Yolda kaldıysanız.',
    intro: 'Araç kurtarma ve taşıma, konteyner ve yük nakliyesi. Yarımadanın her yoluna çıkarız.',
    model: '/models/arac.glb', scale: 3.6, yaw: 0.9, floorOffset: 0,
    steps: [
      { title: 'Çekici ve hiyap', text: 'Yolda kalan aracınız kaldırılır ve güvenle taşınır; düşük şasi ve klasik araçlar için özel askı.', cam: { theta: 0.8, phi: 1.25, dist: 3.0, height: 0.6 } },
      { title: 'Konteyner ve prefabrik', text: 'Şantiye konteyneri, ofis ve depo yapıları hiyap ile yüklenir, taşınır ve yerine indirilir.', cam: { theta: -0.9, phi: 1.1, dist: 2.7, height: 0.8 } },
      { title: 'Yarımadanın her yolu', text: 'Çeşme, Alaçatı, Ilıca, Urla, Karaburun, Seferihisar. Konumunuzu paylaşın, süre ve fiyat telefonda.', cam: { theta: 2.3, phi: 1.35, dist: 3.4, height: 0.5 } },
    ],
    services: [{ name: 'Hiyap ile Nakliye', href: '/hizmetler/hiyap-nakliye' }, { name: 'Mobil Vinç Kiralama', href: '/hizmetler/mobil-vinc-kiralama' }],
  },
];
