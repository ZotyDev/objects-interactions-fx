import { ObjectsInteractionsFX as OIF } from "../objects_interactions_fx";

// @ts-ignore
export class EffectManagerApplication extends Application {
  static #instance: EffectManagerApplication;

  constructor(options) {
    super(options);

    if (EffectManagerApplication.#instance !== undefined) {
      // @ts-ignore
      EffectManagerApplication.#instance.close();
    }

    EffectManagerApplication.#instance = this;

    document.addEventListener('keydown', EffectManagerApplication._onKeydown);
  }

  static get defaultOptions() {
    const defaultOptions = super.defaultOptions;

    const overrideOptions = {
      id: 'oif-effect-manager',
      template: OIF.TEMPLATES.EFFECT_MANAGER,
      title: 'Effect Manager',
      popOut: false,
    };

    // @ts-ignore
    const mergedOptions = foundry.utils.mergeObject(defaultOptions, overrideOptions);
    return mergedOptions;
  }

  static _onKeydown(e) {
    if (e.key === 'Escape') {
      if (EffectManagerApplication.#instance) {
        // @ts-ignore
        EffectManagerApplication.#instance.close();
      }

      document.removeEventListener('keydown', EffectManagerApplication._onKeydown);
    }

    e.preventDefault();
    e.stopPropagation();
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  getData(options) {
    return {}
  }

  async _updateObject(event, formData) {}
}
