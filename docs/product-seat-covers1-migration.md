# Product Seat Covers 1 Migration

Source template:
- `theme cũ/templates/product.seat-covers1.json`

## Sections in source template

Already available in `autocarfull`:
- `main-product`
- `apps`
- `video`
- `rich-text`
- `related-products`

Created in `autocarfull`:
- `custom-html`
- `scroll-position`
- `toolbar-prod-detail`
- `faq`
- `review`
- `images-with-text-scrolling`
- `table-compare`
- `image-with-text-overlay`

Still needed:
- `main-product` custom migration

## Main product custom logic still needed

Custom blocks from old theme:
- `line_item_property`
- `dropdown_data`
- `gift_free`
- `shipping`
- `top_comment`
- `collapsible_text`
- `image`
- `offer`

Snippets in old theme tied to product page:
- `dropdown_data.liquid`
- `gift-free.liquid`
- `shipping.liquid`
- `top-comment.liquid`
- `offer.liquid`

Notes:
- `main-product` in old theme is heavily customized and cannot be copied directly into Dawn-based `autocarfull`.
- The safest order is `main-product` first, then `faq`, `review`, `table-compare`, `images-with-text-scrolling`, and `image-with-text-overlay`.
