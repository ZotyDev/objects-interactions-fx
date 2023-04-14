import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

let Parts = {
    'oif.settings.name'    : 'settings/Name.hbs',
    'oif.settings.checkbox': 'settings/Checkbox.hbs',
    'oif.settings.slider'  : 'settings/Slider.hbs',
    'oif.settings.dropdown': 'settings/Dropdown.hbs',
    'oif.settings.string'  : 'settings/String.hbs',

    'oif.config.title'   : 'config/Title.hbs',
    'oif.config.name'    : 'config/Name.hbs',
    'oif.config.checkbox': 'config/Checkbox.hbs',
    'oif.config.slider'  : 'config/Slider.hbs',
    'oif.config.dropdown': 'config/Dropdown.hbs',
    'oif.config.string'  : 'config/String.hbs',
    'oif.config.color'   : 'config/Color.hbs',
    'oif.config.icon'    : 'config/Icon.hbs',

    'oif.masterTag.lighting': 'masterTag/Lighting.hbs',

    'oif.masterTag.special.powerful': 'masterTag/special/Powerful.hbs',
    'oif.masterTag.special.generateCurrency': 'masterTag/special/GenerateCurrency.hbs'
}

Hooks.on('ready', () => {
    Object.keys(Parts).forEach((key) => {
        Parts[key] = `modules/${OIF.ID}/templates/parts/${Parts[key]}`
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