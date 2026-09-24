# -*- coding: utf-8 -*-
"""
Собирает вертикальные слайды 1280x1920 для «Историй» Яндекс Бизнеса.

Кадры программ горизонтальные, поэтому слайд строится так: размытый кадр
на фон, сам кадр по центру, сверху подпись. Текст — только подтверждённые
факты: цены, хронометраж, состав аттракциона.
"""
import os, subprocess, json

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = r'C:\Users\Batya\Desktop\7d-catalog\img'
OUT = os.path.join(HERE, '..', '.stories-tmp')

W, H = 1280, 1920
INK, ACC, MUT = '#F2F4F8', '#FF4D1C', '#B3BAC7'
FONT, FONT_R = 'Arial-Bold', 'Arial'

STORIES = [
    ('53 программы', [
        ('cover',  ['53 ПРОГРАММЫ'],            'и все по 250 ₽'),
        ('top-01', ['ДИНОЗАВРЫ, КОСМОС,', 'ЗОМБИ И ПИРАТЫ'], 'Сеанс от 2 до 6 минут'),
        ('top-04', ['И СПОКОЙНОЕ', 'ПОГРУЖЕНИЕ'], 'Рифы, черепахи, тишина'),
    ]),
    ('День рождения', [
        ('top-01', ['ДЕНЬ РОЖДЕНИЯ', 'НА АТТРАКЦИОНЕ'], 'Выкуп от 4 000 ₽ за час'),
        ('top-05', ['ВСЕ ЧЕТЫРЕ', 'МЕСТА ВАШИ'],        'Гости катаются по очереди'),
        ('top-08', ['БРОНИРУЙТЕ', 'ЗАРАНЕЕ'],           '+7 919 004-62-12'),
    ]),
    ('Три эффекта', [
        ('top-10', ['VR-ШЛЕМ'],          'Обзор 360°, картинка следует за головой'),
        ('top-03', ['ДВИЖЕНИЕ КРЕСЕЛ'],  'Платформа повторяет каждый поворот'),
        ('top-07', ['ВЕТЕР'],            'Поток воздуха в лицо на скорости'),
    ]),
]


def run(args):
    r = subprocess.run(args, capture_output=True)
    if r.returncode:
        raise RuntimeError(args[-1] + ': ' + r.stderr.decode('utf-8', 'replace')[:200])


def slide(src, heads, sub, dst):
    img = os.path.join(SRC, src + '.jpg')
    bg, mid = dst + '.bg.png', dst + '.mid.png'

    # фон: кадр во весь слайд, размытый и притемнённый
    run(['magick', img, '-resize', '%dx%d^' % (W, H), '-gravity', 'center',
         '-extent', '%dx%d' % (W, H), '-blur', '0x28',
         '-fill', 'black', '-colorize', '58%', bg])
    # сам кадр — резкий, ровно 1280x720, иначе высокие картинки (мозаика)
    # лезут под заголовок
    run(['magick', img, '-resize', '%dx720^' % W, '-gravity', 'center',
         '-extent', '%dx720' % W, mid])

    args = ['magick', bg, mid, '-gravity', 'north', '-geometry', '+0+470',
            '-composite', '-gravity', 'north']
    # шапка
    args += ['-font', FONT, '-pointsize', '46', '-fill', ACC,
             '-annotate', '+0+170', '7D ATTRACTION']
    # заголовок
    y = 1330
    for line in heads:
        args += ['-font', FONT, '-pointsize', '104', '-fill', INK,
                 '-annotate', '+0+%d' % y, line]
        y += 124
    # подпись
    args += ['-font', FONT_R, '-pointsize', '54', '-fill', MUT,
             '-annotate', '+0+%d' % (y + 40), sub]
    args += ['-quality', '90', dst]
    run(args)

    for f in (bg, mid):
        os.remove(f)


def main():
    os.makedirs(OUT, exist_ok=True)
    made = []
    for si, (title, slides) in enumerate(STORIES, 1):
        for i, (src, heads, sub) in enumerate(slides, 1):
            dst = os.path.join(OUT, 's%d_%d.jpg' % (si, i))
            slide(src, heads, sub, dst)
            made.append({'история': title, 'слайд': i, 'файл': dst})
    print(json.dumps({'слайдов': len(made), 'папка': os.path.abspath(OUT),
                      'истории': [s[0] for s in STORIES]},
                     ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
