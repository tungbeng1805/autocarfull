(() => {
  const MOBILE_QUERY = '(max-width: 749px)';
  const ZOOMED_CLASS = 'is-zoomed';
  // Must stay in sync with the zoomed image width in section-main-product.css.
  const ZOOM_SCALE = 2.5;

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  // The rendered image is 2.5x wider once zoomed, so widen `sizes` to let the
  // browser pick a sharper candidate from the existing srcset.
  function setSizes(image, zoomed) {
    if (image.dataset.defaultSizes === undefined) image.dataset.defaultSizes = image.sizes;

    image.sizes = zoomed ? `${Math.round(ZOOM_SCALE * 100)}vw` : image.dataset.defaultSizes;
  }

  function zoomOut(content) {
    if (!content.classList.contains(ZOOMED_CLASS)) return;
    content.classList.remove(ZOOMED_CLASS);
    content.querySelectorAll('img').forEach((image) => setSizes(image, false));
    content.scrollTo(0, 0);
  }

  function zoomIn(content, image, point) {
    const rect = image.getBoundingClientRect();
    const ratioX = rect.width ? (point.x - rect.left) / rect.width : 0.5;
    const ratioY = rect.height ? (point.y - rect.top) / rect.height : 0.5;

    content.classList.add(ZOOMED_CLASS);
    setSizes(image, true);

    content.scrollTo({
      left: ratioX * image.offsetWidth - content.clientWidth / 2,
      top: ratioY * image.offsetHeight - content.clientHeight / 2,
    });
  }

  function onContentClick(content, event) {
    if (!isMobile()) return;

    const image = event.target.closest('img');
    if (!image || !content.contains(image)) return;

    if (content.classList.contains(ZOOMED_CLASS)) {
      zoomOut(content);
    } else {
      zoomIn(content, image, { x: event.clientX, y: event.clientY });
    }
  }

  function init(modal) {
    if (modal.dataset.mediaZoom === 'true') return;

    const content = modal.querySelector('.product-media-modal__content');
    if (!content) return;

    modal.dataset.mediaZoom = 'true';
    content.addEventListener('click', (event) => onContentClick(content, event));

    // The modal keeps its markup between openings, so drop the zoom when it closes
    // and when the viewport grows past the mobile breakpoint.
    new MutationObserver(() => {
      if (!modal.hasAttribute('open')) zoomOut(content);
    }).observe(modal, { attributes: true, attributeFilter: ['open'] });

    window.matchMedia(MOBILE_QUERY).addEventListener('change', (event) => {
      if (!event.matches) zoomOut(content);
    });
  }

  function initAll() {
    document.querySelectorAll('product-modal.product-media-modal').forEach(init);
  }

  initAll();
  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', initAll);
})();
