// @ts-nocheck
import { GeneralSettings } from "./interface/general_settings";
import { MasterTagsSettings } from "./interface/master_tag_settings";
import { ObjectsInteractionsFX as OIF } from "./objects_interactions_fx";

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
    const attackHooks = Bifrost.attackHooks;
    GeneralSettings.Register(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK, {
      name: 'OIF.Settings.DefaultAttackHook.Title',
      hint: 'OIF.Settings.DefaultAttackHook.Hint',
      scope: 'world',
      type: 'dropdown',
      default: attackHooks[0].value,
      choices: attackHooks,
    });
    const itemHooks = Bifrost.itemHooks;
    GeneralSettings.Register(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM, {
      name: 'OIF.Settings.DefaultItemHook.Title',
      hint: 'OIF.Settings.DefaultItemHook.Hint',
      scope: 'world',
      type: 'dropdown',
      default: itemHooks[0].value,
      choices: itemHooks
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
    GeneralSettings.Register(OIF.SETTINGS.GENERAL.DEVELOPER_MODE, {
      name: 'OIF.Settings.DeveloperMode.Title',
      hint: 'OIF.Settings.DeveloperMode.Hint',
      scope: 'world',
      type: 'checkbox',
      default: false,
    });

    GeneralSettings.UpdateSettings();
  }
}
