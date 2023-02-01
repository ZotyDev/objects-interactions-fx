import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";
import { TokenLightingManipulator } from "../library/TokenLightingManipulator.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { GeneralSettings } from "../interface/GeneralSettings.js";

const LightingItems = {
    torch: {
        name: "torch",
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
        name: "lamp",
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

Hooks.on("oifReady", () => {
    Hooks.on(GeneralSettings.Get(OIF.SETTINGS.GENERAL.DEFAULT_ATTACK_HOOK), async (workflow) => {
        if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.LIGHTING_ITEMS_AUTOMATION))
        {
            let Item = workflow.item;
            let Author = canvas.tokens.get(workflow.tokenId);
    
            let Tags = await ObjectsInteractionsFXData.GetData(Item);
            let Options = LightingItems[Tags];
            if (Options != null && Options != undefined) 
            {
                TokenLightingManipulator.ToggleItemLighting(Item, Author, Options);
            }
        }
    });
});