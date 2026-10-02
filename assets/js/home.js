/* Perilaku untuk beranda manual (index.html). Tidak membaca data/site.json. */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var btt = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 80);
    btt.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var tg = document.getElementById('navToggle'), nl = document.getElementById('navLinks');
  tg.addEventListener('click', function () { nl.classList.toggle('open'); });

  function count(el, target) {
    var cur = 0, step = Math.max(1, target / 50);
    var t = setInterval(function () {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString('id-ID'); clearInterval(t); }
      else el.textContent = Math.floor(cur).toLocaleString('id-ID');
    }, 30);
  }

  var revealEls = document.querySelectorAll('.reveal');
  var stats = document.querySelector('.stats');
  if (typeof window.IntersectionObserver === 'function') {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    if (stats) {
      var so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.querySelectorAll('.num[data-target]').forEach(function (n) { count(n, parseInt(n.dataset.target, 10)); });
          so.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      so.observe(stats);
    }
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.num[data-target]').forEach(function (n) { n.textContent = n.dataset.target; });
  }

  var track = document.getElementById('galeriTrack');
  if (track) {
    document.querySelectorAll('.galeri-nav button').forEach(function (b) {
      b.addEventListener('click', function () { track.scrollBy({ left: 340 * parseInt(b.dataset.dir, 10), behavior: 'smooth' }); });
    });
    var down = false, sx = 0, sl = 0;
    track.addEventListener('mousedown', function (e) { down = true; sx = e.pageX; sl = track.scrollLeft; track.style.scrollBehavior = 'auto'; });
    window.addEventListener('mouseup', function () { down = false; track.style.scrollBehavior = ''; });
    track.addEventListener('mousemove', function (e) { if (down) track.scrollLeft = sl - (e.pageX - sx) * 1.3; });
  }
})();
