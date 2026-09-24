# -*- coding: utf-8 -*-
"""
Готовит прайс для Яндекс Бизнеса: берёт выгруженный файл и дописывает
программы из каталога сайта, пропуская те, что уже есть под другим именем.

Запуск:  python tools/build_price.py
"""
import re, sys, os, json
import openpyxl

SRC = os.path.expanduser('~/Downloads/download_price_list.xlsx')
OUT = os.path.join(os.path.dirname(__file__), '..', 'price-53.xlsx')
DATA = os.path.join(os.path.dirname(__file__), '..', 'js', 'data.js')

# Программы из Яндекса, уже присутствующие под другим (переведённым) именем.
# Ключ — название в каталоге сайта, значение — как оно называется в Яндексе.
ALREADY = {
    'Ultimate Booster':  'Ultimate Booster',
    'Конфетные зомби':   'Конфетные зомби',
    'Dream of Dali':     'Dream of Dali',
    'Ограбление поезда': 'Ограбление поезда',
    'Зомби горки':       'Зомби горки',
    'Бреющий полёт':     'Бреющий полет',
    'Skeleton Island':   'Остров скелетов',
    'ZombieCoaster 2':   'Зомби горки 2',
    'Asylum':            'Убежище',
}

# Позицию «Minecraft» в Яндексе переименовываем: сравнение фото показало,
# что там стоит постер MainCraft (хронометраж 04:21). Minecraft VR — другая
# программа, её в карточке не было, добавляем отдельной строкой.
RENAME = {'Minecraft': 'MainCraft'}
AMBIGUOUS = []


def read_catalog():
    """Вытаскивает названия программ из массива FILMS в data.js."""
    src = open(DATA, encoding='utf-8').read()
    films = []
    for m in re.finditer(r'\{\s*t:\s*"([^"]+)"\s*,\s*genre:\s*"([^"]+)"\s*,'
                         r'\s*dur:\s*"([^"]+)"\s*,\s*age:\s*"([^"]+)"', src):
        films.append(dict(zip(('t', 'genre', 'dur', 'age'), m.groups())))
    return films


def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb.active
    header = [c.value for c in ws[1]]
    col = {name: i for i, name in enumerate(header)}

    renamed = []
    for r in range(2, ws.max_row + 1):
        cell = ws.cell(r, col['название'] + 1)
        if cell.value in RENAME:
            renamed.append((cell.value, RENAME[cell.value]))
            cell.value = RENAME[cell.value]

    existing = {ws.cell(r, col['название'] + 1).value
                for r in range(2, ws.max_row + 1)}
    existing = {e for e in existing if e}

    films = read_catalog()
    if len(films) != 53:
        print('ВНИМАНИЕ: из каталога прочитано %d программ, ожидалось 53' % len(films))

    added, skipped, ambiguous = [], [], []
    for f in films:
        name = f['t']
        if name in AMBIGUOUS:
            ambiguous.append(name);                       continue
        if name in existing:
            skipped.append((name, 'уже в списке'));       continue
        if name in ALREADY:
            skipped.append((name, 'есть как «%s»' % ALREADY[name])); continue
        added.append(f)

    row = ws.max_row + 1
    for f in added:
        ws.cell(row, col['категория'] + 1, 'Фильм')
        ws.cell(row, col['название'] + 1, f['t'])
        ws.cell(row, col['цена'] + 1, '250')
        ws.cell(row, col['в наличии'] + 1, 'да')
        ws.cell(row, col['популярный товар'] + 1, 'нет')
        row += 1

    wb.save(os.path.abspath(OUT))

    report = {
        'было_в_яндексе': len(existing),
        'переименовано': renamed,
        'добавлено': len(added),
        'станет_всего': len(existing) + len(added),
        'пропущено_дубли': skipped,
        'требуют_решения': ambiguous,
        'добавленные': [f['t'] for f in added],
        'файл': os.path.abspath(OUT),
    }
    print(json.dumps(report, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
