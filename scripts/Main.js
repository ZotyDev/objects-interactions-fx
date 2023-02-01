import { ItemAnimator } from "./animation/ItemAnimator.js";
import { ObjectsInteractionsFX as OIF } from "./ObjectsInteractionsFX.js";
import { Settings } from "./Settings.js";
import { ItemTags } from "./interface/ItemTags.js";

Hooks.on("init", () =>
{
    console.log("%cObject Interaction FX", `
        color:#FF0088;
        background-color:white;
        font-size:25pt;
        font-weight:bold;
        padding:15pt;
    `);

    OIF.Initialize();

    Hooks.on("getItemSheetHeaderButtons", async (itemSheet, buttonArray) => {
        let TagButton = {
            label: "Tags",
            class: "item-tags",
            icon: "fas fa-tags",
            onclick: async () => {
                new ItemTags().render(true, { item: itemSheet.object, width: 480 })
            }
        }

        buttonArray.unshift(TagButton);
    });

    Hooks.on("getActorSheetHeaderButtons", async (itemSheet, buttonArray) => {
        let TagButton = {
            label: "Tags",
            class: "item-tags",
            icon: "fas fa-tags",
            onclick: async () => {
                new ItemTags().render(true, { item: itemSheet.object, width: 480 })
            }
        }

        buttonArray.unshift(TagButton);
    })

    window[OIF.FLAGS.OIF] = {
        MeleeSingleAttack: ItemAnimator.MeleeSingleAttack,
        RangedSingleAttack: ItemAnimator.RangedSingleAttack
    };

    Hooks.on("ready", () => {
        Settings.Initialize();

        Hooks.callAll("oifReady", game.modules.get(OIF.ID).api);
        console.log("Automated Objects, Interactions and Effects is ready!!");
    });
});