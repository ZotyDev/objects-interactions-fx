# Automated Objects, Interactions and Effects Changelog

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