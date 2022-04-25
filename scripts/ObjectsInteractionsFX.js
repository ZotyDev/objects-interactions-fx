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
        }
    }

    static Initialize() {
        // Check loaded modules
        if (game.modules.get("levels")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.LEVELS = true;
        }
        if (game.modules.get("kandashis-fluid-canvas")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.KFC = true;
        }
        if (game.modules.get("item-piles")?.active)
        {
            this.SETTINGS.LOADED_MODULES.ITEM_PILES = true;
        }
        if (game.modules.get("warpgate")?.active)
        {
            this.SETTINGS.LOADED_MODULES.WARPGATE = true;
        }
        if (game.modules.get("tagger")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.TAGGER = true;
        }
        if (game.modules.get("token-attacher")?.active) 
        {
            this.SETTINGS.LOADED_MODULES.TOKEN_ATTACHER = true;    
        }
        if (game.modules.get("vehicles-and-mechanisms")?.active)
        {
            this.SETTINGS.LOADED_MODULES.VEHICLES_AND_MECHANISMS = true;
        }
        if (game.modules.get("times-up")?.active)
        {
            this.SETTINGS.LOADED_MODULES.TIMES_UP = true;
        }
        if (game.modules.get("about-time")?.active)
        {
            this.SETTINGS.LOADED_MODULES.ABOUT_TIME = true;
        }

        // Register settings
        game.settings.register(this.ID, "removeThrowableItem", {
            name: "OIF.Settings.RemoveThrowableItem.Title",
            hint: "OIF.Settings.RemoveThrowableItem.Hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
        game.settings.register(this.ID, "addThrowableToTargetInventory", {
            name: "OIF.Settings.AddThrowableToTargetInventory.Title",
            hint: "OIF.Settings.AddThrowableToTargetInventory.Hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
        game.settings.register(this.ID, "addAmmunitionToTargetInventory", {
            name: "OIF.Settings.AddAmmunitionToTargetInventory.Title",
            hint: "OIF.Settings.AddAmmunitionToTargetInventory.Hint",
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
        game.settings.register(this.ID, "createItemPilesOnMiss", {
            name: "OIF.Settings.CreateItemPilesOnMiss.Title",
            hint: "OIF.Settings.CreateItemPilesOnMiss.Hint",
            scope: "world",
            config: this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            default: this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            type: Boolean,
        });
        game.settings.register(this.ID, "powerfulImpactShakeEffect", {
            name: "OIF.Settings.PowerfulImpactShakeEffect.Title",
            hint: "OIF.Settings.PowerfulImpactShakeEffect.Hint",
            scope: "client",
            config: this.SETTINGS.LOADED_MODULES.KFC,
            default: this.SETTINGS.LOADED_MODULES.KFC,
            type: Boolean,
        });
        game.settings.register(this.ID, "setElevationOfItemPiles", {
            name: "OIF.Settings.SetElevationOfItemPiles.Title",
            hint: "OIF.Settings.SetElevationOfItemPiles.Hint",
            scope: "world",
            config: this.SETTINGS.LOADED_MODULES.LEVELS && this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            default: this.SETTINGS.LOADED_MODULES.LEVELS && this.SETTINGS.LOADED_MODULES.ITEM_PILES,
            type: Boolean,
        })
    }
}