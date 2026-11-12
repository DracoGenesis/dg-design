/* Draco Genesis UI behaviours — optional, dependency-free, progressive enhancement.
   Load with <script src=".../dg.js" defer></script>. Everything is wired by data attributes,
   so pages work in plain HTML/PHP and in Electron renderers alike. Exposes window.DG. */
(function () {
  'use strict';
  var doc = document;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Toggles: <button data-dg-toggle aria-controls="id" aria-expanded="false">
     Add data-dg-outside to close on outside click / Esc (dropdown menus). */
  function setOpen(btn, open) {
    var target = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.setAttribute('aria-expanded', String(open));
    target.hidden = !open;
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-dg-toggle]');
    if (btn) { setOpen(btn, btn.getAttribute('aria-expanded') !== 'true'); }
    $$('[data-dg-toggle][data-dg-outside][aria-expanded="true"]').forEach(function (b) {
      if (b === btn) return;
      var t = doc.getElementById(b.getAttribute('aria-controls'));
      if (t && !t.contains(e.target)) setOpen(b, false);
    });
  });

  /* ---- Mobile menu: data-dg-menu-open="id" / data-dg-menu-close ---- */
  var lastFocus = null;
  function openMenu(id) {
    var m = doc.getElementById(id); if (!m) return;
    lastFocus = doc.activeElement; m.hidden = false;
    doc.documentElement.classList.add('dg-scroll-lock');
    var f = m.querySelector('[data-dg-menu-close], a, button'); if (f) f.focus();
  }
  function closeMenus() {
    $$('.dg-mobile-menu:not([hidden])').forEach(function (m) { m.hidden = true; });
    doc.documentElement.classList.remove('dg-scroll-lock');
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-dg-menu-open]');
    if (o) { e.preventDefault(); openMenu(o.getAttribute('data-dg-menu-open')); return; }
    if (e.target.closest('[data-dg-menu-close]')) { e.preventDefault(); closeMenus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 768) closeMenus(); });

  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('[data-dg-toggle][data-dg-outside][aria-expanded="true"]').forEach(function (b) { setOpen(b, false); b.focus(); });
    closeMenus();
  });

  /* ---- Tabs: role="tablist" > role="tab"[aria-controls]; arrow keys move focus ---- */
  function selectTab(tab) {
    var list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
      var p = doc.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on;
    });
  }
  doc.addEventListener('click', function (e) {
    var tab = e.target.closest('[role="tab"][aria-controls]'); if (tab) selectTab(tab);
  });
  doc.addEventListener('keydown', function (e) {
    var tab = e.target.closest && e.target.closest('[role="tab"]'); if (!tab) return;
    var tabs = $$('[role="tab"]', tab.closest('[role="tablist"]')); var i = tabs.indexOf(tab);
    var n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault(); var next = tabs[(n + tabs.length) % tabs.length]; next.focus();
    if (next.hasAttribute('aria-controls')) selectTab(next);
  });

  /* ---- Modals: <dialog class="dg-modal" id="x">, data-dg-modal-open="x", data-dg-modal-close ---- */
  doc.addEventListener('click', function (e) {
    var o = e.target.closest('[data-dg-modal-open]');
    if (o) { var d = doc.getElementById(o.getAttribute('data-dg-modal-open')); if (d && d.showModal) d.showModal(); return; }
    var c = e.target.closest('[data-dg-modal-close]');
    if (c) { var dlg = c.closest('dialog'); if (dlg) dlg.close(c.value || ''); return; }
    if (e.target.matches && e.target.matches('dialog.dg-modal[data-dg-light-dismiss]')) e.target.close();
  });

  /* ---- Dismissible elements (announcement bar): data-dg-dismiss="storage-key" on the close button,
     inside the element with data-dg-dismissible ---- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } }
  $$('[data-dg-dismiss]').forEach(function (b) {
    var host = b.closest('[data-dg-dismissible]'); var key = 'dg:dismiss:' + b.getAttribute('data-dg-dismiss');
    if (host && store(key) === '1') host.hidden = true;
    b.addEventListener('click', function () { if (host) host.hidden = true; store(key, '1'); });
  });

  /* ---- Stepper: buttons with data-dg-step="-1|1" next to an input ---- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dg-step]'); if (!b) return;
    var input = b.parentElement.querySelector('input'); if (!input) return;
    var step = Number(b.getAttribute('data-dg-step')) * (Number(input.step) || 1);
    var v = (Number(input.value) || 0) + step;
    if (input.min !== '') v = Math.max(Number(input.min), v);
    if (input.max !== '') v = Math.min(Number(input.max), v);
    input.value = v; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---- Range fill ---- */
  function syncRange(r) { var min = Number(r.min || 0), max = Number(r.max || 100); r.style.setProperty('--dg-range', ((r.value - min) / (max - min)) * 100 + '%'); }
  doc.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('dg-range')) syncRange(e.target); });

  /* ---- Card fans: rotate and drop outer cards symmetrically ---- */
  var FAN = { 1: [0], 2: [-8, 8], 3: [-14, 0, 14], 4: [-18, -6, 6, 18], 5: [-22, -11, 0, 11, 22] };
  function layoutFan(f) {
    var imgs = $$(':scope > img', f); var angles = FAN[imgs.length] || FAN[5];
    f.setAttribute('data-count', String(imgs.length));
    imgs.forEach(function (img, i) { var a = angles[i] || 0; var drop = Math.round(Math.abs(a) * Math.abs(a) / 18); img.style.transform = 'translateY(' + drop + 'px) rotate(' + a + 'deg)'; });
  }

  /* ---- Toasts: DG.toast('Pod shuffled', { action: 'Undo', onAction: fn, duration: 5000 }) ---- */
  function toast(message, opts) {
    opts = opts || {};
    var region = doc.querySelector('.dg-toast-region');
    if (!region) { region = doc.createElement('div'); region.className = 'dg-toast-region'; region.setAttribute('role', 'status'); region.setAttribute('aria-live', 'polite'); doc.body.appendChild(region); }
    var t = doc.createElement('div'); t.className = 'dg-toast';
    var msg = doc.createElement('span'); msg.className = 'dg-toast__msg'; msg.textContent = message; t.appendChild(msg);
    if (opts.action) {
      var b = doc.createElement('button'); b.type = 'button'; b.className = 'dg-btn dg-btn--ghost'; b.textContent = opts.action;
      b.addEventListener('click', function () { if (opts.onAction) opts.onAction(); remove(); }); t.appendChild(b);
    }
    region.appendChild(t);
    var left = opts.duration || 5000, started = Date.now(), timer;
    function remove() { clearTimeout(timer); if (t.parentNode) t.parentNode.removeChild(t); }
    function run() { started = Date.now(); timer = setTimeout(remove, left); }
    t.addEventListener('mouseenter', function () { clearTimeout(timer); left -= Date.now() - started; });
    t.addEventListener('mouseleave', run);
    run();
    return remove;
  }

  function init(root) {
    $$('.dg-range', root).forEach(syncRange);
    $$('.dg-fan', root).forEach(layoutFan);
    $$('[role="tablist"]', root).forEach(function (l) { var s = l.querySelector('[role="tab"][aria-selected="true"]') || l.querySelector('[role="tab"]'); if (s && s.hasAttribute('aria-controls')) selectTab(s); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { init(); }); else init();

  window.DG = { toast: toast, init: init, openMenu: openMenu, closeMenus: closeMenus, reducedMotion: reduce };
})();
