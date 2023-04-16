import { ObjectsInteractionsFX as OIF } from "../../ObjectsInteractionsFX.js";
import { ObjectsInteractionsFXData as OIFD } from "../../data/ObjectsInteractionsFXData.js";
import { MasterTagsSettings } from "../../interface/MasterTagsSettings.js";

export class DnD5e 
{
    static Methods = {
        'GetOptionsFromWeaponRoll': async (workflow) =>
        {
            // Check if Midi QOL is active
            if(OIF.OPTIONAL_MODULES.MIDI_QOL?.active)
            {   
                // Retrieve the item
                let Item = workflow[0].item;

                // Retrieve the item's tags
                let Tags = await OIFD.GetData(Item);

                // Retrieve the token
                let Token = await canvas.tokens.get(workflow[0].tokenId);

                // Retrieve the targets
                let Targets = Array.from(game.user.targets);
                let HitTargets = workflow[0].hitTargets;

                // Set the options
                let Options =
                {
                    name   : Tags[0],
                    item   : Item,
                    tags   : Tags,
                    author : Token,
                    targets: Targets,
                    miss   : HitTargets.size === 0 ?? false,
                    type   : 'attack',
                }

                return Options;
            }
            // If Midi QOL is not active
            else
            {
                // Retrieve the item
                let Item = workflow[0];

                // Retrieve the item's tags
                let Tags = await OIFD.GetData(Item);

                // Retrieve the actor and token
                let Actor = Item.parent;
                let Token = Actor.token?.object ?? Actor.getActiveTokens()[0];

                // Retrieve the targets
                let Targets = Array.from(game.user.targets);
                let HitTargets = Targets.filter(t => t.actor.system.attributes.ac.value <= workflow[1].total);
            
                // Set the options
                let Options =
                {
                    name   : Tags[0],
                    item   : Item,
                    tags   : Tags,
                    author : Token,
                    targets: Array.from(game.user.targets),
                    miss   : await game.settings.get(OIF.ID, OIF.SETTINGS.GENERAL.DEFAULT_ATTACK_HOOK) == 'dnd5e.rollDamage' ? false : HitTargets.size === 0 ?? false,
                    type   : 'attack',
                }

                return Options;
            }
        },
        'GetOptionsFromItemRoll': async (workflow) =>
        {
            // Check if Midi QOL is active
            if(game.modules.get(OIF.OPTIONAL_MODULES.MIDI_QOL)?.active)
            {   
                // Retrieve the item
                let Item = workflow[0].item;

                // Retrieve the item's tags
                let Tags = await OIFD.GetData(Item);

                // Retrieve the token
                let Token = await canvas.tokens.get(workflow[0].tokenId);

                // Retrieve the targets
                let Targets = Array.from(game.user.targets);

                // Set the options
                let Options = 
                {
                    name   : Tags[0],
                    item   : Item,
                    tags   : Tags,
                    author : Token,
                    targets: Targets,
                    miss   : false,
                    type   : 'item',
                }

                return Options;
            }
            // If Midi QOL is not active
            else
            {
                // Retrieve the item
                let Item = workflow[0];

                // Retrieve the item's tags
                let Tags = await OIFD.GetData(Item);

                // Retrieve the actor and token
                let Actor = Item.parent;
                let Token = Actor.token?.object ?? Actor.getActiveTokens()[0];

                // Retrieve the targets
                let Targets = Array.from(game.user.targets);
            
                // Set the options
                let Options =
                {
                    name   : Tags[0],
                    item   : Item,
                    tags   : Tags,
                    author : Token,
                    targets: Targets,
                    miss   : false,
                    type   : 'item',
                }

                return Options;
            }
        },
        'GetDefaultTagPack': () => 
        {
            if (game.modules.get('jb2a_patreon')?.active)
            {
                return 'DefaultFantasyTagsJB2AComplete';
            }
            else if (game.modules.get('jb2a_patreon')?.active)
            {
                return 'DefaultFantasyTagsJB2AFree';
            }
            else
            {
                return 'DefaultFantasyTagsNoAnimations';
            }
        },
        'ApplyDefaultTagPack': async () =>
        {
            return await MasterTagsSettings.LoadTags(MasterTagsSettings.TagPacks[0]);
        },
        'GetDistances': (options) =>
        {
            options.meleeWeaponDistance = options.gridUnitSize;

            options.minDistance = options.item.system.range.value;
            options.maxDistance = options.item.system.range.long;

            if (options.item.system.properties.rch)
            {
                options.meleeWeaponDistance *= 2;
            }

            return options;
        },
        'CheckThrowable': (options) =>
        {
            options.throwable = options.item.system.properties.thr;
            return options;
        },
        'CheckConsumeAmmo': (options) =>
        {
            options.consumeAmmo = options.item.system.properties.amm;
            return options;
        },
        'CheckAmmo': (options) =>
        {
            let Target = options.item.system.consume.target;
            if (Target == "")
            {
                options.ammo = undefined;
            }
            else
            {
                options.ammo = options.item.system.consume.target;
            }
            return options;
        },
    }
}