document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('status');
      status.textContent = 'Sending...';
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });
        status.textContent = res.ok
          ? 'Message sent. Thank you.'
          : 'Error sending message.';
        if (res.ok) form.reset();
      } catch {
        status.textContent = 'Network error.';
      }
    });
  }

  const animatedEls = document.querySelectorAll(
    '.hero, .project-card, .graph-card, .timeline-item, .gallery-item'
  );

  animatedEls.forEach(el => {
    if (!el.classList.contains('is-animated')) el.classList.add('is-animated');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('active');

      if (el.dataset && el.dataset.stagger === "true") {
        Array.from(el.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
        });
      }

      el.querySelectorAll('.bar-track div').forEach(bar => {
        const inlineWidth = bar.getAttribute('data-width') || bar.style.width;
        if (inlineWidth) {
          // ensure starting from 0 (CSS sets width:0), then animate to inline width
          requestAnimationFrame(() => {
            bar.style.width = inlineWidth;
          });
        }
      });

      el.querySelectorAll('.circle').forEach((circle, idx) => {
        const raw = getComputedStyle(circle).getPropertyValue('--p').trim();
        const p = parseFloat(raw) || 0;
        circle.style.background = `conic-gradient(var(--accent) ${p}%, rgba(255,255,255,0.18) 0)`;
        // small staggered reveal
        setTimeout(() => circle.classList.add('revealed'), idx * 90);
      });

      observer.unobserve(el);
    });
  }, { threshold: 0.18 });

  animatedEls.forEach(el => observer.observe(el));

  (function () {
    const galleryButtons = document.querySelectorAll('.project-gallery .gallery-item');
    if (!galleryButtons.length) return;

    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML =
      '<button class="close-btn" aria-label="Close">✕</button><img alt="">';
    document.body.appendChild(modal);

    const img = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-btn');

    function closeModal() {
      modal.classList.remove('open');
      img.src = '';
      document.body.style.overflow = '';
      closeBtn.blur();
    }

    galleryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.dataset.src || btn.querySelector('img')?.src;
        img.src = src;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  })();

  (function () {
    const hookBtn = document.getElementById('hookBtn');
    const hookModal = document.getElementById('hookModal');
    const hookClose = document.getElementById('hookClose');
    const hookCancel = document.getElementById('hookCancel');
    const hookForm = document.getElementById('hookForm');
    const hookStatus = document.getElementById('hookStatus');

    if (!hookBtn || !hookModal) return;

    function openHook() {
      hookModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const panel = hookModal.querySelector('.hook-panel');
      panel && panel.focus && panel.focus();
    }
    function closeHook() {
      hookModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hookBtn.addEventListener('click', openHook);
    hookClose && hookClose.addEventListener('click', closeHook);
    hookCancel && hookCancel.addEventListener('click', closeHook);
    hookModal.addEventListener('click', e => {
      if (e.target === hookModal) closeHook();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeHook();
    });

    if (hookForm) {
      hookForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        if (!hookForm.action) return;
        hookStatus.textContent = 'Sending...';
        const data = new FormData(hookForm);
        try {
          const res = await fetch(hookForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          hookStatus.textContent = res.ok ? 'Message sent. Thank you.' : 'Error sending message.';
          if (res.ok) hookForm.reset();
        } catch {
          hookStatus.textContent = 'Network error.';
        }
      });
    }
  })();

});

