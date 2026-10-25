import "material/list/list.js";
import "material/list/list-item.js";
import "material/radio/radio.js";

import { html, LitElement } from "lit";

class VotingList extends LitElement {
  static properties = {
    categories: { type: Array },
    selected: { type: String },
  };

  constructor() {
    super();
    this.categories = [];
    this.selected = "";
  }

  render() {
    return html`
      <md-list>
        ${this.categories.map((category, index) => {
          const value = String(category.id ?? index + 1);
          const name = category.username || category.name || category;

          return html`
            <md-list-item type="text">
              <img
                slot="start"
                src=${category.avatar || "./assets/avatar.png"}
                alt="Avatar"
                style="width: 100px; height: 100px; border-radius: 50%;"
              />

              <div slot="headline" style="font-size: medium;">
                ${name}
              </div>

              <div slot="supporting-text" style="font-size: small;">
                ${category.description || category.supportingText || ""}
              </div>

              <md-radio
                slot="end"
                name="group"
                value=${value}
                ?checked=${this.selected === value}
                style="position: absolute; right: 10px;"
                @change=${() => {
                  this.selected = value;

                  this.dispatchEvent(
                    new CustomEvent("vote-change", {
                      detail: {
                        selected: value,
                        category,
                      },
                      bubbles: true,
                      composed: true,
                    }),
                  );
                }}
              ></md-radio>
            </md-list-item>
          `;
        })}
      </md-list>
    `;
  }
}

customElements.define("voting-list", VotingList);