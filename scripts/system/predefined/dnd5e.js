import { ObjectsInteractionsFX as OIF } from "../../ObjectsInteractionsFX.js";
import { MasterTagsSettings } from "../../interface/MasterTagsSettings.js";

export class DnD5e 
{
    static Methods = {
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