(function () {

  const toAnimate = document.querySelectorAll('.hero, .project-card, .graph-card, .timeline-item, .gallery-item, .cards, .projects-list, .circle');
  toAnimate.forEach(el => {
    if (!el.classList.contains('is-animated')) el.classList.add('is-animated');
  });


  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;


      el.classList.add('active');


      if (el.dataset && el.dataset.stagger === "true") {
        Array.from(el.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
        });
      }

      el.querySelectorAll('.bar-track div').forEach(bar => {
        const target = bar.getAttribute('data-width') || bar.getAttribute('data-value') || bar.style.width || bar.getAttribute('style');

        let widthVal = target;
        if (widthVal && !widthVal.toString().includes('%')) {

          const n = parseFloat(widthVal);
          if (!isNaN(n)) {
            widthVal = (n > 1 ? n : n * 100) + '%';
          }
        }
        if (widthVal) {

          requestAnimationFrame(() => {
            bar.style.width = widthVal;
          });
        }
      });

      el.querySelectorAll('.circle').forEach(circle => {

        let raw = circle.style.getPropertyValue('--p') || circle.getAttribute('data-value') || circle.dataset.value;
        raw = (raw || '').toString().trim();
        let target = parseFloat(raw);
        if (isNaN(target)) {

          const cs = getComputedStyle(circle).getPropertyValue('--p');
          target = parseFloat(cs) || 0;
        }

        if (typeof target === 'number') {
          circle.classList.add('revealed');
          let start = null;
          const duration = 900;
          const initial = 0;
          function step(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = initial + (target - initial) * easeOutCubic(progress);
            circle.style.setProperty('--p', String(current));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          }
          requestAnimationFrame(step);
        } else {

          circle.classList.add('revealed');
        }
      });

      animObserver.unobserve(el);
    });
  }, { threshold: 0.18 });

  toAnimate.forEach(el => animObserver.observe(el));

  // easing helper
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
})();

(function () {

  const graphCards = document.querySelectorAll('.graph-card');

  if (!graphCards.length) return;

  function parseWidthFromStyle(styleStr) {
    if (!styleStr) return null;
    const m = styleStr.match(/width\s*:\s*([0-9.]+%?)/i);
    return m ? m[1] : null;
  }

  function animateBars(container) {
    container.querySelectorAll('.bar-track div').forEach(bar => {

      let target = bar.getAttribute('data-width') || parseWidthFromStyle(bar.getAttribute('style')) || bar.style.width || getComputedStyle(bar).width;
      if (!target) return;

      if (!String(target).includes('%')) {
        const n = parseFloat(target);
        if (!isNaN(n)) target = (n > 1 ? n : n * 100) + '%';
      }

      bar.style.width = '0';
      requestAnimationFrame(() => {

        requestAnimationFrame(() => {
          bar.style.width = target;
        });
      });
    });
  }

  function animateCircles(container) {
    container.querySelectorAll('.circle').forEach(circle => {

      let raw = circle.style.getPropertyValue('--p') || circle.getAttribute('data-value') || circle.dataset.value;
      raw = (raw || '').toString().trim();
      let target = parseFloat(raw);
      if (isNaN(target)) {

        const cs = getComputedStyle(circle).getPropertyValue('--p');
        target = parseFloat(cs) || 0;
      }

      circle.style.setProperty('--p', '0');
      circle.classList.add('revealed');
      const duration = 900;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); 
        const current = target * eased;
        circle.style.setProperty('--p', String(current));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      el.classList.add('active');

      animateBars(el);
      animateCircles(el);
      obs.unobserve(el);
    });
  }, { threshold: 0.18 });

  graphCards.forEach(card => {
  
    card.querySelectorAll('.bar-track div').forEach(bar => {

      const inline = bar.getAttribute('style');
      if (inline && !bar.hasAttribute('data-width')) {
        const parsed = parseWidthFromStyle(inline);
        if (parsed) bar.setAttribute('data-width', parsed);
      }

      bar.style.width = '0';
    });

    card.querySelectorAll('.circle').forEach(circle => {
      const inlineP = circle.style.getPropertyValue('--p');
      if (inlineP && !circle.hasAttribute('data-value')) {
        const n = parseFloat(inlineP);
        if (!isNaN(n)) circle.setAttribute('data-value', String(n));
      }
      circle.style.setProperty('--p', '0');
      circle.classList.remove('revealed');
    });

    observer.observe(card);
  });
})();
