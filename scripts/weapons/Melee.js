import { ItemAnimator } from "../animation/ItemAnimator.js";
import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";

const MeleeWeapons = {
    club: {
        meleeAnimation: "jb2a.club.melee.01.white",
    },
    dagger: {
        meleeAnimation: "jb2a.dagger.melee.fire.white",
        throwAnimation: "jb2a.dagger.throw.01.white",
        returnAnimation: "jb2a.dagger.return.01.white",  
    },
    falchion: {
        meleeAnimation: "jb2a.falchion.melee.01.white",
    },
    glaive: {
        meleeAnimation: "jb2a.glaive.melee.01.white",
    },
    greataxe: {
        meleeAnimation: "jb2a.greataxe.melee.standard.white",
        throwAnimation: "jb2a.greataxe.throw.white",
    },
    greatclub: {
        meleeAnimation: "jb2a.greatclub.standard.white",
    },
    greatsword: {
        meleeAnimation: "jb2a.greatsword.melee.standard.white",
        throwAnimation: "jb2a.greatsword.throw",
        returnAnimation: "jb2a.greatsword.return",
    },
    halberd: {
        meleeAnimation: "jb2a.halberd.melee.01.white",
    },
    hammer: {
        meleeAnimation: "jb2a.hammer.melee.01.white",
        throwAnimation: "jb2a.hammer.throw",
        returnAnimation: "jb2a.hammer.return",
    },
    javelin: {
        meleeAnimation: "jb2a.spear.melee.01.white.2", // Uses a spear
        throwAnimation: "jb2a.javelin.01.throw",
        returnAnimation: "jb2a.javelin.01.return",
    },
    kunai: {
        meleeAnimation: "jb2a.dagger.melee.fire.white", // Uses a dagger
        throwAnimation: "jb2a.kunai.throw.01",
    },
    handaxe: {
        meleeAnimation: "jb2a.handaxe.melee.standard.white",
        throwAnimation: "jb2a.handaxe.throw.01",
    },
    mace: {
        meleeAnimation: "jb2a.mace.melee.01.white",
        throwAnimation: "jb2a.mace.throw",
    },
    maul: {
        meleeAnimation: "jb2a.maul.melee.standard.white",
        powerful: true,
        powerfulDelay: -1000,
    },
    quarterstaff: {
        meleeAnimation: "jb2a.quarterstaff.melee.01.white",
    },
    rapier: {
        meleeAnimation: "jb2a.rapier.melee.01.white",
    },
    scimitar: {
        meleeAnimation: "jb2a.scimitar.melee.01.white",
    },
    shortsword: {
        meleeAnimation: "jb2a.shortsword.melee.01.white",
    },
    spear: {
        meleeAnimation: "jb2a.spear.melee.01.white",
        throwAnimation: "jb2a.spear.throw.01",
        returnAnimation: "jb2a.spear.return.01",
    },
    sword: {
        meleeAnimation: "jb2a.sword.melee.01.white",
        throwAnimation: "jb2a.sword.throw.white",
    },
    warhammer: {
        meleeAnimation: "jb2a.warhammer.melee.01.white",
    },
    wrench: {
        meleeAnimation: "jb2a.wrench.melee.01.white",
    }
}

Hooks.on("ready", () => {
    Hooks.on("midi-qol.RollComplete", async (workflow) => {
        let Item = workflow.item;
        let Author = canvas.tokens.get(workflow.tokenId);
        let Targets = Array.from(game.user.targets);
    
        let Tags = ObjectsInteractionsFXData.GetData(Item);
        let Options = MeleeWeapons[Tags];
        if (Options != null && Options != undefined) {
            Options.name = Tags;
            Options.miss = workflow.hitTargets.size === 0;
    
            ItemAnimator.MeleeSingleAttack(Item, Author, Targets[0], Options);
        }
    });
});