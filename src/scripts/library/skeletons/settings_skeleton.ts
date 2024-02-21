// @ts-nocheck
import { GeneralSettings } from "../../interface/general_settings";
import { ObjectsInteractionsFX as OIF } from "../../objects_interactions_fx";
import { Constants as C } from "../../constants";

export class SettingsSkeleton extends FormApplication
{
  static get defaultOptions() {
    const DefaultOptions = super.defaultOptions;

    const OverrideOptions = {
      closeOnSubmit: false,
      height: 'auto',
      with: 600,
      submitOnChange: true,
      template: OIF.TEMPLATES.SETTINGS_SKELETON
    };

    const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
    return MergedOptions;
  }

  static Settings = {}

  ////////////////////////////////////////////////////////////
  // Prototype function used to register custom settings
  ////////////////////////////////////////////////////////////
  static _protoRegister(config, name, options)
  {
    if (SettingsSkeleton.Settings[config] == undefined)
    {
      SettingsSkeleton.Settings[config] = {};
    }

    // Prepare the internal foundry setting options
    let FoundrySettingOptions = {
      name:    options['name'],
      hint:    options['hint'],
      scope:   options['scope'],
      default: options['default'],
      config:  false
    }

    // Detect and convert custom type to be used by foundry
    if (options['type'] != undefined)
    {
      // Sets a value inside option, named after the type name, as true
      // This is used inside .hbs templates to select which option
      // display/editor will be shown
      options[options['type']] = true;

      // Convert type to a foundry compatible
      switch (options['type'])
      {
        case 'checkbox':
        FoundrySettingOptions['type'] = Boolean;
        break;

        case 'slider':
        FoundrySettingOptions['type'] = Number;
        FoundrySettingOptions['range'] = options['range'];
        break;

        case 'string':
        FoundrySettingOptions['type'] = String;
        break;

        case 'dropdown':
        FoundrySettingOptions['type'] = String;
        FoundrySettingOptions['choices'] = options['choices'];
        break;

        default:
        // Debug
        C.D.error(`Cannot register setting, ${options['type']} is not a valid type`);

        break;
      }
    }

    // Register setting inside foundry
    game.settings.register(OIF.ID, name, FoundrySettingOptions);

    // Get currently set value to be displayed
    options['value'] = game.settings.get(OIF.ID, name);

    // Dropdown types are handled differently
    if (options['type'] == 'dropdown')
    {
      // Iterate through the choices and set them as selected
      // or not
      options['choices'].forEach((element) => {
        if (element.value == options['value'])
        {
          element['selected'] = true;
        }
        else
        {
          element['selected'] = false;
        }
      })
    }

    // Set the ID to be used as reference later
    options['referenceID'] = name;

    // Check there are required modules
    let RequiredModule = options['requiredModule'];
    if (RequiredModule != undefined)
    {
      // Check if the required module is active
      if (!RequiredModule.active)
      {
        options['disabled'] = true;
        options['disabledMessage'] = game.i18n.localize('OIF.Settings.ModuleRequired').replace("${module}", `"${RequiredModule.name}"`);
      }
    }

    // Register inside OIF
    SettingsSkeleton.Settings[config][name] = options;
  }

  ////////////////////////////////////////////////////////////
  // Prototype function used to get custom settings
  ////////////////////////////////////////////////////////////
  static _protoGet(config, name)
  {
    let CurrentSetting = SettingsSkeleton.Settings[config][name];
    switch (CurrentSetting['type'])
    {
      case 'checkbox':
      return CurrentSetting['value'] && !CurrentSetting['disabled'];
      break;

      case 'slider':
      case 'string':
      case 'dropdown':
      return CurrentSetting['disabled'] ? CurrentSetting['default'] : CurrentSetting['value'];
      break;

      default:
      return CurrentSetting['value'];
      break;
    }
  }

  ////////////////////////////////////////////////////////////
  // Internal function that checks if restart is required
  ////////////////////////////////////////////////////////////
  async _checkForRestart(config, id)
  {
    if (SettingsSkeleton.Settings[config][id]['restart'] != null && SettingsSkeleton.Settings[config][id]['restart'] != undefined && SettingsSkeleton.Settings[config][id]['restart'])
    {
      SettingsSkeleton.Settings[config][id]['requiresRestart'] = true;
      SettingsSkeleton.Settings[config][id]['restartMessage'] = 'OIF.Settings.RestartRequired';
    }
  }

  ////////////////////////////////////////////////////////////
  // Internal function for handling Checkbox interactions
  ////////////////////////////////////////////////////////////
  async _handleCheckBoxInteraction(config, event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.checked);
    SettingsSkeleton.Settings[config][ClickedElement.id]['value'] = ClickedElement.checked;

