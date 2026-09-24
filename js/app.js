/* ============================================================================
   7D Attraction — сборка страницы из data.js
   ========================================================================== */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ---------------------------------------------------------------- контакты */
function fillInfo(){
  $('#hdrTel').textContent = INFO.phone;
  $('#hdrTel').href  = INFO.phoneHref;
  $('#heroCall').href = INFO.phoneHref;
  $('#contCall').href = INFO.phoneHref;
  $('#heroBadge').href = INFO.mapsUrl;
  $('#revLink').href   = INFO.mapsUrl;
  $('#socMaps').href   = INFO.mapsUrl;
  $('#socVk').href     = INFO.vk;
  $('#contRoute').href = INFO.routeUrl;
  $('#mapFrame').src   = INFO.mapEmbed;
  $('#fCount').textContent = FILMS.length;

  $('#ftrLegal').innerHTML =
    `© ${new Date().getFullYear()} ${esc(INFO.name)} — ${esc(INFO.city)}<br>` +
    `${esc(INFO.legalName)} · ИНН ${esc(INFO.inn)}`;

  const ico = {
    pin:   '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    phone: '<path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
    vk:    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8 9.5c.2 3 1.8 4.6 3.2 5v-5m0 5c1.6-.3 3-1.7 3.4-3.2m-3.4 3.2h.6c1.5 0 2.4 1 3.4 2"/>'
  };

  $('#contList').innerHTML = [
    { i:ico.pin,   l:'Адрес',        v:INFO.addr },
    { i:ico.phone, l:'Телефон',      v:INFO.phone, href:INFO.phoneHref, s:'Бронь аттракциона на дни рождения' },
    { i:ico.clock, l:'Часы работы',  v:INFO.hours },
    { i:ico.vk,    l:'ВКонтакте',    v:'vk.com/7drbk', href:INFO.vk, s:'Наша группа' }
  ].map(c => `
    <div class="ci rise">
      <div class="ci-ico"><svg viewBox="0 0 24 24">${c.i}</svg></div>
      <div>
        <div class="ci-l">${esc(c.l)}</div>
        ${c.href
          ? `<a class="ci-v" href="${esc(c.href)}"${c.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(c.v)}</a>`
          : `<div class="ci-v">${esc(c.v)}</div>`}
        ${c.s ? `<div class="ci-s">${esc(c.s)}</div>` : ''}
      </div>
    </div>`).join('');
}

/* ------------------------------------------------------- как это работает */
function fillHow(){
  const ico = {
    vr:     '<rect x="2.5" y="7" width="19" height="10" rx="3.2"/><path d="M9.6 17c.6-1.5 1.3-2.2 2.4-2.2s1.8.7 2.4 2.2"/><circle cx="7.5" cy="11.6" r="1.1"/><circle cx="16.5" cy="11.6" r="1.1"/>',
    motion: '<path d="M4 15.5h16M6.5 15.5V19M17.5 15.5V19"/><path d="M6.5 15.5 8 7.5h8l1.5 8"/><path d="M2.5 11.5 4.5 13M21.5 11.5 19.5 13"/>',
    wind:   '<path d="M3 8h10a2.6 2.6 0 1 0-2.6-2.6"/><path d="M3 12h14a2.6 2.6 0 1 1-2.6 2.6"/><path d="M3 16h7a2.2 2.2 0 1 1-2.2 2.2"/>'
  };

  $('#fxGrid').innerHTML = RIG.fx.map(f => `
    <article class="fx rise">
      <div class="fx-ico"><svg viewBox="0 0 24 24">${ico[f.id]}</svg></div>
      <h3>${esc(f.name)}</h3>
      <p>${esc(f.desc)}</p>
    </article>`).join('');

  $('#rig').innerHTML = `
    <div class="rig-t">Аттракцион <b>${esc(RIG.model)}</b> производства ${esc(RIG.vendor)}</div>
    <div class="rig-i">${RIG.seats} места на одной подвижной платформе</div>
    <div class="rig-i">Беспроводные шлемы</div>
    <div class="rig-i">Сеанс 2—6 минут</div>`;
}

/* ------------------------------------------------------------------ цены */
function fillPrices(){
  $('#priceGrid').innerHTML = PRICES.map(p => `
    <article class="price rise${p.hl ? ' hl' : ''}">
      <h3>${esc(p.n)}</h3>
      <p>${esc(p.s)}</p>
      <b>${esc(p.p)}</b>
    </article>`).join('');
}

/* -------------------------------------------------------- день рождения */
function fillBday(){
  $('#bdayBox').innerHTML = `
    <div class="bday-txt">
      <span class="sec-kicker">Праздник</span>
      <h2>${BDAY.title}</h2>
      <p>${esc(BDAY.text)}</p>
      <div class="bday-facts">
        ${BDAY.facts.map(f => `<div><b>${esc(f.b)}</b><span>${esc(f.s)}</span></div>`).join('')}
      </div>
      <a class="btn btn-p" href="${esc(INFO.phoneHref)}">Забронировать на праздник</a>
      <p class="bday-note">${esc(BDAY.note)}</p>
    </div>
    <div class="bday-img">
      <img src="img/${esc(BDAY.img)}.webp" alt="" loading="lazy" width="800" height="450">
    </div>`;
}

/* ---------------------------------------------------------------- отзывы */
function fillReviews(){
  $('#revGrid').innerHTML = REVIEWS.slice(0, 6).map(r => `
    <article class="rev rise">
      <p class="rev-q">${esc(r.t)}</p>
      <div class="rev-a">
        <div class="rev-av">${esc(r.a[0])}</div>
        <div>
          <div class="rev-n">${esc(r.a)}</div>
          <div class="rev-d">${esc(r.d)}</div>
        </div>
      </div>
    </article>`).join('');
}

