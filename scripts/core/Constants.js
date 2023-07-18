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
//? This class contains all the constants used by OIF
export class Constants
{
    // Basic information related to the module
    static ID      = 'objects-interactions-fx';
    static NAME    = 'Automated Objects, Interactions and Effects';

    // Flags used to store information
    static FLAGS = 
    {
        OIF: 'OIF',
        ITEM_TAGS: 'item-tags',
    }

    // Default values
    static DEFAULT = 
    {
        TAG_PACKS:
        [
            'Empty',
            'FantasyJB2AComplete',
            'FantasyJB2AFree',
            'FantasyNoAnimations'
        ],
        PATH:
        {
            USER_TAG_PACKS: `oif/TagPacks.json`
        }
    }

    // IDs that will be used to set/get settings
    static SETTINGS =
    {
        GENERAL: 
        {
            ENABLE_DEBUG: "enableDebug"
        },
        SELECTED:
        {
            TAG_PACK: 'selectedTagPack'
        }
    }
}