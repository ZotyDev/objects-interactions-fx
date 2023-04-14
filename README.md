<a href="https://foundryvtt.com/packages/object-interaction-fx">
    <p align="center">
        <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/title.png" alt="Automated Objects, Interactions and Effects">
    </p>
</a>

<p align="center">
    <a href="https://discord.gg/RAgPXB4zG7">
        <img src="https://discord.com/api/guilds/1071251491375042661/widget.png?style=shield"/>
    </a>
</p>

A Foundry VTT module that provides automation and effects for everything that I and other people might find fun :D

The final objective of OIF is to provide you with a nice and easy way of automating things inside your worlds, my approach to this is providing you with the best tools for setting these automations and cool effects yourself, the goal here is to give you power to customize without worrying too much about conflicts and coding.

Other design choice of the module is making it very _gamefied_, taking a little bit of control from your hands in exchange for a smoother experience.

**If you are searching for instructions on how to use the module, you can find it on the [Wiki](https://github.com/ZotyDev/objects-interactions-fx/wiki)**

Like my module? Consider supporting me :)

<a href='https://ko-fi.com/T6T8IFCB5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi5.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---
## Main Features
- Play animations using Tags defined on items
- [Create](https://github.com/ZotyDev/objects-interactions-fx/wiki/Customization) custom Tags
- Custom Tag Packs that can be shared
- Fine tune how the animations will be played and how the interactions will happen
- ~~Preview the animations while creating/editing them~~ W.I.P

---
## Supported Systems
- [x] DnD5e
- [ ] WoD 20th
- [ ] Old School Essentials
- Want a specific system to be supported? Make a [issue](https://github.com/ZotyDev/objects-interactions-fx/issues/new?assignees=ZotyDev&labels=system%2Ctriage&template=SYSTEM_SUPPORT.yml&title=%5BSYSTEM%5D%3A+) with the `System Support` template.

---
## Dependencies
| Name                    | Type     | Description                              |
| ----------------------- | -------- | ---------------------------------------- |
| Sequencer               | Required | Core functionality                       |
| Midi-QOL                | Required | Makes DnD5e automation possible          |
| Item Piles              | Optional | Used for creating Item Piles (drops)     |
| Tagger                  | Optional | Lighting items need it to work properly  |
| Tidy5e Sheet            | Optional | Provides currency for DnD5e NPCs         |

## Native Assets Support
| Name                    | Where to find                                                    |
|-------------------------|------------------------------------------------------------------|
| JB2A Free               | [FoundryVTT Modules](https://foundryvtt.com/packages/JB2A_DnD5e) |
| JB2A Patreon            | [JB2A's Patreon](https://www.patreon.com/JB2A)                   |


<h1 align="center"> ✨ <strong>Showcase</strong> 🔥 </h1>

<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/dagger_throw.gif" alt="Throwable item miss">
</p>
<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/bow_ranged.gif" alt="Arrow miss">
    <p align="center"><i> Projectiles become a Item Pile on miss </i></p>
</p>
</br>
<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/maul_melee.gif" alt="Powerful impact">
    <p align="center"><i> Powerful impacts shake the screen </i></p>
</p>
</br>
<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/lighting.gif" alt="Lighting Items">
</p>
<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/lighting_flashlight.gif" alt="Lighting Flashlight">
    <p align="center"><i> Lighting automation using items </i></p>
</p>
</br>

---

<h2 align="center"> <strong>How to get started</strong> </h2> 

<h3 align="center"> Select a Tag Pack </h3> 

First you need to select the Tag Pack that you are going to use.

<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/tag_pack_select.gif" alt="Tag Pack Select">
</p>

<h3 align="center"> Insert the desired Tag on the Item </h3> 

Now insert the tag in the item you are going to use. Click the Item Tags header button on your item, write the tag's name and press `Enter`.

<p align="center">
    <img src="https://raw.githubusercontent.com/wiki/ZotyDev/objects-interactions-fx/images/showcase/tag_adding.gif" alt="Adding tags">
</p>

<h3 align="center"> Alternatively, you can <a href="https://github.com/ZotyDev/objects-interactions-fx/wiki/Customization#tag-packs">create</a> your own Tag Packs </h3>

---

## Settings
Since all settings that aren't simple have a hint that explains how it works, there is no need to explain them here. 

Almost eveything in the module can be fine tuned to your desire, if there is something you want to be configured/added to the module leave a [issue](https://github.com/ZotyDev/objects-interactions-fx/issues/new) and I will try my best to implement it.

---

## Planned
- [ ] Loot generator
- [x] *~~Currency generator~~*
- [ ] User defined *~~tags, animations and~~* triggers
- [x] *~~Better Wiki~~*
- [ ] More *~~and better~~* default animations
- [ ] Elevation sensor for created Item Piles (Levels compatibility)
- [ ] Custom images support for created Item Piles
- [ ] Impact knockback effect
- [x] *~~Minify the name of the created Item Piles (make it ▲)~~*
- [ ] Death effects
- [x] *~~Lighting tags (torch, lamp, etc)~~*
- [x] *~~Option to configure percentage of ranged and thrown items that get destroyed on impact~~*
- [ ] Sounds (Need to find a way to play sounds at a specific location)
- [ ] Material tags (metal, wood, glass, etc)
- [ ] Material-based effects (metal sword? metal armor? well, lets throw some sparks on the air :D)
- [ ] Disarm effects - suggested by r/Shuggaloaf
- [ ] Unique magical items (cheating coin/dice, transforming weapons, and some other funny things)
- [ ] Spells interactions with the world
- [ ] Effects that change the canvas color
- [ ] Animate tile (Waving leaves, water with waves, etc)
- [ ] Block, dodge and miss animations
- [ ] Armor-based weapon hit effects and sounds
- [ ] Attach hit projectiles to tokens
- [ ] Handle multiple lightsources on a same token
- [ ] Custom animations with static images
- [ ] Remove DnD5e and MidiQOL from requirements (make it work with everything)
- [ ] Magic Wand (Tool for easily applying effects)
- [ ] Dynamic reactions (Explosions and wind blow trees, push objects, etc)
- [ ] Cinematical spells (BBEG is going to kill half the world? Well, make that epic with camera movement, sounds, scene's colors changind and blinking lights)
- [ ] Height/Weight based impact animations (Walking giants should make the ground shake!!)
- [ ] Gore effects (Chop arms, heads, legs, make the ground your art, and the enemy your brush)
- [ ] Guns (Rifles, pistols, machineguns, etc)
- [ ] Ammo capsules on the ground (laggy or not here we go)
- [ ] Elevation based shadows (Levels compatibility)
- [ ] Preview effects at master tag configuration
- [ ] Objects (something between tokens and tiles)

---

<h2 align="center"> <a href="https://github.com/ZotyDev/objects-interactions-fx/blob/main/CHANGELOG.md"> Changelog</a> </h2> 
