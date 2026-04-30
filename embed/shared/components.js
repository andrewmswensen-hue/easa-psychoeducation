/* EASA Psychoeducation — shared interaction components
   Reveal cards, flip cards, chapter navigation, parent-page bridge. */

(function () {
  'use strict';

  /* Parent bridge — when this page is iframed, send our content height to
     the parent so it can size the iframe to fit (no nested scrollbars).
     Also expose a request-scroll helper for the chapter nav.
     -------------------------------------------------------------------- */
  const isIframed = window.parent !== window;
  let resizeScheduled = false;

  function sendHeight() {
    if (!isIframed) return;
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      resizeScheduled = false;
      const h = Math.ceil(document.documentElement.scrollHeight);
      window.parent.postMessage({ type: 'easa-embed-resize', height: h }, '*');
    });
  }

  function requestParentScroll() {
    if (!isIframed) return;
    window.parent.postMessage({ type: 'easa-embed-scroll-to' }, '*');
  }

  function initParentBridge() {
    if (!isIframed) return;

    // Re-send height on any layout change
    if (window.ResizeObserver) {
      new ResizeObserver(sendHeight).observe(document.body);
    }
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    // Initial ping (covers cases before ResizeObserver triggers)
    sendHeight();
  }

  /* Reveal cards (tap to expand symptom examples)
     -------------------------------------------------------------------- */
  function initRevealCards() {
    document.querySelectorAll('[data-reveal-card]').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

      const toggle = () => {
        const open = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!open));
        // Re-send height after CSS expansion settles
        setTimeout(sendHeight, 320);
      };

      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* Flip cards (myth → fact)
     -------------------------------------------------------------------- */
  function initFlipCards() {
    document.querySelectorAll('[data-flip-card]').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

      const toggle = () => {
        const flipped = card.getAttribute('aria-pressed') === 'true';
        card.setAttribute('aria-pressed', String(!flipped));
      };

      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* Chapter navigation — linear prev/next + progress bar
     -------------------------------------------------------------------- */
  function initChapterNav() {
    const wrap = document.querySelector('[data-chapters]');
    if (!wrap) return;

    const chapters = Array.from(wrap.querySelectorAll('.chapter'));
    if (chapters.length === 0) return;

    const prevBtn = document.querySelector('[data-nav-prev]');
    const nextBtn = document.querySelector('[data-nav-next]');
    const fill    = document.querySelector('[data-progress-fill]');
    const label   = document.querySelector('[data-progress-label]');
    const title   = document.querySelector('[data-chapter-title]');

    let i = 0;

    function render(isInitial) {
      chapters.forEach((ch, idx) => ch.classList.toggle('is-active', idx === i));
      if (fill)  fill.style.width = `${((i + 1) / chapters.length) * 100}%`;
      if (label) label.textContent = `Section ${i + 1} of ${chapters.length}`;
      if (title) title.textContent = chapters[i].dataset.title || '';
      if (prevBtn) {
        prevBtn.disabled = false;
        prevBtn.textContent = i === 0 ? '← All modules' : '← Back';
      }
      if (nextBtn) {
        const last = i === chapters.length - 1;
        nextBtn.disabled = false;
        nextBtn.textContent = last ? 'Done' : 'Next';
      }

      if (isInitial) return;

      // Scroll behavior — let parent handle when iframed; locally scroll otherwise
      if (isIframed) {
        // Wait a beat for the new chapter content to lay out, then ask parent to scroll
        setTimeout(requestParentScroll, 120);
      } else {
        const anchor = document.querySelector('[data-chapter-top]');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function go(delta) {
      const next = Math.max(0, Math.min(chapters.length - 1, i + delta));
      if (next === i) return;
      i = next;
      render(false);
    }

    function goHome() {
      window.location.href = '../';
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (i === 0) goHome();
      else go(-1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (i === chapters.length - 1) goHome();
      else go(1);
    });

    // Keyboard shortcuts: ←/→ for prev/next (when not typing in a field)
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    });

    render(true);
  }

  /* Init on DOM ready
     -------------------------------------------------------------------- */
  function init() {
    initParentBridge();
    initRevealCards();
    initFlipCards();
    initChapterNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
