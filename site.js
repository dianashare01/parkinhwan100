// 마리서사 RE:OPEN — 아코디언 · 팝업
(function () {
  // ---------- 공간별 안내: 모두 펼치기 / 접기 ----------
  var rooms = Array.prototype.slice.call(document.querySelectorAll('details.room'));
  var toggle = document.getElementById('toggle-all');

  function syncToggle() {
    if (!toggle) return;
    var allOpen = rooms.every(function (d) { return d.open; });
    toggle.textContent = allOpen ? '모두 접기' : '모두 펼치기';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var allOpen = rooms.every(function (d) { return d.open; });
      rooms.forEach(function (d) { d.open = !allOpen; });
      syncToggle();
    });
    rooms.forEach(function (d) { d.addEventListener('toggle', syncToggle); });
    syncToggle();
  }

  // 주소에 #room-xx / #poem 이 붙어 오면 그 칸을 펼침
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'start' });
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  document.querySelectorAll('[data-open]').forEach(function (a) {
    a.addEventListener('click', function () {
      var el = document.getElementById(a.getAttribute('data-open'));
      if (el) el.open = true;
    });
  });

  // ---------- 오픈 준비중 팝업 ----------
  var popup = document.getElementById('popup');
  if (!popup) return;
  var OPEN_AT = new Date('2026-10-29T00:00:00+09:00').getTime();
  var SKIP_KEY = 'mrs-popup-skip-until';
  var SESSION_KEY = 'mrs-popup-closed';

  function store(kind) { try { return window[kind]; } catch (e) { return null; } }
  var local = store('localStorage');
  var session = store('sessionStorage');
  function get(s, k) { try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function set(s, k, v) { try { if (s) s.setItem(k, v); } catch (e) {} }

  var now = Date.now();
  var skipUntil = Number(get(local, SKIP_KEY) || 0);
  if (now >= OPEN_AT || now < skipUntil || get(session, SESSION_KEY)) return;

  var lastFocus = document.activeElement;
  popup.hidden = false;
  var ok = popup.querySelector('.ok');
  if (ok) ok.focus();

  function close() {
    var today = document.getElementById('pop-today');
    if (today && today.checked) {
      var end = new Date(); end.setHours(24, 0, 0, 0); // 오늘 자정까지
      set(local, SKIP_KEY, String(end.getTime()));
    }
    set(session, SESSION_KEY, '1');
    popup.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  popup.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  popup.addEventListener('click', function (e) { if (e.target === popup) close(); });
  document.addEventListener('keydown', onKey);
})();
