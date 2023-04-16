import { ItemAnimator } from "../animation/ItemAnimator.js";
import { TokenLightingManipulator } from "../library/TokenLightingManipulator.js";

export class TagHandler
{
    static Tags = {
        MeleeAttack : {},
        RangedAttack: {},
        Lighting    : {}
    }

    static async UpdateTags(tags)
    {
        Object.entries(tags).forEach((tag) => {
            switch (tag[1].type)
            {
                case 'meleeAttack' : TagHandler.Tags.MeleeAttack[tag[0]] = tag[1]; break;
                case 'rangedAttack': TagHandler.Tags.RangedAttack[tag[0]] = tag[1]; break;
                case 'lighting'    : TagHandler.Tags.Lighting[tag[0]] = tag[1]; break;
                default: break;
            }
        });
    }

    ////////////////////////////////////////////////////////////
    // Clean Tags
    ////////////////////////////////////////////////////////////
    static CleanTags(tags)
    {
        let CleanedTags = tags;
        // Remove the tags inside of MeleeAttack
        CleanedTags = CleanedTags.filter((tag) => 
        {
            return TagHandler.Tags.MeleeAttack[tag] == undefined;
        });
        // Remove the tags inside of RangedAttack
        CleanedTags = CleanedTags.filter((tag) =>
        {
            return TagHandler.Tags.RangedAttack[tag] == undefined;
        });
        // Remove the tags inside of Lighting
        CleanedTags = CleanedTags.filter((tag) =>
        {
            return TagHandler.Tags.Lighting[tag] == undefined;
        });

        return tags;
    }

    ////////////////////////////////////////////////////////////
    // Dispatch Tags
    ////////////////////////////////////////////////////////////
    static async Dispatch(options)
    {
        ////////////////////////////////////////////////////////////
        // Iterate through all the tags trying to find the first
        // valid tag
        options.tags.every((tag) =>
        {
            ////////////////////////////////////////////////////////////
            // Dispatch Melee Attack Tags
            ////////////////////////////////////////////////////////////
            if (TagHandler.Tags.MeleeAttack[tag] != undefined && options.type == 'attack')
            {
                // Combine the options
                let MergedOptions = 
                {
                    ...options,
                    ...TagHandler.Tags.MeleeAttack[tag]
                }
                // Check if the tag is enabled
                if (MergedOptions.enabled)
                {
                    // Add the other tags
                    MergedOptions.tags = options.tags;

                    // Execute the animation
                    ItemAnimator.MeleeWeaponSingleAttack(MergedOptions);

                    return false;
                }
                else
                {
                    return true;
                }
            }
            ////////////////////////////////////////////////////////////
            // Dispatch Ranged Attack Tags
            ////////////////////////////////////////////////////////////
            else if (TagHandler.Tags.RangedAttack[tag] != undefined && options.type == 'attack')
            {
                // Combine the options
                let MergedOptions =
                {
                    ...options,
                    ...TagHandler.Tags.RangedAttack[tag]
                }
                // Check if the tag is enabled
                if (MergedOptions.enabled)
                {
                    // Add the other tags
                    MergedOptions.tags = options.tags;

                    // Execute the animation
                    ItemAnimator.RangedWeaponSingleAttack(MergedOptions);

                    return false;
                }
                else
                {
                    return true;
                }
            }
            ////////////////////////////////////////////////////////////
            // Dispatch Lighting Tags
            ////////////////////////////////////////////////////////////
            else if (TagHandler.Tags.Lighting[tag] != undefined && options.type == 'item')
            {
                // Combine the option
                let MergedOptions =
                {
                    ...options,
                    ...TagHandler.Tags.Lighting[tag]
                }
                // Check if the tag is enabled
                if (MergedOptions.enabled)
                {
                    // Add the other tags
                    MergedOptions.tags = options.tags;

                    // Execute the animation
                    TokenLightingManipulator.ToggleItemLighting(MergedOptions);

                    return false;
                }
                else
                {
                    return true;
                }
            }

            return true;
        })
    }
}