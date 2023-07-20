# Automated Objects, Interactions and Effects Changelog

### Version 1.0.10

- *Fixed* - Destruction chance not working.

### Version 1.0.9

- *Fixed* - V11 compatibility.

### Version 1.0.8

- *Fixed* - Import not working.
- *Fixed* - Tag Packs not being loaded sometimes because wrong usage of async methods.

### Version 1.0.7

- *Fixed #16* - Same problem.. The ItemDropper class was calling a method with wrong parameters. Hope everything related is fixed for good now. Thank you KellethDregar for reporting the bugs you've found while using OIF!

### Version 1.0.6

- *Fixed #15* - MidiQOL workflow now uses the right size function for detecting if a attack is hit/miss.

### Version 1.0.5

- *Fixed* - Dumb me included the wrong files.. Sorry everyone :c

### Version 1.0.4

- *Fixed* - Only GMs were able to use tags, now every user can use tags.
- *Fixed* - Master Tags were not being loaded at all for users, only for GMs, now tags are properly stored and updated when needed.

Special thanks to **pretzelboi** for reaching out about these issues, thanks!

### Version 1.0.3

- *Fixed* - Lighting tags not working properly.
- *Fixed* - Clear Lighting tooltip not working properly.
- *Intern* - Removed Kandash'is Fluid Canvas optional requirement.
- *Intern* - Restart after changing trigger hooks is no more required.
- *Intern* - Added a Developer Mode, it should make the task of supporting other systems easier.
- *Intern* - Way better workflow, now DnD5e _should_ not be haunted by bugs anymore.
- *Interface* - Added a tooltip for the configurations.
- *Tag Packs* - Readded `powerful` to maul.
- *Dynamic Interactions* - Dropped items now have a Tagger tag that indicates they have been created by OIF. The tag is `object-interacionts-efx-dropped-item-<id of the source item>` - Thanks to Ikabodo for suggesting it!

---

### Version 1.0.2

- *Intern* - MidiQOL is no more required to make the module function, but it is highly recommended if you are using DnD5e!
- *System Support* - Now DnD5e hooks can be used to trigger animations and interactions:
  - `dnd5e.rollAttack` and `dnd5e.rollAttack` for weapon items.
  - `dnd5e.useItem` for normal items.
- *Interface* - Added a config to choose trigger hooks just for items.
- *Fixed* - A typo was making it impossible to use thrown items - Thanks to Ikabodo for reporting it!
- *Fixed* - Thrown items were getting removed while not being created anywhere - Thanks to Ikabodo for reporting it!

--- 

### Version 1.0.1

- *Fixed* - I forgot to include some things..

---

### Version 1.0.0
- *Fixed* - Animations will only play if the distance between author and target is inside the range.
- *Fixed #1* - Now you can disable the module's animations and use just the interactions and automations.
  - There is no easy way to get the position where the effects from other modules landed on hit, because of that, when OIF is not the one handling the animations, the Item Piles will be created at random positions.
- *Fixed #4* - There is now a option to snap the created Item Piles to the canvas grid.
- *Fixed #5* - Actors with emtpy tags and strange promises, tbh idk much about javascript to point the exact error origin, but I've found a fix.
- *Fixed #7* - Created a option to create item piles on hit now, this feature is incompatible with projectiles being added to inventory on hit.
- *Tags* - Major update on how tags work.
  - Auto focus after adding tags.
  - Master Tags system that gives users the ability to create tags that will be used to define animations on items.
    - Create and configure master tags.
    - Create, export and import custom Tag Packs.
    - Color and icons to visualize master tags better.
    - Enable/Disable any master tag at anytime without reload.
  - Special tags that can have unique effects.
  - The first valid tag that OIF finds is used, the others are ignored (unless they are special tags)
- *Intern* - Code cleaning.
- *Intern* - Preparation for system-free design approach.
- *Intern* - Removed KFC dependency and added the screen shake effect inside OIF itself.
- *Tag Packs* - Added default tag packs for JB2A Free and Complete.
- *Interface* - Added a tooltip for accessing master tags faster.
- *Interface* - Also added a tooltip for clearing all lights that originate from OIF (currently just lighting items).
- *Settings Helper* - Better dependency management.
- *Settings Helper* - Added undependencies (settings that are incompatible).
- *Dynamic Interactions* - Way better lighting master tags.
- *Documentation* - Huge improvements on the **[Wiki](https://github.com/ZotyDev/objects-interactions-fx/wiki)**.
  - Updated the home page.
  - Added instructions on how to use the module.
  - Added instructions on how to customize the module.
  - Added a **[API Reference](https://github.com/ZotyDev/objects-interactions-fx/wiki/API)**.

I apologize for not being able to provide some of the features that I mentioned that would be on this release, but they will be implemented as soon as possible!

---

### Version 0.2.1
- *Minor Fixes* - Some of the additions generated errors, and some features where wrongly implemented.

---

### Version 0.2
- *Fixed #2* - Now the delay for throwable items should be correct.
- *Fixed #3* - Added a option to select the hook that will trigger the effects and automations.
- *Fixed Internal* - Updated module.json to v10.
- *Fixed Internal* - Removed Foundry deprecated functionality use.
- *Item Dropper* - Items "dropped" by the module now have a minified name (▲) (Can be toggled).
- *Actor Inventor* - Added currency generator feature and `generateCurrency` tag, when a actor has this tag, its currency will be randomly generated using the set values as the max (Requires Tidy5e Sheet).
- *Actor Inventor* - The actor inventor is a new system designed to make NPC creation easier.
- *Tags* - Actors now have Tags too.
- *Tags* - Renamed Item Tags to just Tags.
- *Tags* - Improved Item Tags implementation and visualization, multiple tags can now be attached to a object, they are also easier to create, read and delete.
- *Intern* - Optional module checking and warning is now more clever.
- *Intern* - Removed unused optional modules warning.
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