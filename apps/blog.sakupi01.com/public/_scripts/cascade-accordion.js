// CSS Cascade Accordion Web Component
// Displays CSS Cascade levels 4-6 based on enabled features:
// - Level 6: With Scope Proximity (requires Layers)
// - Level 5: With Cascade Layers only
// - Level 4: Basic cascade without Layers or Scope
//
// Attributes:
// - show-layers: boolean (default: true)
// - show-scope-proximity: boolean (default: true)
// - disabled: boolean (default: false) - disables all controls

// CSS Cascade Accordion Component Usage:

// 1. Default (Level 6 - all features):
// <cascade-accordion></cascade-accordion>

// 2. Level 5 (Layers only):
// <cascade-accordion show-scope-proximity="false"></cascade-accordion>

// 3. Level 4 (basic cascade):
// <cascade-accordion show-layers="false"></cascade-accordion>

// 4. Disabled controls (read-only):
// <cascade-accordion disabled></cascade-accordion>

// 5. Custom initial state with disabled:
// <cascade-accordion show-scope-proximity="false" disabled></cascade-accordion>

// Dependencies:
// - Scope Proximity requires Layers to be enabled
// - Disabling Layers automatically disables Scope Proximity
// - Enabling Scope Proximity automatically enables Layers
class CascadeAccordion extends HTMLElement {
  static get observedAttributes() {
    return ["show-layers", "show-scope-proximity", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Initialize state
    this._showLayers = true;
    this._showScopeProximity = true;
    this._disabled = false;
    this._setupControlsDone = false;
  }

  connectedCallback() {
    // Get initial values from attributes if set
    this._showLayers = this.getAttribute("show-layers") !== "false";
    this._showScopeProximity =
      this.getAttribute("show-scope-proximity") !== "false";
    this._disabled = this.getAttribute("disabled") !== null;

    // Scope Proximity requires Layers
    if (this._showScopeProximity && !this._showLayers) {
      this._showLayers = true;
    }

    this.render();
    this.setupAccordion();
    this.setupControls();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case "show-layers":
          this._showLayers = newValue !== "false";
          // If Layers is turned off, Scope Proximity must also be turned off
          if (!this._showLayers && this._showScopeProximity) {
            this._showScopeProximity = false;
            // Use setTimeout to avoid recursive calls
            setTimeout(
              () => this.setAttribute("show-scope-proximity", "false"),
              0,
            );
          }
          break;
        case "show-scope-proximity":
          this._showScopeProximity = newValue !== "false";
          // If Scope Proximity is turned on, Layers must also be turned on
          if (this._showScopeProximity && !this._showLayers) {
            this._showLayers = true;
            // Use setTimeout to avoid recursive calls
            setTimeout(() => this.setAttribute("show-layers", "true"), 0);
          }
          break;
        case "disabled":
          this._disabled = newValue !== null;
          // Reset setup flag when disabled state changes
          this._setupControlsDone = false;
          break;
      }
      this.render();
      this.setupAccordion();

      // Re-setup controls only if disabled state changed
      if (name === "disabled" && !this._disabled) {
        this.setupControls();
      }
    }
  }

  get showLayers() {
    return this._showLayers;
  }

  get showScopeProximity() {
    return this._showScopeProximity;
  }

  get disabled() {
    return this._disabled;
  }

  getCascadeLevel() {
    if (this.showScopeProximity) {
      return {
        level: 6,
        url: "https://www.w3.org/TR/2024/WD-css-cascade-6-20240906/#cascade-sort",
        text: "CSS Cascading and Inheritance Level 6",
      };
    }
    if (this.showLayers) {
      return {
        level: 5,
        url: "https://www.w3.org/TR/css-cascade-5/#cascade-sort",
        text: "CSS Cascading and Inheritance Level 5",
      };
    }
    return {
      level: 4,
      url: "https://www.w3.org/TR/css-cascade-4/#cascade-sort",
      text: "CSS Cascading and Inheritance Level 4",
    };
  }

  render() {
    const layers = this.getLayers();
    const cascadeInfo = this.getCascadeLevel();

    this.shadowRoot.innerHTML = `
                    <style>
                        ${this.getStyles()}
                    </style>
                    <div class="component-wrapper">
                        ${
                          !this.disabled
                            ? `
                        <div class="controls">
                            <label>
                                <input type="checkbox" id="showLayers" ${this.showLayers ? "checked" : ""}>
                                Show Layers (Level 5)
                            </label>
                            <label title="Requires Layers to be enabled" class="${!this.showLayers ? "disabled" : ""}">
                                <input type="checkbox" id="showScopeProximity" ${this.showScopeProximity ? "checked" : ""} ${!this.showLayers ? "disabled" : ""}>
                                Show Scope Proximity (Level 6)
                            </label>
                        </div>`
                            : ""
                        }
                        
                        <div class="cascade-container">
                            <div class="cascade-title">The Cascade</div>
                            <small style="color: light-dark(var(--color-base-dark), var(--color-base-light)); display: block; margin-bottom: 12px;">
                                - based on <a href="${cascadeInfo.url}" 
                                             target="_blank" rel="noopener">
                                    ${cascadeInfo.text}
                                </a>
                                <span style="margin-left: 10px; color: light-dark(#6d6ded, #6dd5ed); font-weight: bold;">[Level ${cascadeInfo.level}]</span>
                            </small>
                            <div>
                                ${layers.map((layer) => layer.render()).join("")}
                            </div>
                        </div>
                    </div>
                `;
  }

  getLayers() {
    const layers = [];
    const cascadeInfo = this.getCascadeLevel();

    // 1. Origin and Importance (CSS Level 1)
    layers.push({
      class: "origin-importance",
      title: "Origin & Importance",
      render: () => `
                        <details class="origin-importance" name="cascade-accordion">
                            <summary>Origin & Importance</summary>
                            <div class="layer-content">
                                <div class="layer-content-grid">
                                    <div class="content-section content-section-fill">✨ Transition declarations</div>
                                    <div class="content-section content-section-right" style="background: rgba(0, 0, 0, 0.4);">
                                        <h4>important</h4>
                                        <div class="content-item">❗🖥️ User Agent</div>
                                        <div class="content-item">❗👤 User</div>
                                        <div class="content-item">❗🌐 Author</div>
                                    </div>
                                    <div class="content-section content-section-fill">✨ Animation declarations</div>
                                    <div class="content-section content-section-left">
                                        <h4>normal</h4>
                                        <div class="content-item">🌐 Author</div>
                                        <div class="content-item">👤 User</div>
                                        <div class="content-item">🖥️ User Agent</div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    `,
    });

    // 2. Context (Shadow DOM handling)
    layers.push({
      class: "context",
      title: "Context",
      render: () => `
                        <details class="context" name="cascade-accordion">
                            <summary>(Shadow) Context</summary>
                            <div class="layer-content">
                                <div class="content-grid">
                                    <div class="content-section content-section-important">
                                        <h4>important</h4>
                                        <div class="content-item">❗🌚 Inner Context (Shadow)</div>
                                        <div class="content-item">❗🌝 Outer Context (Light)</div>
                                    </div>
                                    <div class="content-section">
                                        <h4>normal</h4>
                                        <div class="content-item">🌝 Outer Context (Light)</div>
                                        <div class="content-item">🌚 Inner Context (Shadow)</div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    `,
    });

    // 3. The Style Attribute (inline styles)
    layers.push({
      class: "style-attribute",
      title: "The Style Attribute",
      render: () => `
                        <details class="style-attribute" name="cascade-accordion">
                            <summary> ${cascadeInfo.level < 5 ? "Top in Specificity: " : ""}The Style Attribute</summary>
                            <div class="layer-content">
                                <div class="content-grid">
                                    <div class="content-section content-section-important">
                                        <h4>important</h4>
                                        <div class="layer-item">❗ style="..." (inline)</div>
                                        <div class="layer-item">❗ Style rules</div>
                                    </div>
                                    <div class="content-section">
                                        <h4>normal</h4>
                                        <div class="layer-item">style="..." (inline)</div>
                                        <div class="layer-item">Style rules</div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    `,
    });

    // 4. Layers (conditionally rendered) - CSS Cascade Level 5
    if (this.showLayers) {
      layers.push({
        class: "cascade-layers",
        title: "Layers",
        render: () => `
                            <details class="cascade-layers" name="cascade-accordion">
                                <summary>Layers <span class="new-badge">Level 5</span></summary>
                                <div class="layer-content">
                                    <div class="content-grid">
                                        <div class="content-section content-section-important">
                                            <h4>important</h4>
                                            <div class="layer-item">❗ first @layer</div>
                                            <div class="layer-item">❗ ...</div>
                                            <div class="layer-item">❗ last @layer</div>
                                            <div class="layer-item">❗ unlayered</div>
                                        </div>
                                        <div class="content-section">
                                            <h4>normal</h4>
                                            <div class="layer-item">unlayered</div>
                                            <div class="layer-item">last @layer</div>
                                            <div class="layer-item">...</div>
                                            <div class="layer-item">first @layer</div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        `,
      });
    }

    // 5. Specificity (selector weight calculation)
    layers.push({
      class: "selector-specificity",
      title: "Specificity",
      render: () => `
                        <details class="selector-specificity" name="cascade-accordion">
                            <summary>Specificity</summary>
                            <div class="layer-content">
                                <div class="code-example">#id /* (1,0,0) */</div>
                                <div class="code-example">.class, :pseudo-class, [attr] /* (0,1,0) */</div>
                                <div class="code-example">element, ::pseudo-element /* (0,0,1) */</div>
                                <div class="code-example">*, :where() /* (0,0,0) */</div>
                            </div>
                        </details>
                    `,
    });

    // 6. Scope Proximity (conditionally rendered) - CSS Cascade Level 6
    if (this.showScopeProximity) {
      layers.push({
        class: "scope-proximity",
        title: "Scope Proximity",
        render: () => `
                            <details class="scope-proximity" name="cascade-accordion">
                                <summary>Scope Proximity <span class="new-badge">Level 6</span></summary>
                                <div class="layer-content">
                                    <div class="scope-example">
                                        <h5>Scoping Root Distance</h5>
                                        <div class="proximity-item">@scope (.card) { ... } /* 0 hops */</div>
                                        <div class="proximity-item">@scope (.container) { .card { ... } } /* 1 hop */</div>
                                        <div class="proximity-item">@scope (body) { .container .card { ... } } /* 2 hops */</div>
                                        <div class="proximity-item">/* No scope = ∞ hops */</div>
                                    </div>
                                    <p style="font-size: 13px; opacity: 0.8; margin-top: 10px;">
                                        Fewer hops = Higher priority
                                    </p>
                                </div>
                            </details>
                        `,
      });
    }

    // 7. Order of Appearance (source order)
    layers.push({
      class: "order-appearance",
      title: "Order of Appearance",
      render: () => `
                        <details class="order-appearance" name="cascade-accordion">
                            <summary>Order of Appearance</summary>
                            <div class="layer-content">
                                <p style="font-size: 14px; opacity: 0.9; text-align: center;">
                                    The last declaration in document order wins
                                </p>
                                <div class="code-example" style="margin-top: 15px;">
                                    /* Later rules override earlier ones */
                                    <br>p { color: blue; }
                                    <br>p { color: red; } /* This wins */
                                </div>
                            </div>
                        </details>
                    `,
    });

    return layers;
  }

  getStyles() {
    // Recalculate positions based on visible layers
    const visibleLayers = this.getLayers();
    const cascadeInfo = this.getCascadeLevel();

    return `
                    /* Reset and base styles */
                    :host {
                        display: block;
                        width: 100%;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    .component-wrapper {
                        display: flex;
                        flex-direction: column;
                        gap: 30px;
                        align-items: center;
                    }
                    
                    /* Controls styles */
                    .controls {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px 25px;
                        border-radius: 10px;
                        display: flex;
                        gap: 30px;
                        flex-wrap: wrap;
                        justify-content: center;
                        border: 1px solid light-dark(var(--color-base-dark), var(--color-base-light));
                    }
                    
                    .controls.controls-disabled {
                        opacity: 0.6;
                        background: rgba(255, 255, 255, 0.05);
                    }

                    .controls label {
                        color: light-dark(var(--color-base-dark), var(--color-base-light));
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: color 0.3s ease;
                    }
                    
                    .controls label:hover {
                        color: light-dark(#6d6ded, #6dd5ed)
                    }
                    
                    .controls label.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    
                    .controls label.disabled:hover {
                        color: white;
                    }

                    .controls input[type="checkbox"] {
                        cursor: pointer;
                        width: 18px;
                        height: 18px;
                        color: light-dark(#6d6ded, #6dd5ed)
                    }
                    
                    .controls input[type="checkbox"]:disabled {
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                    
                    /* Container styles */
                    .cascade-container {
                        width: 100%;
                        max-width: 700px;
                        perspective: 1000px;
                    }

                    .cascade-title {
                        color: light-dark(var(--color-base-dark), var(--color-base-light));;
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 5px;
                        opacity: 0.95;
                        letter-spacing: -1px;
                    }

                    .cascade-layers {
                        position: relative;
                        transform-style: preserve-3d;
                    }

                    /* Details and summary styles */
                    details {
                        margin: 0;
                        position: relative;
                        transition: all 0.3s ease;
                        padding-bottom: 5px;
                    }

                    details[open] {
                        z-index: 20;
                        transform: translateZ(20px);
                    }

                    details[open] .layer-content {
                        margin-bottom: 10px;
                    }

                    summary {
                        cursor: pointer;
                        padding: 18px 20px;
                        list-style: none;
                        font-weight: 600;
                        font-size: 16px;
                        position: relative;
                        user-select: none;
                        display: flex;
                        align-items: center;
                        transition: all 0.3s ease;
                    }

                    summary::-webkit-details-marker {
                        display: none;
                    }

                    summary::before {
                        content: '▶';
                        margin-right: 10px;
                        transition: transform 0.3s ease;
                        font-size: 12px;
                    }

                    details[open] summary::before {
                        transform: rotate(90deg);
                    }

                    summary:hover {
                        filter: brightness(1.05);
                        transform: translateX(2px);
                    }

                    .layer-content {
                        padding: 20px 5px;
                        animation: fadeIn 0.3s ease;
                        position: relative;
                        z-index: 1;
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* Layer-specific colors */
                    .origin-importance {
                        --bg-color: linear-gradient(90deg, #6dd5ed 0%, #0c4b5a 100%);
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .context {
                        --bg-color: linear-gradient(90deg, #667eea 0%, #3a1363 100%);
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .style-attribute {
                        ${
                          cascadeInfo.level < 5
                            ? `
                          --bg-color: #fa7070;
                          background: var(--bg-color);
                          `
                            : `
                          --bg-color: linear-gradient(90deg, #f093fb 0%, #39175c 100%);
                          background: var(--bg-color);
                          `
                        }
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .cascade-layers {
                        --bg-color: linear-gradient(90deg, #f093fb 0%, #70212c 100%);
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .selector-specificity {
                        --bg-color: #fa7070;
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .scope-proximity {
                        --bg-color: #fa709a;
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: white;
                    }

                    .order-appearance {
                        --bg-color: #feca57;
                        background: var(--bg-color);
                        // color: contrast-color(var(--bg-color));
                        color: #1a1a1a;
                    }

                    /* Dynamic positioning for visible layers */
                    ${visibleLayers
                      .map((layer, index) => {
                        const percentage =
                          visibleLayers.length > 1
                            ? (index / (visibleLayers.length - 1)) * 18
                            : 0;
                        return `
                            .${layer.class} {
                                margin-top: ${index === 0 ? "0" : "-1px"};
                                z-index: ${visibleLayers.length - index};
                                clip-path: polygon(${percentage}% 0, ${100 - percentage}% 0, ${100 - percentage - 3}% 100%, ${percentage + 3}% 100%);
                            }
                            
                            .${layer.class} summary {
                                width: ${75 - index * 4}%;
                                margin: 0 auto;
                            }

                            .${layer.class} .layer-content {
                                width: ${75 - index * 4}%;
                                margin: 0 auto;
                            }
                            
                        `;
                      })
                      .join("")}

                    /* Content styling */
                    .layer-content-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }

                    .content-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }

                    .content-section-fill {
                        grid-column: 1 / 3;
                    }

                    .content-section-right {
                        grid-column: 2 / 3;
                    }

                    .content-section-left {
                        grid-column: 1 / 2;
                    }

                    .content-section-important {
                        background: rgba(0, 0, 0, 0.4);
                        order: 1;
                    }

                    .content-section {
                        background: rgba(0, 0, 0, 0.2);
                        padding: 10px;
                        border-radius: 8px;
                    }

                    .content-section h4 {
                        font-size: 14px;
                        margin-block: 10px;
                        opacity: 0.8;
                        text-transform: lowercase;
                        font-style: italic;
                    }

                    .content-item,
                    .layer-item {
                        display: flex;
                        align-items: center;
                        padding: 8px 0;
                    }

                    .code-example {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 10px;
                        border-radius: 4px;
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                        margin: 5px 0;
                    }

                    .scope-example {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 15px;
                        border-radius: 8px;
                        margin: 10px 0;
                    }

                    .scope-example h5 {
                        margin: 0 0 10px 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }

                    .proximity-item {
                        padding: 5px 0;
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                    }

                    /* Badge for new features */
                    .new-badge {
                        background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
                        color: #fff;
                        padding: 3px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: bold;
                        margin-left: 8px;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                    }

                    /* Link styles */
                    a {
                        color: light-dark(#6d6ded, #6dd5ed);
                        text-decoration: none;
                        border-bottom: 1px dotted light-dark(#6d6ded, #6dd5ed);
                        transition: all 0.3s ease;
                    }
                    
                    a:hover {
                        border-bottom-style: solid;
                    }

                    /* Responsive */
                    @media (max-width: 600px) {
                        .content-grid {
                            grid-template-columns: 1fr;
                        }
                        .layer-content {
                            padding: 20px;
                        }
                        .controls {
                            gap: 15px;
                            padding: 15px;
                        }
                        .cascade-title {
                            font-size: 20px;
                        }
                        .content-section-important {
                          order: -1;
                        }
                    }
                `;
  }

  setupAccordion() {
    const accordions = this.shadowRoot.querySelectorAll(
      'details[name="cascade-accordion"]',
    );

    for (const accordion of accordions) {
      accordion.addEventListener("toggle", (e) => {
        if (e.target.open) {
          for (const otherAccordion of accordions) {
            if (otherAccordion !== e.target && otherAccordion.open) {
              otherAccordion.open = false;
            }
          }
        }
      });
    }

    // Keyboard navigation
    accordions.forEach((accordion, index) => {
      const summary = accordion.querySelector("summary");

      summary.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextAccordion = accordions[index + 1] || accordions[0];
          nextAccordion.querySelector("summary").focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevAccordion =
            accordions[index - 1] || accordions[accordions.length - 1];
          prevAccordion.querySelector("summary").focus();
        }
      });
    });
  }

  setupControls() {
    // Prevent multiple event listener attachments
    if (this._setupControlsDone) {
      return;
    }

    // If component is disabled, don't setup controls
    if (this.disabled) {
      return;
    }

    // Setup internal controls
    const showLayersCheckbox = this.shadowRoot.getElementById("showLayers");
    const showScopeProximityCheckbox =
      this.shadowRoot.getElementById("showScopeProximity");

    if (showLayersCheckbox) {
      showLayersCheckbox.addEventListener("change", () => {
        // Set attribute, which will trigger attributeChangedCallback
        this.setAttribute("show-layers", showLayersCheckbox.checked);
      });
    }

    if (showScopeProximityCheckbox) {
      showScopeProximityCheckbox.addEventListener("change", () => {
        // Set attribute, which will trigger attributeChangedCallback
        this.setAttribute(
          "show-scope-proximity",
          showScopeProximityCheckbox.checked,
        );
      });
    }

    this._setupControlsDone = true;
  }
}

customElements.define("cascade-accordion", CascadeAccordion);
