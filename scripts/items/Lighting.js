import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";
import { TokenLightingManipulator } from "../library/TokenLightingManipulator.js";

const LightingItems = {
    torch: {
        light: {
            animationType: "torch",
            color: "#ffae00",
            alpha: 0.4,
        },
        image: {
            unlit: "icons/sundries/lights/torch-black.webp",
            lit: "icons/sundries/lights/torch-brown-lit.webp",
        }
    },
    lamp: {
        light: {
            animationType: "torch",
            color: "#ffa500",
            alpha: 0.5
        },
        image: {
            unlit: "icons/sundries/lights/lantern-steel.webp",
            lit: "icons/sundries/lights/lantern-iron-lit-yellow.webp",
        }
    }
}

Hooks.on("ready", () => {
    Hooks.on("midi-qol.RollComplete", async (workflow) => {
        let Item = workflow.item;
        let Author = canvas.tokens.get(workflow.tokenId);

        let Tags = ObjectsInteractionsFXData.GetData(Item);
        let Options = LightingItems[Tags];
        if (Options != null && Options != undefined) 
        {
            Options.name = Tags;

            TokenLightingManipulator.ToggleItemLighting(Item, Author, Options);
        }
    });
});