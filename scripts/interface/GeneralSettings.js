import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ActorInventorSettings } from "./ActorInventorSettings.js";

export class GeneralSettings extends FormApplication {
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            closeOnSubmit: false,
            height: 'auto',
            width: 600,
            id: 'oif-general-settings',
            submitOnChange: true,
            template: OIF.TEMPLATES.GENERAL_SETTINGS,
            title: game.i18n.localize('OIF.Settings.GeneralSettings.Title'),
            item: '',
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }

    static Settings = {};

    // Register the settings inside foundry and inside self
    static Register(name, options)
    {
        // Prepare the internal foundry setting
        let FoundrySettingOptions = {
            name: options['name'],
            hint: options['hint'],
            scope: options['scope'],
            default: options['default'],
            config: false,
        };

        // Type detection and conversion
        if (options['type'] != null && options['type'] != undefined) 
        {
            options[options['type']] = true;
            switch (options['type']) 
            {
                case 'checkbox':
                    FoundrySettingOptions['type'] = Boolean;
                    break;

                case 'slider':
                    FoundrySettingOptions['type'] = Number;
                    FoundrySettingOptions['range'] = options['range'];

                case 'text':
                    FoundrySettingOptions['type'] = String;
                    break;

                case 'dropdown':
                    FoundrySettingOptions['type'] = String;
                    FoundrySettingOptions['choices'] = options['choices'];
                    break;

                default:
                    break;
            }
        }

        // Register setting inside foundry
        game.settings.register(OIF.ID, name, FoundrySettingOptions);

        // Get currently set value to be displayed
        options['value'] = game.settings.get(OIF.ID, name);

        if (options['type'] == 'dropdown')
        {
            options['choices'].forEach(function(element) 
            {
                element['selected'] = false;
                if (element.value == options['value'])
                {
                    element['selected'] = true;
                }
            });
        }

        // Set the ID to be used as reference later
        options['referenceID'] = name;

        // Check if required module is active
        let RequiredModule = options['requiredModule']
        if (RequiredModule != null && RequiredModule != undefined)
        {
            if (!RequiredModule.active) 
            {
                options['disabled'] = true;
                options['disabledMessage'] = game.i18n.localize('OIF.Settings.ModuleRequired').replace("${module}", `"${RequiredModule.name}"`);
            }
        }

        // Register inside OIF
        this.Settings[name] = options;
    }

    static Get(name)
    {
        let CurrentSettings = GeneralSettings.Settings[name];
        switch (GeneralSettings.Settings[name]['type']) {
            case 'checkbox':
                return CurrentSettings['value'] && !CurrentSettings['disabled'];
                break;

            case 'slider':
                return CurrentSettings['disabled'] ? CurrentSettings['default'] : CurrentSettings['value'];
                break;

            case 'string':
                return CurrentSettings['disabled'] ? CurrentSettings['default'] : CurrentSettings['value'];
                break;

            case 'dropdown':
                return CurrentSettings['disabled'] ? CurrentSettings['default'] : CurrentSettings['value'];
                break;

            default:
                return CurrentSettings['value'];
                break;
        }
    }

    // Check for restart
    static _checkForRestart(id)
    {
        if (this.Settings[id]['restart'] != null && this.Settings[id]['restart'] != undefined && this.Settings[id]['restart'])
        {
            this.Settings[id]['requiresRestart'] = true;
            this.Settings[id]['restartMessage'] = 'OIF.Settings.RestartRequired';
        }
    }

    // Update checkbox setting
    async _handleCheckboxUpdate(event)
    {
        let ClickedElement = $(event.currentTarget)[0];
        game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.checked);
        GeneralSettings.Settings[ClickedElement.id]['value'] = ClickedElement.checked;

        GeneralSettings._checkForRestart(ClickedElement.id);
        GeneralSettings.UpdateSettings();
        this.render();
    }

    // Update slider setting
    async _handleSliderUpdate(event)
    {
        let ClickedElement = $(event.currentTarget)[0];
        game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.value);

        // Check value
        let CurrentValue = Number(ClickedElement.value);
        if (CurrentValue > ClickedElement.max) 
        {
            CurrentValue = ClickedElement.max;    
        }
        else if (CurrentValue < ClickedElement.min)
        {
            CurrentValue = ClickedElement.min;
        }

        GeneralSettings.Settings[ClickedElement.id]['value'] = CurrentValue;

        GeneralSettings._checkForRestart(ClickedElement.id);
        GeneralSettings.UpdateSettings();
        this.render();
    }

    // Update text setting
    async _handleTextUpdate(event)
    {
        let ClickedElement = $(event.currentTarget)[0];
        game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.value);
        GeneralSettings.Settings[ClickedElement.id]['value'] = ClickedElement.value;

        GeneralSettings._checkForRestart(ClickedElement.id);
        GeneralSettings.UpdateSettings();
        this.render();
    }

    // Update dropdown setting
    async _handleDropdownUpdate(event)
    {
        let ClickedElement = $(event.currentTarget)[0];
        console.log(GeneralSettings.Settings[ClickedElement.id]['value']);
        console.log(ClickedElement.value);
        game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.value);
        GeneralSettings.Settings[ClickedElement.id]['value'] = ClickedElement.value;

        GeneralSettings.Settings[ClickedElement.id]['choices'].forEach(function(element) 
        {
            element['selected'] = false;
            if (element.value == ClickedElement.value)
            {
                element['selected'] = true;
            }
        });

        GeneralSettings._checkForRestart(ClickedElement.id);
        GeneralSettings.UpdateSettings();
        this.render();
    }

    activateListeners(html)
    {
        super.activateListeners(html);

        html.on('change', 'input[type=checkbox]', this._handleCheckboxUpdate.bind(this));
        html.on('change', 'input[type=range], input[type=number]', this._handleSliderUpdate.bind(this));
        html.on('change', 'input[type=text]', this._handleTextUpdate.bind(this));
        html.on('change', 'select', this._handleDropdownUpdate.bind(this));
    }

    getData(options)
    {
        // Only return settings in the 'world' scope for GMs
        let ReturnedSettings = {};
        for (const key in GeneralSettings.Settings)
        {
            let CurrentSetting = GeneralSettings.Settings[key];
            if (CurrentSetting.scope == 'world') 
            {
                if (game.user.isGM) 
                {
                    ReturnedSettings[key] = CurrentSetting;
                }
            }
            else
            {
                ReturnedSettings[key] = CurrentSetting;
            }
        }

        return {
            settings: ReturnedSettings,
        }
    }

    async _updateObject(event, formData) 
    {
    }

    static UpdateSettings()
    {
        for (const key in this.Settings) 
        {
            // Check if current element has a dependecy
            let CurrentSetting = this.Settings[key];
            let CurrentDependecy = CurrentSetting['dependsOn'];

            // Check if setting requires a module to be used
            let RequiredModule = CurrentSetting.requiredModule;
            if (RequiredModule != null && RequiredModule != undefined) 
            {
                // Check if required module isn't loaded
                if (!RequiredModule.active)
                {
                    CurrentSetting['disabled'] = true;
                    CurrentSetting['disabledMessage'] = game.i18n.localize('OIF.Settings.ModuleRequired').replace("${module}", `"${RequiredModule.name}"`);
                    continue;
                }
            }

            // Check if setting has a dependecy
            if (CurrentDependecy != null && CurrentDependecy != undefined) 
            {
                // Dependencies can only be Boolean
                if (this.Settings[CurrentDependecy]['type'] != 'checkbox') 
                {
                    continue;
                }

                // Check if the dependecy exist
                let CurrentRequirement = this.Settings[CurrentDependecy];
                if (CurrentRequirement != null && CurrentRequirement != undefined) 
                {
                    CurrentSetting['disabled'] = CurrentRequirement['disabled'] || !this.Get(CurrentDependecy);
                    if (CurrentSetting['disabled']) 
                    {
                        CurrentSetting['disabledMessage'] = game.i18n.localize('OIF.Settings.OptionRequired').replace("${option}", `"${game.i18n.localize(CurrentRequirement['name'])}"`);
                    }
                    else
                    {
                        CurrentSetting['disabledMessage'] = undefined;
                    }
                }
            }
        }
    }
}