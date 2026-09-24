# -*- coding: utf-8 -*-
"""Выдаёт список программ, у которых в Яндексе нет описания, и путь к постеру."""
import re, os, json, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'js', 'data.js')
IMG = r'C:\Users\Batya\Desktop\7d-catalog\img'
OUT = sys.argv[1] if len(sys.argv) > 1 else None

# Эти уже описаны в Яндексе — трогать не нужно.
HAVE_DESC = {
    'MainCraft', 'Ultimate Booster', 'Конфетные зомби', 'Убежище',
    'Парящие храмы', 'Dream of Dali', 'Остров скелетов', 'Ограбление поезда',
    'Зомби горки 2', 'Зомби горки', 'Бреющий полет',
}
# То же самое, но под каталожными именами.
SAME = {'Asylum': 'Убежище', 'Skeleton Island': 'Остров скелетов',
        'ZombieCoaster 2': 'Зомби горки 2', 'Бреющий полёт': 'Бреющий полет'}

src = open(DATA, encoding='utf-8').read()
films = []
for m in re.finditer(r'\{\s*t:\s*"([^"]+)"\s*,\s*genre:\s*"([^"]+)"\s*,'
                     r'\s*dur:\s*"([^"]+)"\s*,\s*age:\s*"([^"]+)"[^}]*?'
                     r'img:\s*"([^"]+)"', src):
    t, genre, dur, age, img = m.groups()
    films.append(dict(t=t, genre=genre, dur=dur, age=age, img=img))

need = [f for f in films
        if f['t'] not in HAVE_DESC and SAME.get(f['t']) not in HAVE_DESC]

for f in need:
    f['path'] = os.path.join(IMG, f['img'] + '.jpg')
    f['exists'] = os.path.exists(f['path'])

print(json.dumps(need, ensure_ascii=False, indent=1))
print('ВСЕГО:', len(need), '| файлов нет:',
      [f['t'] for f in need if not f['exists']], file=sys.stderr)
