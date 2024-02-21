// @ts-nocheck
import { Constants as C } from "./constants";
export class ObjectsInteractionsFX
{
  static ID = 'objects-interactions-fx';
  static NAME = 'Automated Objects, Interactions and Effects';

  static FLAGS = {
    OIF: 'OIF',
  }

  static TEMPLATES = {
    MASTER_TAGS_SETTINGS    : `modules/${this.ID}/module/master_tags_settings.hbs`,
    MASTER_TAG_CONFIGURATION: `modules/${this.ID}/module/master_tag_configuration.hbs`,
    SETTINGS_SKELETON       : `modules/${this.ID}/module/settings_skeleton.hbs`,
    CONFIG_SKELETON         : `modules/${this.ID}/module/config_skeleton.hbs`,
  }

  static SETTINGS = {
    GENERAL: {
      ATTACH_HOOKS: {
        ATTACK: 'hookAttachAttack',
        ITEM  : 'hookAttachItem',
      },
      MASTER_TAGS_SETTINGS                 : 'masterTagsSettings',
      GENERAL_SETTINGS                     : 'generalSettings',
      DEFAULT_ATTACK_HOOK                  : 'defaultAttackHook',
      DEFAULT_ITEM_HOOK                    : 'defaultItemHook',
      USE_ANIMATIONS                       : 'useAnimations',
      MELEE_ANIMATION_DELAY                : 'animationDelay',
      RANGED_ANIMATION_DELAY               : 'rangedAnimationDelay',
      DEFAULT_AMMUNITION_DESTRUCTION_CHANCE: 'defaultAmmunitionDestructionChance',
      DEFAULT_THROWABLE_DESTRUCTION_CHANCE : 'defaultThrowableDestructionChance',
      REMOVE_THROWABLE_ITEM                : 'removeThrowableItem',
      ADD_THROWABLE_TO_TARGET_INVENTORY    : 'addThrowableToTargetInventory',
      ADD_AMMUNITION_TO_TARGET_INVENTORY   : 'addAmmunitionToTargetInventory',
      CREATE_ITEM_PILES_ON_MISS            : 'createItemPilesOnMiss',
      CREATE_ITEM_PILES_ON_HIT             : 'createItemPilesOnHit',
      SNAP_CREATED_ITEM_PILES_TO_GRID      : 'snapCreatedItemPilesToGrid',
      MINIFY_ITEM_PILES_NAMES              : 'minifyItemPilesNames',
      POWERFUL_IMPACT_SHAKE_EFFECT         : 'powerfulImpactShakeEffect',
      SET_ELEVATION_OF_ITEM_PILES          : 'setElevationOfItemPiles',
      LIGHTING_ITEMS_AUTOMATION            : 'lightingItemsAutomation',
      DEVELOPER_MODE                       : 'developerMode',
    },

    ACTOR_INVENTOR: {
      CURRENCY_GENERATOR: 'currencyGenerator',
      CP_LOCATION       : 'copperPiecesLocation',
      SP_LOCATION       : 'silverPiecesLocation',
      GP_LOCATION       : 'goldPiecesLocation',
      PP_LOCATION       : 'platinumPiecesLocation',
      EP_LOCATION       : 'electrumPiecesLocation',
    },

    MASTER_TAGS: {
      CURRENT_TAG_PACK: 'currentTagPack',
    }
  }

  static FILES = {
    ORIGIN   : 'data',
    DATA_FOLDERS: {
      DEFAULT_TAG_PACKS: `modules/${this.ID}/module/data/defaultTagPacks`,
      ROOT             : 'oif'
    }
  }

  static HOOKS = {
    CHANGE_SETTINGS: 'oif.ChangeSettings',
    ATTACH_HOOKS : 'oif.attachHooks',
    WORKFLOW: {
      POST_PREPARE: 'oifWorkflowPostPrepare',
      POST_EXECUTE: 'oifWorkflowPostExecute',
    },
    ITEM: {
      LIGHTING: {
        POST_PREPARE: 'oifItemLightingPostPrepare',
        LIGHT: {
          POST_APPLY: 'oifItemLightingLightPostApply',
          POST_SOUND: 'oifPostItemLightingLightSound',
        },
        EXTINGUISH: {
          POST_APPLY: 'oifItemLightingExtinguishPostApply',
          POST_SOUND: 'oifPostItemLightingExtinguishSound',
        },
      },
    },
    WEAPON: {
      MELEE: {
        POST_PREPARE: 'oifWeaponMeleePostPrepare',
        HIT: {
          POST_ANIMATION  : 'oifWeaponMeleeHitPostAnimation',
          POST_INTERACTION: 'oifWeaponMeleeHitPostInteraction',
          POST_SOUND      : 'oifWeaponMeleeHitPostSound',
        },
        THROW: {
          POST_ANIMATION  : 'oifWeaponMeleeThrowPostAnimation',
          POST_INTERACTION: 'oifWeaponMeleeThrowPostInteraction',
          POST_SOUND      : 'oifWeaponMeleeThrowPostSound',
        },
      },
      RANGED: {
        POST_PREPARE: 'oifWeaponRangedPostPrepare',
        HIT: {
          POST_ANIMATION  : 'oifWeaponRangedHitPostAnimation',
          POST_INTERACTION: 'oifWeaponRangedHitPostInteraction',
          POST_SOUND      : 'oifWeaponRangedHitPostSound',
        }
      },
    },
  }

  static OPTIONAL_MODULES = {
    MIDI_QOL: {
      id    : 'midi-qol',
      name  : 'MidiQOL',
      active: false,
    },
    LEVELS: {
      id    : 'levels',
      name  : 'Levels',
      active: false,
    },
    ITEM_PILES: {
      id    : 'item-piles',
      name  : 'Item Piles',
      active: false,
    },
    TAGGER: {
      id    : 'tagger',
      name  : 'Tagger',
      active: false,
    },
    TIDY_SHEET: {
      id    : 'tidy5e-sheet',
      name  : 'Tidy5e Sheet',
      active: false,
    }
  }

  static WORKFLOW = {
    DATA: {
      TYPE: {
        ACTION: {
          ATTACK: {
            MELEE : 'meleeAttack',
            RANGED: 'rangedAttack',
          },
          USE: {
            ITEM: 'useItem',
          }
        }
      }
    }
  }

  static Initialize()
  {
    // Check if optional modules are loaded
    for (const key in this.OPTIONAL_MODULES)
    {
      if (game.modules.get(this.OPTIONAL_MODULES[key].id)?.active)
      {
        this.OPTIONAL_MODULES[key].active = true;
      }
      else
      {
        // Debug
        C.D.warn(`OIF | module ${this.OPTIONAL_MODULES[key].name} not active - some features disabled`);
      }
    }
  }
}
