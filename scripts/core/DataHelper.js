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
import { Constants as C }               from "./Constants.js";
import { Debugger as DBG }              from "./Debugger.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

//? The Data Helper is a class that provides OIF with some utilities for data
//? storage and manipulation
//! This is a singleton class, which means that it should be not instanciated
export class DataHelper
{
    ////////////////////////////////////////////////////////////////////////////
    // Set the tags of a item
    ////////////////////////////////////////////////////////////////////////////
    static async SetTags(item, tags)
    {
        item.setFlag(C.ID, C.FLAGS.ITEM_TAGS, tags);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Get the tags on a item
    ////////////////////////////////////////////////////////////////////////////
    static async GetTags(item)
    {
        // Check if the tags exist
        let Data = item.getFlags(C.ID, C.FLAGS.ITEM_TAGS);
        if (Data == undefined)
        {
            // Create the tags if they do not exist
            item.setFlag(C.ID, C.FLAGS.ITEM_TAGS, []);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Add a tag to a item
    ////////////////////////////////////////////////////////////////////////////
    static async AddTag(item, tag)
    {
        // Check if the tag is defined
        if (tag == undefined)
        {
            DBG.Error('DataHelper.AppendTag: cannot append undefined tag');
            return;
        }

        let Tags = await DataHelper.GetTags(item);
        Tags.push(tag);
        await DataHelper.SetTags(item, Tags);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Remove a tag from a item
    ////////////////////////////////////////////////////////////////////////////
    static async RemoveTag(item, tag)
    {
        let Data = await DataHelper.GetTags(item);
        for (let index = 0; index < Data.length; index++) 
        {
            if (Data[index] === tag)
            {
                Data.splice(index, 1);
                return;
            }
        }
    }

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