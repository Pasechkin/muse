document.addEventListener('DOMContentLoaded', function () {
  const dialog = document.getElementById('mobile-menu');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const panel = dialog.querySelector('[data-swipe-panel]');
  if (!panel) return;

  let startX = 0;
  let startY = 0;
  let isTracking = false;

  panel.addEventListener('touchstart', function (e) {
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    startX = touch.clientX;
    startY = touch.clientY;
    isTracking = true;
  }, { passive: true });

  panel.addEventListener('touchmove', function (e) {
    if (!isTracking) return;
    const touch = e.touches && e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startX;
    const dy = Math.abs(touch.clientY - startY);

    if (dx > 60 && dy < 40) {
      isTracking = false;
      try {
        dialog.close();
      } catch (err) {
        // ignore
      }
    }
  }, { passive: true });

  panel.addEventListener('touchend', function () {
    isTracking = false;
  }, { passive: true });
});