/* --------------------------------------------------------------- каталог */
const AGES = ['0+', '6+', '12+', '16+', '18+'];
const state = { genre:'Все', age:'Любой', q:'' };

function buildChips(){
  const genres = ['Все', ...new Set(FILMS.map(f => f.genre))].sort((a, b) =>
    a === 'Все' ? -1 : b === 'Все' ? 1 : a.localeCompare(b, 'ru'));

  $('#genreChips').innerHTML = genres
    .map(g => `<button class="chip${g === state.genre ? ' on' : ''}" data-g="${esc(g)}">${esc(g)}</button>`).join('');
  $('#ageChips').innerHTML = ['Любой', ...AGES]
    .map(a => `<button class="chip${a === state.age ? ' on' : ''}" data-a="${esc(a)}">${esc(a)}</button>`).join('');

  $('#genreChips').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    state.genre = b.dataset.g;
    $$('#genreChips .chip').forEach(c => c.classList.toggle('on', c === b));
    render();
  };
  $('#ageChips').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    state.age = b.dataset.a;
    $$('#ageChips .chip').forEach(c => c.classList.toggle('on', c === b));
    render();
  };
  $('#q').oninput = e => { state.q = e.target.value.trim().toLowerCase(); render(); };
}

function card(f){
  const ageCls = 'a' + f.age.replace('+', '');
  const bars = f.int
    ? `<div class="card-int" title="Интенсивность ${f.int} из 5">${
        Array.from({ length:5 }, (_, i) => `<i class="${i < f.int ? 'on' : ''}"></i>`).join('')}</div>`
    : '';

  return `
  <article class="card rise">
    <div class="card-img">
      <img src="img/${f.img}.webp" alt="${esc(f.t)}" loading="lazy" width="800" height="450">
      <div class="card-tags">
        ${f.hit ? '<span class="tag tag-hit">ХИТ</span>' : ''}
        <span class="tag tag-age ${ageCls}">${esc(f.age)}</span>
      </div>
    </div>
    <div class="card-b">
      <h3>${esc(f.t)}</h3>
      <div class="card-m">
        <span>${esc(f.genre)}</span>
        ${f.dur !== '—' ? `<span class="dot"></span><span>${esc(f.dur)}</span>` : ''}
        ${bars}
      </div>
    </div>
  </article>`;
}

function render(){
  const list = FILMS.filter(f =>
    (state.genre === 'Все'   || f.genre === state.genre) &&
    (state.age   === 'Любой' || f.age   === state.age)   &&
    (!state.q || f.t.toLowerCase().includes(state.q)));

  $('#grid').innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="empty">Ничего не нашлось. Попробуйте сбросить фильтры или изменить запрос.</p>';

  const word = n => {
    const d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return 'программа';
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'программы';
    return 'программ';
  };
  $('#fcount').innerHTML = `Показано <b>${list.length}</b> ${word(list.length)} из ${FILMS.length}`;

  observeRise();
}

/* ------------------------------------------------- появление при прокрутке
   Блоки проявляются при въезде в экран. Наблюдатель — основной механизм, но
   полагаться только на него нельзя: если он почему-то молчит, посетитель
   увидит пустые секции. Поэтому рядом работает проверка по прокрутке, и она
   отключается сама, когда показывать больше нечего. */

const inView = el => {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight && r.bottom > 0;
};

function sweep(){
  const rest = $$('.rise:not(.in)');
  rest.forEach(el => { if (inView(el)) el.classList.add('in'); });
  if (!$$('.rise:not(.in)').length) removeEventListener('scroll', onScrollSweep);
}

let sweepPending = false;
function onScrollSweep(){
  if (sweepPending) return;
  sweepPending = true;
  setTimeout(() => { sweepPending = false; sweep(); }, 150);
}

let io, ioAlive = false;
function observeRise(){
  if ('IntersectionObserver' in window) {
    if (!io) {
      io = new IntersectionObserver(es => {
        ioAlive = true;                    /* наблюдатель отозвался — он жив */
        es.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin:'0px 0px -40px 0px' });
    }
    $$('.rise:not(.in)').forEach(el => io.observe(el));
  }

  addEventListener('scroll', onScrollSweep, { passive:true });
  sweep();
}

/* Последний рубеж. Наблюдатель всегда присылает первый ответ сразу после
   подписки — даже про блоки за экраном. Если через четыре секунды ответа так
   и не было, значит механизм мёртв: показываем страницу целиком без анимации.
   В живом браузере это не срабатывает и анимацию не портит. */
setTimeout(() => {
  if (!ioAlive) {
    /* Снимаем класс js — правило, которое прячет блоки, перестаёт применяться,
       и содержимое появляется сразу, не дожидаясь плавного перехода. */
    document.documentElement.classList.remove('js');
    removeEventListener('scroll', onScrollSweep);
  }
}, 4000);

/* --------------------------------------------------------- шапка и меню */
function initHeader(){
  const hdr = $('#hdr'), nav = $('#nav'), burger = $('#burger');

  const onScroll = () => hdr.classList.toggle('stuck', scrollY > 20);
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  burger.onclick = () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open);
  };
  nav.onclick = e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.classList.remove('on');
      burger.setAttribute('aria-expanded', 'false');
    }
  };
}

/* ------------------------------------------------------------------ старт */
fillInfo();
fillHow();
fillPrices();
fillBday();
fillReviews();
buildChips();
render();
initHeader();
observeRise();
