import "material/list/list.js";
import "material/list/list-item.js";
import "material/radio/radio.js";

import { css, html, LitElement } from "lit";

class VotingList extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    md-list {
      width: 100%;
      max-width: 52rem;
      margin: 0 auto;
      padding: 0;
    }

    md-list-item {
      width: 100%;
      min-width: 0;
    }

    .avatar {
      display: block;
      width: clamp(48px, 13vw, 72px);
      height: clamp(48px, 13vw, 72px);
      flex: 0 0 auto;
      border-radius: 50%;
      object-fit: cover;
    }

    .headline,
    .supporting {
      display: block;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    .headline {
      font-size: clamp(1rem, 2.5vw, 1.125rem);
      line-height: 1.3;
    }

    .supporting {
      font-size: 0.875rem;
      line-height: 1.35;
    }

    md-radio {
      flex: 0 0 auto;
      margin-inline: 4px;
    }
  `;

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
                class="avatar"
              />

              <div slot="headline" class="headline">
                ${name}
              </div>

              <div slot="supporting-text" class="supporting">
                ${category.description || category.supportingText || ""}
              </div>

              <md-radio
                slot="end"
                name="group"
                value=${value}
                ?checked=${this.selected === value}
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
