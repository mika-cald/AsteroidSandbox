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

// Possible item types
const itemTypes = ["engine", "shield", "weapon"];

// Spawns a random item on the screen at a random position
function spawnRandomItem() {
    if (!canSpawn || effectActive || activeItem || !state.gameRunning) return;

    // Select random item type
    const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    // Create item element
    const item = document.createElement("img");
    item.src = `assets/items/${randomItem}.gif`;
    item.classList.add("item", "item-hitbox");
    item.dataset.type = randomItem;

    // Random position within viewport bounds
    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

    // Set random position
    item.style.left = `${Math.random() * maxX}px`;
    item.style.top = `${Math.random() * maxY}px`;

    // Add item to the DOM
    activeItem = item;
    document.body.appendChild(item);

    // Auto-remove item after 8 seconds if not collected
    setTimeout(() => {
        if (activeItem === item) removeItem();
    }, 8000);
}

// Removes the active item from the game
function removeItem() {
    if (activeItem) {
        activeItem.remove();
        activeItem = null;
    }
}

// Resets all item effects and states to default
function resetItems() {
    engineType.name = "base";
    engineType.thrust = 600;
    state.isInvincible = false;
    projectileType.name = "rocket";
    projectileType.damage = 100;

    // Clear any existing spawn timers
    if (spawnTimer) clearTimeout(spawnTimer);
    
    activeItem = null;
    canSpawn = false;
    effectActive = false;

    // Allow spawning after delay
    spawnTimer = setTimeout(() => {
        if (state.gameRunning) canSpawn = true;
    }, spawnDelay);
}

// Applies the effect of the collected item
function useItem(item) {
    const type = item.dataset.type;
    effectActive = true;

    const img = effect.querySelector("img");
    
    effect.style.display = "block";
    img.style.display = "block";
    img.src = `assets/player/effects/${type}.gif`;

    removeItem();

    // Apply item effect
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

    // Remove effect after duration
    setTimeout(() => {
        img.src = "";
        img.style.display = "none";
        effectActive = false;

        canSpawn = false;

        // Clear existing spawn timer
        if (spawnTimer) clearTimeout(spawnTimer);

        // Revert item effects
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
        
        // Allow new item spawn after delay
        spawnTimer = setTimeout(() => {
            if (state.gameRunning) canSpawn = true;
        }, spawnDelay);

    }, effectDuration);
}

// Updates item state each frame
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

// Initial spawn allowance after 3 seconds
setTimeout(() => {
    canSpawn = true;
}, 3000);


export { updateItems, spawnRandomItem, removeItem, resetItems};