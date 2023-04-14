import { SettingsSkeleton } from "../library/skeletons/SettingsSkeleton.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class ActorInventorSettings extends SettingsSkeleton {
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            id: 'oif-actor-inventor-settings',
            title: game.i18n.localize('OIF.Settings.ActorInventorSettings.Title'),
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }

    activateListeners(html)
    {
        super.activateListeners(html, 'oif-actor-inventor-settings');
    }

    static Register(name, options)
    {
        SettingsSkeleton._protoRegister('oif-actor-inventor-settings', name, options);
    }

    static Get(name)
    {
        return SettingsSkeleton._protoGet('oif-actor-inventor-settings', name);
    }

    static UpdateSettings()
    {
        SettingsSkeleton._protoUpdateSettings('oif-actor-inventor-settings');
    }

    getData(options)
    {
        return SettingsSkeleton._protoGetData('oif-actor-inventor-settings', options);
    }

    async _updateObject(event, formData) 
    {}
}