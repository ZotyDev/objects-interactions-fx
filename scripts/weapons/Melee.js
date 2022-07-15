import { ItemAnimator } from "../animation/ItemAnimator.js";
import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";

const MeleeWeapons = {
    club: {
        meleeAnimation: {
            effect: "jb2a.club.melee.01.white",
        },
    },
    dagger: {
        meleeAnimation: {
            effect: "jb2a.dagger.melee.fire.white",
        },
        throwAnimation: {
            effect: "jb2a.dagger.throw.01.white",
        },
        returnAnimation: {
            effect: "jb2a.dagger.return.01.white",
        }, 
    },
    falchion: {
        meleeAnimation: {
            effect: "jb2a.falchion.melee.01.white",
        },
    },
    glaive: {
        meleeAnimation: {
            effect: "jb2a.glaive.melee.01.white",
        },
    },
    greataxe: {
        meleeAnimation: {
            effect: "jb2a.greataxe.melee.standard.white",
        },
        throwAnimation: {
            effect: "jb2a.greataxe.throw.white",
        },
    },
    greatclub: {
        meleeAnimation: {
            effect: "jb2a.greatclub.standard.white",
        },
    },
    greatsword: {
        meleeAnimation: {
            effect: "jb2a.greatsword.melee.standard.white",
        },
        throwAnimation: {
            effect: "jb2a.greatsword.throw",
        },
        returnAnimation: {
            effect: "jb2a.greatsword.return",
        },
    },
    halberd: {
        meleeAnimation: {
            effect: "jb2a.halberd.melee.01.white",
        },
    },
    hammer: {
        meleeAnimation: {
            effect: "jb2a.hammer.melee.01.white",
        },
        throwAnimation: {
            effect: "jb2a.hammer.throw",
        },
        returnAnimation: {
            effect: "jb2a.hammer.return",
        },
    },
    javelin: {
        meleeAnimation: {
            effect: "jb2a.spear.melee.01.white.2", // Uses a spear
        },
        throwAnimation: {
            effect: "jb2a.javelin.01.throw",
        },
        returnAnimation: {
            effect: "jb2a.javelin.01.return",
        },
    },
    kunai: {
        meleeAnimation: {
            effect: "jb2a.dagger.melee.fire.white", // Uses a dagger
        },
        throwAnimation: {
            effect: "jb2a.kunai.throw.01",
        },
    },
    handaxe: {
        meleeAnimation: {
            effect: "jb2a.handaxe.melee.standard.white",
        },
        throwAnimation: {
            effect: "jb2a.handaxe.throw.01",
        },
    },
    mace: {
        meleeAnimation: {
            effect: "jb2a.mace.melee.01.white",
        },
        throwAnimation: {
            effect: "jb2a.mace.throw",
        },
    },
    maul: {
        meleeAnimation: {
            effect: "jb2a.maul.melee.standard.white",
            powerful: true,
            powerfulDelay: -1000,
        },
    },
    quarterstaff: {
        meleeAnimation: {
            effect: "jb2a.quarterstaff.melee.01.white",
        },
    },
    rapier: {
        meleeAnimation: {
            effect: "jb2a.rapier.melee.01.white",
        },
    },
    scimitar: {
        meleeAnimation: {
            effect: "jb2a.scimitar.melee.01.white",
        },
    },
    shortsword: {
        meleeAnimation: {
            effect: "jb2a.shortsword.melee.01.white",
        },
    },
    spear: {
        meleeAnimation: {
            effect: "jb2a.spear.melee.01.white",
        },
        throwAnimation: {
            effect: "jb2a.spear.throw.01",
        },
        returnAnimation: {
            effect: "jb2a.spear.return.01",
        },
    },
    sword: {
        meleeAnimation: {
            effect: "jb2a.sword.melee.01.white",
        },
        throwAnimation: {
            effect: "jb2a.sword.throw.white",
        },
    },
    warhammer: {
        meleeAnimation: {
            effect: "jb2a.warhammer.melee.01.white",
        }
    },
    wrench: {
        meleeAnimation: {
            effect: "jb2a.wrench.melee.01.white",
        },
    },
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