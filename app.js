/* ============================================================
   SAHARA LAB — API Client Layer  (v2.1)
   Strategy: Cache all bookings locally after each fetch.
   Sync-looking getters (getAllBookings, getBooking, etc.) read
   from the in-memory cache so existing HTML pages need ZERO
   changes. Writes (createBooking, updateBooking, etc.) hit
   the API and refresh the cache automatically.
   ============================================================ */

const SaharaApp = (() => {
  'use strict';

  const API = 'http://localhost:4000/api';

  // ============================================================
  // IN-MEMORY CACHE
  // ============================================================
  let _bookings       = [];   // all bookings, refreshed on every write
  let _catalogueCache = null; // test catalogue, fetched once

  // ============================================================
  // LOW-LEVEL FETCH HELPER
  // ============================================================
  const _req = async (method, path, body) => {
    const token = localStorage.getItem('sl_token');
    const opts  = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const res  = await fetch(`${API}${path}`, opts);
    const data = await res.json();

    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
    return data;
  };

  const _get   = (path)       => _req('GET',   path);
  const _post  = (path, body) => _req('POST',  path, body);
  const _patch = (path, body) => _req('PATCH', path, body);

  // ============================================================
  // CACHE REFRESH HELPERS
  // ============================================================
  const _refreshBookings = async () => {
    try {
      const user = getCurrentUser();
      let data;
      if (user?.role === 'admin') {
        data = await _get('/bookings');
        _bookings = data.bookings;
      } else if (user?.role === 'labboy') {
        data = await _get('/bookings/my/list');
        _bookings = data.bookings;
      } else {
        _bookings = [];
      }
    } catch {
      _bookings = [];
    }
  };

  // ============================================================
  // INIT  (call on every page load — awaits catalogue + bookings)
  // ============================================================
  const init = async () => {
    // Load test catalogue
    if (!_catalogueCache) {
      try {
        const data    = await _get('/tests');
        _catalogueCache = data.tests;
      } catch {
        _catalogueCache = [];
      }
    }

    // Load bookings if user is already logged in
    const user = getCurrentUser();
    if (user) await _refreshBookings();
  };

  // ============================================================
  // AUTHENTICATION
  // ============================================================
  const loginAdmin = async (username, password) => {
    try {
      const data = await _post('/auth/admin-login', { username, password });
      localStorage.setItem('sl_token',   data.token);
      localStorage.setItem('sl_session', JSON.stringify(data.user));
      await _refreshBookings();
      return data.user;
    } catch {
      return null;
    }
  };

  const loginLabBoy = async (pin) => {
    try {
      const data = await _post('/auth/labboy-login', { pin });
      localStorage.setItem('sl_token',   data.token);
      localStorage.setItem('sl_session', JSON.stringify(data.user));
      await _refreshBookings();
      return data.user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_session');
    _bookings = [];
  };

  const getCurrentUser = () => {
    try { return JSON.parse(localStorage.getItem('sl_session')); } catch { return null; }
  };

  const requireAuth = (role) => {
    const u = getCurrentUser();
    if (!u) return null;
    if (role && u.role !== role) return null;
    return u;
  };

  // ============================================================
  // BOOKING SYNC GETTERS  (read from cache — no await needed)
  // ============================================================
  const getAllBookings = ()     => _bookings;
  const getBooking    = (id)   => {
    if (!id) return null;
    return _bookings.find(b => b.id.toUpperCase() === id.toUpperCase()) || null;
  };
  const searchBookings = (query) => {
    const q = (query || '').toLowerCase();
    return _bookings.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.patient.name.toLowerCase().includes(q) ||
      b.patient.phone.includes(q)
    );
  };
  const getBookingsForLabBoy = () => _bookings;

  // ============================================================
  // BOOKING WRITES  (hit API then refresh cache)
  // ============================================================
  const createBooking = async (data) => {
    const res = await _post('/bookings', data);
    await _refreshBookings();
    return res.booking;
  };

  const updateBooking = async (id, updates) => {
    // Map old-style status updates to specific endpoints
    if (updates.status === 'collected') {
      const res = await _patch(`/bookings/${id}/collect`, {
        collectionNotes: updates.collectionNotes || '',
        testIds:         updates.tests || [],
      });
      await _refreshBookings();
      return res.booking;
    }
    if (updates.status === 'processing') {
      const res = await _patch(`/bookings/${id}/process`, {});
      await _refreshBookings();
      return res.booking;
    }
    if (updates.status === 'ready') {
      const res = await _patch(`/bookings/${id}/process`, {});
      await _refreshBookings();
      return res.booking;
    }
    const res = await _patch(`/bookings/${id}`, updates);
    await _refreshBookings();
    return res.booking;
  };

  const assignBooking = async (bookingId, staffId, testIds = []) => {
    const res = await _patch(`/bookings/${bookingId}/assign`, { staffId, testIds });
    await _refreshBookings();
    return res.booking;
  };

  const collectSample = async (bookingId, collectionNotes = '', testIds = []) => {
    const res = await _patch(`/bookings/${bookingId}/collect`, { collectionNotes, testIds });
    await _refreshBookings();
    return res.booking;
  };

  const markProcessing = async (bookingId) => {
    const res = await _patch(`/bookings/${bookingId}/process`, {});
    await _refreshBookings();
    return res.booking;
  };

  const saveReport = async (bookingId, reportData) => {
    const res = await _patch(`/bookings/${bookingId}/report`, reportData);
    await _refreshBookings();
    return res.booking;
  };

  // ============================================================
  // PATIENT ANALYTICS
  // ============================================================
  const getPatientAnalytics = async (identifier) => {
    if (!identifier) return null;
    const res = await _get(`/patient/analytics?identifier=${encodeURIComponent(identifier)}`);
    return res;
  };

  // ============================================================
  // STAFF  (async — used in admin modals)
  // ============================================================
  const getStaff = async () => {
    const res = await _get('/staff');
    return res.staff;
  };

  const getLabBoys = async () => {
    const res = await _get('/staff/labboys');
    return res.labboys;
  };

  const getStaffById = async (id) => {
    const res = await _get(`/staff/${id}`);
    return res.staff;
  };

  // ============================================================
  // UTILITIES  (identical to v1.0)
  // ============================================================
  const fmtDate = (str) => {
    if (!str) return 'N/A';
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const fmtDateTime = (str) => {
    if (!str) return 'N/A';
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const fmtTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const STATUS_LABELS = {
    booked: 'Booked', assigned: 'Assigned', collected: 'Sample Collected',
    processing: 'Processing', ready: 'Report Ready',
  };
  const STATUS_ICONS = {
    booked: '🕐', assigned: '👤', collected: '🧪', processing: '⚗️', ready: '✅',
  };

  const statusLabel = (s) => STATUS_LABELS[s] || s;
  const statusIcon  = (s) => STATUS_ICONS[s]  || '•';
  const badgeHtml   = (status) => `<span class="badge badge-${status}">${statusLabel(status)}</span>`;

  // ============================================================
  // TEST CATALOGUE  (sync reads from cache)
  // ============================================================
  const getTestById   = (id) => (_catalogueCache || []).find(t => t.id === id) || null;
  const getSubTestRef = (sub, gender) => {
    if (gender === 'male'   && sub.refMale)   return sub.refMale;
    if (gender === 'female' && sub.refFemale) return sub.refFemale;
    if (sub.refMale && sub.refFemale) return `${sub.refMale} (M) / ${sub.refFemale} (F)`;
    return sub.ref || '';
  };

  // ============================================================
  // TOAST / MODAL  (unchanged)
  // ============================================================
  const showToast = (msg, type = 'success', ms = 3500) => {
    let box = document.querySelector('.toast-container');
    if (!box) {
      box = document.createElement('div');
      box.className = 'toast-container';
      document.body.appendChild(box);
    }
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span style="font-size:1.1rem">${icons[type] || '✓'}</span><span>${msg}</span>`;
    box.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, ms);
  };

  const openModal  = (id) => { const el = document.getElementById(id); if (el) el.classList.add('open'); };
  const closeModal = (id) => { const el = document.getElementById(id); if (el) el.classList.remove('open'); };

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
  });

  // ============================================================
  // PUBLIC API
  // ============================================================
  return {
    init,
    refreshBookings: _refreshBookings,
    // Auth  (async)
    loginAdmin, loginLabBoy, logout, getCurrentUser, requireAuth,
    // Bookings — SYNC getters (read cache)
    getAllBookings, getBooking, searchBookings, getBookingsForLabBoy,
    // Bookings — ASYNC writes
    createBooking, updateBooking, assignBooking, collectSample, markProcessing, saveReport,
    // Patient Analytics
    getPatientAnalytics,
    // Staff  (async)
    getStaff, getLabBoys, getStaffById,
    // Formatting
    fmtDate, fmtDateTime, fmtTime, statusLabel, statusIcon, badgeHtml,
    // Tests  (sync from cache)
    get TEST_CATALOGUE() { return _catalogueCache || []; },
    getTestById, getSubTestRef,
    // UI helpers
    showToast, openModal, closeModal,
  };
})();
