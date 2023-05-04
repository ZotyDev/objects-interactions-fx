////////////////////////////////////////////////////////////////////////////////
//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects  -  By ZotyDev          //
////////////////////////////////////////////////////////////////////////////////
import { Debugger as DBG }              from "./Debugger.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

//? The Data Helper is a class that provides OIF with some utilities for data
//? storage and manipulation
//! This is a singleton class, which means that it should be not instanciated
export class DataHelper
{
    ////////////////////////////////////////////////////////////////////////////
    // Save a file formatted as JSON
    ////////////////////////////////////////////////////////////////////////////
    static async SaveJSON(data, name, path)
    {
        // Checks if the user is a GM
        if (game.user.isGM)
        {
            // Create
            const NewFile = new File([JSON.stringify(data)], name, { type: 'application/json' });
            await FilePicker.upload(OIF.FILES.ORIGIN, path, NewFile, {});
            return { result: true };
        }
        else
        {
            DBG.Error('DataHelper.SaveJSON: only GMs can save JSON files!');
            return { result: false };
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Loads a JSON file
    ////////////////////////////////////////////////////////////////////////////
    static async LoadJSON(path)
    {
        // Tries to fetch the JSON
        return await foundry.utils.fetchJsonWithTimeout(path).catch((reason) =>
        {
            // Could not fetch the JSON
            DBG.Error('DataHelper.LoadJSON: could not fetch JSON at', path, 'reason:', reason);
            return { result: false };
        }).then((value) =>
        {
            // Returns the data
            return { result: true, value: value };
        })
    }
}