    this._checkForRestart(config, ClickedElement.id);
    SettingsSkeleton._protoUpdateSettings(config);
    this.render();
  }

  ////////////////////////////////////////////////////////////
  // Internal function for handling Slider interactions
  ////////////////////////////////////////////////////////////
  async _handleSliderInteraction(config, event)
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

    SettingsSkeleton.Settings[config][ClickedElement.id]['value'] = CurrentValue;

    this._checkForRestart(config, ClickedElement.id);
    SettingsSkeleton._protoUpdateSettings(config);
    this.render();
  }

  ////////////////////////////////////////////////////////////
  // Internal function for handling String interactions
  ////////////////////////////////////////////////////////////
  async _handleStringInteraction(config, event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.value);
    SettingsSkeleton.Settings[config]['value'] = ClickedElement.value;

    this._checkForRestart(config, ClickedElement.id);
    SettingsSkeleton._protoUpdateSettings(config);
    this.render();
  }

  ////////////////////////////////////////////////////////////
  // Internal function for handling Dropdown interactions
  ////////////////////////////////////////////////////////////
  async _handleDropdownInteraction(config, event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    game.settings.set(OIF.ID, ClickedElement.id, ClickedElement.value);
    SettingsSkeleton.Settings[config][ClickedElement.id]['value'] = ClickedElement.value;

    SettingsSkeleton.Settings[config][ClickedElement.id]['choices'].forEach(function(element)
    {
      element['selected'] = false;
      if (element.value == ClickedElement.value)
      {
        element['selected'] = true;
      }
    });

    this._checkForRestart(config, ClickedElement.id);
    SettingsSkeleton._protoUpdateSettings(config);
    this.render();
  }

  ////////////////////////////////////////////////////////////
  // Prototype function that updates settings
  ////////////////////////////////////////////////////////////
  static _protoUpdateSettings(config)
  {
    for (const key in SettingsSkeleton.Settings[config])
    {
      // Check if current element has a dependecy
      let CurrentSetting = SettingsSkeleton.Settings[config][key];
      let CurrentDependencies = CurrentSetting['dependsOn'];
      let CurrentUndependencies = CurrentSetting['excludesOn'];

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

      // Check if setting has dependencies
      let AllRequirementsMet = true;
      if (CurrentDependencies != null && CurrentDependencies != undefined)
      {
        // Loop through all dependencies to check if the are Boolean
        let BoolCheck = true;
        for (let index = 0; index < CurrentDependencies.length; index++)
        {
          // Check if the current dependency is a Boolean
          const CurrentDependency = CurrentDependencies[index];
          if (SettingsSkeleton.Settings[config][CurrentDependency]['type'] != 'checkbox')
          {
            BoolCheck = false;
          }
        }

        // If one of the dependencies isn't a Boolean, skip the rest
        if (BoolCheck == false)
        {
          // Debug
          C.D.error(`OIF | ${config} | ${key} | Dependency isn't a Boolean`);

          continue;
        }

        // Check if the dependecies exist
        let CurrentRequirements = [];
        for (let index = 0; index < CurrentDependencies.length; index++)
        {
          // Check if the current dependency exists
          const CurrentDependency = CurrentDependencies[index];
          let CurrentRequirement = SettingsSkeleton.Settings[config][CurrentDependency];
          if (CurrentRequirement != null && CurrentRequirement != undefined)
          {
            CurrentRequirements.push(CurrentRequirement);
          }
        }

        // Check if all dependencies are met
        for (let index = 0; index < CurrentRequirements.length; index++)
        {
          // Check if the current dependency is met
          const CurrentRequirement = CurrentRequirements[index];
          if (!SettingsSkeleton._protoGet(config, CurrentRequirement.referenceID))
          {
            AllRequirementsMet = false;
          }
        }

        // If all dependencies are met, enable the setting
        if (AllRequirementsMet)
        {
          CurrentSetting['disabled'] = false;
          CurrentSetting['disabledMessage'] = '';
        }
        // If not, disable the setting
        else
        {
          // Create a string with all dependencies, so the user knows which ones are missing
          // separeted all dependencies with a comma, except the last one, which is separeted with 'and'
          let DependenciesString = '';
          for (let index = 0; index < CurrentRequirements.length; index++)
          {
            const CurrentRequirement = CurrentRequirements[index];
            if (index == CurrentRequirements.length - 1)
            {
              DependenciesString += ` and "${game.i18n.localize(CurrentRequirement['name'])}"`;
            }
            else
            {
              DependenciesString += `"${game.i18n.localize(CurrentRequirement['name'])}", `;
            }
          }

          // Disable the setting and add a message
          CurrentSetting['disabled'] = true;
          CurrentSetting['disabledMessage'] = game.i18n.localize('OIF.Settings.OptionRequired').replace("${option}", DependenciesString);
        }
      }

      // Check if setting has undependencies
      if (CurrentUndependencies != null && CurrentUndependencies != undefined && AllRequirementsMet)
      {
        // Loop through all undependencies to check if the are Boolean
        let BoolCheck = true;
        for (let index = 0; index < CurrentUndependencies.length; index++)
        {
          // Check if the current undependency is a Boolean
          const CurrentUndependency = CurrentUndependencies[index];
          if (SettingsSkeleton.Settings[config][CurrentUndependency]['type'] != 'checkbox')
          {
            BoolCheck = false;
          }
        }

        // If one of the undependencies isn't a Boolean, skip the rest
        if (BoolCheck == false)
        {
          // Debug
          C.D.error(`OIF | ${config} | ${key} | Undependency isn't a Boolean`);

          continue;
        }

        // Check if the undependecies exist
        let CurrentUnrequirements = [];
        for (let index = 0; index < CurrentUndependencies.length; index++)
        {
          // Check if the current undependency exists
          const CurrentUndependency = CurrentUndependencies[index];
          let CurrentRequirement = SettingsSkeleton.Settings[config][CurrentUndependency];
          if (CurrentRequirement != null && CurrentRequirement != undefined)
          {
            CurrentUnrequirements.push(CurrentRequirement);
          }
        }

        // Check if all undependencies are met
        let AllUnrequirementsMet = true;
        for (let index = 0; index < CurrentUnrequirements.length; index++)
        {
          // Check if the current undependency is met
          const CurrentUnrequirement = CurrentUnrequirements[index];
          if (SettingsSkeleton._protoGet(config, CurrentUnrequirement.referenceID))
          {
            AllUnrequirementsMet = false;
          }
        }

        // If all undependencies are met, enable the setting
        if (AllUnrequirementsMet)
        {
          CurrentSetting['disabled'] = false;
          CurrentSetting['disabledMessage'] = '';
        }
        // If not, disable the setting
        else
        {
          // Create a string with all undependencies, so the user knows which ones are missing
          // separeted all undependencies with a comma, except the last one, which is separeted with 'and'
          let UndependenciesString = '';
          for (let index = 0; index < CurrentUnrequirements.length; index++)
          {
            const CurrentUnrequirement = CurrentUnrequirements[index];
            if (index == CurrentUnrequirements.length - 1)
            {
              UndependenciesString += ` and "${game.i18n.localize(CurrentUnrequirement['name'])}"`;
            }
            else
            {
              UndependenciesString += `"${game.i18n.localize(CurrentUnrequirement['name'])}", `;
            }
          }

          // Disable the setting and add a message
          CurrentSetting['disabled'] = true;
          CurrentSetting['disabledMessage'] = game.i18n.localize('OIF.Settings.OptionUnrequired').replace("${option}", UndependenciesString);
        }
      }
    }

    Hooks.call(OIF.HOOKS.CHANGE_SETTINGS, SettingsSkeleton.Settings[config]);
  }

  ////////////////////////////////////////////////////////////
  // Prototype function to get data for rendering .hbs
  ////////////////////////////////////////////////////////////
  static _protoGetData(config, options)
  {
    // Only return settings that are in the 'world' scope
    // for GMs
    let ReturnedSettings = {};
    for (const key in SettingsSkeleton.Settings[config])
    {
      let CurrentSetting = SettingsSkeleton.Settings[config][key];
      if (CurrentSetting.scope == 'world')
      {
        if (game.user.isGM)
        {
          ReturnedSettings[key] = CurrentSetting;
        }
        else
        {
          continue;
        }
      }
      else
      {
        ReturnedSettings[key] = CurrentSetting;
      }
    }

    return { settings: ReturnedSettings }
  }

  ////////////////////////////////////////////////////////////
  // Activate listeners
  ////////////////////////////////////////////////////////////
  activateListeners(html, config)
  {
    super.activateListeners(html);

    // Checkbox
    html.on('change', 'input[type=checkbox]', this._handleCheckBoxInteraction.bind(this, config));
    // Slider
    html.on('change', 'input[type=range]', this._handleSliderInteraction.bind(this, config));
    html.on('change', 'input[type=number]', this._handleSliderInteraction.bind(this, config));
    // String
    html.on('change', 'input[type=text]', this._handleStringInteraction.bind(this, config));
    // Dropdown
    html.on('change', 'select', this._handleDropdownInteraction.bind(this, config));
  }
}
