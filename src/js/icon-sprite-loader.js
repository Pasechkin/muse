/* Lazy SVG sprite injector
   Usage: include this script with attribute data-sprite="../../../icons/sprite-common.svg"
   The script will fetch the sprite and inline it into <body> when #preimushchestva (or [data-load-sprite]) appears in viewport.
*/
(function() {
  'use strict';

  function getScript() {
    try { return document.currentScript; } catch (e) { return null; }
  }

  var script = getScript();
  var spriteURL = script && script.getAttribute('data-sprite') || '../../../icons/sprite-common.svg';
  var injectedId = 'svg-sprite-root';

  if (document.getElementById(injectedId)) return;

  function inject(svgText) {
    try {
      var container = document.createElement('div');
      container.innerHTML = svgText.trim();
      var svg = container.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('aria-hidden', 'true');
      svg.style.display = 'none';
      svg.id = injectedId;
      document.body.insertBefore(svg, document.body.firstChild);
      document.documentElement.classList.add('sprite-loaded');
    } catch (e) {
      console.warn('sprite inject failed', e);
    }
  }

  function fetchAndInject() {
    fetch(spriteURL, { credentials: 'same-origin' })
      .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function(txt) { inject(txt); })
      .catch(function() { /* fail silently */ });
  }

  function startLazy() {
    var target = document.querySelector('#preimushchestva') || document.querySelector('[data-load-sprite]');
    if (target && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { fetchAndInject(); obs.disconnect(); }
        });
      }, { rootMargin: '200px' });
      io.observe(target);
    } else {
      // fallback: load after small delay
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', function() { setTimeout(fetchAndInject, 300); });
      } else {
        setTimeout(fetchAndInject, 300);
      }
    }
  }

  startLazy();
})();
