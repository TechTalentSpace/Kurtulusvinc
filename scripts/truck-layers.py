"""
Gerçek kamyon fotoğrafından arka plansız hero varlıkları üretir:
  src/assets/truck/truck.png       tüm araç (kesilmiş, sis halkası bastırılmış)
  src/assets/truck/wheel-*.png     tekerlek daireleri (scroll ile döner)
Kullanım: python3 scripts/truck-layers.py <kaynak.jpg|webp>
Gerekli: pip install rembg onnxruntime pillow numpy
Koordinatlar zeytin ağaçlı Iveco fotoğrafına (1840x1136) göre; yeni fotoğrafta CROP ve WHEELS güncellenir,
çıktıdaki yüzdeler src/components/RoadHero.astro içindeki WHEELS listesine yazılır.
"""
import sys, numpy as np
from PIL import Image
from rembg import remove, new_session

SRC = sys.argv[1]; OUT = 'src/assets/truck'
CROP = (240, 300, 1470, 900)                       # x0,y0,x1,y1
WHEELS = [("t1",372,795,33),("t2",430,795,33),("t3",487,795,33),("r",826,815,52),("f",1168,830,55)]  # ad,cx,cy,r

im = Image.open(SRC).convert('RGB')
cut = remove(im, session=new_session('isnet-general-use'))
a = np.array(cut).astype(np.float32) / 255
al = np.clip((a[..., 3] - 0.18) / 0.82, 0, 1) ** 1.15   # sis halkası bastırma
a[..., 3] = al; a[..., :3] *= (al[..., None] > 0)
X0, Y0, X1, Y1 = CROP; CW, CH = X1 - X0, Y1 - Y0
Image.fromarray((a[Y0:Y1, X0:X1] * 255).astype(np.uint8), 'RGBA').save(f'{OUT}/truck.png', optimize=True)
H, W = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
print('canvas', CW, CH)
for n, cx, cy, r in WHEELS:
    rr = r - 2; dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    edge = np.clip((rr - dist + 1.5) / 3, 0, 1)
    w = a.copy(); w[..., 3] = a[..., 3] * edge * (dist <= rr); w[..., :3] *= (w[..., 3:] > 0)
    Image.fromarray((w[cy - r - 2:cy + r + 2, cx - r - 2:cx + r + 2] * 255).astype(np.uint8), 'RGBA').save(f'{OUT}/wheel-{n}.png', optimize=True)
    print(f"  {{ n: '{n}', left: {(cx - X0) / CW * 100:.2f}, top: {(cy - Y0) / CH * 100:.2f}, size: {(2 * r + 4) / CW * 100:.2f} }},")
