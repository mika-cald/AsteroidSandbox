// ============================= ITEMS MODULE ===============================
// Manages item spawning, effects, and interactions with the player's ship.
// =========================================================================

import { state } from "./gameState.js";
import { effect } from "./ui.js";
import { collisionWithItems } from "./collision.js";
import { engineType } from "./ship.js";
import { projectileType } from "./projectiles.js";

let activeItem = null;
let canSpawn = false;
let effectActive = false;

let effectDuration = 5000;
let spawnDelay = 3000;
let spawnTimer = null;

const itemTypes = ["engine", "shield", "weapon"];

function spawnRandomItem() {
    if (!canSpawn || effectActive || activeItem || !state.gameRunning) return;

    const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    const item = document.createElement("img");
    item.src = `assets/items/${randomItem}.gif`;
    item.classList.add("item", "item-hitbox");
    item.dataset.type = randomItem;

    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

    item.style.left = `${Math.random() * maxX}px`;
    item.style.top = `${Math.random() * maxY}px`;

    activeItem = item;
    document.body.appendChild(item);

    setTimeout(() => {
        if (activeItem === item) removeItem();
    }, 8000);
}

    
function removeItem() {
    if (activeItem) {
        activeItem.remove();
        activeItem = null;
    }
}

function resetItems() {
    engineType.name = "base";
    engineType.thrust = 600;
    state.isInvincible = false;
    projectileType.name = "rocket";
    projectileType.damage = 100;

    if (spawnTimer) clearTimeout(spawnTimer);
    
    activeItem = null;
    canSpawn = false;
    effectActive = false;

    spawnTimer = setTimeout(() => {
        if (state.gameRunning) canSpawn = true;
    }, spawnDelay);
}

function useItem(item) {
    const type = item.dataset.type;
    effectActive = true;

    const img = effect.querySelector("img");
    
    effect.style.display = "block";
    img.style.display = "block";
    img.src = `assets/player/effects/${type}.gif`;

    removeItem();

    switch (type) {
        case "engine":
            engineType.name = "supercharged";
            engineType.thrust = 750;
            break;        
        
        case "shield":
            state.isInvincible = true;
            break;        
            
        case "weapon":
            projectileType.name = "space-gun";
            projectileType.damage = 150;
            break;
    }

    setTimeout(() => {
        img.src = "";
        img.style.display = "none";
        effectActive = false;

        canSpawn = false;

        if (spawnTimer) clearTimeout(spawnTimer);

        switch (type) {
            case "engine":
                engineType.name = "base";
                engineType.thrust = 600;
                break;        
            
            case "shield":
                state.isInvincible = false;
                break;        
                
            case "weapon":
                projectileType.name = "rocket";
                projectileType.damage = 100;
                break;
        }

        spawnTimer = setTimeout(() => {
            if (state.gameRunning) canSpawn = true;
        }, spawnDelay);

    }, effectDuration);
}


function updateItems() {
    if (!state.gameRunning) {
        removeItem();
        canSpawn = false;
        return;
    }

    if (activeItem && collisionWithItems()) {
        useItem(activeItem);
    }
    
    if (!activeItem && canSpawn && !effectActive) {
        spawnRandomItem();
        canSpawn = true;

        spawnTimer = setTimeout(() => {
            if (state.gameRunning) canSpawn = true;
        }, spawnDelay);
    }
}

setTimeout(() => {
    canSpawn = true;
}, 3000);


export { updateItems, spawnRandomItem, removeItem, resetItems};