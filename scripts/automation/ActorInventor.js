import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ObjectsInteractionsFXData } from "../data/ObjectsInteractionsFXData.js";
import { ActorInventorSettings } from "../interface/ActorInventorSettings.js";

Hooks.on("oifReady", () => {
    Hooks.on("createToken", async (actor) => {
        if (actor != null && actor != undefined && actor.actor.type == "npc") 
        {
            actor = actor.actor;
            let Tags = ObjectsInteractionsFXData.GetData(actor);

            // Make sure we are checking for tags, not strange promises..
            if ((typeof Tags) == Array)
            {
                if (Tags.indexOf("generateCurrency") > -1 && ActorInventorSettings.Get(OIF.SETTINGS.ACTOR_INVENTOR.CURRENCY_GENERATOR))
                {
                    let CpLocation = game.settings.get(OIF.ID, OIF.SETTINGS.ACTOR_INVENTOR.CP_LOCATION);
                    let SpLocation = game.settings.get(OIF.ID, OIF.SETTINGS.ACTOR_INVENTOR.SP_LOCATION);
                    let GpLocation = game.settings.get(OIF.ID, OIF.SETTINGS.ACTOR_INVENTOR.GP_LOCATION);
                    let PpLocation = game.settings.get(OIF.ID, OIF.SETTINGS.ACTOR_INVENTOR.PP_LOCATION);
                    let EpLocation = game.settings.get(OIF.ID, OIF.SETTINGS.ACTOR_INVENTOR.EP_LOCATION);
    
                    actor.update({ 
                        [CpLocation]: Math.floor(Math.random() * (getProperty(actor, CpLocation) + 1)),
                        [SpLocation]: Math.floor(Math.random() * (getProperty(actor, SpLocation) + 1)),
                        [GpLocation]: Math.floor(Math.random() * (getProperty(actor, GpLocation) + 1)),
                        [PpLocation]: Math.floor(Math.random() * (getProperty(actor, PpLocation) + 1)),
                        [EpLocation]: Math.floor(Math.random() * (getProperty(actor, EpLocation) + 1))
                    })
                }
            }
        }
    });
});