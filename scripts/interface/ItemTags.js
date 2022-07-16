import { ObjectsInteractionsFX } from '../ObjectsInteractionsFX.js';
import { ObjectsInteractionsFXData } from '../data/ObjectsInteractionsFXData.js';

export class ItemTags extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            closeOnSubmit: false,
            height: 'auto',
            id: 'item-tags',
            submitOnChange: true,
            template: ObjectsInteractionsFX.TEMPLATES.ITEM_TAGS,
            title: "Item Tags",
            item: '',
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

        return mergedOptions;
    }

    async _handleButtonClick(event) {
        const ClickedElement = $(event.currentTarget);
        const Action = ClickedElement.data().action;
        let CurrentTags = ClickedElement.parent().find('input[name="itemTags"]').val();

        if (Action == 'save') {
            await ObjectsInteractionsFXData.UpdateData(this.options.item, CurrentTags);
            await this.close();
        }
    }

    async _handleEnter(event) {
        console.log(event);
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "[data-action]", this._handleButtonClick.bind(this));
    }

    getData(options) {
        return {
            itemTags: ObjectsInteractionsFXData.GetData(options.item)
        }
    }

    async _updateObject(event, formData) {
        let CurrentTags = foundry.utils.expandObject(formData).itemTags;

        await ObjectsInteractionsFXData.UpdateData(this.options.item, CurrentTags);
    }
}