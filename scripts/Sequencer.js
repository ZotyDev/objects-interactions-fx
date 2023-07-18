////////////////////////////////////////////////////////////////////////////////
//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects -  By ZotyDev           //
////////////////////////////////////////////////////////////////////////////////
//? This contains the database with the effects provided by OIF, all the effects
//? here are made by me (ZotyDev)
import { Constants as C } from "./core/Constants.js";

////////////////////////////////////////////////////////////////////////////////
// The database that contains all the effects (animations and sounds)
////////////////////////////////////////////////////////////////////////////////
const Database = 
{
    effects: 
    {
        sparks:
        {
            metal:
            {
                small:
                {
                    "01":
                    {
                        blue: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_blue_01.webm`
                        ],
                        green: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_green_01.webm`
                        ],
                        orange: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_orange_01.webm`
                        ],
                        pink: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_pink_01.webm`
                        ],
                        red: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_red_01.webm`
                        ],
                        yellow: 
                        [
                            `modules/${C.ID}/assets/effects/sparks/sparks_metal_small_yellow_01.webm`
                        ],
                    }
                }
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// Register on the Sequencer database
////////////////////////////////////////////////////////////////////////////////
Hooks.on('sequencerReady', () => 
{
    Sequencer.Database.registerEntries(C.ID, Database);
});