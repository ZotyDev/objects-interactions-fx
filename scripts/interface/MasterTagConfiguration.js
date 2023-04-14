import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { MasterTagsSettings } from "./MasterTagsSettings.js";
import { ObjectsInteractionsFXData as OIFD } from '../data/ObjectsInteractionsFXData.js';
import { ItemTags } from "./ItemTags.js";
import { ConfigSkeleton } from "../library/skeletons/ConfigSkeleton.js";

export class MasterTagConfiguration extends ConfigSkeleton
{
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            id: 'oif-master-tag-configuration',
            title: game.i18n.localize('OIF.Settings.MasterTagConfiguration.Title'),
            tag: '',
            caller: null,
            updaterFunction: MasterTagsSettings.UpdateTag,
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }

    static MAX_DELAY = 3000;

    getData(options)
    {
        let ReturnedConfiguration;
        let DefaultConfigurationHeader = 
        [
            {
                disabled: false,
                name: 'enabled',
                title: 'OIF.Settings.MasterTagConfiguration.Options.Enabled.Title',
                type: 'checkbox',
                value: this.options.configurationData.enabled,
            },
            {
                disabled: false,
                name: 'type',
                title: 'OIF.Settings.MasterTagConfiguration.Options.Type.Title',
                type: 'dropdown',
                value: this.options.configurationData.type,
                choices: 
                [
                    {
                        name: 'OIF.Settings.MasterTagConfiguration.Options.Type.Choices.None',
                        value: 'none',
                    },
                    {
                        name: 'OIF.Settings.MasterTagConfiguration.Options.Type.Choices.MeleeAttack',
                        value: 'meleeAttack'
                    },
                    {
                        name: 'OIF.Settings.MasterTagConfiguration.Options.Type.Choices.RangedAttack',
                        value: 'rangedAttack'
                    },
                    {
                        name: 'OIF.Settings.MasterTagConfiguration.Options.Type.Choices.Lighting',
                        value: 'lighting'
                    }
                ]
            }
        ]

        switch (this.options.configurationData.type)
        {
            case 'meleeAttack':
            case 'rangedAttack':
                ReturnedConfiguration =
                [
                    ...DefaultConfigurationHeader,
                    {
                        disabled: false,
                        name: 'meleeAnimation.source',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.MeleeAnimation.Source.Title',
                        type: 'string',
                        value: this.options.configurationData?.meleeAnimation?.source ?? '',
                    },
                    {
                        disabled: false,
                        name: 'meleeAnimation.delay',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.MeleeAnimation.Delay.Title',
                        type: 'slider',
                        value: this.options.configurationData?.meleeAnimation?.delay ?? 0,
                        range:
                        {
                            min: 0,
                            max: MasterTagConfiguration.MAX_DELAY,
                            step: 1,
                        },
                    },
                    {
                        disabled: false,
                        name: 'throwAnimation.source',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.ThrowAnimation.Source.Title',
                        type: 'string',
                        value: this.options.configurationData?.throwAnimation?.source ?? '',
                    },
                    {
                        disabled: false,
                        name: 'throwAnimation.delay',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.ThrowAnimation.Delay.Title',
                        type: 'slider',
                        value: this.options.configurationData?.throwAnimation?.delay ?? 0,
                        range:
                        {
                            min: 0,
                            max: MasterTagConfiguration.MAX_DELAY,
                            step: 1,
                        },
                    },
                    {
                        disabled: false,
                        name: 'returnAnimation.source',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.ReturnAnimation.Source.Title',
                        type: 'string',
                        value: this.options.configurationData?.returnAnimation?.source ?? '',
                    },
                    {
                        disabled: false,
                        name: 'returnAnimation.delay',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.ReturnAnimation.Delay.Title',
                        type: 'slider',
                        value: this.options.configurationData?.returnAnimation?.delay ?? 0,
                        range:
                        {
                            min: 0,
                            max: MasterTagConfiguration.MAX_DELAY,
                            step: 1,
                        },
                    },
                    {
                        disabled: false,
                        name: 'rangedAnimation.source',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.RangedAnimation.Source.Title',
                        type: 'string',
                        value: this.options.configurationData?.rangedAnimation?.source ?? '',
                    },
                    {
                        disabled: false,
                        name: 'rangedAnimation.delay',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Weapon.RangedAnimation.Delay.Title',
                        type: 'slider',
                        value: this.options.configurationData?.rangedAnimation?.delay ?? 0,
                        range:
                        {
                            min: 0,
                            max: MasterTagConfiguration.MAX_DELAY,
                            step: 1,
                        },
                    }
                ]
                break;
            case 'lighting':
                ReturnedConfiguration = 
                [
                    ...DefaultConfigurationHeader,
                    {
                        disabled: false,
                        name: 'light.animationType',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Hint',
                        type: 'dropdown',
                        value: this.options.configurationData?.light?.animationType ?? 'none',
                        choices:
                        [
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.None',
                                value: 'none',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.Torch',
                                value: 'torch',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.Pulse',
                                value: 'pulse',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.Chroma',
                                value: 'chroma',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.PulsingWave',
                                value: 'wave',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.SwirlingFog',
                                value: 'fog',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.Sunburst',
                                value: 'sunburst',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.LightDome',
                                value: 'dome',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.MysteriousEmanation',
                                value: 'emanation',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.HexaDome',
                                value: 'hexa',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.GhostlyLight',
                                value: 'ghost',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.EnergyField',
                                value: 'energy',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.RoilingMass',
                                value: 'roiling',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.BlackHole',
                                value: 'hole',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.Vortex',
                                value: 'vortex',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.BewitchingWave',
                                value: 'witchwave',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.SwirlingRainbow',
                                value: 'rainbowswirl',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.RadialRainbow',
                                value: 'radialrainbow',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.FairyLight',
                                value: 'fairy',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.ForceGrid',
                                value: 'grid',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.StarLight',
                                value: 'starlight',
                            },
                            {
                                name: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Type.Choices.SmokePatch',
                                value: 'smokepatch',
                            }
                        ]
                    },
                    {
                        disabled: false,
                        name: 'light.animationSpeed',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Speed.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Speed.Hint',
                        type: 'slider',
                        value: this.options.configurationData?.light?.animationSpeed ?? 0,
                        range:
                        {
                            min: 0,
                            max: 10,
                            step: 1,
                        }
                    },
                    {
                        disabled: false,
                        name: 'light.animationIntensity',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Intensity.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Intensity.Hint',
                        type: 'slider',
                        value: this.options.configurationData?.light?.animationIntensity ?? 1,
                        range:
                        {
                            min: 1,
                            max: 10,
                            step: 1,
                        }
                    },
                    {
                        disabled: false,
                        name: 'light.animationReverse',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Reverse.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Animation.Reverse.Hint',
                        type: 'checkbox',
                        value: this.options.configurationData?.light?.animationReverse ?? false,
                    },
                    {
                        disabled: false,
                        name: 'light.color',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Color.Title',
                        type: 'color',
                        value: this.options.configurationData?.light?.color ?? '#000000',
                    },
                    {
                        disabled: false,
                        name: 'light.intensity',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Intensity.Title',
                        type: 'slider',
                        value: this.options.configurationData?.light?.intensity ?? 0.5,
                        range:
                        {
                            min: 0,
                            max: 1,
                            step: 0.05,
                        }
                    },
                    {
                        disabled: false,
                        name: 'light.angle',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Angle.Title',
                        type: 'slider',
                        value: this.options.configurationData?.light?.angle ?? 360,
                        range:
                        {
                            min: 0,
                            max: 360,
                            step: 1,
                        }
                    },
                    {
                        disabled: false,
                        name: 'icons.unlit',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Icons.Unlit.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Icons.Unlit.Hint',
                        type: 'icon',
                        value: this.options.configurationData?.icons?.unlit ?? '',
                    },
                    {
                        disabled: false,
                        name: 'icons.lit',
                        title: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Icons.Lit.Title',
                        hint: 'OIF.Settings.MasterTagConfiguration.Options.Lighting.Icons.Lit.Hint',
                        type: 'icon',
                        value: this.options.configurationData?.icons?.lit ?? '',
                    }
                ]
                break;
            case 'special':
                ReturnedConfiguration =
                [
                ]
                break;
            default:
                ReturnedConfiguration =
                {
                    ...DefaultConfigurationHeader,
                }
                break;
        }

        return {
            data: this.options.configurationData,
            config: ReturnedConfiguration
        }
    }

    async activateListeners(html)
    {
        super.activateListeners(html);
    }

    async _updateObject(event, formData) 
    {}
}