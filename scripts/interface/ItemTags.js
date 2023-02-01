import { ObjectsInteractionsFX } from '../ObjectsInteractionsFX.js';
import { ObjectsInteractionsFXData as OIFD } from '../data/ObjectsInteractionsFXData.js';

export class ItemTags extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            closeOnSubmit: false,
            height: 'auto',
            id: 'item-tags',
            submitOnChange: true,
            template: ObjectsInteractionsFX.TEMPLATES.ITEM_TAGS,
            title: "Tags",
            item: '',
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

        return mergedOptions;
    }

    async _handleEnterKeypress(event) {
        if (event.key == "Enter") {
            let CurrentTags = await OIFD.GetData(this.options.item, event.target.value);
            CurrentTags.push(event.target.value);
            await OIFD.UpdateData(this.options.item, CurrentTags);
            event.target.value = "";
            this.render({ focus: true });
        }
    }

    async _handleLinkClick(event) {
        let ClickedElement = $(event.currentTarget);
        let CurrentTags = await OIFD.GetData(this.options.item, event.target.value);
        CurrentTags.splice(ClickedElement[0].id, 1);
        await OIFD.UpdateData(this.options.item, CurrentTags);
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('keypress', null, this._handleEnterKeypress.bind(this));
        html.on('click', 'i', this._handleLinkClick.bind(this));
    }

    getData(options) {
        return {
            itemTags: OIFD.GetData(options.item)
        }
    }

    async _updateObject(event, formData) {
    }
}