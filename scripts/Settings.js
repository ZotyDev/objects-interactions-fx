import { GeneralSettings } from "./interface/GeneralSettings.js";
import { MasterTagsSettings } from "./interface/MasterTagsSettings.js";
import { ActorInventorSettings } from "./interface/ActorInventorSettings.js";
import { ObjectsInteractionsFX as OIF } from "./ObjectsInteractionsFX.js";
import { SettingsSkeleton } from "./library/skeletons/SettingsSkeleton.js";

export class Settings
{
    static async Initialize()
    {
        //////////////////////////////////////////////////
        // Register Master Tags menu
        game.settings.registerMenu(OIF.ID, OIF.SETTINGS.GENERAL.MASTER_TAGS_SETTINGS, {
            name: 'OIF.Settings.MasterTagsSettings.Title',
            hint: 'OIF.Settings.MasterTagsSettings.Hint',
            label: 'OIF.Settings.MasterTagsSettings.Label',
            icon: 'fas fa-tags',
            type: MasterTagsSettings,
            restricted: true,
        });
        await MasterTagsSettings.Register();

        //////////////////////////////////////////////////
        // Register General Settings menu
        game.settings.registerMenu(OIF.ID, OIF.SETTINGS.GENERAL.GENERAL_SETTINGS, {
            name: 'OIF.Settings.GeneralSettings.Title',
            hint: 'OIF.Settings.GeneralSettings.Hint',
            label: 'OIF.Settings.GeneralSettings.Label',
            icon: 'fas fa-cog',
            type: GeneralSettings,
            restricted: false,
        });

        GeneralSettings.Register(OIF.SETTINGS.GENERAL.DEFAULT_ATTACK_HOOK, {
            name: 'OIF.Settings.DefaultAttackHook.Title',
            hint: 'OIF.Settings.DefaultAttackHook.Hint',
            scope: 'world',
            type: 'dropdown',
            default: 'dnd5e.rollAttack',
            choices: [
                {
                    name: 'OIF.Settings.DefaultAttackHook.Options.DND5EfterAttackRoll.Label',
                    value: 'dnd5e.rollAttack',
                },
                {
                    name: 'OIF.Settings.DefaultAttackHook.Options.DND5EfterDamageRoll.Label',
                    value: 'dnd5e.rollDamage',
                },
                {
                    name: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterAttackRoll.Label',
                    value: 'midi-qol.AttackRollComplete',
                    disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL.active,
                    disabledMessage: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterAttackRoll.DisabledMessage',
                },
                {
                    name: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterDamageRoll.Label',
                    value: 'midi-qol.DamageRollComplete',
                    disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL.active,
                    disabledMessage: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterDamageRoll.DisabledMessage',
                },
                {
                    name: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterCompleteRoll.Label',
                    value: 'midi-qol.RollComplete',
                    disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL.active,
                    disabledMessage: 'OIF.Settings.DefaultAttackHook.Options.MIDIAfterCompleteRoll.DisabledMessage',
                },
            ],
            restart: 'true',
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.DEFAULT_ITEM_HOOK, {
            name: 'OIF.Settings.DefaultItemHook.Title',
            hint: 'OIF.Settings.DefaultItemHook.Hint',
            scope: 'world',
            type: 'dropdown',
            default: 'dnd5e.useItem',
            choices: [
                {
                    name: 'OIF.Settings.DefaultItemHook.Options.DND5EAfterItemUse.Label',
                    value: 'dnd5e.useItem',
                },
            ],
            restart: 'true',
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.USE_ANIMATIONS, {
            name: 'OIF.Settings.UseAnimations.Title',
            hint: 'OIF.Settings.UseAnimations.Hint',
            scope: 'world',
            type: 'checkbox',
            default: true,
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.MELEE_ANIMATION_DELAY, {
            name: 'OIF.Settings.MeleeAnimationDelay.Title',
            hint: 'OIF.Settings.MeleeAnimationDelay.Hint',
            scope: 'world',
            type: 'slider',
            range: {
                min: 0,
                max: 3000,
                step: 1,
            },
            default: 1950,
            excludesOn: [OIF.SETTINGS.GENERAL.USE_ANIMATIONS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.RANGED_ANIMATION_DELAY, {
            name: 'OIF.Settings.RangedAnimationDelay.Title',
            hint: 'OIF.Settings.RangedAnimationDelay.Hint',
            scope: 'world',
            type: 'slider',
            range: {
                min: 0,
                max: 3000,
                step: 1,
            },
            default: 850,
            excludesOn: [OIF.SETTINGS.GENERAL.USE_ANIMATIONS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM, {
            name: 'OIF.Settings.RemoveThrowableItem.Title',
            hint: 'OIF.Settings.RemoveThrowableItem.Hint',
            scope: 'world',
            type: 'checkbox',
            default: false,
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.ADD_THROWABLE_TO_TARGET_INVENTORY, {
            name: 'OIF.Settings.AddThrowableToTargetInventory.Title',
            hint: 'OIF.Settings.AddThrowableToTargetInventory.Hint',
            scope: 'world',
            type: 'checkbox',
            default: false,
            dependsOn: [OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.ADD_AMMUNITION_TO_TARGET_INVENTORY, {
            name: 'OIF.Settings.AddAmmunitionToTargetInventory.Title',
            hint: 'OIF.Settings.AddAmmunitionToTargetInventory.Hint',
            scope: 'world',
            type: 'checkbox',
            default: false,
            dependsOn: [OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS, {
            name: 'OIF.Settings.CreateItemPilesOnMiss.Title',
            hint: 'OIF.Settings.CreateItemPilesOnMiss.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.ITEM_PILES,
            default: OIF.OPTIONAL_MODULES.ITEM_PILES.active,
            dependsOn: [OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_HIT, {
            name: 'OIF.Settings.CreateItemPilesOnHit.Title',
            hint: 'OIF.Settings.CreateItemPilesOnHit.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.ITEM_PILES,
            default: false,
            dependsOn: [OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM],
            excludesOn: [OIF.SETTINGS.GENERAL.ADD_THROWABLE_TO_TARGET_INVENTORY, OIF.SETTINGS.GENERAL.ADD_AMMUNITION_TO_TARGET_INVENTORY],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.SNAP_CREATED_ITEM_PILES_TO_GRID, {
            name: 'OIF.Settings.SnapCreatedItemPilesToGrid.Title',
            hint: 'OIF.Settings.SnapCreatedItemPilesToGrid.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.ITEM_PILES,
            default: OIF.OPTIONAL_MODULES.ITEM_PILES.active,
            dependsOn: [OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.MINIFY_ITEM_PILES_NAMES, {
            name: 'OIF.Settings.MinifyItemPilesNames.Title',
            hint: 'OIF.Settings.MinifyItemPilesNames.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.ITEM_PILES,
            default: OIF.OPTIONAL_MODULES.ITEM_PILES.active,
            dependsOn: [OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.DEFAULT_THROWABLE_DESTRUCTION_CHANCE, {
            name: 'OIF.Settings.DefaultThrowableDestructionChance.Title',
            hint: 'OIF.Settings.DefaultThrowableDestructionChance.Hint',
            scope: 'world',
            type: 'slider',
            range: {
                min: 0,
                max: 100,
                step: 1,
            },
            default: 0,
            dependsOn: [OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.DEFAULT_AMMUNITION_DESTRUCTION_CHANCE, {
            name: 'OIF.Settings.DefaultAmmunitionDestructionChance.Title',
            hint: 'OIF.Settings.DefaultAmmunitionDestructionChance.Hint',
            scope: 'world',
            type: 'slider',
            range: {
                min: 0,
                max: 100,
                step: 1,
            },
            default: 50,
            dependsOn: [OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.SET_ELEVATION_OF_ITEM_PILES, {
            name: 'OIF.Settings.SetElevationOfItemPiles.Title',
            hint: 'OIF.Settings.SetElevationOfItemPiles.Hint',
            scope: 'world',
            type: 'checkbox',
            disabled: !(OIF.OPTIONAL_MODULES.LEVELS.active && OIF.OPTIONAL_MODULES.ITEM_PILES.active),
            default: OIF.OPTIONAL_MODULES.LEVELS.active && OIF.OPTIONAL_MODULES.ITEM_PILES.active,
            dependsOn: [OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS],
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT, {
            name: 'OIF.Settings.PowerfulImpactShakeEffect.Title',
            hint: 'OIF.Settings.PowerfulImpactShakeEffect.Hint',
            scope: 'client',
            type: 'checkbox',
            default: true,
        });
        GeneralSettings.Register(OIF.SETTINGS.GENERAL.LIGHTING_ITEMS_AUTOMATION, {
            name: 'OIF.Settings.LightingItemsAutomation.Title',
            hint: 'OIF.Settings.LightingItemsAutomation.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.TAGGER,
            disabled: !OIF.OPTIONAL_MODULES.TAGGER.active,
            default: OIF.OPTIONAL_MODULES.TAGGER.active,
        });

        //////////////////////////////////////////////////
        // Register Actor Inventor Settings menu
        game.settings.registerMenu(OIF.ID, OIF.SETTINGS.GENERAL.ACTOR_INVENTOR_SETTINGS, {
            name: 'OIF.Settings.ActorInventorSettings.Title',
            hint: 'OIF.Settings.ActorInventorSettings.Hint',
            label: 'OIF.Settings.ActorInventorSettings.Label',
            icon: 'fas fa-user',
            type: ActorInventorSettings,
            restricted: false,
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR, {
            name: 'OIF.Settings.CurrencyGenerator.Title',
            hint: 'OIF.Settings.CurrencyGenerator.Hint',
            scope: 'world',
            type: 'checkbox',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET.active,
            default: OIF.OPTIONAL_MODULES.TIDY_SHEET.active,
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.CP_LOCATION, {
            name: 'OIF.Settings.CpLocation.Title',
            hint: 'OIF.Settings.CpLocation.Hint',
            scope: 'world',
            type: 'string',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET,
            default: "system.currency.cp",
            dependsOn: [OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR],
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.SP_LOCATION, {
            name: 'OIF.Settings.SpLocation.Title',
            hint: 'OIF.Settings.SpLocation.Hint',
            scope: 'world',
            type: 'string',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET,
            default: "system.currency.sp",
            dependsOn: [OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR],
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.GP_LOCATION, {
            name: 'OIF.Settings.GpLocation.Title',
            hint: 'OIF.Settings.GpLocation.Hint',
            scope: 'world',
            type: 'string',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET,
            default: "system.currency.gp",
            dependsOn: [OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR],
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.PP_LOCATION, {
            name: 'OIF.Settings.PpLocation.Title',
            hint: 'OIF.Settings.PpLocation.Hint',
            scope: 'world',
            type: 'string',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET,
            default: "system.currency.pp",
            dependsOn: [OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR],
        });
        ActorInventorSettings.Register(OIF.SETTINGS.ACTOR_INVENTOR.EP_LOCATION, {
            name: 'OIF.Settings.EpLocation.Title',
            hint: 'OIF.Settings.EpLocation.Hint',
            scope: 'world',
            type: 'string',
            requiredModule: OIF.OPTIONAL_MODULES.TIDY_SHEET,
            disabled: !OIF.OPTIONAL_MODULES.TIDY_SHEET,
            default: "system.currency.ep",
            dependsOn: [OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR],
        });

        GeneralSettings.UpdateSettings();
        ActorInventorSettings.UpdateSettings();
    }
}