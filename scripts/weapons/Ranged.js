import { ItemAnimator } from "../animation/ItemAnimator.js";
import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { GeneralSettings } from "../interface/GeneralSettings.js";

const RangedWeapons = {
    shortbow: {
        rangedAnimation: {
            effect: "jb2a.arrow.physical.white.01",
        }
    },
    longbow: {
        rangedAnimation: {
            effect: "jb2a.arrow.physical.white.01",
        },
    },
    handcrossbow: {
        rangedAnimation: {
            effect: "jb2a.bolt.physical.white02",
        },
    },
    lightcrossbow: {
        rangedAnimation: {
            effect: "jb2a.bolt.physical.white02",
        },
    },
    heavycrossbow: {
        rangedAnimation: {
            effect: "jb2a.bolt.physical.white02",
        },
    }
}

Hooks.on("oifReady", () => {
    Hooks.on(GeneralSettings.Get(OIF.SETTINGS.GENERAL.DEFAULT_ATTACK_HOOK), async (workflow) => {
        let Item = workflow.item;
        let Author = canvas.tokens.get(workflow.tokenId);
        let Targets = Array.from(game.user.targets);
    
        let Tags = await ObjectsInteractionsFXData.GetData(Item);

        // May god forbid me for this sin
        for (let i = 0; i < Tags.length; i++) 
        {
            let Options = RangedWeapons[Tags[i]];
            if (Options != null && Options != undefined) 
            {
                Options.name = Tags[i];
                Options.miss = workflow.hitTargets.size === 0;

                ItemAnimator.RangedSingleAttack(Item, Author, Targets[0], Options);
                return;
            }
        }
    });
});