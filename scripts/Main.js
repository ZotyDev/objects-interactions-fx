import { ItemAnimator } from "./animation/ItemAnimator.js";
import { ObjectsInteractionsFX } from "./ObjectsInteractionsFX.js";
import { ObjectsInteractionsFXData} from "./data/ObjectsInteractionsFXData.js";
import { ItemTags } from "./interface/ItemTags.js";

Hooks.on("init", () =>
{
    ObjectsInteractionsFX.Initialize();

    Hooks.on("getItemSheetHeaderButtons", async (itemSheet, buttonArray) => {
        let TagButton = {
            label: "Item Tags",
            class: "item-tags",
            icon: "fas fa-tags",
            onclick: async () => {
                await ObjectsInteractionsFXData.CreateData(itemSheet.object, [ '' ]);
                new ItemTags().render(true, { item: itemSheet.object, width: 480 })
            }
        }

        buttonArray.unshift(TagButton);
    });

    window[ObjectsInteractionsFX.FLAGS.OIF] = {
        MeleeSingleAttack: ItemAnimator.MeleeSingleAttack,
        RangedSingleAttack: ItemAnimator.RangedSingleAttack
    };

    console.log("%cObject Interaction FX", `
        color:#FF0088;
        background-color:white;
        font-size:25pt;
        font-weight:bold;
        padding:15pt;
    `);

    Hooks.callAll("oifReady", game.modules.get(ObjectsInteractionsFX.ID).api);
    console.log("Automated Objects, Interactions and Effects is ready!!");
});