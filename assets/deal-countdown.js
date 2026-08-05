(() => {
  const KEY = 'deal_14_days';
  const DURATION = 14 * 24 * 60 * 60 * 1000;

  let end = null;

  // In-app browsers and private mode can block storage; the countdown then
  // simply restarts on the next page load instead of throwing.
  function readStoredEnd() {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? parseInt(stored, 10) : null;
    } catch (error) {
      return null;
    }
  }

  function storeEnd(value) {
    try {
      localStorage.setItem(KEY, String(value));
    } catch (error) {
      /* storage unavailable */
    }
  }

  function pad(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  function update() {
    let diff = end - Date.now();
    if (diff <= 0) {
      end = Date.now() + DURATION;
      storeEnd(end);
      diff = end - Date.now();
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.querySelectorAll('.deal-bar').forEach((bar) => {
      const d = bar.querySelector('.deal-timer__days');
      const h = bar.querySelector('.deal-timer__hours');
      const m = bar.querySelector('.deal-timer__minutes');
      const s = bar.querySelector('.deal-timer__seconds');
      if (d) d.textContent = pad(days);
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(minutes);
      if (s) s.textContent = pad(seconds);
    });
  }

  function init() {
    const stored = readStoredEnd();
    if (stored && Date.now() < stored) {
      end = stored;
    } else {
      end = Date.now() + DURATION;
      storeEnd(end);
    }

    if (window.__cartDealCountdownTimer) clearInterval(window.__cartDealCountdownTimer);

    update();
    window.__cartDealCountdownTimer = setInterval(update, 1000);
  }

  // The cart drawer injects its markup with innerHTML, which never runs inline
  // scripts, so the timer has to live outside the drawer and be callable again
  // after each re-render.
  window.initCartDealCountdown = init;

  init();
})();
