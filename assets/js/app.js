(function () {
  'use strict';

  var B = document.body;
  var ROOT = B.dataset.root || './';
  var PAGE = B.dataset.page || 'home';
  var BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  var NAV = [
    ['tentang', 'Tentang', 'tentang/'],
    ['prodi', 'Program studi', 'prodi/'],
    ['alumni', 'Alumni', 'alumni/'],
    ['galeri', 'Galeri', 'galeri/'],
    ['berita', 'Berita', 'berita/'],
    ['kontak', 'Kontak', 'kontak/']
  ];
  var TITLES = {
    tentang: 'Tentang kampus', prodi: 'Program studi', alumni: 'Alumni',
    galeri: 'Galeri', berita: 'Berita', daftar: 'Pendaftaran', kontak: 'Kontak'
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function src(u) {
    if (!u) return '';
    return /^(https?:|data:|\/\/)/.test(u) ? u : ROOT + String(u).replace(/^\/+/, '');
  }
  function href(p) { return ROOT + p; }
  function safeUrl(u) { return /^(https?:|mailto:|tel:)/i.test(u || '') ? u : ''; }
  function tgl(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? (+m[3]) + ' ' + BULAN[+m[2] - 1] + ' ' + m[1] : (iso || '');
  }
  function paras(t) {
    return String(t || '').split(/\n{2,}/).filter(function (p) { return p.trim(); }).map(function (p) {
      return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  function today() { return new Date().toLocaleDateString('sv-SE'); }
  function digits(n) {
    n = String(n || '').replace(/\D/g, '');
    if (n.indexOf('0') === 0) n = '62' + n.slice(1);
    return n;
  }
  function head(eyebrow, title, desc) {
    return '<div class="section-head reveal"><div class="eyebrow">' + esc(eyebrow) + '</div><h2>' +
      esc(title) + '</h2>' + (desc ? '<p>' + esc(desc) + '</p>' : '') + '</div>';
  }
  function sortedBerita(d) {
    return (d.berita || []).slice().sort(function (a, b) { return (b.tanggal || '').localeCompare(a.tanggal || ''); });
  }

  /* ---------- header / footer ---------- */
  function headerHTML(d) {
    var id = d.identitas || {};
    var top = (d.topLinks || []).filter(function (l) { return safeUrl(l.url); }).map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener"><i class="fas ' + esc(l.icon || 'fa-link') + '"></i> ' + esc(l.label) + '</a>';
    }).join('');
    var links = NAV.map(function (n) {
      return '<a href="' + href(n[2]) + '"' + (PAGE === n[0] ? ' class="active"' : '') + '>' + esc(n[1]) + '</a>';
    }).join('');
    return '<header class="site" id="siteHeader">' +
      (top ? '<div class="topbar"><div class="wrap">' + top + '</div></div>' : '') +
      '<nav class="main"><a class="logo" href="' + href('') + '" aria-label="Beranda">' +
      '<span class="logo-top">' + esc(id.logoAtas) + '</span><span class="logo-bottom">' + esc(id.logoBawah) + '</span></a>' +
      '<div class="nav-links" id="navLinks">' + links + '<a class="nav-cta-m" href="' + href('daftar/') + '">Daftar</a></div>' +
      '<a class="nav-cta" href="' + href('daftar/') + '">Daftar</a>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Menu"><i class="fas fa-bars"></i></button></nav></header>';
  }
  function footerHTML(d) {
    var id = d.identitas || {};
    var soc = [['instagram', 'fa-instagram'], ['facebook', 'fa-facebook-f'], ['youtube', 'fa-youtube']].map(function (s) {
      var u = safeUrl(id[s[0]]);
      return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + s[0] + '"><i class="fab ' + s[1] + '"></i></a>' : '';
    }).join('');
    var wa = digits(id.whatsapp);
    if (wa) soc += '<a href="https://wa.me/' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>';
    return '<footer class="site"><div class="wrap footer-grid">' +
      '<div class="footer-brand"><div class="logo"><span class="logo-top">' + esc(id.logoAtas) + '</span><span class="logo-bottom">' + esc(id.logoBawah) + '</span></div><p>' + esc(id.deskripsiSingkat) + '</p></div>' +
      '<div><h4>Navigasi</h4><ul>' +
      '<li><a href="' + href('tentang/') + '">Tentang</a></li><li><a href="' + href('prodi/') + '">Program studi</a></li><li><a href="' + href('alumni/') + '">Alumni</a></li><li><a href="' + href('galeri/') + '">Galeri</a></li></ul></div>' +
      '<div><h4>Layanan</h4><ul><li><a href="' + href('daftar/') + '">Pendaftaran</a></li><li><a href="' + href('berita/') + '">Berita</a></li><li><a href="' + href('kontak/') + '">Kontak</a></li></ul></div>' +
      '<div><h4>Ikuti kami</h4><div class="social">' + (soc || '<span style="font-size:12px">—</span>') + '</div></div></div>' +
      '<div class="wrap footer-bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(id.nama) + '. Semua hak dilindungi.</span><span>Kabupaten Aceh Barat, Aceh</span></div></footer>';
  }

  /* ---------- sections ---------- */
  function secHero(d) {
    var h = d.hero || {};
    return '<section class="hero" style="--hero-img:url(\'' + esc(src(h.gambar)) + '\')"><div class="hero-inner">' +
      '<div class="rule"></div><div class="eyebrow">' + esc(h.eyebrow) + '</div>' +
      '<h1>' + esc(h.judul) + ' <em>' + esc(h.judulSorot) + '</em></h1><p>' + esc(h.deskripsi) + '</p>' +
      '<div class="btn-row"><a href="' + href('daftar/') + '" class="btn-primary">Daftar sekarang</a>' +
      '<a href="' + href('prodi/') + '" class="btn-secondary">Lihat program studi</a></div></div></section>';
  }
  function secStats(d) {
    return '<div class="stats">' + (d.statistik || []).map(function (s) {
      var n = /^\d+$/.test(String(s.angka).trim());
      return '<div class="stat"><div class="num"' + (n ? ' data-target="' + esc(s.angka) + '">0' : '>' + esc(s.angka)) + '</div><div class="label">' + esc(s.label) + '</div></div>';
    }).join('') + '</div>';
  }
  function secTentang(d, more) {
    var t = d.tentang || {};
    return '<section class="sec white"><div class="wrap about-grid">' +
      '<div class="about-visual reveal"><div class="quote">"' + esc(t.kutipan) + '"</div><div class="who">' + esc(t.penutur) + '</div></div>' +
      '<div class="about-text reveal"><div class="eyebrow">Tentang kampus</div><h3>' + esc(t.judul) + '</h3>' + paras(t.paragraf) +
      '<ul class="about-list">' + (t.poin || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      (more ? '<p style="margin-top:18px"><a class="more-link" href="' + href('tentang/') + '" style="color:var(--sky-deep);font-weight:600;font-size:13px">Selengkapnya →</a></p>' : '') +
      '</div></div></section>';
  }
  function secProdi(d, more) {
    var list = d.prodi || [];
    return '<section class="sec cream"><div class="wrap">' +
      head('Program studi', 'Pilihan jalur akademik kesehatan', list.length + ' program studi yang dirancang untuk kebutuhan tenaga kesehatan masa depan.') +
      '<div class="grid3">' + list.map(function (p) {
        return '<div class="prodi-card reveal"><div class="jenjang">' + esc(p.jenjang) + '</div><h3>' + esc(p.nama) + '</h3><p>' + esc(p.deskripsi) + '</p></div>';
      }).join('') + '</div>' +
      (more ? '<div class="more"><a href="' + href('prodi/') + '">Lihat semua program studi →</a></div>' : '') +
      '</div></section>';
  }
  function secAlumni(d, more) {
    return '<section class="sec navy"><div class="wrap">' +
      head('Kata alumni', 'Cerita dari yang sudah menjalani', 'Pengalaman nyata alumni yang kini bekerja di berbagai fasilitas kesehatan.') +
      '<div class="grid3">' + (d.alumni || []).map(function (a) {
        return '<div class="testi-card reveal"><div class="stars">★★★★★</div><div class="msg">' + esc(a.testimoni) + '</div><div class="name">' + esc(a.nama) + '</div><div class="role">' + esc(a.peran) + '</div></div>';
      }).join('') + '</div>' +
      (more ? '<div class="more"><a href="' + href('alumni/') + '" style="color:var(--gold)">Lihat semua cerita →</a></div>' : '') +
      '</div></section>';
  }
  function secGaleri(d, full) {
    var g = d.galeri || [];
    var body;
    if (full) {
      body = '<div class="galeri-grid">' + g.map(function (x) {
        return '<div class="galeri-item reveal" data-full="' + esc(src(x.url)) + '" data-cap="' + esc(x.keterangan) + '"><img loading="lazy" src="' + esc(src(x.url)) + '" alt="' + esc(x.keterangan) + '"><span>' + esc(x.keterangan) + '</span></div>';
      }).join('') + '</div>';
    } else {
      body = '<div class="galeri-slider"><div class="galeri-track" id="galeriTrack">' + g.map(function (x) {
        return '<img loading="lazy" src="' + esc(src(x.url)) + '" alt="' + esc(x.keterangan) + '" data-full="' + esc(src(x.url)) + '" data-cap="' + esc(x.keterangan) + '">';
      }).join('') + '</div><div class="galeri-nav"><button type="button" data-dir="-1" aria-label="Sebelumnya">‹</button><button type="button" data-dir="1" aria-label="Berikutnya">›</button></div></div>' +
        '<div class="more"><a href="' + href('galeri/') + '">Buka galeri →</a></div>';
    }
    return '<section class="sec white"><div class="wrap">' +
      head('Galeri', 'Suasana kampus', 'Sekilas kegiatan akademik dan lingkungan kampus ' + ((d.identitas || {}).nama || '') + '.') +
      body + '</div></section>';
  }
  function beritaCard(b) {
    return '<a class="berita-card reveal" href="' + href('berita/?p=' + encodeURIComponent(b.id)) + '">' +
      (b.gambar ? '<div class="thumb"><img loading="lazy" src="' + esc(src(b.gambar)) + '" alt=""></div>' : '') +
      '<div class="berita-body"><div class="berita-date">' + esc(tgl(b.tanggal)) + '</div><h3>' + esc(b.judul) + '</h3><p>' + esc(b.ringkasan) + '</p><span class="baca">Baca selengkapnya →</span></div></a>';
  }
  function secBerita(d, limit) {
    var list = sortedBerita(d);
    if (limit) list = list.slice(0, limit);
    return '<section class="sec cream"><div class="wrap">' +
      head('Berita', 'Kabar terbaru kampus', 'Informasi dan agenda terkini dari ' + ((d.identitas || {}).nama || '') + '.') +
      (list.length ? '<div class="grid3">' + list.map(beritaCard).join('') + '</div>' : '<p style="text-align:center;color:var(--muted)">Belum ada berita.</p>') +
      (limit ? '<div class="more"><a href="' + href('berita/') + '">Semua berita →</a></div>' : '') +
      '</div></section>';
  }
  function secBeritaDetail(d, id) {
    var b = (d.berita || []).filter(function (x) { return x.id === id; })[0];
    if (!b) return '<section class="sec cream"><div class="wrap"><div class="error-box">Berita tidak ditemukan.<br><a href="' + href('berita/') + '" style="color:var(--sky-deep)">← Semua berita</a></div></div></section>';
    document.title = b.judul + ' — ' + (d.identitas || {}).nama;
    return '<section class="sec cream"><div class="wrap"><article class="artikel reveal in"><div class="berita-date">' + esc(tgl(b.tanggal)) + '</div><h2>' + esc(b.judul) + '</h2>' +
      (b.gambar ? '<img src="' + esc(src(b.gambar)) + '" alt="">' : '') + paras(b.isi) +
      '<a class="back" href="' + href('berita/') + '">← Semua berita</a></article></div></section>';
  }

  function gelStatus(g) {
    var t = today();
    if (g.mulai && t < g.mulai) return 'akan';
    if (g.tutup && t > g.tutup) return 'tutup';
    return 'buka';
  }
  function bukaGelombang(d) {
    var l = ((d.pmb || {}).gelombang || []).filter(function (g) { return gelStatus(g) === 'buka'; });
    return l[0] || null;
  }
  function secPmbCta(d) {
    var p = d.pmb || {}, g = bukaGelombang(d);
    var msg, btn;
    if (g) {
      msg = esc(g.nama) + (g.tutup ? ' ditutup ' + esc(tgl(g.tutup)) + '.' : ' sedang dibuka.') + (p.biaya ? ' Biaya pendaftaran: ' + esc(p.biaya) + '.' : '');
    } else {
      msg = 'Saat ini belum ada gelombang yang dibuka. Lihat jadwal dan persyaratan pada halaman pendaftaran.';
    }
    return '<section class="pmb"><div class="wrap"><h2>' + esc(g ? 'Pendaftaran mahasiswa baru dibuka' : 'Informasi pendaftaran mahasiswa baru') + '</h2><p>' + msg + '</p>' +
      '<a href="' + href('daftar/') + '" class="btn-primary">' + (g ? 'Mulai pendaftaran' : 'Lihat informasi') + '</a></div></section>';
  }
  function secDaftar(d) {
    var p = d.pmb || {}, g = bukaGelombang(d);
    var status = g
      ? '<div class="status buka"><i class="fas fa-circle-check"></i> ' + esc(g.nama) + ' sedang dibuka' + (g.tutup ? ' — ditutup ' + esc(tgl(g.tutup)) : '') + '</div>'
      : '<div class="status tutup"><i class="fas fa-clock"></i> Belum ada gelombang yang dibuka saat ini</div>';
    var lbl = { buka: 'Dibuka', tutup: 'Ditutup', akan: 'Akan dibuka' };
    var tbl = (p.gelombang || []).length
      ? '<table class="gel"><thead><tr><th>Gelombang</th><th>Mulai</th><th>Tutup</th><th>Status</th></tr></thead><tbody>' +
        p.gelombang.map(function (x) {
          var s = gelStatus(x);
          return '<tr><td>' + esc(x.nama) + '</td><td>' + (x.mulai ? esc(tgl(x.mulai)) : '—') + '</td><td>' + (x.tutup ? esc(tgl(x.tutup)) : '—') + '</td><td><span class="badge ' + s + '">' + lbl[s] + '</span></td></tr>';
        }).join('') + '</tbody></table>'
      : '';
    var form = safeUrl(p.linkForm)
      ? '<p style="margin-top:18px"><a class="btn-dark" href="' + esc(p.linkForm) + '" target="_blank" rel="noopener">Isi formulir pendaftaran →</a></p>' : '';
    var prodiOpts = (d.prodi || []).map(function (x) { return '<option>' + esc(x.jenjang + ' ' + x.nama) + '</option>'; }).join('');
    var hasWa = !!digits((d.identitas || {}).whatsapp);
    return '<section class="sec cream"><div class="wrap daftar-grid">' +
      '<div class="reveal">' + status +
      '<div class="panel"><h3>' + esc(p.judul) + '</h3><p style="font-size:14px;color:var(--muted);margin-bottom:16px">' + esc(p.deskripsi) + '</p>' +
      (p.biaya ? '<p style="font-size:14px;margin-bottom:16px"><strong>Biaya pendaftaran:</strong> ' + esc(p.biaya) + '</p>' : '') + tbl + form + '</div>' +
      ((p.syarat || []).length ? '<div class="panel" style="margin-top:20px"><h3>Persyaratan</h3><ul class="list-check">' + p.syarat.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>' : '') +
      ((p.alur || []).length ? '<div class="panel" style="margin-top:20px"><h3>Alur pendaftaran</h3><ol class="steps">' + p.alur.map(function (s) { return '<li><span>' + esc(s) + '</span></li>'; }).join('') + '</ol></div>' : '') +
      '</div>' +
      '<div class="panel reveal"><h3>Tanya / daftar cepat</h3><p style="font-size:13px;color:var(--muted)">Isi data singkat, lalu pesan akan dikirim lewat ' + (hasWa ? 'WhatsApp' : 'email') + ' ke panitia.</p>' +
      '<form class="form" id="daftarForm"><label for="f-nama">Nama lengkap</label><input id="f-nama" required>' +
      '<label for="f-hp">Nomor HP</label><input id="f-hp" type="tel" required>' +
      '<label for="f-prodi">Program studi diminati</label><select id="f-prodi">' + prodiOpts + '</select>' +
      '<label for="f-pesan">Pesan (opsional)</label><textarea id="f-pesan" rows="3"></textarea>' +
      '<button class="btn-dark" type="submit">Kirim via ' + (hasWa ? 'WhatsApp' : 'email') + '</button></form>' +
      '<p class="note">Data tidak disimpan di situs ini; hanya dibuka di aplikasi ' + (hasWa ? 'WhatsApp' : 'email') + ' Anda.</p></div>' +
      '</div></section>';
  }
  function secKontak(d) {
    var k = d.kontak || {};
    var map = safeUrl(k.mapsEmbed) ? '<iframe src="' + esc(k.mapsEmbed) + '" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi"></iframe>' : '';
    var gm = safeUrl(k.mapsLink) ? '<a class="gmaps" href="' + esc(k.mapsLink) + '" target="_blank" rel="noopener">Buka di Google Maps →</a>' : '';
    return '<section class="sec white"><div class="wrap kontak-grid">' +
      '<div class="kontak-info reveal"><div class="eyebrow">Kontak</div><h3>Hubungi kami</h3>' +
      [['Alamat', k.alamat], ['Telepon', k.telepon], ['Email', k.email], ['Jam layanan', k.jam]].filter(function (r) { return r[1]; }).map(function (r) {
        return '<div class="kontak-row"><div class="k-label">' + r[0] + '</div><div>' + esc(r[1]) + '</div></div>';
      }).join('') + '</div>' +
      '<div class="kontak-map reveal">' + map + gm + '</div></div></section>';
  }
  function pageHero(title) {
    return '<section class="page-hero"><div class="eyebrow">' + esc((window.__d.identitas || {}).nama) + '</div><h1>' + esc(title) + '</h1><div class="crumb"><a href="' + href('') + '">Beranda</a> / ' + esc(title) + '</div></section>';
  }

  /* ---------- compose ---------- */
  function build(d) {
    var q = new URLSearchParams(location.search);
    switch (PAGE) {
      case 'home':
        return secHero(d) + secStats(d) + secTentang(d, true) + secProdi(d, true) + secAlumni(d, true) + secGaleri(d, false) + secBerita(d, 3) + secPmbCta(d) + secKontak(d);
      case 'tentang': return pageHero('Tentang kampus') + secTentang(d, false);
      case 'prodi': return pageHero('Program studi') + secProdi(d, false) + secPmbCta(d);
      case 'alumni': return pageHero('Alumni') + secAlumni(d, false);
      case 'galeri': return pageHero('Galeri') + secGaleri(d, true);
      case 'berita':
        if (q.get('p')) return pageHero('Berita') + secBeritaDetail(d, q.get('p'));
        return pageHero('Berita') + secBerita(d, 0);
      case 'daftar': return pageHero('Pendaftaran') + secDaftar(d);
      case 'kontak': return pageHero('Kontak') + secKontak(d);
    }
    return '';
  }

  /* ---------- behaviours ---------- */
  function animateCounter(el, target) {
    var cur = 0, step = Math.max(1, target / 50);
    var t = setInterval(function () {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString('id-ID'); clearInterval(t); }
      else el.textContent = Math.floor(cur).toLocaleString('id-ID');
    }, 30);
  }
  function initUI(d) {
    var header = document.getElementById('siteHeader');
    var btt = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
      if (header) header.classList.toggle('scrolled', window.scrollY > 80);
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    var tg = document.getElementById('navToggle'), nl = document.getElementById('navLinks');
    if (tg) tg.addEventListener('click', function () { nl.classList.toggle('open'); });

    if (typeof window.IntersectionObserver === 'function') {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      var st = document.querySelector('.stats');
      if (st) {
        var so = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.num[data-target]').forEach(function (n) { animateCounter(n, parseInt(n.dataset.target, 10)); });
            so.unobserve(e.target);
          });
        }, { threshold: 0.4 });
        so.observe(st);
      }
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('.num[data-target]').forEach(function (n) { n.textContent = n.dataset.target; });
    }

    // slider galeri
    var track = document.getElementById('galeriTrack');
    if (track) {
      document.querySelectorAll('.galeri-nav button').forEach(function (b) {
        b.addEventListener('click', function () { track.scrollBy({ left: 340 * parseInt(b.dataset.dir, 10), behavior: 'smooth' }); });
      });
      var down = false, sx = 0, sl = 0, moved = false;
      track.addEventListener('mousedown', function (e) { down = true; moved = false; sx = e.pageX; sl = track.scrollLeft; track.style.scrollBehavior = 'auto'; });
      window.addEventListener('mouseup', function () { down = false; track.style.scrollBehavior = ''; });
      track.addEventListener('mousemove', function (e) {
        if (!down) return;
        if (Math.abs(e.pageX - sx) > 4) moved = true;
        track.scrollLeft = sl - (e.pageX - sx) * 1.3;
      });
      track.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    }

    // lightbox
    var items = document.querySelectorAll('[data-full]');
    if (items.length) {
      var lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.innerHTML = '<button type="button" aria-label="Tutup">×</button><img alt=""><p></p>';
      document.body.appendChild(lb);
      var close = function () { lb.classList.remove('open'); };
      lb.addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      items.forEach(function (it) {
        it.addEventListener('click', function () {
          lb.querySelector('img').src = it.dataset.full;
          lb.querySelector('p').textContent = it.dataset.cap || '';
          lb.classList.add('open');
        });
      });
    }

    // form daftar
    var f = document.getElementById('daftarForm');
    if (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var nama = document.getElementById('f-nama').value.trim();
        var hp = document.getElementById('f-hp').value.trim();
        var prodi = document.getElementById('f-prodi').value;
        var pesan = document.getElementById('f-pesan').value.trim();
        var teks = 'Halo, saya ' + nama + ' (HP: ' + hp + '). Saya tertarik mendaftar di program studi ' + prodi + '.' + (pesan ? '\n\n' + pesan : '');
        var wa = digits((d.identitas || {}).whatsapp);
        if (wa) window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(teks), '_blank', 'noopener');
        else if ((d.kontak || {}).email) location.href = 'mailto:' + d.kontak.email + '?subject=' + encodeURIComponent('Pendaftaran ' + prodi) + '&body=' + encodeURIComponent(teks);
      });
    }
  }

  /* ---------- boot ---------- */
  fetch(ROOT + 'data/site.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) {
      window.__d = d;
      var nama = (d.identitas || {}).nama || '';
      document.title = (TITLES[PAGE] ? TITLES[PAGE] + ' — ' : '') + nama;
      document.getElementById('site-header').innerHTML = headerHTML(d);
      document.getElementById('app').innerHTML = build(d);
      document.getElementById('site-footer').innerHTML = footerHTML(d);
      initUI(d);
    })
    .catch(function (err) {
      document.getElementById('app').innerHTML = '<div class="error-box"><h2>Konten tidak dapat dimuat</h2><p>' + esc(err.message) +
        '. Jika membuka file langsung (file://), jalankan lewat server lokal atau publikasikan ke GitHub Pages.</p></div>';
    });
})();
