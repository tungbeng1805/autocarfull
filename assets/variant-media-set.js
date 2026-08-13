/*
 * Rebuilds the product gallery from the server on every variant change.
 *
 * Dawn only swaps the single image referenced by variant.featured_media in the embedded variant
 * JSON, and silently does nothing when that key is absent. Letting Liquid decide instead means the
 * gallery always reflects the selected variant, and it is also what filters media into per-option
 * image sets (see the alt tag handling in 'product-media-gallery.liquid').
 *
 * No extra request is made: Dawn already fetches the section markup for the new variant to refresh
 * the price, and publishes it with the variantChange event.
 */
subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
  const sectionId = event.data?.sectionId;
  const html = event.data?.html;
  if (!sectionId || !html) return;

  document.querySelectorAll(`[id^="MediaGallery-${sectionId}"]`).forEach((gallery) => {
    const updatedGallery = html.getElementById(gallery.id);
    if (!updatedGallery) return;

    // Replacing the whole element re-runs the custom element constructor, which rebinds the
    // thumbnail click handlers. Updating innerHTML alone would leave them pointing at dead nodes.
    gallery.replaceWith(document.importNode(updatedGallery, true));
  });
});
