import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StorageData, store } from '../lib/store';
import './settings-button.css';

@customElement('settings-button')
export class SettingsButton extends LitElement {
  @property({ type: Boolean })
  open: boolean = false;

  @property({ type: String })
  openAIAPIToken: string = '';

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    store.subscribe((data) => {
      this.openAIAPIToken = data.settings?.openAIAPIToken;
    });
    super.connectedCallback();
  }

  onSave(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('openAIAPIToken') as HTMLInputElement;
    const openAIAPIToken = input.value;
    const settings = store.get().settings;

    store.update({ settings: { openAIAPIToken, ...settings } });

    this.toggleDialog();
  }

  onClear(e: SubmitEvent) {
    e.preventDefault();

    const settings = store.get().settings;
    delete settings.openAIAPIToken;

    store.update({ settings: settings });
  }

  onDismiss() {
    // 1. clear any data
    // 2. close modal
    this.toggleDialog();
  }

  toggleDialog() {
    const dialog = this.querySelector<HTMLDialogElement>(
      '[data-settings-dialog]'
    );
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  render() {
    return html`
      <button
        aria-label="open settings"
        class="menu-button"
        @click="${this.toggleDialog}"
      >
        <svg
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <dialog data-settings-dialog>
        <div class="dialog-header">
          <h2>Settings</h2>
          <button
            aria-label="close dialog"
            class="close-dialog-button"
            @click="${this.onDismiss}"
          >
            <svg
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="dialog-content">
          ${this.openAIAPIToken
            ? html`
                <div class="read-only-settings">
                  <label>OpenAI API token</label>
                  <div class="value-row">
                    <div class="value">••••••••••••••••</div>
                    <button @click="${this.onClear}">Clear</button>
                  </div>
                </div>
              `
            : html`
                <form
                  id="settings-form"
                  class="settings-form"
                  @submit="${this.onSave}"
                >
                  <label for="openAIAPIToken">OpenAI API token</label>
                  <input id="openAIAPIToken" name="openAIAPIToken" />
                </form>
              `}
        </div>
        <div class="dialog-footer">
          <button type="submit" form="settings-form">Save</button>
          <button @click="${this.onDismiss}">Cancel</button>
        </div>
      </dialog>
    `;
  }
}
