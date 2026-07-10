/* ==========================================================================
   SkyLord — script.js
   Единственный файл, который нужно редактировать владельцу сервера.
   Все настраиваемые значения собраны в CONFIG и DATA ниже.
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. КОНФИГУРАЦИЯ — редактируйте здесь
   ========================================================================== */
const CONFIG = {
  // IP сервера. Оставьте пустым '' — сайт сам включит демонстрационный режим,
  // как только впишете реальный адрес (например, 'play.skylord.ru'), сайт
  // начнёт опрашивать публичное API mcsrvstat.us и покажет настоящий онлайн.
  SERVER_IP: '',
  SERVER_PORT: '', // укажите, если порт отличается от стандартного 25565
  SERVER_VERSION: '1.21.x',

  // Источник данных о статусе сервера. Поддерживается mcsrvstat.us (CORS-friendly).
  STATUS_API: 'https://api.mcsrvstat.us/3/',

  // Как часто опрашивать статус сервера и обновлять онлайн (мс)
  STATUS_UPDATE_INTERVAL: 15000,

  // Фейковый (накрученный) онлайн — включается одной переменной.
  FAKE_ONLINE_ENABLED: true,
  FAKE_ONLINE_MIN_BOOST: 340,
  FAKE_ONLINE_MAX_BOOST: 520,

  MAX_ONLINE: 4000,
  RECORD_ONLINE: 3218,

  // Дата и время окончания акции (локальное время посетителя)
  DISCOUNT_END: '2026-08-01T00:00:00',

  // Источник последних покупок: локальный JSON-файл, который можно
  // редактировать вручную, либо URL собственного API, отдающего такой же формат.
  PURCHASES_SOURCE: 'purchases.json',
  PURCHASES_UPDATE_INTERVAL: 20000,
  PURCHASES_LIMIT: 8,

  // Ссылки на покупку. duration: 'month' | 'quarter' | 'forever'
  // Замените на ссылку своего магазина/платёжной системы —
  // {tier} и {duration} подставятся автоматически.
  SHOP_BUY_URL: 'https://discord.gg/skylord?tier={tier}&duration={duration}',

  SOCIAL: {
    discord: 'https://discord.gg/skylord',
    telegram: 'https://t.me/skylord',
    vk: 'https://vk.com/skylord',
  },

  STATS: {
    players: 18420,
    privileges: 6137,
    uptimeDays: 742,
  },
};

/* ==========================================================================
   2. КОНТЕНТ — тарифы, преимущества, FAQ
   ========================================================================== */
const DATA = {
  shopTiers: [
    { id: 'baron',   name: 'Барон',   desc: 'Первый шаг во власти. Косметика и базовые бонусы для старта.', month: 15,   quarter: 29,   forever: 59 },
    { id: 'hero',    name: 'Герой',   desc: 'Больше домов, доступ к приватным ивентам и цветной ник.',       month: 39,   quarter: 89,   forever: 139 },
    { id: 'chief',   name: 'Глава',   desc: 'Расширенные команды строительства и личный маркер на карте.',   month: 69,   quarter: 139,  forever: 199 },
    { id: 'lord',    name: 'Владыка', desc: 'Полёт в своём мире, доступ к закрытым ресурс-мирам.',           month: 139,  quarter: 239,  forever: 319, featured: true },
    { id: 'dragon',  name: 'Драгон',  desc: 'Уникальные питомцы, увеличенные лимиты и приоритет в очереди.', month: 239,  quarter: 379,  forever: 529 },
    { id: 'titan',   name: 'Титан',   desc: 'Собственный /warp, безлимитный крафт и эксклюзивные текстуры.', month: 379,  quarter: 619,  forever: 899 },
    { id: 'king',    name: 'Царь',    desc: 'Приватный остров, личный слот на ивентах и голос в решениях.',  month: 619,  quarter: 1289, forever: 1999 },
    { id: 'custom',  name: 'Кастом',  desc: 'Индивидуальный набор привилегий под ваши задачи и пожелания.',  month: 1289, quarter: 2319, forever: 4999 },
  ],

  features: [
    { icon: '⚡', title: 'Высокий TPS', desc: 'Оптимизированное железо и настройка ядра держат стабильные 20 TPS даже в пиковый онлайн.' },
    { icon: '🛡️', title: 'Честный античит', desc: 'Собственная система защиты ловит читеров без ложных банов обычных игроков.' },
    { icon: '🧩', title: 'Уникальные механики', desc: 'Авторские плагины и мини-игры, которых нет на других серверах.' },
    { icon: '🏝️', title: 'Красивые миры', desc: 'Кастомная генерация островов и биомов — есть на что посмотреть.' },
    { icon: '📶', title: 'Без лагов', desc: 'Раздельные сервера под лобби, выживание и ивенты — нагрузка не пересекается.' },
    { icon: '💬', title: 'Быстрая поддержка', desc: 'Модерация и техподдержка на связи в Discord каждый день.' },
  ],

  faq: [
    { q: 'Как зайти на сервер?', a: 'Скопируйте IP из блока «Подключение», откройте Minecraft, выберите «Добавить сервер» и вставьте адрес. Поддерживаются Java и Bedrock издания.' },
    { q: 'Какая версия Minecraft нужна?', a: 'Сервер работает на версии ' + CONFIG.SERVER_VERSION + '. Рекомендуем использовать актуальный лаунчер, чтобы не было проблем с подключением.' },
    { q: 'Что даёт привилегия?', a: 'В зависимости от уровня — от косметических бонусов до расширенных строительных команд, приватных миров и уникальных механик. Подробности в карточке каждого тарифа.' },
    { q: 'Можно ли вернуть деньги за привилегию?', a: 'Возврат возможен в течение 24 часов после покупки, если привилегия не была использована. Подробности — в пользовательском соглашении.' },
    { q: 'Как долго действует привилегия?', a: 'Выбирайте срок при покупке: 1 месяц, 3 месяца или навсегда. Таймер отображается в личном кабинете после покупки.' },
    { q: 'Есть ли античит и как он работает?', a: 'Да, на сервере работает собственная система защиты от чит-клиентов и дюпов, которая проверяется и обновляется вручную командой SkyLord.' },
  ],
};

