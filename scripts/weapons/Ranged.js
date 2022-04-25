import { ItemAnimator } from "../animation/ItemAnimator.js";
import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";

const RangedWeapons = {
    shortbow: {
        rangedAnimation: "jb2a.arrow.physical.white.01",
    },
    longbow: {
        rangedAnimation: "jb2a.arrow.physical.white.01",
    },
    handcrossbow: {
        rangedAnimation: "jb2a.bolt.physical.white02",
    },
    lightcrossbow: {
        rangedAnimation: "jb2a.bolt.physical.white02",
    },
    heavycrossbow: {
        rangedAnimation: "jb2a.bolt.physical.white02",
    }
}

Hooks.on("ready", () => {
    Hooks.on("midi-qol.RollComplete", async (workflow) => {
        let Item = workflow.item;
        let Author = canvas.tokens.get(workflow.tokenId);
        let Targets = Array.from(game.user.targets);
    
        let Tags = ObjectsInteractionsFXData.GetData(Item);
        let Options = RangedWeapons[Tags];
        if (Options != null && Options != undefined) {
            Options.name = Tags;
            Options.miss = workflow.hitTargets.size === 0;
    
            ItemAnimator.RangedSingleAttack(Item, Author, Targets[0], Options);
        }
    });
});