import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class TokenLightingManipulator
{
    static async SetItemLighting(item, author, options)
    {
        // Check if light_source tag is already set
        if (Tagger.hasTags(author, "light_source"))
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.AlreadySource"));
            console.error("Failed to set token lighting based on item! Token is already a light source");
            return false;
        }
        else
        {
            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.LIGHT.PRE, options);

            // Set token light properties
            await author.document.update({ 
                "light.bright": item.data.data.range.value,
                "light.dim": item.data.data.range.long,
                "light.animation.type": options.light.animationType,
                "light.color": options.light.color,
                "light.alpha": options.light.alpha,
            });

            // Set item image to the lit one
            await item.update({ 
                "img": options.image.lit,
            });

            // Add the light source tag
            await Tagger.addTags(author, ["light_source", options.name]);

            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.LIGHT.POS, options);

            return true;
        }
    }

    static async RemoveItemLighting(item, author, options)
    {
        // Check if light_source tag is not set
        if (!Tagger.hasTags(author, "light_source")) 
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.NotSource"));
            console.error("Failed to reset token lighting based on item! Token is not a light source");
            return false;
        }
        else if (!Tagger.hasTags(author, options.name))
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.NotRightSource"));
            console.error("Failed to reset token lighting based on item! Specified item is not the one providing light");
            return false;
        }
        else
        {
            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.EXTINGUISH.PRE);

            // Reset token light properties
            await author.document.update({
                "light.bright": 0,
                "light.dim": 0,
                "light.animation.type": undefined,
                "light.color": "#000000",
                "light.alpha": 0.5,
            });

            // Set item image to the unlit one
            await item.update({
                "img": options.image.unlit,
            });

            // Remove the light source tag
            await Tagger.removeTags(author, ["light_source", options.name]);

            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.EXTINGUISH.POS);

            return true;
        }
    }

    static async ToggleItemLighting(item, author, options)
    {
        // Check if light_source tag is set
        if (Tagger.hasTags(author, "light_source"))
        {
            // Remove if set
            return this.RemoveItemLighting(item, author, options);
        }
        else
        {
            // Add if unset
            return this.SetItemLighting(item, author, options);
        }

        return true;
    }
}