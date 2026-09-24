# -*- coding: utf-8 -*-
"""
Собирает описания для сайта: берёт их из готового прайса Яндекса и
сопоставляет с названиями программ в data.js (часть программ в Яндексе
названа по-русски, а в каталоге сайта — по-английски).

Печатает готовый блок JS, который вставляется в data.js.
"""
import os, re, json
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
PRICE = os.path.join(HERE, '..', 'price-photos.xlsx')
DATA = os.path.join(HERE, '..', 'js', 'data.js')

# название в каталоге сайта -> название в Яндексе
SAME = {
    'Asylum': 'Убежище',
    'Skeleton Island': 'Остров скелетов',
    'ZombieCoaster 2': 'Зомби горки 2',
    'Бреющий полёт': 'Бреющий полет',
}

ws = openpyxl.load_workbook(PRICE).active
desc = {}
for r in range(2, ws.max_row + 1):
    name, d = ws.cell(r, 3).value, ws.cell(r, 4).value
    if name and d:
        desc[name] = ' '.join(str(d).split())

films = re.findall(r'\{\s*t:\s*"([^"]+)"', open(DATA, encoding='utf-8').read())

out, missing = {}, []
for t in films:
    key = SAME.get(t, t)
    if key in desc:
        out[t] = desc[key]
    else:
        missing.append(t)

lines = ['/* Описания программ. Считаны с постеров и из карточки Яндекса —',
         '   ничего не выдумано. Показываются на карточках каталога. */',
         'const DESCRIPTIONS = {']
for t, d in out.items():
    lines.append('  %s: %s,' % (json.dumps(t, ensure_ascii=False),
                                json.dumps(d, ensure_ascii=False)))
lines.append('};')

open(os.path.join(HERE, 'site_desc.js'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print(json.dumps({'всего_программ': len(films), 'с_описанием': len(out),
                  'без_описания': missing}, ensure_ascii=False, indent=1))
