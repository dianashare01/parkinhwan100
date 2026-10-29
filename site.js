// 마리서사 RE:OPEN — 아코디언 · 팝업
(function () {
  // ---------- 공간별 안내: 모두 펼치기 / 접기 ----------
  var rooms = Array.prototype.slice.call(document.querySelectorAll('details.room'));
  var toggle = document.getElementById('toggle-all');

  function syncToggle() {
    if (!toggle) return;
    var allOpen = rooms.every(function (d) { return d.open; });
    toggle.textContent = allOpen
      ? (toggle.getAttribute('data-label-close') || '모두 접기')
      : (toggle.getAttribute('data-label-open') || '모두 펼치기');
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

  // ---------- 오픈 준비중 팝업: data-soon 링크를 누르면 뜸 ----------
  var popup = document.getElementById('popup');
  if (!popup) return;
  var lastFocus = null;

  function open(e) {
    e.preventDefault();
    lastFocus = e.currentTarget;
    popup.hidden = false;
    var ok = popup.querySelector('.ok');
    if (ok) ok.focus();
    document.addEventListener('keydown', onKey);
  }
  function close() {
    popup.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  document.querySelectorAll('[data-soon]').forEach(function (a) { a.addEventListener('click', open); });
  popup.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  popup.addEventListener('click', function (e) { if (e.target === popup) close(); });
})();
