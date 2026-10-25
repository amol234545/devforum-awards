import "material/list/list.js";
import "material/list/list-item.js";

import { css, html, LitElement } from "lit";

function generateCohesivePalette(colorCount = 5) {
  const palette = [];
  const baseHue = Math.floor(Math.random() * 360);

  for (let i = 0; i < colorCount; i++) {
    const hue = (baseHue + i * (360 / colorCount)) % 360;
    const saturation = 70 + Math.floor(Math.random() * 20);
    const lightness = 50 + Math.floor(Math.random() * 15);

    palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return palette;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


class CategoryList extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .layout-container {
      width: 100%;
      max-width: 56rem;
      margin: 0 auto;
    }

    md-list {
      width: 100%;
      padding: 0;
    }

    .category-name {
      display: block;
      max-width: 100%;
      overflow-wrap: anywhere;
      font-size: clamp(1rem, 3vw, 1.5rem);
      line-height: 1.3;
    }
  `;

  static properties = {
    categories: { type: Array },
  };

  constructor() {
    super();
    this.categories = [];
  }

  render() {
    const palette = generateCohesivePalette(this.categories.length);

    return html`
      <div class="layout-container">
        <md-list>
          ${shuffle(this.categories).map(
            (category, index) =>
              html`
                <md-list-item
                  style="--md-list-item-label-text-color: ${palette[index]}"
                  type="text"
                >
                  <div slot="headline"><span class="category-name">${category}</span></div>
                </md-list-item>
              `,
          )}
        </md-list>
      </div>
    `;
  }
}

customElements.define("category-list", CategoryList);
