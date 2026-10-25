import "material/list/list.js";
import "material/list/list-item.js";

import { html, LitElement } from "lit";

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

class CategoryList extends LitElement {
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
          ${this.categories.map(
            (category, index) =>
              html`
                <md-list-item
                  style="--md-list-item-label-text-color: ${palette[index]}"
                  type="text"
                >
                  <div slot="headline">${category}</div>
                </md-list-item>
              `,
          )}
        </md-list>
      </div>
    `;
  }
}

customElements.define("category-list", CategoryList);
