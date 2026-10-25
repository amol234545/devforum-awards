import "material/nav/rail.js";
import "material/nav/item.js";
import "material/nav/bar.js";
import "material/icon/icon.js";
import "material/badge/badge.js";

import { css, html, LitElement } from "lit";

class Navigation extends LitElement {
  static properties = {
    page: { type: String },
  };

  constructor() {
    super();
    this.page = "Vote";
  }
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      height: calc(var(--app-nav-height, 80px) + env(safe-area-inset-bottom, 0px));
      padding-bottom: env(safe-area-inset-bottom, 0px);
      background: var(--md-sys-color-surface-container, #f7f3fb);
      box-shadow: 0 -2px 16px rgb(32 24 40 / 8%);
    }

    .layout-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }

    md-nav-bar {
      display: block;
      width: 100%;
      height: var(--app-nav-height, 80px);
      --md-navigation-bar-container-height: var(--app-nav-height, 80px);
      --_container-height: var(--app-nav-height, 80px);
    }
  `;

  render() {
    const items = [
      { label: "Home", icon: "home" },
      { label: "Categories", icon: "category", href: "/categories" },
      { label: "Voting", icon: "how_to_vote", href: "/voting"},
      { label: "Results", icon: "bar_chart", href: "/results" },
      { label: "Profile", icon: "account_circle", href: "/profile" },
    ];

    const activeIndex = items.findIndex(
      (item) => item.label.toLowerCase() === this.page.toLowerCase(),
    );

    return html`
      <div class="layout-container">
        <md-nav-bar active-index="${activeIndex < 0 ? 0 : activeIndex}">
          ${items.map((item) =>
            html`
              <md-nav-item
                label="${item.label}"
                ?show-badge="${item.badge !== undefined}"
                badge-value="${item.badge ?? ""}"
                href="${item.href ?? "/"}"
              >
                <md-icon slot="active-icon">${item.icon}</md-icon>
                <md-icon slot="inactive-icon">${item.icon}</md-icon>
              </md-nav-item>
            `
          )}
        </md-nav-bar>
      </div>
    `;
  }
}

customElements.define("app-navigation", Navigation);
