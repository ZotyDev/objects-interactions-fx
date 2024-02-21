// @ts-nocheck
import { ObjectsInteractionsFX as OIF } from "../objects_interactions_fx";

export class HandlebarsHelpers {
  static initialize() {
    let Parts = {
      'oif.settings.name'    : 'settings_name.hbs',
      'oif.settings.checkbox': 'settings_checkbox.hbs',
      'oif.settings.slider'  : 'settings_slider.hbs',
      'oif.settings.dropdown': 'settings_dropdown.hbs',
      'oif.settings.string'  : 'settings_string.hbs',

      'oif.config.title'   : 'config_title.hbs',
      'oif.config.name'    : 'config_name.hbs',
      'oif.config.checkbox': 'config_checkbox.hbs',
      'oif.config.slider'  : 'config_slider.hbs',
      'oif.config.dropdown': 'config_dropdown.hbs',
      'oif.config.string'  : 'config_string.hbs',
      'oif.config.color'   : 'config_color.hbs',
      'oif.config.icon'    : 'config_icon.hbs',

      'oif.masterTag.lighting': 'masterTag/Lighting.hbs',

      'oif.masterTag.special.powerful': 'masterTag/special/Powerful.hbs',
      'oif.masterTag.special.generateCurrency': 'masterTag/special/GenerateCurrency.hbs'
    }

    Hooks.on('ready', () => {
      Object.keys(Parts).forEach((key) => {
        Parts[key] = `modules/${OIF.ID}/module/templates/parts/${Parts[key]}`
      });

      loadTemplates(Parts);

      Handlebars.registerHelper('masterTagAnimation', (origin, type) => {
        let Header = `
        <h3> ${game.i18n.localize('OIF.Settings.MasterTagConfiguration.Tag.' + type)} </h3>
        `;

        let Body = `
        <label for="oif-${type}-animation"> ${game.i18n.localize('OIF.Settings.MasterTagConfiguration.Tag.Animation')} </label>
        <input class="oif-animation-input-text" name="oif-${type}-animation" type="text" ${origin?.source ? 'value="' + origin.source + '"' : ''}>

        <label for="oif-${type}-delay"> ${game.i18n.localize('OIF.Settings.MasterTagConfiguration.Tag.Delay')} </label>
        <input class="oif-animation-input-text" name="oif-${type}-delay" type="text" ${origin?.delay ? 'value="' + origin.delay + '"' : ''}>
        `;

        let Complete = (Header + Body);

        return new Handlebars.SafeString(Complete);
      })
    });
  }
}
