/* EASA Psychoeducation — shared interaction components
   Reveal cards, flip cards, chapter navigation. No dependencies. */

(function () {
  'use strict';

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
     Expects a wrapper with data-chapters containing .chapter elements,
     and (optionally) controls: [data-nav-prev], [data-nav-next],
     [data-progress-fill], [data-progress-label].
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

    function render() {
      chapters.forEach((ch, idx) => ch.classList.toggle('is-active', idx === i));
      if (fill)  fill.style.width = `${((i + 1) / chapters.length) * 100}%`;
      if (label) label.textContent = `Section ${i + 1} of ${chapters.length}`;
      if (title) title.textContent = chapters[i].dataset.title || '';
      if (prevBtn) prevBtn.disabled = i === 0;
      if (nextBtn) {
        const last = i === chapters.length - 1;
        nextBtn.disabled = last;
        nextBtn.textContent = last ? 'Done' : 'Next';
      }
      // Scroll to top of tool content on chapter change
      const anchor = document.querySelector('[data-chapter-top]');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function go(delta) {
      const next = Math.max(0, Math.min(chapters.length - 1, i + delta));
      if (next === i) return;
      i = next;
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    // Keyboard shortcuts: ←/→ for prev/next (when not typing in a field)
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    });

    render();
  }

  /* Init on DOM ready
     -------------------------------------------------------------------- */
  function init() {
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
