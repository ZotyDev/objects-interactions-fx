import { ItemAnimator } from "./animation/ItemAnimator.js";
import { ObjectsInteractionsFX as OIF } from "./ObjectsInteractionsFX.js";
import { Settings } from "./Settings.js";
import { ItemTags } from "./interface/ItemTags.js";
import { SystemSupporter } from "./system/SystemSupporter.js";
import { MasterTagsSettings } from "./interface/MasterTagsSettings.js";
import { GeneralSettings } from "./interface/GeneralSettings.js";
import { ObjectsInteractionsFXData } from "./data/ObjectsInteractionsFXData.js";
import { TagHandler } from "./tags/TagHandler.js";
import { TokenLightingManipulator } from "./library/TokenLightingManipulator.js";
import { Debug as DBG } from "./library/Debug.js";

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

    Hooks.on('getSceneControlButtons', (controls) => {
        if (!canvas.scene) return;

        const MasterTags = {
            name: 'master-tags',
            title: game.i18n.localize('OIF.Tooltips.MasterTags.Title'),
            icon: 'fas fa-tags',
            onClick: async () => {
                new MasterTagsSettings().render(true);
            },
            button: true
        }

        const ClearLighting = {
            name: 'clear-lighting',
            title: game.i18n.localize('OIF.Tooltips.ClearLighting.Title'),
            icon: 'fas fa-lightbulb-slash',
            onClick: async () => {
                TokenLightingManipulator.RemoveAllLighting();
            },
            button: true
        }

        const Configuration = 
        {
            name: 'configuration',
            title: game.i18n.localize('OIF.Tooltips.Configuration.Title'),
            icon: 'fas fa-gears',
            onClick: async () => {
                new Wizard.ConfigurationSkeleton({ module: OIF.ID, title: 'oif-config' }).render(true);
            },
            button: true
        }

        controls.push({
            name: OIF.ID,
            title: OIF.NAME,
            layer: 'CanvasEffects',
            icon: 'fas fa-snowflake',
            visible: game.user.isGM,
            tools: [
                MasterTags,
                ClearLighting,
                Configuration
            ]
        });
    })

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

    Hooks.on("ready", async () => {
        await SystemSupporter.Initialize();
        await Settings.Initialize();
        await DBG.Initialize();

        let Options =
        {
            module: OIF.ID,
            data: 
            {
                bugReportUrl: "https://github.com/ZotyDev/objects-interactions-fx/issues/new?assignees=ZotyDev&labels=bug%2Ctriage&template=BUG_REPORT.yml&title=%5BBUG%5D%3A+",
                topics: 
                [
                    {
                        label: 'Tags',
                        id   : 'oif-tags',
                        type : 'blocks',
                        sections:
                        [
                            {
                                label: 'Melee Attacks',
                                id: 'melee-attacks',
                            },
                            {
                                label: 'Ranged Attacks',
                                id: 'ranged-attacks'
                            }
                        ]
                    },
                    {
                        label: 'Settings',
                        id   : 'oif-settings',
                        type : 'blocks',
                        sections: 
                        [
                            {
                                label: 'General Settings',
                                id: 'general-settings',
                                settings:
                                [
                                    {
                                        label: 'OIF.Settings.Animations.Label',
                                        hint: 'OIF.Settings.Animations.Hint',
                                        id: OIF.SETTINGS.GENERAL.ANIMATIONS.ID,
                                        settings: 
                                        [
                                            {
                                                id: OIF.SETTINGS.GENERAL.ANIMATIONS.ENABLED,
                                                label: 'OIF.Settings.Animations.Enabled.Label',
                                                hint: 'OIF.Settings.Animations.Enabled.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'client',
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ANIMATIONS.GLOBAL_DELAY.MELEE,
                                                label: 'OIF.Settings.Animations.GlobalDelay.Melee.Label',
                                                hint: 'OIF.Settings.Animations.GlobalDelay.Melee.Hint',
                                                type: 'slider',
                                                default: 0,
                                                scope: 'client',
                                                compatibility:
                                                {
                                                    requires: 
                                                    [
                                                        OIF.SETTINGS.GENERAL.ANIMATIONS.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ANIMATIONS.GLOBAL_DELAY.THROW,
                                                label: 'OIF.Settings.Animations.GlobalDelay.Throw.Label',
                                                hint: 'OIF.Settings.Animations.GlobalDelay.Throw.Hint',
                                                type: 'slider',
                                                default: 0,
                                                scope: 'client',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ANIMATIONS.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ANIMATIONS.GLOBAL_DELAY.RETURN,
                                                label: 'OIF.Settings.Animations.GlobalDelay.Return.Label',
                                                hint: 'OIF.Settings.Animations.GlobalDelay.Return.Hint',
                                                type: 'slider',
                                                default: 0,
                                                scope: 'client',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ANIMATIONS.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ANIMATIONS.GLOBAL_DELAY.RANGED,
                                                label: 'OIF.Settings.Animations.GlobalDelay.Ranged.Label',
                                                hint: 'OIF.Settings.Animations.GlobalDelay.Ranged.Hint',
                                                type: 'slider',
                                                default: 0,
                                                scope: 'client',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ANIMATIONS.ENABLED,
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        label: 'OIF.Settings.DynamicAttacks.Label',
                                        hint: 'OIF.Settings.DynamicAttacks.Hint',
                                        id: OIF.SETTINGS.GENERAL.DYNAMIC_ATTACKS.ID,
                                        settings:
                                        [
                                            {
                                                id: OIF.SETTINGS.GENERAL.DYNAMIC_ATTACKS.ENABLED,
                                                label: 'OIF.Settings.DynamicAttacks.Enabled.Label',
                                                hint: 'OIF.Settings.DynamicAttacks.Enabled.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.DYNAMIC_ATTACKS.MELEE_TO_THROWN,
                                                label: 'OIF.Settings.DynamicAttacks.MeleeToThrown.Label',
                                                hint: 'OIF.Settings.DynamicAttacks.MeleeToThrown.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.DYNAMIC_ATTACKS.ENABLED,
                                                    ],
                                                }
                                            },
                                        ],
                                    },
                                    {
                                        label: 'OIF.Settings.InventoryAutomations.Label',
                                        hint: 'OIF.Settings.InventoryAutomations.Hint',
                                        id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ID,
                                        settings: 
                                        [
                                            {
                                                id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ENABLED,
                                                label: 'OIF.Settings.InventoryAutomations.Enabled.Label',
                                                hint: 'OIF.Settings.InventoryAutomations.Enabled.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.AMMO.REMOVE,
                                                label: 'OIF.Settings.InventoryAutomations.Ammo.Remove.Label',
                                                hint: 'OIF.Settings.InventoryAutomations.Ammo.Remove.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ENABLED,
                                                    ],
                                                },
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.THROWN.REMOVE,
                                                label: 'OIF.Settings.InventoryAutomations.Thrown.Remove.Label',
                                                hint: 'OIF.Settings.InventoryAutomations.Thrown.Remove.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ENABLED,
                                                    ],
                                                },
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.AMMO.TRANSFER,
                                                label: 'OIF.Settings.InventoryAutomations.Ammo.Transfer.Label',
                                                hint: 'OIF.Settings.InventoryAutomations.Ammo.Transfer.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ENABLED,
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.AMMO.REMOVE
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.THROWN.TRANSFER,
                                                label: 'OIF.Settings.InventoryAutomations.Thrown.Transfer.Label',
                                                hint: 'OIF.Settings.InventoryAutomations.Thrown.Transfer.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.ENABLED,
                                                        OIF.SETTINGS.GENERAL.INVENTORY_AUTOMATIONS.THROWN.REMOVE
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        label: 'OIF.Settings.ItemPiles.Label',
                                        hint: 'OIF.Settings.ItemPiles.Hint',
                                        id: OIF.SETTINGS.GENERAL.ITEM_PILES.ID,
                                        settings:
                                        [
                                            {
                                                id: OIF.SETTINGS.GENERAL.ITEM_PILES.ENABLED,
                                                label: 'OIF.Settings.ItemPiles.Enabled.Label',
                                                hint: 'OIF.Settings.ItemPiles.Enabled.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    dependsOn:
                                                    [
                                                        OIF.OPTIONAL_MODULES.ITEM_PILES.id,
                                                    ]
                                                },
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ITEM_PILES.MINIFY_NAME,
                                                label: 'OIF.Settings.ItemPiles.MinifyName.Label',
                                                hint: 'OIF.Settings.ItemPiles.MinifyName.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ITEM_PILES.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ITEM_PILES.SNAP_TO_GRID,
                                                label: 'OIF.Settings.ItemPiles.SnapToGrid.Label',
                                                hint: 'OIF.Settings.ItemPiles.SnapToGrid.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ITEM_PILES.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ITEM_PILES.ON_MISS.ENABLED,
                                                label: 'OIF.Settings.ItemPiles.OnMiss.Label',
                                                hint: 'OIF.Settings.ItemPiles.OnMiss.Hint',
                                                type: 'checkbox',
                                                default: true,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ITEM_PILES.ENABLED,
                                                    ]
                                                }
                                            },
                                            {
                                                id: OIF.SETTINGS.GENERAL.ITEM_PILES.ON_HIT.ENABLED,
                                                label: 'OIF.Settings.ItemPiles.OnHit.Label',
                                                hint: 'OIF.Settings.ItemPiles.OnHit.Hint',
                                                type: 'checkbox',
                                                default: false,
                                                scope: 'world',
                                                compatibility:
                                                {
                                                    requires:
                                                    [
                                                        OIF.SETTINGS.GENERAL.ITEM_PILES.ENABLED,
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    //{
                                    //    label: 'OIF.Settings.DefaultThrowableDestructionChance.Label',
                                    //    id: OIF.SETTINGS.GENERAL.DEFAULT_THROWABLE_DESTRUCTION_CHANCE,
                                    //    type: 'slider',
                                    //},
                                    //{
                                    //    label: 'OIF.Settings.DefaultAmmunitionDestructionChance.Label',
                                    //    id: OIF.SETTINGS.GENERAL.DEFAULT_AMMUNITION_DESTRUCTION_CHANCE,
                                    //    type: 'slider',
                                    //},
                                    //{
                                    //    label: 'OIF.Settings.SetElevationOfItemPiles.Label',
                                    //    id: OIF.SETTINGS.GENERAL.SET_ELEVATION_OF_ITEM_PILES,
                                    //    type: 'checkbox'
                                    //},
                                    //{
                                    //    label: 'OIF.Settings.PowerfulImpactShakeEffect.Title',
                                    //    id: OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT,
                                    //    type: 'checkbox'
                                    //},
                                    //{
                                    //    label: 'OIF.Settings.LightingItemsAutomation.Label',
                                    //    id: OIF.SETTINGS.GENERAL.LIGHTING_ITEMS_AUTOMATION,
                                    //    type: 'checkbox',
                                    //},
                                    {
                                        label: 'OIF.Settings.DebugMode.Label',
                                        hint: 'OIF.Settings.DebugMode.Hint',
                                        id: OIF.SETTINGS.GENERAL.DEBUG_MODE.ID,
                                        settings:
                                        [
                                            {
                                                id: OIF.SETTINGS.GENERAL.DEBUG_MODE.ENABLED,
                                                label: 'OIF.Settings.DebugMode.Enabled.Label',
                                                hint: 'OIF.Settings.DebugMode.Enabled.Hint',
                                                type: 'checkbox',
                                                default: false,
                                                scope: 'client'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                label: 'Actor Inventor',
                                id: 'actor-inventor'
                            }
                        ]
                    },
                ]
            }
        }

        Wizard.ConfigurationSkeleton.RegisterConfigurations(Options);

        let test = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);

        // Create the folders that are going to be used
        if (game.user.isGM)
        {
            // Create the root folder if it doesn't exist
            let Folders = await FilePicker.browse(OIF.FILES.ORIGIN, '.');
            if (!Folders.dirs.includes(OIF.FILES.DATA_FOLDERS.ROOT))
            {
                console.warn("Root folder doesn't exist, creating it...");
                await FilePicker.createDirectory(OIF.FILES.ORIGIN, OIF.FILES.DATA_FOLDERS.ROOT);
            }

            // Create the default tag packs file if it doesn't exist
            Folders = await FilePicker.browse(OIF.FILES.ORIGIN, OIF.FILES.DATA_FOLDERS.ROOT);
            if (!Folders.files.includes(`${OIF.FILES.DATA_FOLDERS.ROOT}/TagPacks.json`))
            {
                console.warn("TagPacks.json doesn't exist, creating it...");
                let Data = {};
                await ObjectsInteractionsFXData.SaveJSON(Data, 'TagPacks.json', OIF.FILES.DATA_FOLDERS.ROOT);
            }
        }

        // Load default packs
        await MasterTagsSettings.LoadFromConfig();

        ////////////////////////////////////////////////////////////
        // Hooks to attach
        ////////////////////////////////////////////////////////////
        let HooksToAttach = 
        {
            attack:
            {
                hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK),
                id  : 0
            },
            item:
            {
                hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM),
                id  : 0
            }
        }
        Hooks.on(OIF.HOOKS.CHANGE_SETTINGS, async (settings) => 
        {
            DBG.Log('Changing settings', settings);

            // Update the hooks to attach
            HooksToAttach.attack.hook = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK);
            HooksToAttach.item.hook   = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM);
            Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
        });
        Hooks.on(OIF.HOOKS.ATTACH_HOOKS, async () => 
        {
            DBG.Log('Attaching hooks', HooksToAttach);

            if (HooksToAttach.attack.id != 0)
            {
                Hooks.off(HooksToAttach.attack.hook, HooksToAttach.attack.id);
            }
            if (HooksToAttach.item.id != 0)
            {
                Hooks.off(HooksToAttach.item.hook, HooksToAttach.item.id);
            }

            ////////////////////////////////////////////////////////////
            // Attack Hook
            ////////////////////////////////////////////////////////////
            HooksToAttach.attack.id = Hooks.on(HooksToAttach.attack.hook, async (arg1, arg2, arg3) =>
            {
                // Extract relevant information
                let Workflow = [arg1, arg2, arg3];
                let Options = await SystemSupporter.ExtractOptions(Workflow, 'attack', HooksToAttach.attack.hook);

                // Start the workflow
                Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, Options);
                DBG.Log('Post prepare hook called from attack hook', HooksToAttach.attack.hook,  Options);
            });

            ////////////////////////////////////////////////////////////
            // Item Hook
            ////////////////////////////////////////////////////////////
            HooksToAttach.item.id = Hooks.on(HooksToAttach.item.hook, async (arg1, arg2, arg3) =>
            {
                // Extract relevant information
                let Workflow = [arg1, arg2, arg3];
                let Options = await SystemSupporter.ExtractOptions(Workflow, 'item', HooksToAttach.item.hook);

                // Start the workflow
                Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, Options);
                DBG.Log('Post prepare hook called from item hook', HooksToAttach.item.hook, Options);
            });
        });

        ////////////////////////////////////////////////////////////
        // Main workflow
        ////////////////////////////////////////////////////////////
        Hooks.on(OIF.HOOKS.WORKFLOW.POST_PREPARE, async (options) =>
        {
            DBG.Log('Post prepare hook called', options);
            // Check if there are tags to be used
            if (options.tags.length > 0)
            {
                // Send tags to the handler
                TagHandler.Dispatch(options);
            }   
        });

        Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
        Hooks.callAll("oifReady", game.modules.get(OIF.ID).api);
        console.log("Automated Objects, Interactions and Effects is ready!!");
    });
});