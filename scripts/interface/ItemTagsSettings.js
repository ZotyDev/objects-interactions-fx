import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class ItemTagsSettings extends FormApplication {
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            closeOnSubmit: false,
            height: 'auto',
            id: 'oif-item-tags-settings',
            submitOnChange: true,
            template: OIF.TEMPLATES.ITEM_TAGS_SETTINGS,
            title: game.i18n.localize('OIF.Settings.ItemTagsSettings.Title'),
            item: '',
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }
}