/* ==========================================================================
   3. Вспомогательные утилиты
   ========================================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function formatNumber(n) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n));
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} мин назад`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} ч назад`;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) +
    ' в ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

/* ==========================================================================
   4. Toast-уведомления
   ========================================================================== */
function showToast(message, type = 'default') {
  const container = $('#toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast${type !== 'default' ? ' toast--' + type : ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}

/* ==========================================================================
   5. Header: тень при скролле, бургер-меню, активная ссылка
   ========================================================================== */
function initHeader() {
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger');
  const mobileNav = $('#mobile-nav');
  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('#mobile-nav a').forEach((a) => a.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  const sections = $$('main section[id]');
  const navLinks = $$('[data-nav-link]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
}

/* ==========================================================================
   6. Reveal-анимации при появлении блоков в вьюпорте
   ========================================================================== */
function initReveal() {
  const items = $$('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach((el) => io.observe(el));
}

/* ==========================================================================
   7. Частицы на фоне (лёгкий canvas, без библиотек)
   ========================================================================== */
function initParticles() {
  const canvas = $('#particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height, dpr;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    particles = Array.from({ length: count }, () => spawn());
  }

  function spawn() {
    const isViolet = Math.random() > 0.5;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.6 + 0.6) * dpr,
      vy: -(Math.random() * 0.25 + 0.06) * dpr,
      vx: (Math.random() - 0.5) * 0.1 * dpr,
      alpha: Math.random() * 0.5 + 0.15,
      color: isViolet ? '155,92,255' : '77,127,255',
    };
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (!reduceMotion) requestAnimationFrame(tick);
}

/* ==========================================================================
   8. Копирование IP
   ========================================================================== */
function initCopyIP() {
  const buttons = $$('[data-copy-ip]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = $(btn.getAttribute('data-copy-target'));
      const ip = CONFIG.SERVER_IP || (target ? target.textContent.trim() : '');
      if (!CONFIG.SERVER_IP) {
        showToast('IP сервера скоро будет добавлен — следите за новостями в Discord', 'error');
        return;
      }
      const full = CONFIG.SERVER_PORT ? `${ip}:${CONFIG.SERVER_PORT}` : ip;
      try {
        await navigator.clipboard.writeText(full);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = full;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(`IP «${full}» скопирован в буфер обмена ✅`, 'success');
    });
  });
}

/* ==========================================================================
   9. Таймер акции
   ========================================================================== */
function initCountdown() {
  const end = new Date(CONFIG.DISCOUNT_END).getTime();
  const els = {
    days: $('#t-days'), hours: $('#t-hours'), mins: $('#t-mins'), secs: $('#t-secs'),
  };
  if (!els.days || isNaN(end)) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = end - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(d);
    els.hours.textContent = pad(h);
    els.mins.textContent = pad(m);
    els.secs.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   10. Статус сервера и онлайн (mcsrvstat.us), с демо-режимом
   ========================================================================== */
const serverState = {
  online: true,
  realOnline: 0,
  fakeOnline: 0,
  ping: null,
};

function setStatusUI({ online, realOnline, ping }) {
  serverState.online = online;
  serverState.realOnline = realOnline;
  serverState.ping = ping;

  const boost = CONFIG.FAKE_ONLINE_ENABLED
    ? Math.round(CONFIG.FAKE_ONLINE_MIN_BOOST + Math.random() * (CONFIG.FAKE_ONLINE_MAX_BOOST - CONFIG.FAKE_ONLINE_MIN_BOOST))
    : 0;
  serverState.fakeOnline = realOnline + boost;

  const dot = $('#status-dot');
  const heroDot = $('#hero-status-dot');
  [dot, heroDot].forEach((d) => d && d.classList.toggle('is-offline', !online));

  $('#status-value').textContent = online ? 'Онлайн' : 'Недоступен';
  $('#hero-status-text').textContent = online ? 'Сервер онлайн' : 'Сервер временно недоступен';
  $('#status-updated').textContent = 'обновлено ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  $('#online-real').textContent = formatNumber(realOnline);
  $('#hero-online-value').textContent = formatNumber(realOnline);
  $('#online-fake').textContent = formatNumber(serverState.fakeOnline);
  $('#online-max').textContent = formatNumber(CONFIG.MAX_ONLINE);
  $('#online-record').textContent = formatNumber(CONFIG.RECORD_ONLINE);
  $('#server-ping').textContent = ping != null ? `${ping} мс` : '—';
  $('#c-online-live').textContent = formatNumber(realOnline);

  const ipValueEl = $('#server-ip-value');
  if (ipValueEl) ipValueEl.textContent = CONFIG.SERVER_IP || 'будет добавлен позже';
  const versionEl = $('#server-version');
  if (versionEl) versionEl.textContent = CONFIG.SERVER_VERSION;
}

async function pollServerStatus() {
  // Демо-режим: IP ещё не указан владельцем сайта.
  if (!CONFIG.SERVER_IP) {
    const demoOnline = Math.round(180 + Math.random() * 60 + Math.sin(Date.now() / 90000) * 30);
    setStatusUI({ online: true, realOnline: clamp(demoOnline, 40, CONFIG.MAX_ONLINE), ping: Math.round(28 + Math.random() * 14) });
    return;
  }

  const address = CONFIG.SERVER_PORT ? `${CONFIG.SERVER_IP}:${CONFIG.SERVER_PORT}` : CONFIG.SERVER_IP;
  const started = performance.now();
  try {
    const res = await fetch(CONFIG.STATUS_API + encodeURIComponent(address), { cache: 'no-store' });
    const ping = Math.round(performance.now() - started);
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    setStatusUI({
      online: !!data.online,
      realOnline: data.online && data.players ? (data.players.online || 0) : 0,
      ping,
    });
    if (data.online && data.players && data.players.max) {
      CONFIG.MAX_ONLINE = data.players.max;
    }
  } catch (err) {
    setStatusUI({ online: false, realOnline: 0, ping: null });
  }
}

function initServerStatus() {
  pollServerStatus();
  setInterval(pollServerStatus, CONFIG.STATUS_UPDATE_INTERVAL);
}

/* ==========================================================================
   11. Магазин привилегий
   ========================================================================== */
function crownIcon(level) {
  // Чем выше тариф, тем больше «зубцов» короны — визуальная прогрессия уровня.
  const spikes = clamp(level + 1, 2, 8);
  const w = 40, baseY = 30, topY = 10;
  let path = `M4 ${baseY} `;
  const step = (w - 8) / (spikes * 2);
  for (let i = 0; i <= spikes * 2; i++) {
    const x = 4 + step * i;
    const y = i % 2 === 0 ? baseY : topY + (i / (spikes * 2)) * 4;
    path += `L${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  path += `L36 ${baseY} Z`;
  return `<svg width="26" height="22" viewBox="0 0 40 34" fill="none">
    <path d="${path}" fill="url(#tierGrad${level})"/>
    <defs><linearGradient id="tierGrad${level}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6ea8ff"/><stop offset="1" stop-color="#b98bff"/>
    </linearGradient></defs>
  </svg>`;
}

function renderShop() {
  const grid = $('#shop-grid');
  if (!grid) return;
  grid.innerHTML = DATA.shopTiers.map((tier, i) => `
    <article class="shop-card${tier.featured ? ' is-featured' : ''}" style="--tier-glow:${i % 2 === 0 ? 'var(--blue)' : 'var(--violet)'}">
      ${tier.featured ? '<span class="shop-card-badge">Хит продаж</span>' : ''}
      <span class="shop-card-icon">${crownIcon(i)}</span>
      <h3 class="shop-card-name">${tier.name}</h3>
      <p class="shop-card-desc">${tier.desc}</p>
      <div class="shop-card-prices" role="radiogroup" aria-label="Срок действия — ${tier.name}">
        <label class="price-row is-selected">
          <input type="radio" name="duration-${tier.id}" value="month" checked>
          <span class="price-row-label">1 месяц</span>
          <span class="price-row-value">${tier.month} ₽</span>
        </label>
        <label class="price-row">
          <input type="radio" name="duration-${tier.id}" value="quarter">
          <span class="price-row-label">3 месяца</span>
          <span class="price-row-value">${tier.quarter} ₽</span>
        </label>
        <label class="price-row">
          <input type="radio" name="duration-${tier.id}" value="forever">
          <span class="price-row-label">Навсегда</span>
          <span class="price-row-value">${tier.forever} ₽</span>
        </label>
      </div>
      <a class="btn btn--primary shop-card-cta" href="${CONFIG.SHOP_BUY_URL.replace('{tier}', tier.id).replace('{duration}', 'month')}" data-buy-link="${tier.id}" target="_blank" rel="noopener">Купить</a>
    </article>
  `).join('');

  // Переключение срока действия обновляет ссылку покупки и подсветку.
  $$('.shop-card').forEach((card) => {
    const rows = $$('.price-row', card);
    const link = $('[data-buy-link]', card);
    rows.forEach((row) => {
      row.addEventListener('click', () => {
        rows.forEach((r) => r.classList.remove('is-selected'));
        row.classList.add('is-selected');
        const duration = $('input', row).value;
        const tierId = link.getAttribute('data-buy-link');
        link.href = CONFIG.SHOP_BUY_URL.replace('{tier}', tierId).replace('{duration}', duration);
      });
    });
  });
}

/* ==========================================================================
   12. Последние покупки
   ========================================================================== */
function initials(nick) {
  return nick.replace(/[^a-zA-Zа-яА-Я0-9]/g, '').slice(0, 2).toUpperCase() || '??';
}

function renderPurchases(list) {
  const container = $('#purchases-list');
  if (!container) return;
  if (!list || !list.length) {
    container.innerHTML = '<div class="purchases-empty">Пока покупок нет — станьте первым!</div>';
    return;
  }
  container.innerHTML = list.slice(0, CONFIG.PURCHASES_LIMIT).map((p) => `
    <div class="purchase-row">
      <span class="purchase-nick"><span class="purchase-avatar">${initials(p.nick)}</span>${p.nick}</span>
      <span class="purchase-tag">${p.privilege}</span>
      <span class="purchase-price">${p.price}</span>
      <span class="purchase-date">${formatDate(p.date)}</span>
    </div>
  `).join('');
}

async function loadPurchases() {
  try {
    const res = await fetch(CONFIG.PURCHASES_SOURCE, { cache: 'no-store' });
    if (!res.ok) throw new Error('purchases fetch failed');
    const data = await res.json();
    const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderPurchases(sorted);
  } catch (err) {
    const loading = $('#purchases-loading');
    if (loading) loading.textContent = 'Не удалось загрузить покупки. Проверьте файл purchases.json.';
  }
}

function initPurchases() {
  loadPurchases();
  setInterval(loadPurchases, CONFIG.PURCHASES_UPDATE_INTERVAL);
}

/* ==========================================================================
   13. Счётчики статистики (count-up при появлении)
   ========================================================================== */
function animateCount(el, target, duration = 1600) {
  const start = performance.now();
  function frame(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(target * eased);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = formatNumber(target);
  }
  requestAnimationFrame(frame);
}

function initCounters() {
  $('#c-players').setAttribute('data-count-target', CONFIG.STATS.players);
  $('#c-privileges').setAttribute('data-count-target', CONFIG.STATS.privileges);
  $('#c-uptime').setAttribute('data-count-target', CONFIG.STATS.uptimeDays);
  $('#c-record').setAttribute('data-count-target', CONFIG.RECORD_ONLINE);

  const counters = $$('.counter-value[data-count-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateCount(el, Number(el.getAttribute('data-count-target')));
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => io.observe(el));
}

/* ==========================================================================
   14. Преимущества сервера
   ========================================================================== */
function renderFeatures() {
  const grid = $('#feature-grid');
  if (!grid) return;
  grid.innerHTML = DATA.features.map((f) => `
    <div class="feature-card">
      <span class="feature-icon">${f.icon}</span>
      <h3 class="feature-title">${f.title}</h3>
      <p class="feature-desc">${f.desc}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   15. FAQ-аккордеон
   ========================================================================== */
function renderFAQ() {
  const list = $('#faq-list');
  if (!list) return;
  list.innerHTML = DATA.faq.map((item, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${item.q}</span>
        <span class="faq-q-icon" aria-hidden="true"></span>
      </button>
      <div class="faq-a" id="faq-a-${i}">
        <div class="faq-a-inner">${item.a}</div>
      </div>
    </div>
  `).join('');

  $$('.faq-item').forEach((item) => {
    const btn = $('.faq-q', item);
    const answer = $('.faq-a', item);
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      $$('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        $('.faq-q', other).setAttribute('aria-expanded', 'false');
        $('.faq-a', other).style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   16. Соцсети в футере
   ========================================================================== */
const SOCIAL_ICONS = {
  discord: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 6.5C18.6 5.8 17.1 5.3 15.5 5L15.2 5.6C16.6 5.9 17.9 6.4 19.1 7.1C17.4 6.2 15.5 5.7 13.5 5.5C13 5.45 12.5 5.45 12 5.5C10 5.7 8.1 6.2 6.4 7.1C7.6 6.4 8.9 5.9 10.3 5.6L10 5C8.4 5.3 6.9 5.8 5.5 6.5C3.6 9.7 3 12.9 3.2 16C4.6 17.1 6.2 17.9 7.9 18.4L8.4 17.5C7.6 17.2 6.9 16.8 6.2 16.3C6.4 16.5 6.6 16.6 6.8 16.7C8.4 17.5 10.2 18 12 18C13.8 18 15.6 17.5 17.2 16.7C17.4 16.6 17.6 16.5 17.8 16.3C17.1 16.8 16.4 17.2 15.6 17.5L16.1 18.4C17.8 17.9 19.4 17.1 20.8 16C21.1 12.4 20.2 9.2 20 6.5ZM9.5 14C8.7 14 8 13.2 8 12.3C8 11.4 8.7 10.6 9.5 10.6C10.3 10.6 11 11.4 11 12.3C11 13.2 10.3 14 9.5 14ZM14.5 14C13.7 14 13 13.2 13 12.3C13 11.4 13.7 10.6 14.5 10.6C15.3 10.6 16 11.4 16 12.3C16 13.2 15.3 14 14.5 14Z" fill="currentColor"/></svg>',
  telegram: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M21 4L2.5 11.5C1.7 11.8 1.7 12.7 2.5 13L7.2 14.6L9 20.4C9.2 21 10 21.1 10.4 20.6L12.8 17.9L17.6 21.4C18.2 21.8 19 21.5 19.2 20.8L22 5.2C22.2 4.3 21.8 3.7 21 4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7.2 14.6L17.5 7.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  vk: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13.2 17C7.8 17 4.6 13.3 4.5 7H7.5C7.6 11.5 9.6 13.4 11.1 13.8V7H14V10.6C15.5 10.4 17 8.7 17.5 7H20.3C19.9 9.1 18.3 10.8 17.1 11.5C18.3 12.1 20.1 13.6 20.8 17H17.7C17.2 15.4 15.9 14.1 14 13.9V17H13.2Z" fill="currentColor"/></svg>',
};

function renderSocial() {
  const row = $('#social-row');
  if (!row) return;
  row.innerHTML = Object.entries(CONFIG.SOCIAL).map(([key, url]) => `
    <a class="social-link" href="${url}" target="_blank" rel="noopener" aria-label="${key}">${SOCIAL_ICONS[key] || ''}</a>
  `).join('');
}

/* ==========================================================================
   17. Кнопка «наверх»
   ========================================================================== */
function initBackToTop() {
  const btn = $('#to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 700);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==========================================================================
   18. Инициализация
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  $('#footer-year').textContent = new Date().getFullYear();

  initHeader();
  initBackToTop();
  initCopyIP();
  initCountdown();
  initParticles();

  renderShop();
  renderFeatures();
  renderFAQ();
  renderSocial();

  initServerStatus();
  initPurchases();
  initCounters();

  // data-reveal вешаем последним, чтобы к моменту наблюдения контент уже был в DOM
  initReveal();
});
