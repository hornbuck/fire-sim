import {
    getHose, setHose, 
    getExtinguisher, setExtinguisher, 
    getHelicopter, setHelicopter, 
    getFiretruck, setFiretruck, 
    getAirtanker, setAirtanker,
    getHotshotCrew, setHotshotCrew, 
    getSmokejumpers, setSmokejumpers
} from "./assetValues.js";
import { deactivate, show_notification, setCoins, getCoins } from "./DeploymentClickEvents.js";
import { bank, all_assets, hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText, open_shop } from "./ui.js";

// Initialize purchase quantity for each asset
let s_hose;
let s_extinguisher;
let s_helicopter;
let s_firetruck;
let s_airtanker;
let s_hotshotcrew;
let s_smokejumpers;
let s_total = 0;

// Initialize asset counts in the shop
let cart_toggle = true;

let hose_counter = 0;
let extinguisher_counter = 0;
let helicopter_counter = 0;
let firetruck_counter = 0;
let airtanker_counter = 0;
let hotshotcrew_counter = 0;
let smokejumper_counter = 0;
let total_cost = 0;


export function createNewShop(scene) {
    // Create the shop background panel (replace the static image)
    let shop = scene.add.rectangle(
        scene.cameras.main.width / 2, 
        scene.cameras.main.height / 2, 
        500, 
        450, 
        0x2d3436, 
        0.95
    ).setDepth(500).setOrigin(0.5, 0.5).setVisible(false)
    .setStrokeStyle(3, 0xffffff);

    // Add shop title
    let shopTitle = scene.add.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2 - 200, 'SHOP', {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#FFFFFF',
        align: 'center'
    }).setOrigin(0.5, 0.5).setDepth(501).setVisible(false);

    // Close button
    let close = scene.add.rectangle(
        scene.cameras.main.width / 2 + 230, 
        scene.cameras.main.height / 2 - 200, 
        30, 
        30, 
        0x8B0000
    ).setDepth(501).setOrigin(0.5, 0.5).setVisible(false);
    
    let closeText = scene.add.text(
        scene.cameras.main.width / 2 + 230, 
        scene.cameras.main.height / 2 - 200, 
        'X', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFFFFF'
        }
    ).setOrigin(0.5, 0.5).setDepth(502).setVisible(false);

    // Initialize asset item containers
    const itemRows = [
        { asset: 'hose', price: 150, y: 210 },
        { asset: 'extinguisher', price: 25, y: 210 },
        { asset: 'helicopter', price: 300, y: 277 },
        { asset: 'firetruck', price: 250, y: 277 },
        { asset: 'airtanker', price: 250, y: 347 },
        { asset: 'hotshot-crew', price: 700, y: 347 },
        { asset: 'smokejumper', price: 250, y: 417 }
    ];

    // Create item displays in two columns
    let itemContainers = [];
    let minusButtons = [];
    let plusButtons = [];
    let priceTexts = [];
    let itemCountTexts = [];

    itemRows.forEach((item, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = scene.cameras.main.width / 2 + (col === 0 ? -110 : 110);
        const y = scene.cameras.main.height / 2 - 120 + (row * 80);
        
        // Item background
        const itemBg = scene.add.rectangle(x, y, 180, 60, 0x333333)
            .setDepth(501).setOrigin(0.5).setVisible(false);
        
        // Item icon - use the same resource images
        const icon = scene.add.image(x - 70, y, item.asset)
            .setDepth(502).setScale(0.6).setOrigin(0.5).setVisible(false);
        
        // Price text (always visible)
        const priceText = scene.add.text(x, y - 20, `$${item.price}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFD700'
        }).setOrigin(0.5, 0.5).setDepth(502).setVisible(false);
        
        // Count text
        const countText = scene.add.text(x, y, '0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(502).setVisible(false);
        
        // Minus button
        const minusBtn = scene.add.rectangle(x - 30, y, 25, 25, 0x8B0000)
            .setDepth(502).setOrigin(0.5).setVisible(false).setInteractive();
        
        const minusText = scene.add.text(x - 30, y, '-', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(503).setVisible(false);
        
        // Plus button
        const plusBtn = scene.add.rectangle(x + 30, y, 25, 25, 0x228B22)
            .setDepth(502).setOrigin(0.5).setVisible(false).setInteractive();
        
        const plusText = scene.add.text(x + 30, y, '+', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(503).setVisible(false);
        
        itemContainers.push({
            bg: itemBg,
            icon: icon,
            minusBtn: minusBtn,
            minusText: minusText,
            plusBtn: plusBtn,
            plusText: plusText,
            countText: countText,
            priceText: priceText,
            asset: item.asset,
            price: item.price
        });
        
        // Store references
        minusButtons.push(minusBtn);
        plusButtons.push(plusBtn);
        priceTexts.push(priceText);
        itemCountTexts[item.asset] = countText;
    });

    // Total section
    const totalBg = scene.add.rectangle(
        scene.cameras.main.width / 2,
        scene.cameras.main.height / 2 + 180,
        450, 
        60, 
        0x333333
    ).setDepth(501).setOrigin(0.5).setVisible(false);
    
    let totalLabel = scene.add.text(
        scene.cameras.main.width / 2 - 100,
        scene.cameras.main.height / 2 + 180,
        'TOTAL:', 
        {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFFFFF'
        }
    ).setOrigin(0.5, 0.5).setDepth(502).setVisible(false);
    
    s_total = scene.add.text(
        scene.cameras.main.width / 2,
        scene.cameras.main.height / 2 + 180,
        '0', 
        {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#FFD700'
        }
    ).setDepth(502).setVisible(false);

    // Purchase button
    let purchase = scene.add.rectangle(
        scene.cameras.main.width / 2 + 150,
        scene.cameras.main.height / 2 + 180,
        120, 
        40, 
        0x228B22
    ).setDepth(501).setOrigin(0.5).setVisible(false).setInteractive();
    
    let purchaseText = scene.add.text(
        scene.cameras.main.width / 2 + 150,
        scene.cameras.main.height / 2 + 180,
        'PURCHASE', 
        {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#FFFFFF'
        }
    ).setOrigin(0.5, 0.5).setDepth(502).setVisible(false);

    // Error notification
    let no_funds = scene.add.text(
        scene.cameras.main.width / 2,
        scene.cameras.main.height / 2,
        'Insufficient Funds!', 
        {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#FF0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }
    ).setOrigin(0.5, 0.5).setDepth(1100).setVisible(false);

    // Setup shop interaction and event handling
    setupShop(
        scene, 
        open_shop, 
        // UI Elements
        {
            panel: shop,
            title: shopTitle,
            close: close,
            closeText: closeText,
            items: itemContainers,
            totalLabel: totalLabel,
            totalText: s_total,
            purchase: purchase,
            purchaseText: purchaseText,
            noFunds: no_funds
        }
    );
}

// Initialize Shop Menu
export function setupShop(scene, open_shop, elements) {
    // Make all elements interactive
    elements.close.setInteractive();
    elements.purchase.setInteractive();
    
    elements.items.forEach(item => {
        item.plusBtn.setInteractive();
        item.minusBtn.setInteractive();
        
        // Plus button functionality (add item)
        item.plusBtn.on('pointerdown', function() {
            const itemCounter = getItemCounter(item.asset);
            itemCounter.setValue(itemCounter.value + 1);
            
            // Change this line - get the updated value after setting it
            const newValue = getItemCounter(item.asset).value;
            item.countText.setText(`${newValue}`);
            
            total_cost += item.price;
            elements.totalText.setText(`${total_cost}`);
        });

        // Minus button functionality (remove item)
        item.minusBtn.on('pointerdown', function() {
            const itemCounter = getItemCounter(item.asset);
            if (itemCounter.value > 0) {
                itemCounter.setValue(itemCounter.value - 1);
                
                // Change this line - get the updated value after setting it
                const newValue = getItemCounter(item.asset).value;
                item.countText.setText(`${newValue}`);
                
                total_cost -= item.price;
                elements.totalText.setText(`${total_cost}`);
            }
        });
        
        // Hover effects
        item.plusBtn.on('pointerover', () => item.plusBtn.setFillStyle(0x2E8B57));
        item.plusBtn.on('pointerout', () => item.plusBtn.setFillStyle(0x228B22));
        item.minusBtn.on('pointerover', () => item.minusBtn.setFillStyle(0xA52A2A));
        item.minusBtn.on('pointerout', () => item.minusBtn.setFillStyle(0x8B0000));
    });
    
    // Confirm purchase functionality
    elements.purchase.on('pointerdown', function() {
        let auth_purch = setCoins(total_cost);
        
        if (auth_purch == false) {
            // Show insufficient funds notification
            elements.noFunds.setVisible(true);
            scene.time.delayedCall(2000, () => elements.noFunds.setVisible(false));
        } else {
            // Process the purchase
            elements.items.forEach(item => {
                const itemCounter = getItemCounter(item.asset);
                if (itemCounter.value > 0) {
                    // Update the player's inventory based on asset type
                    updatePlayerInventory(item.asset, itemCounter.value);
                    // Change this line:
                    itemCounter.setValue(0);  // Use setValue instead of setting .value = 0
                    item.countText.setText('0');
                }
            });
            
            // Update UI elements
            updateAssetCounts();
            bank.setText(`${getCoins()}`);
            elements.totalText.setText("0");
            total_cost = 0;
        }
    });
    
    // Open shop button
    open_shop.on('pointerdown', function() {
        deactivate(all_assets);
        scene.input.setDefaultCursor('url(assets/cursors/glove.png), pointer');
        
        // Show all shop elements
        showShopElements(elements, true);
    });
    
    // Close button
    elements.close.on('pointerdown', function() {
        // Reset all counters and total cost
        resetShopCounters(elements);
        
        // Hide all shop elements
        showShopElements(elements, false);
    });
    
    // Hover effects for buttons
    elements.close.on('pointerover', () => elements.close.setFillStyle(0xA52A2A));
    elements.close.on('pointerout', () => elements.close.setFillStyle(0x8B0000));
    elements.purchase.on('pointerover', () => elements.purchase.setFillStyle(0x2E8B57));
    elements.purchase.on('pointerout', () => elements.purchase.setFillStyle(0x228B22));
}

// Helper function to show/hide all shop elements
function showShopElements(elements, visible) {
    elements.panel.setVisible(visible);
    elements.title.setVisible(visible);
    elements.close.setVisible(visible);
    elements.closeText.setVisible(visible);
    elements.totalLabel.setVisible(visible);
    elements.totalText.setVisible(visible);
    elements.purchase.setVisible(visible);
    elements.purchaseText.setVisible(visible);
    
    elements.items.forEach(item => {
        item.bg.setVisible(visible);
        item.icon.setVisible(visible);
        item.minusBtn.setVisible(visible);
        item.minusText.setVisible(visible);
        item.plusBtn.setVisible(visible);
        item.plusText.setVisible(visible);
        item.countText.setVisible(visible);
        item.priceText.setVisible(visible);
    });
}

// Helper function to get the counter for a specific item
function getItemCounter(asset) {
    switch(asset) {
        case 'hose': return { value: hose_counter, setValue: (v) => { hose_counter = v; } };
        case 'extinguisher': return { value: extinguisher_counter, setValue: (v) => { extinguisher_counter = v; } };
        case 'helicopter': return { value: helicopter_counter, setValue: (v) => { helicopter_counter = v; } };
        case 'firetruck': return { value: firetruck_counter, setValue: (v) => { firetruck_counter = v; } };
        case 'airtanker': return { value: airtanker_counter, setValue: (v) => { airtanker_counter = v; } };
        case 'hotshotcrew': return { value: hotshotcrew_counter, setValue: (v) => { hotshotcrew_counter = v; } };
        case 'smokejumper': return { value: smokejumper_counter, setValue: (v) => { smokejumper_counter = v; } };
        default: return { value: 0, setValue: () => {} };
    }
}

// Helper function to update player inventory based on asset type
function updatePlayerInventory(asset, value) {
    switch(asset) {
        case 'hose': setHose(value); break;
        case 'extinguisher': setExtinguisher(value); break;
        case 'helicopter': setHelicopter(value); break;
        case 'firetruck': setFiretruck(value); break;
        case 'airtanker': setAirtanker(value); break;
        case 'hotshotcrew': setHotshotCrew(value); break;
        case 'smokejumper': setSmokejumpers(value); break;
    }
}

// Update UI counts after purchase
function updateAssetCounts() {
    hoseText.setText(getHose());
    extinguisherText.setText(getExtinguisher());
    helicopterText.setText(getHelicopter());
    firetruckText.setText(getFiretruck());
    airtankerText.setText(getAirtanker());
    hotshotcrewText.setText(getHotshotCrew());
    smokejumperText.setText(getSmokejumpers());
}

// Reset all shop counters and totals when closing
function resetShopCounters(elements) {
    // Reset all item counters to 0
    hose_counter = 0;
    extinguisher_counter = 0;
    helicopter_counter = 0;
    firetruck_counter = 0;
    airtanker_counter = 0;
    hotshotcrew_counter = 0;
    smokejumper_counter = 0;
    
    // Reset the displayed counts
    elements.items.forEach(item => {
        item.countText.setText('0');
    });
    
    // Reset the total cost
    total_cost = 0;
    elements.totalText.setText('0');
}
