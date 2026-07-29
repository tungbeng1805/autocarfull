if (!customElements.get('sticky-add-to-cart')) {
  customElements.define(
    'sticky-add-to-cart',
    class StickyAddToCart extends HTMLElement {
      #scopeFromPassed = false;
      #scopeToReached = false;
      #intersectionObserver = new IntersectionObserver(this.#onObserved.bind(this));

      connectedCallback() {
        this._scopeFrom = document.getElementById(this.getAttribute('form'));
        this._scopeTo = document.querySelector('.footer, footer-group, #shopify-section-footer');

        if (!this._scopeFrom) return;

        this.#intersectionObserver.observe(this._scopeFrom);
        if (this._scopeTo) this.#intersectionObserver.observe(this._scopeTo);

        this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          if (event.data.sectionId !== this.dataset.section) return;
          this.#syncFromHtml(event.data.html);
        });
      }

      disconnectedCallback() {
        this.#intersectionObserver.disconnect();
        if (this.variantChangeUnsubscriber) this.variantChangeUnsubscriber();
      }

      #onObserved(entries) {
        entries.forEach((entry) => {
          if (entry.target === this._scopeFrom) {
            this.#scopeFromPassed = entry.boundingClientRect.bottom < 0;
          }
          if (this._scopeTo && entry.target === this._scopeTo) {
            this.#scopeToReached = entry.isIntersecting;
          }
        });

        this.classList.toggle('is-visible', this.#scopeFromPassed && !this.#scopeToReached);
      }

      #syncFromHtml(html) {
        const sectionId = this.dataset.section;
        const stickyPrice = document.getElementById(`StickyPrice-${sectionId}`);
        const stickyPriceSource = html.getElementById(`StickyPrice-${sectionId}`);
        if (stickyPrice && stickyPriceSource) {
          stickyPrice.innerHTML = stickyPriceSource.innerHTML;
        }

        const stickyMedia = document.getElementById(`StickyMedia-${sectionId}`);
        const stickyMediaSource = html.getElementById(`StickyMedia-${sectionId}`);
        if (stickyMedia && stickyMediaSource) {
          stickyMedia.innerHTML = stickyMediaSource.innerHTML;
        }

        const mainButton = html.getElementById(`ProductSubmitButton-${sectionId}`);
        const stickyButtons = [
          document.getElementById(`StickySubmitButton-${sectionId}`),
          document.getElementById(`StickySubmitButtonMobile-${sectionId}`),
        ];

        stickyButtons.forEach((button) => {
          if (!button) return;
          const label = button.querySelector('span');
          if (mainButton && mainButton.hasAttribute('disabled')) {
            button.setAttribute('disabled', 'disabled');
            if (label) label.textContent = window.variantStrings.soldOut;
          } else {
            button.removeAttribute('disabled');
            if (label) label.textContent = window.variantStrings.addToCart;
          }
        });
      }
    }
  );
}
