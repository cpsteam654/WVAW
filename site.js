/* West Virginians for Affordable Water: site scripts */
(function () {
  /* ---------- Hero illustration (ridges, trees, bridge) ---------- */
  var hero = document.getElementById('hero-art');
  if (hero) {
    var f = function (n) { return Math.round(n * 10) / 10; };
    var bumpy = function (pts, w, h, bottom) {
      var d = 'M' + pts[0][0] + ' ' + bottom + ' L' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 0; i < pts.length - 1; i++) {
        var x0 = pts[i][0], y0 = pts[i][1], x1 = pts[i + 1][0], y1 = pts[i + 1][1];
        var n = Math.max(1, Math.round((x1 - x0) / w)), dx = (x1 - x0) / n, dy = (y1 - y0) / n;
        for (var k = 0; k < n; k++) d += ' a' + f(Math.abs(dx) / 2) + ' ' + h + ' 0 0 1 ' + f(dx) + ' ' + f(dy);
      }
      return d + ' L' + pts[pts.length - 1][0] + ' ' + bottom + ' Z';
    };
    var lift = function (pts, dy) { return pts.map(function (p) { return [p[0], p[1] - dy]; }); };
    var yAt = function (pts, x) {
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        if (x >= a[0] && x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
      }
      return null;
    };
    var rnd = function (n) { var v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); };
    var trees = function (pts, spacing, size, rows, seed) {
      var d = '', n = seed;
      rows.forEach(function (r) {
        for (var x = pts[0][0] + r[0]; x <= pts[pts.length - 1][0]; x += spacing) {
          n++;
          var xx = x + (rnd(n) - 0.5) * spacing * 0.6, base = yAt(pts, xx);
          if (base === null) continue;
          var y = base + r[1] + rnd(n + 99) * 6, s = size * (0.75 + rnd(n + 7) * 0.5);
          d += 'M' + f(xx) + ' ' + f(y - s * 2.4) + ' L' + f(xx - s * 0.8) + ' ' + f(y - s) + ' H' + f(xx + s * 0.8) + ' Z';
          d += 'M' + f(xx) + ' ' + f(y - s * 1.7) + ' L' + f(xx - s * 1.05) + ' ' + f(y) + ' H' + f(xx + s * 1.05) + ' Z';
        }
      });
      return d;
    };
    var F2 = [[-40, 290], [240, 262], [500, 300], [700, 282], [900, 300], [1160, 262], [1480, 290]];
    var LN = [[-20, 410], [160, 426], [340, 466], [440, 530], [500, 600], [520, 640]];
    var RN = [[880, 640], [900, 580], [1000, 510], [1160, 462], [1340, 442], [1460, 432]];
    var LL = [[-20, 568], [120, 576], [260, 604], [360, 640]];
    var RL = [[1080, 640], [1240, 600], [1460, 584]];
    var LM = [[-20, 300], [180, 312], [380, 350], [560, 392], [680, 432], [722, 468]];
    var RM = [[738, 468], [800, 430], [940, 382], [1120, 342], [1300, 312], [1460, 300]];
    var Q = function (t, a, c, b) { return (1 - t) * (1 - t) * a + 2 * t * (1 - t) * c + t * t * b; };
    var lattice = '', i, x;
    for (i = 0; i <= 32; i++) { var t = i / 32; lattice += (i ? ' L' : 'M') + f(320 + 800 * t) + ' ' + f(Q(t, 340, 110, 340) + (i % 2 ? 16 : 0)); }
    var verticals = '';
    for (x = 360; x <= 1080; x += 40) verticals += ' M' + x + ' 208 V' + f(Q((x - 320) / 800, 340, 110, 340));
    var deckTruss = '';
    for (x = 110, i = 0; x <= 1330; x += 20, i++) deckTruss += (i ? ' L' : 'M') + x + ' ' + (i % 2 ? 208 : 192);
    var paths = {
      ridgeFar1: bumpy([[-40, 250], [200, 215], [420, 240], [640, 200], [860, 230], [1080, 195], [1300, 225], [1480, 210]], 40, 9, 640),
      ridgeFar2: bumpy(F2, 34, 9, 640), treesFar: trees(F2, 34, 3.6, [[0, 6]], 1),
      leftSun: bumpy(lift(LM, 14), 30, 9, 640), rightSun: bumpy(lift(RM, 14), 30, 9, 640),
      leftMid: bumpy(LM, 30, 9, 640), rightMid: bumpy(RM, 30, 9, 640),
      treesMid: trees(LM, 46, 6.5, [[0, 10], [22, 40]], 300) + trees(RM, 46, 6.5, [[0, 10], [22, 40]], 600),
      leftNear: bumpy(LN, 26, 8, 640), rightNear: bumpy(RN, 26, 8, 640),
      treesNear: trees(LN, 52, 9, [[0, 12], [26, 50]], 900) + trees(RN, 52, 9, [[0, 12], [26, 50]], 1300),
      ledgeL: bumpy(LL, 24, 7, 640), ledgeR: bumpy(RL, 24, 7, 640),
      treesLedge: trees(LL, 70, 12, [[0, 16]], 1700) + trees(RL, 70, 12, [[0, 16]], 1900),
      lattice: lattice, verticals: verticals, deckTruss: deckTruss,
      piers: 'M150 208 V340 M220 208 V330 M1220 208 V330 M1290 208 V340'
    };
    hero.querySelectorAll('[data-path]').forEach(function (el) { el.setAttribute('d', paths[el.getAttribute('data-path')] || ''); });
  }

  /* ---------- Pledge form ----------
     Sends the entry to the existing Jotform pledge form in the background,
     then opens this site's thank-you/share page. If the background send
     isn't possible, it falls back to a normal submit to Jotform. */
  var form = document.getElementById('pledge-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var btn = form.querySelector('.submit');
      if (!window.fetch || !window.FormData) return; // old browser: normal submit
      e.preventDefault();
      btn.disabled = true; btn.firstChild.textContent = 'Signing… ';
      fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
        .then(function () { window.location.href = 'thanks.html'; })
        .catch(function () { btn.disabled = false; form.submit(); });
    });
  }

  /* ---------- Thank-you page: copy link ---------- */
  var copy = document.getElementById('copy-link');
  if (copy) {
    copy.addEventListener('click', function () {
      var url = copy.getAttribute('data-url');
      var done = function () { copy.textContent = '✓ Link copied'; copy.classList.add('copied'); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
      else window.prompt('Copy this link:', url);
    });
  }
})();
