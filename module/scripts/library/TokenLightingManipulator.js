////////////////////////////////////////////////////////////////////////////////
//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects -  By ZotyDev           //
////////////////////////////////////////////////////////////////////////////////
// ? This class handles the lighting of tokens.
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { GeneralSettings } from "../interface/GeneralSettings.js";
import { TagHandler } from "../tags/TagHandler.js";

import { Constants as C } from "../constants.js";

export class TokenLightingManipulator
{
    static LIGHT_SOURCE_ID = OIF.ID + "_light_source";

    ////////////////////////////////////////////////////////////////////////////
    // Sets the lighting options of a token to default, should be used to reset
    // all the options that got applied
    ////////////////////////////////////////////////////////////////////////////
    static async SetDefaultLightingOptions(options)
    {
        await options.token.document.update({
            "light.bright"             : 0,
            "light.dim"                : 0,
            "light.animation.type"     : undefined,
            "light.animation.speed"    : 5,
            "light.animation.intensity": 5,
            "light.animation.reverse"  : false,
            "light.color"              : "#000000",
            "light.alpha"              : 0.5,
            "light.angle"              : 360,
        });

        await options.item?.update({
            "img": options?.icons?.unlit ?? options?.item?.img ?? undefined,
        });
    }

    static async SetLightingOptions(options)
    {
        await options.token.document.update({
            "light.bright"             : options?.item?.system?.range?.value ?? 0,
            "light.dim"                : options?.item?.system?.range?.long  ?? 0,
            "light.animation.type"     : options?.light?.animationType       ?? undefined,
            "light.animation.speed"    : options?.light?.animationSpeed      ?? 5,
            "light.animation.intensity": options?.light?.animationIntensity  ?? 5,
            "light.animation.reverse"  : options?.light?.animationReverse    ?? false,
            "light.color"              : options?.light?.color               ?? "#000000",
            "light.alpha"              : options?.light?.intensity           ?? 0.5,
            "light.angle"              : options?.light?.angle               ?? 360,
        });

        if (options.item != undefined)
        {
            if (options.lit)
            {
                await options.item.update({
                    "img": options?.icons?.lit ?? options?.item?.img ?? undefined,
                });
            }
            else
            {
                await options.item.update({
                    "img": options?.icons?.unlit ?? options?.item?.img ?? undefined,
                });
            }
        }
    }

    static async SetLighting(options)
    {
        // Check if light_source tag is already set
        if (Tagger.hasTags(options.token, TokenLightingManipulator.LIGHT_SOURCE_ID))
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.AlreadySource"));
        }
        else
        {
            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.LIGHT.PRE, options);

            // Set token light properties
            TokenLightingManipulator.SetLightingOptions(options);

            // Add the light source tag
            await Tagger.addTags(options.token, [TokenLightingManipulator.LIGHT_SOURCE_ID, `${C.ID}_${options.name}`]);

            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.LIGHT.POS, options);
        }
    }

    static async RemoveLighting(options)
    {
        // Check if light_source tag is not set
        if (!Tagger.hasTags(options.token, TokenLightingManipulator.LIGHT_SOURCE_ID))
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.NotSource"));
        }
        else if (!Tagger.hasTags(options.token, `${C.ID}_${options.name}`))
        {
            ui.notifications.error(game.i18n.localize("OIF.Item.Lighting.Error.NotRightSource"));
        }
        else
        {
            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.EXTINGUISH.PRE, options);

            // Reset token light properties
            TokenLightingManipulator.SetDefaultLightingOptions(options);

            // Remove the light source tag
            await Tagger.removeTags(options.token, [TokenLightingManipulator.LIGHT_SOURCE_ID, `${C.ID}_${options.name}`]);

            // Call hook
            Hooks.call(OIF.HOOKS.ITEM.LIGHTING.EXTINGUISH.POS, options);
        }
    }

    static async ToggleItemLighting(options)
    {
        Hooks.call(OIF.HOOKS.ITEM.LIGHTING.POST_PREPARE, options);

        if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.LIGHTING_ITEMS_AUTOMATION))
        {
            // Check if light_source tag is set
            if (Tagger.hasTags(options.token, TokenLightingManipulator.LIGHT_SOURCE_ID))
            {
                // Remove if set
                this.RemoveLighting({ ...options, lit: false});

                Hooks.call(OIF.HOOKS.ITEM.LIGHTING.EXTINGUISH.POST_APPLY, options);
            }
            else
            {
                // Add if unset
                this.SetLighting({ ...options, lit: true });

                Hooks.call(OIF.HOOKS.ITEM.LIGHTING.LIGHT.POST_APPLY, options);
            }
        }
    }

    static async RemoveAllLighting()
    {
        let Tokens = Tagger.getByTag(TokenLightingManipulator.LIGHT_SOURCE_ID);

        for (let Token of Tokens)
        {
            await TokenLightingManipulator.SetDefaultLightingOptions({ token: await canvas.tokens.get(Token.id) });

            // Get the tags of the token
            let TokenTags = Tagger.getTags(Token);

            // Remove the prefix
            TokenTags = TokenTags.map(tag => tag.replace(C.ID + "_", ""));

            let LightingTags = Object.assign({}, TagHandler.Tags['Lighting']);
            for (let key in LightingTags)
            {
                if (LightingTags.hasOwnProperty(key))
                {
                    LightingTags[key].name = key;
                }
            }

            // Filter the tags to only get the ones related to lighting
            let itemTags = {};
            for (let key in LightingTags)
            {
                if (LightingTags.hasOwnProperty(key))
                {
                    let lightingTag = LightingTags[key];
                    TokenTags.forEach((tokenTag) =>
                    {
                        if (lightingTag.name == tokenTag)
                        {
                            itemTags[lightingTag.name] = lightingTag;
                        }
                    });
                }
            }

            // Get the lighting items
            for (let lightingTag of Object.values(itemTags))
            {
                for (let item of Token.actor.items)
                {
                    // Get the tags of the item
                    let Tags = itemTags.Get(item);

                    // Check if the item has the tag
                    if (Tags.includes(lightingTag.name))
                    {
                        // Set the item icon to the unlit one
                        item.update({ "img": lightingTag.icons.unlit });

                        // Remove the tag
                        await Tagger.removeTags(Token, [`${C.ID}_${lightingTag.name}`]);
                    }
                }
            }

            // Remove the light source tag
            Tagger.removeTags(Token, [TokenLightingManipulator.LIGHT_SOURCE_ID]);
        }
    }
}
