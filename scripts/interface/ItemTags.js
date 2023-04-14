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

    async _handleEnterKeypress(html, event) {
        if (event.key == "Enter") {
            let CurrentTags = await OIFD.GetData(this.options.item, event.target.value);
            CurrentTags.push(event.target.value);
            await OIFD.UpdateData(this.options.item, CurrentTags);
            event.target.value = "";
            this.render();
            html[0].querySelector('input[class="oif-tag-input"]')?.focus();
        }
    }

    async _handleLinkClick(html, event) {
        let ClickedElement = $(event.currentTarget);
        let CurrentTags = await OIFD.GetData(this.options.item, event.target.value);
        CurrentTags.splice(ClickedElement[0].id, 1);
        await OIFD.UpdateData(this.options.item, CurrentTags);
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('keypress', 'input[class="oif-tag-input"]', this._handleEnterKeypress.bind(this, html));
        html.on('click', 'i[class="fas fa-times"]', this._handleLinkClick.bind(this, html));

        html[0].querySelector('input[class="oif-tag-input"]')?.focus();
    }

    getData(options) {
        return {
            itemTags: OIFD.GetData(options.item)
        }
    }

    async _updateObject(event, formData) {
    }
}