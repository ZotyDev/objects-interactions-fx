# Automated Objects, Interactions and Effects Changelog

### Version 0.2
- *Fixed #2* - Now the delay for throwable items should be correct.
- *Fixed #3* - Added a option to select the hook that will trigger the effects and automations.
- *Item Dropper* - Items "dropped" by the module now have a minified name (▲) (Can be toggled).
- *Actor Inventor* - Added currency generator feature and `generateCurrency` tag, when a actor has this tag, its currency will be randomly generated using the set values as the max (Requires Tidy5e Sheet).
- *Actor Inventor* - The actor inventor is a new system designed to make NPC creation easier.
- *Tags* - Actors now have Tags too.
- *Tags* - Renamed Item Tags to just Tags.
- *Fixed Internal* - Updated module.json to v10.
- *Fixed Internal* - Removed Foundry deprecated functionality use.
- *Intern* - Optional module checking and warning is now more clever.
- *Intern* - Removed unused optional modules warning.
- *Tags* - Improved Item Tags implementation and visualization, multiple tags can now be attached to a object, they are also easier to create, read and delete.
- *Item Animator* - Multiple tags can be used in a single item, the first one found inside the hard coded array will be used, the others will be ignored. This will change since other interactions yet to come will use these tags as references.
- *Settings Helper* - Created a new settings system that uses a dependecy concept.
- *Settings Helper* - Some settings have a dependency on another setting or module, when a dependecy is disabled the settings that rely on it will be disabled.
- *Settings Helper* - **NOTE:** I might also make this helper into a module if someone asks for it.

---

### Version 0.1.1
- *Intern* - Abstracted Item Pile creation and Actor inventory manipulation
- *Intern* - Polished code
- *Intern* - Added token lighting manipulation class
- *Dynamic Interactions* - Item Pile is now created only after the projectile hits
- *Dynamic Interactions* - Added lighting tags
- *Dynamic Interactions* - Lighting tags change the image of the item being used as a light source
- *Dynamic Interactions* - Lighting tags apply effects based on item range (normal range is bright light and long range is dim light)
- *Dynamic Interactions* - Item throwing is now smarter, no longer based on the metric system, alongside being much more compatible with all dimensions of canvas, see the **[Wiki](https://github.com/ZotyDev/objects-interactions-fx/wiki/Throwable-Items)** to see how to setup throwable items
- *API* - Added hooks that get called before and after a item animation, providing a reference to the options used.
  
---

### Version 0.1
- *Item Tags* - Added barebones Item Tags implementation (currently supports only one tag)
- *Animation* - Added item animation based on Item Tags set for the item
- *Animation* - Added single attack melee animations
- *Animation* - Added single attack ranged animations
- *Animation* - Powerful impacts make the screen shake (Requires Kandashi's fluid canvas) (toggable)
- *Dynamic Interactions* - When a throable item is thrown it gets removed from the author inventory (toggable)
- *Dynamic Interactions* - When a thrown attack misses it creates a Item Pile where it landed (Requires Item Piles) (toggable)
- *Dynamic Interactions* - When a thrown attack hits it adds the item to the target's inventory (toggable)
- *Dynamic Interactions* - When a ranged attack misses it creates a Item Pile where it landed (Requires Item Piles) (toggable)
- *Dynamic Interactions* - When a ragend attack hits it adds the ammunition to the target's inventory (toggable)
- *Dynamic Interactions* - When a Item Pile is created it is created at the target's elevation (Requires Levels) (toggable)