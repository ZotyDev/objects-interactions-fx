export class ObjectsInteractionsFX
{
    static ID = "objects-interactions-fx";

    static FLAGS = {
        OIF: "OIF",
        ITEM_TAGS: "item-tags"
    }

    static TEMPLATES = {
        ITEM_TAGS: `modules/${this.ID}/templates/ItemTags.hbs`
    }

    static SOCKET;

    static SETTINGS = {
        LOADED_MODULES: {
            LEVELS: false,
            KFC: false,
            ITEM_PILES: false,
            WARPGATE: false,
            TAGGER: false,
            TOKEN_ATTACHER: false,
            VEHICLES_AND_MECHANISMS: false,
            TIMES_UP: false,
            ABOUT_TIME: false,
        },
        MENU: {
            REMOVE_THROWABLE_ITEM: "removeThrowableItem",
            ADD_THROWABLE_TO_TARGET_INVENTORY: "addThrowableToTargetInventory",
            ADD_AMMUNITION_TO_TARGET_INVENTORY: "addAmmunitionToTargetInventory",
            CREATE_ITEM_PILES_ON_MISS: "createItemPilesOnMiss",
            POWERFUL_IMPACT_SHAKE_EFFECT: "powerfulImpactShakeEffect",
            SET_ELEVATION_OF_ITEM_PILES: "setElevationOfItemPiles",
        },
    }

    static HOOKS = {
        ITEM: {
            LIGHTING: {
                LIGHT: {
                    PRE: "oifPreItemLightingLight",
                    POS: "oifPosItemLithtingLight",
                    SOUND: {
                        PRE: "oifPreItemLightingLightSound",
                        POS: "oifPosItemLightingLightSound",
                    },
                },
                EXTINGUISH: {
                    PRE: "oifPreItemLightingExtinguish",
                    POS: "oifPosItemLightingExtinguish",
                    SOUND: {
                        PRE: "oifPreItemLightingExtinguishSound",
                        POS: "oifPosItemLightingExtinguishSound",
                    },
                },
            },
        },
        WEAPON: {
            MELEE: {
                HIT: {
                    PRE: "oifPreWeaponMeleeHit",
                    POS: "oifPosWeaponMeleeHit",
                    SOUND: {
                        PRE: "oifPreWeaponMeleeHitSound",
                        POS: "oifPosWeaponMeleeHitSound",
                    },
                },
                THROW: {
                    PRE: "oifPreWeaponMeleeThrow",
                    POS: "oifPosWeaponMeleeThrow",
                    SOUND: {
                        PRE: "oifPreWeaponMeleeThrowSound",
                        POS: "oifPreWeaponMeleeThrownSound",
                    },
                },
            },
            RANGED: {
                HIT: {
                    PRE: "oifPreWeaponRangedHit",
                    POS: "oifPosWeaponRangedHit",
                    SOUND: {
                        PRE: "oifPreWeaponRangedHitSound",
                        POS: "oifPosWeaponRangedHitSound",
                    },
                },
            },
        },
    }

    static Initialize() {
        // Check loaded modules
        if (game.modules.get("levels")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.LEVELS = true;
        }
        else
        {
            console.warn("OIF | levels module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("kandashis-fluid-canvas")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.KFC = true;
        }
        else
        {
            console.warn("OIF | kandashis-fluid-canvas module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("item-piles")?.active)
        {
            this.SETTINGS.LOADED_MODULES.ITEM_PILES = true;
        }
        else
        {
            console.warn("OIF |item-piles module is not loaded, some functions will not be avaliable")
        }
        if (game.modules.get("warpgate")?.active)
        {
            this.SETTINGS.LOADED_MODULES.WARPGATE = true;
        }
        else
        {
            console.warn("OIF | warpgate module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("tagger")?.active) 
        {
            //this.SETTINGS.LOADED_MODULES.TAGGER = true;
        }
        else
        {
            console.warn("OIF | tagger module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("token-attacher")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.TOKEN_ATTACHER = true;    
        }
        else
        {
            console.warn("OIF | token-attacher module is not loaded, some functions will not be avaliable")
        }
        if (game.modules.get("vehicles-and-mechanisms")?.active)
        {
            //this.SETTINGS.LOADED_MODULES.VEHICLES_AND_MECHANISMS = true;
        }
        else
        {
            console.warn("OIF | vehicles-and-mechanisms module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("times-up")?.active)
        {
            this.SETTINGS.LOADED_MODULES.TIMES_UP = true;
        }
        else
        {
            //console.warn("OIF | times-p module is not loaded, some functions will not be avaliable");
        }
        if (game.modules.get("about-time")?.active)
        {
            this.SETTINGS.LOADED_MODULES.ABOUT_TIME = true;
        }
        else
        {
            //console.warn("OIF | about-time module is not loaded, some functions will not be avaliable");
        }

        // Register settings
        game.settings.register(this.ID, this.SETTINGS.MENU.REMOVE_THROWABLE_ITEM, {
            name: "OIF.Settings.RemoveThrowableItem.Title",
            hint: "OIF.Settings.RemoveThrowableItem.Hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
        game.settings.register(this.ID, this.SETTINGS.MENU.ADD_THROWABLE_TO_TARGET_INVENTORY, {
            name: "OIF.Settings.AddThrowableToTargetInventory.Title",
            hint: "OIF.Settings.AddThrowableToTargetInventory.Hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
        game.settings.register(this.ID, this.SETTINGS.MENU.ADD_AMMUNITION_TO_TARGET_INVENTORY, {
            name: "OIF.Settings.AddAmmunitionToTargetInventory.Title",
            hint: "OIF.Settings.AddAmmunitionToTargetInventory.Hint",
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register(this.ID, this.SETTINGS.MENU.CREATE_ITEM_PILES_ON_MISS, {
            name: "OIF.Settings.CreateItemPilesOnMiss.Title",
            hint: "OIF.Settings.CreateItemPilesOnMiss.Hint",
            scope: "world",
            config: this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            default: this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            type: Boolean,
        });
        game.settings.register(this.ID, this.SETTINGS.MENU.POWERFUL_IMPACT_SHAKE_EFFECT, {
            name: "OIF.Settings.PowerfulImpactShakeEffect.Title",
            hint: "OIF.Settings.PowerfulImpactShakeEffect.Hint",
            scope: "client",
            config: this.SETTINGS.LOADED_MODULES.KFC,
            default: this.SETTINGS.LOADED_MODULES.KFC,
            type: Boolean,
        });
        game.settings.register(this.ID, this.SETTINGS.MENU.SET_ELEVATION_OF_ITEM_PILES, {
            name: "OIF.Settings.SetElevationOfItemPiles.Title",
            hint: "OIF.Settings.SetElevationOfItemPiles.Hint",
            scope: "world",
            config: this.SETTINGS.LOADED_MODULES.LEVELS && this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            default: this.SETTINGS.LOADED_MODULES.LEVELS && this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            type: Boolean,
        });
    }
}