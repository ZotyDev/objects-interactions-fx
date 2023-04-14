import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ActorInventorSettings } from "./ActorInventorSettings.js";

import { SettingsSkeleton } from "../library/skeletons/SettingsSkeleton.js";

export class GeneralSettings extends SettingsSkeleton {
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            id: 'oif-general-settings',
            title: game.i18n.localize('OIF.Settings.GeneralSettings.Title')
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }

    activateListeners(html)
    {
        super.activateListeners(html, 'oif-general-settings');
    }

    static Register(name, options)
    {
        SettingsSkeleton._protoRegister('oif-general-settings', name, options);
    }

    static Get(name)
    {
        return SettingsSkeleton._protoGet('oif-general-settings', name);
    }

    static UpdateSettings()
    {
        SettingsSkeleton._protoUpdateSettings('oif-general-settings');
    }

    getData(options)
    {
        return SettingsSkeleton._protoGetData('oif-general-settings', options)
    }

    async _updateObject(event, formData) 
    {}
}