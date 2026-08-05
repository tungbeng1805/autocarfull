(() => {
  const COLOR_VALUES_SELECTOR = '.product-form__option-values--variant-image';
  const SWATCH_IMAGE_SELECTOR = '.thumbnail-swatch__image';
  const SWATCH_WIDTHS = [100, 200];

  function getVariants(picker) {
    if (picker.seatCoversVariants) return picker.seatCoversVariants;

    const json = picker.querySelector('script[type="application/json"]');
    if (!json) return null;

    try {
      picker.seatCoversVariants = JSON.parse(json.textContent);
    } catch (error) {
      return null;
    }

    return picker.seatCoversVariants;
  }

  function getSelectedValues(fieldsets) {
    return fieldsets.map((fieldset) => {
      const checked = fieldset.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : null;
    });
  }

  function findVariant(variants, selectedValues, optionIndex, value) {
    const wanted = selectedValues.slice();
    wanted[optionIndex] = value;

    const matches = (variant) =>
      wanted.every((wantedValue, index) => wantedValue === null || variant.options[index] === wantedValue);

    return variants.find((variant) => matches(variant) && variant.available) || variants.find(matches);
  }

  function getVariantImage(variant) {
    if (!variant) return null;

    const preview = variant.featured_media && variant.featured_media.preview_image;
    if (preview && preview.src) return preview;

    return variant.featured_image && variant.featured_image.src ? variant.featured_image : null;
  }

  function buildImageUrl(src, width) {
    const url = new URL(src, window.location.href);
    url.searchParams.set('width', String(width));
    return url.href;
  }

  function applyImage(imageElement, image) {
    const largest = SWATCH_WIDTHS[SWATCH_WIDTHS.length - 1];
    const src = buildImageUrl(image.src, largest);
    if (imageElement.getAttribute('src') === src) return;

    imageElement.setAttribute('src', src);
    imageElement.setAttribute(
      'srcset',
      SWATCH_WIDTHS.map((width) => `${buildImageUrl(image.src, width)} ${width}w`).join(', ')
    );

    if (image.width && image.height) {
      imageElement.setAttribute('width', image.width);
      imageElement.setAttribute('height', image.height);
    }
  }

  function refreshSwatches(picker) {
    const variants = getVariants(picker);
    if (!variants) return;

    const fieldsets = Array.from(picker.querySelectorAll('fieldset'));
    const selectedValues = getSelectedValues(fieldsets);

    fieldsets.forEach((fieldset, optionIndex) => {
      if (!fieldset.querySelector(COLOR_VALUES_SELECTOR)) return;

      fieldset.querySelectorAll('input[type="radio"]').forEach((input) => {
        const label = fieldset.querySelector(`label[for="${CSS.escape(input.id)}"]`);
        const imageElement = label && label.querySelector(SWATCH_IMAGE_SELECTOR);
        if (!imageElement) return;

        const image = getVariantImage(findVariant(variants, selectedValues, optionIndex, input.value));
        if (image) applyImage(imageElement, image);
      });
    });
  }

  function init(picker) {
    if (picker.dataset.seatCoversSwatches === 'true') return;
    if (!picker.querySelector(COLOR_VALUES_SELECTOR)) return;

    picker.dataset.seatCoversSwatches = 'true';
    picker.addEventListener('change', () => refreshSwatches(picker));
  }

  function initAll() {
    document.querySelectorAll('variant-radios').forEach(init);
  }

  initAll();
  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', initAll);
})();
