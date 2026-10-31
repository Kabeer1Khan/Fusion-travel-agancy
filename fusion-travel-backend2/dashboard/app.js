/* Fusion Travel admin dashboard (plain JS, no build step).
   Served by the backend at /dashboard, so API calls are same-origin: no CORS setup needed.
   To host the dashboard elsewhere, set window.FT_API_BASE before this script loads. */
(() => {
  'use strict';

  const API = (window.FT_API_BASE || '') + '/api';
  const TOKEN_KEY = 'ft_admin_token';
  const USER_KEY = 'ft_admin_user';

  /* ---------- tiny helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n, cur = 'USD') => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD', maximumFractionDigits: 0 }).format(n || 0); }
    catch { return `$${Math.round(n || 0).toLocaleString()}`; }
  };
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const ago = (d) => {
    const s = (Date.now() - new Date(d).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return fmtDate(d);
  };
  const stars = (n) => '★'.repeat(Math.round(n || 0)) + '☆'.repeat(5 - Math.round(n || 0));
  const ref = (id) => 'FT-' + String(id || '').slice(-6).toUpperCase();
  const debounce = (fn, ms = 350) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);

  const BOOKING_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];
  const PAYMENT_STATUS = ['unpaid', 'paid', 'refunded'];
  const INQUIRY_STATUS = ['new', 'contacted', 'closed'];
  const CATEGORIES = ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Family', 'Luxury', 'Religious', 'City'];

  const statusSelect = (kind, id, value, options) => `
    <select class="status-select s-${esc(value)}" data-change="${kind}" data-id="${esc(id)}" aria-label="${esc(kind)} status">
      ${options.map((o) => `<option value="${o}" ${o === value ? 'selected' : ''}>${cap(o)}</option>`).join('')}
    </select>`;

  /* ---------- API client ---------- */
  const auth = {
    get token() { return localStorage.getItem(TOKEN_KEY); },
    get user() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } },
    set(token, user) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); },
    clear() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  };

  async function api(path, { method = 'GET', body } = {}) {
    let res;
    try {
      res = await fetch(API + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new Error('Cannot reach the server. Is the backend running?');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && auth.token) { auth.clear(); showLogin('Your session expired. Please sign in again.'); }
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  }
  const qs = (o) => {
    const p = new URLSearchParams();
    Object.entries(o).forEach(([k, v]) => { if (v !== '' && v != null) p.set(k, v); });
    const s = p.toString();
    return s ? `?${s}` : '';
  };

  /* ---------- UI primitives ---------- */
  function toast(msg, isErr = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (isErr ? ' err' : '');
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  const modal = $('#modal');
  function openModal(html, cls = '') {
    modal.className = 'modal ' + cls;
    modal.innerHTML = html;
    if (!modal.open) modal.showModal();
  }
  function closeModal() { if (modal.open) modal.close(); }
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const modalShell = (title, body, foot = '') => `
    <div class="modal-head"><h2>${esc(title)}</h2>
      <button class="icon-btn" data-action="close-modal" type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="modal-body">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}`;

  function confirmDialog({ title, text, okLabel = 'Delete', onOk }) {
    openModal(modalShell(title, `<p class="confirm-text">${esc(text)}</p>`,
      `<button class="btn" type="button" data-action="close-modal">Cancel</button>
       <button class="btn btn-danger" type="button" id="confirm-ok">${esc(okLabel)}</button>`));
    $('#confirm-ok').addEventListener('click', async (e) => {
      e.target.disabled = true;
      try { await onOk(); closeModal(); } catch (err) { toast(err.message, true); e.target.disabled = false; }
    });
  }

  const empty = (title, text = '') => `<div class="empty"><b>${esc(title)}</b>${esc(text)}</div>`;
  const pager = (p) => (p && p.pages > 1 ? `
    <div class="pager"><span>Page ${p.page} of ${p.pages} · ${p.total} total</span>
      <span class="spacer">
        <button class="btn btn-sm" data-action="page" data-page="${p.page - 1}" ${p.page <= 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-sm" data-action="page" data-page="${p.page + 1}" ${p.page >= p.pages ? 'disabled' : ''}>Next</button>
      </span></div>` : (p ? `<div class="pager"><span>${p.total} total</span></div>` : ''));

  /* ---------- Auth views ---------- */
  function showLogin(msg) {
    $('#app-view').hidden = true;
    $('#login-view').hidden = false;
    const err = $('#login-error');
    err.hidden = !msg;
    err.textContent = msg || '';
  }
  function showApp() {
    $('#login-view').hidden = true;
    $('#app-view').hidden = false;
    const u = auth.user || {};
    $('#who-name').textContent = u.name || 'Admin';
    $('#who-email').textContent = u.email || '';
    $('#who-avatar').textContent = (u.name || 'A').charAt(0).toUpperCase();
    route();
    refreshBadges();
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#login-btn');
    const err = $('#login-error');
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email: $('#login-email').value.trim(), password: $('#login-password').value } });
      if (!data.user || data.user.role !== 'admin') throw new Error('This account is not an admin. Use the admin email and password.');
      auth.set(data.token, data.user);
      $('#login-password').value = '';
      showApp();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign in';
    }
  });

  /* ---------- Router ---------- */
  const routes = {
    overview: { title: 'Overview', render: renderOverview },
    bookings: { title: 'Bookings', render: renderBookings },
    packages: { title: 'Packages', render: renderPackages },
    inquiries: { title: 'Inquiries', render: renderInquiries },
    reviews: { title: 'Reviews', render: renderReviews },
    customers: { title: 'Customers', render: renderCustomers },
  };
  let current = 'overview';
  let reloadCurrent = () => {};

  function route() {
    if (!auth.token) return showLogin();
    const name = (location.hash.slice(1) || 'overview');
    current = routes[name] ? name : 'overview';
    $$('.nav a').forEach((a) => (a.dataset.route === current ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    $('#page-title').textContent = routes[current].title;
    $('#top-actions').innerHTML = '';
    $('#side').classList.remove('open');
    document.title = `${routes[current].title} · Fusion Travel Admin`;
    $('#view').innerHTML = '<div class="skeleton"></div><div class="skeleton"></div>';
    const token = Symbol();
    route.token = token;
    Promise.resolve(routes[current].render()).catch((err) => {
      if (route.token !== token) return;
      $('#view').innerHTML = `<div class="panel">${empty('Could not load this page', err.message)}</div>`;
    });
  }
  window.addEventListener('hashchange', route);

  async function refreshBadges() {
    try {
      const [b, i] = await Promise.all([
        api('/bookings?status=pending&limit=1'),
        api('/inquiries?status=new'),
      ]);
      const set = (id, n) => { const el = $(id); el.hidden = !n; el.textContent = n; };
      set('#count-bookings', b.total || 0);
      set('#count-inquiries', i.count || 0);
    } catch { /* badges are optional */ }
  }

  /* ======================================================
     OVERVIEW
     ====================================================== */
  const STATUS_COLORS = { pending: '#f0b429', confirmed: '#0e7490', completed: '#2c4a8a', cancelled: '#c0485a' };

  async function renderOverview() {
    const { data: d } = await api('/admin/stats');
    const bs = d.bookings.byStatus;
    const totalB = d.bookings.total || 1;

    $('#view').innerHTML = `
      <div class="metrics">
        <div class="metric"><span>Revenue collected</span><b>${money(d.revenue.paid)}</b><small>${d.revenue.paidCount} paid bookings</small></div>
        <div class="metric"><span>Awaiting payment</span><b>${money(d.revenue.pending)}</b><small>${d.revenue.unpaidCount} unpaid bookings</small></div>
        <div class="metric"><a href="#bookings"><span>Bookings</span><b>${d.bookings.total}</b><small>${bs.pending} pending your review</small></a></div>
        <div class="metric"><a href="#inquiries"><span>Inquiries</span><b>${d.inquiries.total}</b><small>${d.inquiries.new} new, not answered</small></a></div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h2>Last 6 months</h2></div>
          <div class="panel-body">
            ${barChart(d.monthly)}
            <div class="legend"><span><i style="background:#0e7490"></i>Bookings made</span><span><i style="background:#f0b429"></i>Revenue collected</span></div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Bookings by status</h2></div>
          <div class="panel-body">
            <div class="split" role="img" aria-label="Bookings by status">
              ${BOOKING_STATUS.map((s) => `<span style="width:${(bs[s] / totalB) * 100}%;background:${STATUS_COLORS[s]}"></span>`).join('')}
            </div>
            <div class="split-legend">
              ${BOOKING_STATUS.map((s) => `<div><i style="background:${STATUS_COLORS[s]}"></i>${cap(s)}<b>${bs[s]}</b></div>`).join('')}
            </div>
            <hr style="border:0;border-top:1px solid var(--line-2);margin:18px 0">
            <div class="split-legend">
              <div>Packages<b>${d.packages.active}/${d.packages.total}</b></div>
              <div>Featured<b>${d.packages.featured}</b></div>
              <div>Customers<b>${d.customers}</b></div>
              <div>Subscribers<b>${d.subscribers}</b></div>
              <div>Reviews<b>${d.reviews.total}</b></div>
              <div>Avg rating<b>${d.reviews.total ? d.reviews.average.toFixed(1) : '—'}</b></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-eq">
        <div class="panel">
          <div class="panel-head"><h2>Latest bookings</h2><a class="spacer" href="#bookings">View all</a></div>
          ${d.recentBookings.length ? `<ul class="list">${d.recentBookings.map((b) => `
            <li><button class="row-link" data-action="open-booking" data-id="${esc(b._id)}">
              <span class="grow"><b>${esc(b.name || '—')}</b><span>${esc(b.tourPackage?.title || b.packageTitle || 'No package')} · ${b.numberOfTravelers} traveller${b.numberOfTravelers > 1 ? 's' : ''}</span></span>
              <span class="chip s-${esc(b.status)}">${cap(b.status)}</span></button></li>`).join('')}</ul>` : empty('No bookings yet', 'New bookings from the website will show up here.')}
        </div>
        <div class="panel">
          <div class="panel-head"><h2>Latest inquiries</h2><a class="spacer" href="#inquiries">View all</a></div>
          ${d.recentInquiries.length ? `<ul class="list">${d.recentInquiries.map((i) => `
            <li><button class="row-link" data-action="open-inquiry" data-id="${esc(i._id)}">
              <span class="grow"><b>${esc(i.name)}</b><span>${esc(i.subject || i.message)}</span></span>
              <span class="muted" style="font-size:13px">${ago(i.createdAt)}</span></button></li>`).join('')}</ul>` : empty('No inquiries yet', 'Contact form messages will show up here.')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Most booked packages</h2></div>
        ${d.topPackages.length ? `<ul class="list">${d.topPackages.map((p, i) => `
          <li><span class="rank">${i + 1}</span><span class="grow"><b>${esc(p.title || 'Deleted package')}</b><span>${p.bookings} booking${p.bookings > 1 ? 's' : ''}</span></span><b>${money(p.value)}</b></li>`).join('')}</ul>` : empty('Nothing to rank yet')}
      </div>`;
    reloadCurrent = renderOverview;
  }

  function barChart(months) {
    const W = 560, H = 210, padL = 8, padB = 28, padT = 22;
    const maxB = Math.max(1, ...months.map((m) => m.bookings));
    const maxR = Math.max(1, ...months.map((m) => m.revenue));
    const slot = (W - padL) / months.length;
    const bw = Math.min(26, slot / 3);
    const ch = H - padB - padT;
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bookings and revenue per month">
      <line x1="0" x2="${W}" y1="${H - padB}" y2="${H - padB}" stroke="#d6dfe3"/>
      ${months.map((m, i) => {
        const cx = padL + slot * i + slot / 2;
        const h1 = (m.bookings / maxB) * ch;
        const h2 = (m.revenue / maxR) * ch;
        return `
          <rect x="${cx - bw - 2}" y="${H - padB - h1}" width="${bw}" height="${Math.max(h1, m.bookings ? 2 : 0)}" rx="4" fill="#0e7490"/>
          <rect x="${cx + 2}" y="${H - padB - h2}" width="${bw}" height="${Math.max(h2, m.revenue ? 2 : 0)}" rx="4" fill="#f0b429"/>
          ${m.bookings ? `<text class="val" x="${cx - bw / 2 - 2}" y="${H - padB - h1 - 6}" text-anchor="middle">${m.bookings}</text>` : ''}
          <text x="${cx}" y="${H - 8}" text-anchor="middle">${esc(m.label)}</text>`;
      }).join('')}
    </svg>`;
  }

  /* ======================================================
     BOOKINGS
     ====================================================== */
  const bookingState = { page: 1, status: '', paymentStatus: '', search: '' };

  async function renderBookings() {
    $('#view').innerHTML = `
      <div class="panel">
        <div class="panel-head">
          <div class="toolbar">
            <input class="input" id="bk-search" type="search" placeholder="Search name, email, phone or package" value="${esc(bookingState.search)}" aria-label="Search bookings">
            <select class="input" id="bk-status" aria-label="Filter by status"><option value="">All statuses</option>${BOOKING_STATUS.map((s) => `<option value="${s}" ${bookingState.status === s ? 'selected' : ''}>${cap(s)}</option>`).join('')}</select>
            <select class="input" id="bk-pay" aria-label="Filter by payment"><option value="">All payments</option>${PAYMENT_STATUS.map((s) => `<option value="${s}" ${bookingState.paymentStatus === s ? 'selected' : ''}>${cap(s)}</option>`).join('')}</select>
          </div>
        </div>
        <div id="bk-table"><div class="skeleton"></div></div>
      </div>`;
    $('#bk-search').addEventListener('input', debounce((e) => { bookingState.search = e.target.value.trim(); bookingState.page = 1; loadBookings(); }));
    $('#bk-status').addEventListener('change', (e) => { bookingState.status = e.target.value; bookingState.page = 1; loadBookings(); });
    $('#bk-pay').addEventListener('change', (e) => { bookingState.paymentStatus = e.target.value; bookingState.page = 1; loadBookings(); });
    reloadCurrent = loadBookings;
    await loadBookings();
  }

  async function loadBookings() {
    const box = $('#bk-table');
    if (!box) return;
    const res = await api('/bookings' + qs({ ...bookingState, limit: 15 }));
    window.__pager = (n) => { bookingState.page = n; loadBookings(); };
    box.innerHTML = res.data.length ? `
      <div class="table-wrap"><table>
        <thead><tr><th>Ref</th><th>Customer</th><th>Package</th><th>Travel date</th><th class="num">Guests</th><th class="num">Total</th><th>Status</th><th>Payment</th></tr></thead>
        <tbody>${res.data.map((b) => `
          <tr>
            <td><button class="cell-link" data-action="open-booking" data-id="${esc(b._id)}">${ref(b._id)}</button></td>
            <td>${esc(b.name || b.user?.name || '—')}<span class="sub">${esc(b.email || b.phone || '')}</span></td>
            <td>${esc(b.tourPackage?.title || b.packageTitle || '—')}</td>
            <td>${fmtDate(b.travelDate)}</td>
            <td class="num">${b.numberOfTravelers}</td>
            <td class="num">${money(b.totalPrice)}</td>
            <td>${statusSelect('booking-status', b._id, b.status, BOOKING_STATUS)}</td>
            <td>${statusSelect('booking-payment', b._id, b.paymentStatus, PAYMENT_STATUS)}</td>
          </tr>`).join('')}</tbody></table></div>${pager(res)}` : empty('No bookings match', 'Try clearing the search or filters.');
  }

  async function openBooking(id) {
    const { data: b } = await api(`/bookings/${id}`);
    const pkg = b.tourPackage?.title || b.packageTitle || 'Package removed';
    const name = b.name || b.user?.name || 'Guest';
    const email = b.email || b.user?.email;
    const phone = b.phone || b.user?.phone;
    openModal(`
      <div class="pass">
        <button class="icon-btn pass-close" data-action="close-modal" type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        <div class="pass-main">
          <div class="pass-bar"><b>Booking</b><span class="ref">${ref(b._id)}</span></div>
          <div class="route">
            <div><small>Traveller</small><b>${esc(name)}</b></div>
            <span class="route-line" aria-hidden="true"></span>
            <div><small>Package</small><b>${esc(pkg)}</b></div>
          </div>
          <div class="kv-grid">
            <div class="kv"><small>Travel date</small><b>${fmtDate(b.travelDate)}</b></div>
            <div class="kv"><small>Travellers</small><b>${b.numberOfTravelers}</b></div>
            <div class="kv"><small>Total</small><b>${money(b.totalPrice)}</b></div>
            <div class="kv"><small>Booked on</small><b>${fmtDate(b.createdAt)}</b></div>
            <div class="kv"><small>Status</small>${statusSelect('booking-status', b._id, b.status, BOOKING_STATUS)}</div>
            <div class="kv"><small>Payment</small>${statusSelect('booking-payment', b._id, b.paymentStatus, PAYMENT_STATUS)}</div>
            ${b.specialRequests ? `<div class="kv" style="grid-column:1/-1"><small>Special requests</small><b>${esc(b.specialRequests)}</b></div>` : ''}
          </div>
        </div>
        <div class="pass-stub">
          <div class="kv"><small>Email</small><b>${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : '—'}</b></div>
          <div class="kv"><small>Phone</small><b>${phone ? `<a href="tel:${esc(phone)}">${esc(phone)}</a>` : '—'}</b></div>
          <div class="kv"><small>Account</small><b>${b.user ? 'Registered user' : 'Guest booking'}</b></div>
        </div>
      </div>`, 'pass-modal');
  }

  /* ======================================================
     PACKAGES
     ====================================================== */
  const pkgState = { page: 1, search: '', category: '' };

  async function renderPackages() {
    $('#top-actions').innerHTML = '<button class="btn btn-primary" data-action="new-package" type="button">Add package</button>';
    $('#view').innerHTML = `
      <div class="panel">
        <div class="panel-head"><div class="toolbar">
          <input class="input" id="pk-search" type="search" placeholder="Search title, destination or country" value="${esc(pkgState.search)}" aria-label="Search packages">
          <select class="input" id="pk-cat" aria-label="Filter by category"><option value="">All categories</option>${CATEGORIES.map((c) => `<option ${pkgState.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
        </div></div>
        <div id="pk-table"><div class="skeleton"></div></div>
      </div>`;
    $('#pk-search').addEventListener('input', debounce((e) => { pkgState.search = e.target.value.trim(); pkgState.page = 1; loadPackages(); }));
    $('#pk-cat').addEventListener('change', (e) => { pkgState.category = e.target.value; pkgState.page = 1; loadPackages(); });
    reloadCurrent = loadPackages;
    await loadPackages();
  }

  async function loadPackages() {
    const box = $('#pk-table');
    if (!box) return;
    const res = await api('/packages' + qs({ ...pkgState, limit: 10, all: 'true', sort: 'newest' }));
    window.__pager = (n) => { pkgState.page = n; loadPackages(); };
    box.innerHTML = res.data.length ? `
      <div class="table-wrap"><table>
        <thead><tr><th>Package</th><th>Category</th><th class="num">Price</th><th class="num">Days</th><th>Rating</th><th>Visibility</th><th></th></tr></thead>
        <tbody>${res.data.map((p) => `
          <tr>
            <td><b>${esc(p.title)}</b><span class="sub">${esc(p.destination)}${p.country ? ', ' + esc(p.country) : ''}</span></td>
            <td><span class="chip">${esc(p.category)}</span></td>
            <td class="num">${money(p.price, p.currency)}</td>
            <td class="num">${p.durationDays}</td>
            <td>${p.ratingsCount ? `<span class="stars">${stars(p.ratingsAverage)}</span> <span class="sub" style="display:inline">(${p.ratingsCount})</span>` : '<span class="muted">No reviews</span>'}</td>
            <td><span class="chip s-${p.isActive ? 'confirmed' : 'off'}">${p.isActive ? 'Live' : 'Hidden'}</span>${p.featured ? ' <span class="chip s-pending">Featured</span>' : ''}</td>
            <td><div class="actions">
              <button class="btn btn-sm" data-action="edit-package" data-id="${esc(p._id)}">Edit</button>
              <button class="btn btn-sm" data-action="delete-package" data-id="${esc(p._id)}" data-name="${esc(p.title)}">Delete</button>
            </div></td>
          </tr>`).join('')}</tbody></table></div>${pager(res)}` : empty('No packages found', 'Add your first tour package with the button above.');
  }

  function itineraryRow(it = {}) {
    return `<div class="it-row">
      <input class="input it-day" type="number" min="1" placeholder="Day" value="${esc(it.day ?? '')}" aria-label="Day number">
      <input class="input it-title" placeholder="Title" value="${esc(it.title ?? '')}" aria-label="Day title">
      <input class="input it-desc" placeholder="What happens" value="${esc(it.description ?? '')}" aria-label="Day description">
      <button class="icon-btn" type="button" data-action="remove-row" aria-label="Remove day"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>`;
  }

  function openPackageForm(p = null) {
    const v = (k, d = '') => esc(p?.[k] ?? d);
    openModal(`<form id="pkg-form" novalidate>${modalShell(p ? 'Edit package' : 'New package', `
      <input type="hidden" id="pkg-id" value="${esc(p?._id || '')}">
      <p class="form-error" id="pkg-error" hidden></p>
      <div class="form-grid">
        <label class="field wide">Title<input id="pkg-title" value="${v('title')}" required></label>
        <label class="field">Destination<input id="pkg-destination" value="${v('destination')}" required></label>
        <label class="field">Country<input id="pkg-country" value="${v('country')}"></label>
        <label class="field">Category<select id="pkg-category">${CATEGORIES.map((c) => `<option ${(p?.category || 'Family') === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <label class="field">Duration (days)<input id="pkg-duration" type="number" min="1" value="${v('durationDays')}" required></label>
        <label class="field">Price<input id="pkg-price" type="number" min="0" value="${v('price')}" required></label>
        <label class="field">Currency<input id="pkg-currency" value="${v('currency', 'USD')}" maxlength="3"></label>
        <label class="field">Max group size<input id="pkg-max" type="number" min="1" value="${v('maxGroupSize', 20)}"></label>
        <label class="field wide">Description<textarea id="pkg-description" required>${v('description')}</textarea></label>
        <label class="field wide">Included (comma separated)<input id="pkg-inc" value="${esc((p?.inclusions || []).join(', '))}"></label>
        <label class="field wide">Not included (comma separated)<input id="pkg-exc" value="${esc((p?.exclusions || []).join(', '))}"></label>
        <label class="field wide">Image URLs (comma separated)<input id="pkg-images" value="${esc((p?.images || []).join(', '))}" placeholder="https://…"></label>
        <label class="check"><input type="checkbox" id="pkg-featured" ${p?.featured ? 'checked' : ''}>Show as featured</label>
        <label class="check"><input type="checkbox" id="pkg-active" ${p ? (p.isActive !== false ? 'checked' : '') : 'checked'}>Visible on website</label>
        <div class="wide"><div class="field" style="margin-bottom:8px">Itinerary</div>
          <div id="it-rows">${(p?.itinerary || []).map(itineraryRow).join('')}</div>
          <button class="btn btn-sm" type="button" data-action="add-row">Add a day</button></div>
      </div>`,
      `<button class="btn" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="pkg-save">Save package</button>`)}</form>`);
  }

  async function submitPackage(e) {
    e.preventDefault();
    const err = $('#pkg-error');
    const list = (id) => $(id).value.split(',').map((s) => s.trim()).filter(Boolean);
    const body = {
      title: $('#pkg-title').value.trim(),
      destination: $('#pkg-destination').value.trim(),
      country: $('#pkg-country').value.trim(),
      category: $('#pkg-category').value,
      price: Number($('#pkg-price').value),
      currency: ($('#pkg-currency').value.trim() || 'USD').toUpperCase(),
      durationDays: Number($('#pkg-duration').value),
      maxGroupSize: Number($('#pkg-max').value) || 20,
      description: $('#pkg-description').value.trim(),
      inclusions: list('#pkg-inc'), exclusions: list('#pkg-exc'), images: list('#pkg-images'),
      featured: $('#pkg-featured').checked,
      isActive: $('#pkg-active').checked,
      itinerary: $$('#it-rows .it-row').map((r, i) => ({
        day: Number($('.it-day', r).value) || i + 1,
        title: $('.it-title', r).value.trim(),
        description: $('.it-desc', r).value.trim(),
      })).filter((it) => it.title),
    };
    if (!body.title || !body.destination || !body.description || !(body.durationDays >= 1) || Number.isNaN(body.price)) {
      err.textContent = 'Please fill title, destination, description, price and duration.';
      err.hidden = false;
      return;
    }
    const id = $('#pkg-id').value;
    const btn = $('#pkg-save');
    btn.disabled = true;
    try {
      await api(id ? `/packages/${id}` : '/packages', { method: id ? 'PUT' : 'POST', body });
      closeModal();
      toast(id ? 'Package updated' : 'Package created');
      reloadCurrent();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
    }
  }

  /* ======================================================
     INQUIRIES
     ====================================================== */
  const inqState = { status: '' };
  let inquiryCache = [];

  async function renderInquiries() {
    $('#view').innerHTML = `
      <div class="panel">
        <div class="panel-head"><div class="toolbar">
          <select class="input" id="iq-status" aria-label="Filter by status"><option value="">All inquiries</option>${INQUIRY_STATUS.map((s) => `<option value="${s}" ${inqState.status === s ? 'selected' : ''}>${cap(s)}</option>`).join('')}</select>
        </div></div>
        <div id="iq-table"><div class="skeleton"></div></div>
      </div>`;
    $('#iq-status').addEventListener('change', (e) => { inqState.status = e.target.value; loadInquiries(); });
    reloadCurrent = loadInquiries;
    await loadInquiries();
  }

  async function loadInquiries() {
    const box = $('#iq-table');
    if (!box) return;
    const res = await api('/inquiries' + qs(inqState));
    inquiryCache = res.data;
    box.innerHTML = res.data.length ? `
      <div class="table-wrap"><table>
        <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Received</th><th>Status</th></tr></thead>
        <tbody>${res.data.map((i) => `
          <tr>
            <td><button class="cell-link" data-action="open-inquiry" data-id="${esc(i._id)}">${esc(i.name)}</button><span class="sub">${esc(i.email)}</span></td>
            <td>${esc(i.subject || i.tourPackage?.title || '—')}</td>
            <td><div class="clip">${esc(i.message)}</div></td>
            <td>${ago(i.createdAt)}</td>
            <td>${statusSelect('inquiry-status', i._id, i.status, INQUIRY_STATUS)}</td>
          </tr>`).join('')}</tbody></table></div><div class="pager"><span>${res.count} total</span></div>` : empty('No inquiries', 'Messages from the contact form will appear here.');
  }

  async function openInquiry(id) {
    let i = inquiryCache.find((x) => x._id === id);
    if (!i) { const res = await api('/inquiries'); inquiryCache = res.data; i = inquiryCache.find((x) => x._id === id); }
    if (!i) throw new Error('Inquiry not found');
    openModal(modalShell(i.subject || 'Inquiry', `
      <div class="kv-grid">
        <div class="kv"><small>Name</small><b>${esc(i.name)}</b></div>
        <div class="kv"><small>Received</small><b>${fmtDate(i.createdAt)}</b></div>
        <div class="kv"><small>Email</small><b><a href="mailto:${esc(i.email)}">${esc(i.email)}</a></b></div>
        <div class="kv"><small>Phone</small><b>${i.phone ? `<a href="tel:${esc(i.phone)}">${esc(i.phone)}</a>` : '—'}</b></div>
        ${i.tourPackage ? `<div class="kv" style="grid-column:1/-1"><small>About package</small><b>${esc(i.tourPackage.title || '')}</b></div>` : ''}
      </div>
      <div class="kv"><small>Message</small><p style="margin:4px 0 0;white-space:pre-wrap">${esc(i.message)}</p></div>
      <div class="kv"><small>Status</small>${statusSelect('inquiry-status', i._id, i.status, INQUIRY_STATUS)}</div>`,
      `<a class="btn btn-primary" href="mailto:${esc(i.email)}?subject=${encodeURIComponent('Re: ' + (i.subject || 'Your inquiry'))}">Reply by email</a>`));
  }

  /* ======================================================
     REVIEWS
     ====================================================== */
  const revState = { page: 1 };
  async function renderReviews() {
    $('#view').innerHTML = '<div class="panel"><div id="rv-table"><div class="skeleton"></div></div></div>';
    reloadCurrent = loadReviews;
    await loadReviews();
  }
  async function loadReviews() {
    const box = $('#rv-table');
    if (!box) return;
    const res = await api('/admin/reviews' + qs({ ...revState, limit: 15 }));
    window.__pager = (n) => { revState.page = n; loadReviews(); };
    box.innerHTML = res.data.length ? `
      <div class="table-wrap"><table>
        <thead><tr><th>Customer</th><th>Package</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr></thead>
        <tbody>${res.data.map((r) => `
          <tr>
            <td>${esc(r.user?.name || 'Deleted user')}<span class="sub">${esc(r.user?.email || '')}</span></td>
            <td>${esc(r.tourPackage?.title || '—')}</td>
            <td><span class="stars">${stars(r.rating)}</span></td>
            <td><div class="clip">${esc(r.comment || '—')}</div></td>
            <td>${fmtDate(r.createdAt)}</td>
            <td><div class="actions"><button class="btn btn-sm" data-action="delete-review" data-id="${esc(r._id)}">Delete</button></div></td>
          </tr>`).join('')}</tbody></table></div>${pager(res)}` : empty('No reviews yet', 'Customer reviews will appear here.');
  }

  /* ======================================================
     CUSTOMERS (users + newsletter)
     ====================================================== */
  const custState = { tab: 'users', page: 1, search: '' };
  async function renderCustomers() {
    $('#view').innerHTML = `
      <div class="panel">
        <div class="panel-head">
          <div class="tabs" role="tablist">
            <button role="tab" data-action="cust-tab" data-tab="users" aria-selected="${custState.tab === 'users'}">Accounts</button>
            <button role="tab" data-action="cust-tab" data-tab="subscribers" aria-selected="${custState.tab === 'subscribers'}">Newsletter</button>
          </div>
          ${custState.tab === 'users' ? `<input class="input spacer" id="cu-search" type="search" placeholder="Search name or email" value="${esc(custState.search)}" aria-label="Search customers" style="width:240px">` : ''}
        </div>
        <div id="cu-table"><div class="skeleton"></div></div>
      </div>`;
    const s = $('#cu-search');
    if (s) s.addEventListener('input', debounce((e) => { custState.search = e.target.value.trim(); custState.page = 1; loadCustomers(); }));
    reloadCurrent = loadCustomers;
    await loadCustomers();
  }
  async function loadCustomers() {
    const box = $('#cu-table');
    if (!box) return;
    const isUsers = custState.tab === 'users';
    const res = await api(`/admin/${isUsers ? 'users' : 'subscribers'}` + qs({ page: custState.page, limit: 20, search: isUsers ? custState.search : '' }));
    window.__pager = (n) => { custState.page = n; loadCustomers(); };
    box.innerHTML = res.data.length ? (isUsers ? `
      <div class="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>${res.data.map((u) => `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${esc(u.phone || '—')}</td><td><span class="chip ${u.role === 'admin' ? 's-pending' : ''}">${cap(u.role)}</span></td><td>${fmtDate(u.createdAt)}</td></tr>`).join('')}</tbody></table></div>${pager(res)}` : `
      <div class="table-wrap"><table>
        <thead><tr><th>Email</th><th>Subscribed</th></tr></thead>
        <tbody>${res.data.map((s) => `<tr><td>${esc(s.email)}</td><td>${fmtDate(s.createdAt)}</td></tr>`).join('')}</tbody></table></div>${pager(res)}`)
      : empty(isUsers ? 'No customer accounts yet' : 'No subscribers yet');
  }

  /* ======================================================
     Global event delegation (no inline handlers: works with the strict CSP)
     ====================================================== */
  const guard = (fn) => (...a) => Promise.resolve(fn(...a)).catch((err) => toast(err.message, true));

  document.addEventListener('click', guard(async (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const { action, id } = el.dataset;
    switch (action) {
      case 'logout': auth.clear(); showLogin(); location.hash = ''; break;
      case 'toggle-menu': $('#side').classList.toggle('open'); break;
      case 'close-modal': closeModal(); break;
      case 'page': window.__pager?.(Number(el.dataset.page)); break;
      case 'open-booking': await openBooking(id); break;
      case 'open-inquiry': await openInquiry(id); break;
      case 'new-package': openPackageForm(); break;
      case 'edit-package': openPackageForm((await api(`/packages/${id}`)).data); break;
      case 'add-row': $('#it-rows').insertAdjacentHTML('beforeend', itineraryRow({ day: $$('#it-rows .it-row').length + 1 })); break;
      case 'remove-row': el.closest('.it-row').remove(); break;
      case 'delete-package':
        confirmDialog({ title: 'Delete package', text: `Delete “${el.dataset.name}”? Existing bookings keep the package name, but the package disappears from the website.`,
          onOk: async () => { await api(`/packages/${id}`, { method: 'DELETE' }); toast('Package deleted'); reloadCurrent(); } });
        break;
      case 'delete-review':
        confirmDialog({ title: 'Delete review', text: 'This review will be removed and the package rating recalculated.',
          onOk: async () => { await api(`/reviews/${id}`, { method: 'DELETE' }); toast('Review deleted'); reloadCurrent(); } });
        break;
      case 'cust-tab': custState.tab = el.dataset.tab; custState.page = 1; renderCustomers(); break;
      default:
    }
  }));

  document.addEventListener('change', guard(async (e) => {
    const el = e.target.closest('[data-change]');
    if (!el) return;
    const dataset = el.dataset;
    const value = el.value;
    const prev = [...el.classList].find((c) => c.startsWith('s-'));
    try {
      if (dataset.change === 'booking-status') await api(`/bookings/${dataset.id}/status`, { method: 'PATCH', body: { status: value } });
      else if (dataset.change === 'booking-payment') await api(`/bookings/${dataset.id}/status`, { method: 'PATCH', body: { paymentStatus: value } });
      else if (dataset.change === 'inquiry-status') await api(`/inquiries/${dataset.id}/status`, { method: 'PATCH', body: { status: value } });
      if (prev) el.classList.replace(prev, `s-${value}`);
      toast('Saved');
      refreshBadges();
      reloadCurrent();
    } catch (err) {
      toast(err.message, true);
      reloadCurrent();
    }
  }));

  document.addEventListener('submit', (e) => { if (e.target.id === 'pkg-form') guard(submitPackage)(e); });

  /* ---------- boot ---------- */
  if (auth.token && auth.user?.role === 'admin') showApp();
  else showLogin();
})();
