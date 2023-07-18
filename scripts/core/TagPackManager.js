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
import { Constants as C }  from "./Constants.js";
import { Debugger as DBG } from "./Debugger.js";
import { DataHelper }      from "./DataHelper.js";

//? The Tag Pack Manager is the class responsible for loading, storing and
//? replicating the Tag Packs, every action related only to Tag Packs should be
//? contained here.
//! This is a singleton class, which means that it should be not instanciated
export class TagPackManager
{
    ////////////////////////////////////////////////////////////////////////////
    // Initialize the Tag Pack Manager singleton
    ////////////////////////////////////////////////////////////////////////////
    static async Initialize()
    {
        DBG.Log('Initializing Tag Pack Manager...');
        await TagPackManager.LoadDefault();   
        await TagPackManager.LoadUser();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Data
    ////////////////////////////////////////////////////////////////////////////
    static CurrentTagPack = {};
    static TagPacks       = {};

    ////////////////////////////////////////////////////////////////////////////
    // Loads a Tag Pack from a object
    ////////////////////////////////////////////////////////////////////////////
    static async LoadFromObject(data)
    {
        let Header = data.header;

        DBG.Log(`TagPackManager.LoadFromObject: loading "${Header.name}"`);

        // Verifies if the Tag Pack is not already loaded
        if (TagPackManager.TagPacks[Header.ID] != undefined)
        {
            DBG.Error(`TagPack.LoadFromObject: "${Header.ID}" is already registered`);
            return { result: false };
        }

        // Verifies if the required modules are present
        if (Header.requires != undefined)
        {
            Header.requires.forEach((requirement) =>
            {
                // Disable the pack if one or more required modeules are not
                // present
                if (!game.modules.get(requirement)?.active)
                {
                    DBG.Warn(`TagPackManager.LoadFromObject: "${Header.name}" is missing one or more of its requirements`, Header.requires);
                    Header.disabled = true;
                    return;
                }
            });
        }

        // Check if the Tag Pack is the selected one
        if (await Wizard.Get(C.ID, C.SETTINGS.SELECTED.TAG_PACK) == Header.ID)
        {
            // Make it the current Tag Pack
            DBG.Log(`TagPackManager.LoadFromObject: "${Header.name}" is the selected Tag Pack, setting itas the current Tag Pack`);
            Header.selected = true;
            TagPackManager.CurrentTagPack = data;
        }

        // Insert the Tag Pack header into the pack list
        TagPackManager.TagPacks[Header.ID] = Header;
        
        DBG.Log(`TagPackManager.LoadFromObject: loaded "${Header.name}"`);

        return { result: true };
    }

    ////////////////////////////////////////////////////////////////////////////
    // Loads a Tag Pack from a filepath
    ////////////////////////////////////////////////////////////////////////////
    static async LoadFromFile(path)
    {
        DBG.Log(`TagPackManager.LoadFromFile: loading "${path}"`);
        let PackData = await DataHelper.LoadJSON(path);
        if (PackData.result && PackData.value != undefined)
        {
            let Data   = PackData.value;
            let Header = Data.header;
            Header.location = path;

            DBG.Log(`TagPackManager.LoadFromFile: loading "${Header.name}"`);
            
            // Verifies if the required modules are present
            if (Header.requires != undefined)
            {
                Header.requires.forEach((requirement) => 
                {
                    // Disable the pack if one or more required modules are not
                    // present
                    if (!game.modules.get(requirement)?.active)
                    {
                        DBG.Warn(`TagPackManager.LoadFromFile: "${Header.name}" is missing one or more of its requirements`, Header.requires);
                        Header.disabled = true;
                        return;
                    }
                });
            }

            // Check if the Tag Pack is the selected one
            if (await Wizard.Get(C.ID, C.SETTINGS.SELECTED.TAG_PACK) == Header.ID)
            {
                // Make it the current Tag Pack
                DBG.Log(`TagPackManager.LoadFromFile: "${Header.name}" is the selected Tag Pack, setting it as the current Tag Pack`);
                Header.selected = true;
                TagPackManager.CurrentTagPack = Data;
            }

            // Insert the Tag Pack header into the pack list
            TagPackManager.TagPacks[Header.ID] = Header;
            
            DBG.Log(`TagPackManager.LoadFromFile: loaded "${Header.name}"`);

            return { result: true }
        }
        else
        {
            // A error ocurred while loading the Tag Pack
            DBG.Error('TagPackManager.LoadFromFile: could not load JSON at', path);
            return { result: false };
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Load default Tag Packs
    ////////////////////////////////////////////////////////////////////////////
    static async LoadDefault()
    {
        for (const pack of C.DEFAULT.TAG_PACKS)
        {
            let Result = await TagPackManager.LoadFromFile(`modules/${C.ID}/assets/tagPacks/${pack}.json`);
            if (!Result.result)
            {
                DBG.Error(`TagPackManager.LoadDefault: failed to load default Tag Pack "${pack}"`);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Load user Tag Packs
    ////////////////////////////////////////////////////////////////////////////
    static async LoadUser()
    {
        // Load the file
        let Result = await DataHelper.LoadJSON(C.DEFAULT.PATH.USER_TAG_PACKS);
        if (Result.result && Result.value != undefined)
        {
            // Iterate through all packs
            for (const pack of Object.entries(Result.value))
            {
                Result = await TagPackManager.LoadFromObject(pack);
            }
        }
        else
        {
            // A error ocurred while loading the user Tag Packs
            DBG.Error('TagPackManager.Select: could not load user Tag Packs');
            return { result: false };
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Select a Tag Pack
    ////////////////////////////////////////////////////////////////////////////
    static async Select(pack)
    {
        DBG.Log(`TagPackManager.Select: selecting "${pack}"`);
        // Check if the Tag Pack exists
        if (TagPackManager.TagPacks[pack] == undefined)
        {
            DBG.Error(`TagPackManager.Select: could not find "${pack}"`);
            ui.notifications.error(game.i18n.localize('OIF.TagPackManager.Select.Error.NotFound').replace('${pack}', pack));
            pack = C.DEFAULT.TAG_PACKS[0];
            await Wizard.Set(C.ID, C.SETTINGS.SELECTED.TAG_PACK, pack);
        }

        // Load the Tag Pack header
        let Header = TagPackManager.TagPacks[pack];
        let Tags   = {};

        // Is it a default pack?
        if (Header.location != undefined)
        {
            // Load the Tag Pack from the location described at the header
            let Result = await DataHelper.LoadJSON(Header.location);
            if (Result.result && Result.value != undefined)
            {
                DBG.Log(`TagPackManager.Select: selected "${Header.name}"`);
                // Extract the Tags from the loaded data
                Tags = Result.value.tags;
            }
            else
            {
                // A error ocurred while loading the Tag Pack
                DBG.Error('TagPackManager.Select: could not load JSON at', Header.location);
                return { result: false };
            }
        }
        // It is not a default pack
        else
        {
            // Load the file that contains the user Tag Packs
            let Result = await DataHelper.LoadJSON(C.DEFAULT.PATH.USER_TAG_PACKS);
            if (Result.result && Result.value != undefined)
            {
                DBG.Log(`TagPackManager.Select: selected "${Header.name}"`);
                // Extract the selected Tag Pack
                Tags = Result.value[pack].tags;
            }
            else
            {
                // A error ocurred while loading the user Tag Packs
                DBG.Error('TagPackManager.Select: could not load user Tag Packs');
                return { result: false };
            }
        }
        
        // Combine Header and Tags into a Tag Pack
        let TagPack = 
        {
            header: Header,
            tags  : Tags
        }

        // Make it the current Tag Pack
        TagPackManager.CurrentTagPack[TagPack.header.ID] = TagPack;
        return { result: true, value: TagPack };
    }
}