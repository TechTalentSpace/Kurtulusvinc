"""
Gerçek vinç fotoğrafından arka plansız, katmanlı hero varlıkları üretir.
Kullanım: python3 scripts/crane-layers.py <kaynak.jpg>
Çıktı: src/assets/crane/{carrier,boom2,boom3,hook}.webp (aynı tuval, şeffaf)
Gerekli: pip install rembg onnxruntime pillow numpy
Koordinatlar ACE 16XW fotoğrafına (Pexels #29502190, 1600x2400) göre; yeni fotoğrafta güncellenmeli.
"""
import sys, numpy as np
from PIL import Image
from rembg import remove, new_session

SRC = sys.argv[1]
OUT = 'src/assets/crane'
im = Image.open(SRC).convert('RGB')
cut = remove(im, session=new_session('isnet-general-use'))
a = np.array(cut).astype(np.float32) / 255.0
H, W = a.shape[:2]

def erase(x0, y0, x1, y1): a[y0:y1, x0:x1, 3] = 0
# arka plan kalıntıları: tel, direk, branda, forklift
erase(800, 1240, 1330, 1470); erase(1100, 1100, 1330, 1850); erase(1260, 800, 1330, 1100)
erase(370, 1740, 636, 2012); erase(370, 2012, 426, 2062); erase(465, 1880, 585, 2015)
# mavi branda kalıntıları (renk maskesi, sadece alt bölgede)
rgb = a[..., :3]; mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn + 1e-6
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
s = np.where(mx > 0, d / (mx + 1e-6), 0); v = mx
blue = (h > 185) & (h < 260) & (s > 0.3)
region = np.zeros((H, W), bool); region[1700:2100, 360:930] = True
a[..., 3] = np.where(blue & region, 0, a[..., 3])
# motor/bom ayağı arkasında kalan gri duvar: düşük doygunluk, orta parlaklık (vinç parçaları ya siyah ya turuncu)
gray = (s < 0.22) & (v > 0.3) & (v < 0.92)
region2 = np.zeros((H, W), bool); region2[1580:1860, 900:1130] = True
a[..., 3] = np.where(gray & region2, 0, a[..., 3])

# turuncu -> altın (pirinç paletiyle uyum)
mask = (h > 5) & (h < 45) & (s > 0.35) & (a[..., 3] > 0)
h2 = np.where(mask, h + 12, h); s2 = np.where(mask, s * 0.72, s); v2 = np.where(mask, v * 0.96, v)
c = v2 * s2; hh = h2 / 60; xx = c * (1 - np.abs(hh % 2 - 1)); m = v2 - c
sel = [hh < 1, hh < 2, hh < 3, hh < 4, hh < 5, hh >= 5]
r2 = np.select(sel, [c, xx, 0, 0, xx, c]) + m
g2 = np.select(sel, [xx, c, c, xx, 0, 0]) + m
b2 = np.select(sel, [0, 0, xx, c, c, xx]) + m
a[..., 0], a[..., 1], a[..., 2] = r2, g2, b2

# bom ekseni (iki nokta) ve dik kesimler
P1 = np.array([775.0, 1500.0]); P2 = np.array([470.0, 400.0])
u = (P2 - P1) / np.linalg.norm(P2 - P1)            # eksen yönü (uca doğru)
yy, xx_ = np.mgrid[0:H, 0:W]
t = (xx_ - P1[0]) * u[0] + (yy - P1[1]) * u[1]      # eksen boyunca konum
def t_at_y(y): return (y - P1[1]) / u[1]
T1, T2 = t_at_y(1235), t_at_y(715)                  # eklem 1, eklem 2
hookbox = np.zeros((H, W), bool); hookbox[395:535, 265:355] = True

alpha = a[..., 3]
lay = {
  'hook':    hookbox,
  'boom3':   (t >= T2) & ~hookbox,
  'boom2':   (t >= T1) & (t < T2),
  'carrier': (t < T1),
}
# tuval kırpma
X0, Y0, X1, Y1 = 230, 180, 1330, 2260
for name, m in lay.items():
    layer = a.copy(); layer[..., 3] = np.where(m, alpha, 0)
    layer[..., :3] *= (layer[..., 3:] > 0)  # şeffaf piksellerde RGB sıfır (dosya boyutu)
    img = Image.fromarray((np.clip(layer, 0, 1) * 255).astype(np.uint8), 'RGBA').crop((X0, Y0, X1, Y1))
    img.save(f'{OUT}/{name}.png', optimize=True)
    print(name, img.size)

# animasyon parametreleri (tuval yüzdesi)
CW, CH = X1 - X0, Y1 - Y0
def pct(dist): return (dist * u[0] / CW * 100, dist * u[1] / CH * 100)
print('boom2 retract %:', pct(470)); print('boom3 retract %:', pct(440))
sheave = ((325 - X0) / CW * 100, (330 - Y0) / CH * 100); print('sheave %:', sheave)
print('joint lengths', T2 - T1, t_at_y(220) - T2)
