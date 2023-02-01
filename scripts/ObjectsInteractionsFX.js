export class ObjectsInteractionsFX
{
    static ID = 'objects-interactions-fx';

    static FLAGS = {
        OIF: 'OIF',
        ITEM_TAGS: 'item-tags'
    }

    static TEMPLATES = {
        ITEM_TAGS: `modules/${this.ID}/templates/ItemTags.hbs`,
        ITEM_TAGS_SETTINGS: `modules/${this.ID}/templates/ItemTagsSettings.hbs`,
        GENERAL_SETTINGS: `modules/${this.ID}/templates/GeneralSettings.hbs`,
        ACTOR_INVENTOR_SETTINGS: `modules/${this.ID}/templates/ActorInventorSettings.hbs`
    }

    static SOCKET;

    static SETTINGS = {
        GENERAL: {
            ITEM_TAGS_SETTINGS: 'itemTagsSettings',
            GENERAL_SETTINGS: 'generalSettings',
            ACTOR_INVENTOR_SETTINGS: 'actorInventor',
            DEFAULT_ATTACK_HOOK: 'defaultAttackHook',
            DEFAULT_AMMUNITION_DESTRUCTION_CHANCE: 'defaultAmmunitionDestructionChance',
            DEFAULT_THROWABLE_DESTRUCTION_CHANCE: 'defaultThrowableDestructionChance',
            REMOVE_THROWABLE_ITEM: 'removeThrowableItem',
            ADD_THROWABLE_TO_TARGET_INVENTORY: 'addThrowableToTargetInventory',
            ADD_AMMUNITION_TO_TARGET_INVENTORY: 'addAmmunitionToTargetInventory',
            CREATE_ITEM_PILES_ON_MISS: 'createItemPilesOnMiss',
            MINIFY_ITEM_PILES_NAMES: 'minifyItemPilesNames',
            POWERFUL_IMPACT_SHAKE_EFFECT: 'powerfulImpactShakeEffect',
            SET_ELEVATION_OF_ITEM_PILES: 'setElevationOfItemPiles',
            LIGHTING_ITEMS_AUTOMATION: 'lightingItemsAutomation'
        },

        ACTOR_INVENTOR: {
            CURRENCY_GENERATOR: 'currencyGenerator',
            CP_LOCATION: 'copperPiecesLocation',
            SP_LOCATION: 'silverPiecesLocation',
            GP_LOCATION: 'goldPiecesLocation',
            PP_LOCATION: 'platinumPiecesLocation',
            EP_LOCATION: 'electrumPiecesLocation',
        },
    }

    static HOOKS = {
        ITEM: {
            LIGHTING: {
                LIGHT: {
                    PRE: 'oifPreItemLightingLight',
                    POS: 'oifPosItemLithtingLight',
                    SOUND: {
                        PRE: 'oifPreItemLightingLightSound',
                        POS: 'oifPosItemLightingLightSound',
                    },
                },
                EXTINGUISH: {
                    PRE: 'oifPreItemLightingExtinguish',
                    POS: 'oifPosItemLightingExtinguish',
                    SOUND: {
                        PRE: 'oifPreItemLightingExtinguishSound',
                        POS: 'oifPosItemLightingExtinguishSound',
                    },
                },
            },
        },
        WEAPON: {
            MELEE: {
                HIT: {
                    PRE: 'oifPreWeaponMeleeHit',
                    POS: 'oifPosWeaponMeleeHit',
                    SOUND: {
                        PRE: 'oifPreWeaponMeleeHitSound',
                        POS: 'oifPosWeaponMeleeHitSound',
                    },
                },
                THROW: {
                    PRE: 'oifPreWeaponMeleeThrow',
                    POS: 'oifPosWeaponMeleeThrow',
                    SOUND: {
                        PRE: 'oifPreWeaponMeleeThrowSound',
                        POS: 'oifPreWeaponMeleeThrownSound',
                    },
                },
            },
            RANGED: {
                HIT: {
                    PRE: 'oifPreWeaponRangedHit',
                    POS: 'oifPosWeaponRangedHit',
                    SOUND: {
                        PRE: 'oifPreWeaponRangedHitSound',
                        POS: 'oifPosWeaponRangedHitSound',
                    },
                },
            },
        },
    }

    static OPTIONAL_MODULES = {
        LEVELS: {
            id: 'levels',
            name: 'Levels',
            active: false,
        },
        KFC: {
            id: 'kandashis-fluid-canvas',
            name: 'Kandashi\'s Fluid Canvas',
            active: false,
        },
        ITEM_PILES: {
            id: 'item-piles',
            name: 'Item Piles',
            active: false,
        },
        TAGGER: {
            id: 'tagger',
            name: 'Tagger',
            active: false,
        },
        TIDY_SHEET: {
            id: 'tidy5e-sheet',
            name: "Tidy5e Sheet",
            active: false,
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
                console.warn(`OIF | module ${this.OPTIONAL_MODULES[key].name} not active - some features disabled`);
            }
        }
    }
}