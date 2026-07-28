/**
 * Sticky scroll media + text (Impact-style).
 * Desktop: right media sticks; images swap as left content scrolls into view.
 */
class ImagesWithTextScrolling extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('scrolling-experience')) return;
    if (window.matchMedia('(max-width: 699px)').matches) return;

    this._effect = this.getAttribute('scrolling-experience') || 'reveal';
    this._imageToTransitionItems = Array.from(
      this.querySelectorAll('.images-scrolling-desktop__media-wrapper > :not(:first-child)')
    );
    this._mainImage = this.querySelector('.images-scrolling-desktop__media-wrapper > :first-child');
    this._contentItems = Array.from(
      this.querySelectorAll('.images-scrolling-desktop__content-list > .images-scrolling__content')
    );

    if (!this._mainImage || this._contentItems.length === 0) return;

    this._imageToTransitionItems.forEach((img) => {
      img.style.opacity = '0';
      if (this._effect === 'reveal') {
        img.style.clipPath = 'inset(100% 0 0 0)';
      } else {
        img.style.clipPath = 'none';
      }
    });

    this._raf = null;
    this._onScrollPassive = () => {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._onScroll();
      });
    };

    window.addEventListener('scroll', this._onScrollPassive, { passive: true });
    this._onScroll();
  }

  disconnectedCallback() {
    if (this._onScrollPassive) {
      window.removeEventListener('scroll', this._onScrollPassive);
    }
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _setVisible(image, _content, visible) {
    if (!image) return;

    if (visible) {
      if (image.classList.contains('is-visible')) return;
      image.classList.add('is-visible');
      image.style.opacity = '1';
      if (this._effect === 'reveal') image.style.clipPath = 'inset(0 0 0 0)';
    } else {
      if (!image.classList.contains('is-visible')) return;
      image.classList.remove('is-visible');
      if (this._effect === 'fade') {
        image.style.opacity = '0';
      } else {
        image.style.opacity = '1';
        image.style.clipPath = 'inset(100% 0 0 0)';
      }
    }
  }

  _onScroll() {
    if (!this._mainImage) return;

    const imageRect = this._mainImage.getBoundingClientRect();
    const imageBottom = imageRect.bottom;
    const threshold = imageBottom - imageRect.height * 0.1;

    for (const [index, contentItem] of this._contentItems.entries()) {
      const contentItemRect = contentItem.getBoundingClientRect();
      const image = this._imageToTransitionItems[index - 1];
      const content = this._contentItems[index];

      if (contentItemRect.top < threshold && contentItemRect.bottom > imageBottom) {
        this._setVisible(image, content, true);
        break;
      }

      if (contentItemRect.top > threshold) {
        this._setVisible(image, content, false);
        break;
      }
    }
  }
}

if (!customElements.get('images-with-text-scrolling')) {
  customElements.define('images-with-text-scrolling', ImagesWithTextScrolling);
}
