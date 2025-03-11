import { bank } from "./ui.js";
import { show_notification, getCoins, setCoins } from "./DeploymentClickEvents.js";
import { getHose, setHose, getExtinguisher, setExtinguisher, getHelicopter, setHelicopter, getFiretruck, setFiretruck, getAirtanker, setAirtanker, getHotshotCrew, setHotshotCrew, getSmokejumpers, setSmokejumpers} from "./assetValues.js";
import { s_hose, s_extinguisher, s_helicopter, s_firetruck, s_airtanker, s_hotshotcrew, s_smokejumpers, s_total,
    hoseText, extinguisherText, helicopterText, firetruckText, airtankerText, hotshotcrewText, smokejumperText
 } from "./ui.js";

let cart_toggle = true;

let hose_counter = 0;
let extinguisher_counter = 0;
let helicopter_counter = 0;
let firetruck_counter = 0;
let airtanker_counter = 0;
let hotshotcrew_counter = 0;
let smokejumper_counter = 0;
let total_cost = 0;

export function manageShop(scene, purchase, no_funds, add_hose, add_extinguisher,
    add_helicopter, add_firetruck, add_airtanker, add_hotshotcrew, add_smokejumpers) {
    
    // Buy Hoses
    add_hose.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 150;
                hose_counter += 1;
                s_hose.setText(`${hose_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (hose_counter > 0) {
                total_cost -= 150;
                hose_counter -= 1;
                s_hose.setText(`${hose_counter}`);   
                s_total.setText(`${total_cost}`);
            }
                
        },
        this
    );

    // Buy Extinguishers
    add_extinguisher.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 25;
                extinguisher_counter += 1;
                s_extinguisher.setText(`${extinguisher_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (extinguisher_counter > 0) {
                total_cost -= 25;
                extinguisher_counter -= 1;
                s_extinguisher.setText(`${extinguisher_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Buy Helicopters
    add_helicopter.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 300;
                helicopter_counter += 1;
                s_helicopter.setText(`${helicopter_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (helicopter_counter > 0) {
                total_cost -= 300;
                helicopter_counter -= 1;
                s_helicopter.setText(`${helicopter_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Buy Firetrucks
    add_firetruck.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 250;
                firetruck_counter += 1;
                s_firetruck.setText(`${firetruck_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (firetruck_counter > 0) {
                total_cost -= 250;
                firetruck_counter -= 1;
                s_firetruck.setText(`${firetruck_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Buy Airtankers
    add_airtanker.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 250;
                airtanker_counter += 1;
                s_airtanker.setText(`${airtanker_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (airtanker_counter > 0) {
                total_cost -= 250;
                airtanker_counter -= 1;
                s_airtanker.setText(`${airtanker_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Buy Hotshot Crews
    add_hotshotcrew.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 700;
                hotshotcrew_counter += 1;
                s_hotshotcrew.setText(`${hotshotcrew_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (hotshotcrew_counter > 0) {
                total_cost -= 700;
                hotshotcrew_counter -= 1;
                s_hotshotcrew.setText(`${hotshotcrew_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Buy Smokejumpers
    add_smokejumpers.on(
        "pointerdown",
        function () {
            if (cart_toggle == true) {
                total_cost += 250;
                smokejumper_counter += 1;
                s_smokejumpers.setText(`${smokejumper_counter}`);   
                s_total.setText(`${total_cost}`);
            } else if (smokejumper_counter > 0) {
                total_cost -= 250;
                smokejumper_counter -= 1;
                s_smokejumpers.setText(`${smokejumper_counter}`);   
                s_total.setText(`${total_cost}`);
            }
        },
        this
    );

    // Confirm Purchase
    purchase.on(
        "pointerdown",
        function (pointer, localX, localY, event) {

            let auth_purch = setCoins(total_cost);

            console.log(`${getCoins()}`);

            if (auth_purch == false) {
                show_notification(scene, no_funds);

            } else {
                setHose(hose_counter);
                setExtinguisher(extinguisher_counter);
                setHelicopter(helicopter_counter);
                setFiretruck(firetruck_counter);
                setAirtanker(airtanker_counter);
                setHotshotCrew(hotshotcrew_counter);
                setSmokejumpers(smokejumper_counter);

                hoseText.setText(getHose());
                extinguisherText.setText(getExtinguisher());
                helicopterText.setText(getHelicopter());
                firetruckText.setText(getFiretruck());
                airtankerText.setText(getAirtanker());
                hotshotcrewText.setText(getHotshotCrew());
                smokejumperText.setText(getSmokejumpers());

                s_total.setText(`${total_cost}`);


                // Reset all asset counters when the player makes a purchase
                hose_counter = 0;
                s_hose.setText(`${hose_counter}`); 
                extinguisher_counter = 0;
                s_extinguisher.setText(`${extinguisher_counter}`);  
                helicopter_counter = 0;
                s_helicopter.setText(`${helicopter_counter}`); 
                firetruck_counter = 0;
                s_firetruck.setText(`${firetruck_counter}`);
                airtanker_counter = 0;
                s_airtanker.setText(`${airtanker_counter}`);
                hotshotcrew_counter = 0;
                s_hotshotcrew.setText(`${hotshotcrew_counter}`);
                smokejumper_counter = 0;
                s_smokejumpers.setText(`${smokejumper_counter}`);
            
                bank.setText(`${getCoins()}`);
                s_total.setText("0");

                // Reset shop GUI values
                total_cost = 0;
                setCoins(total_cost);
                hose_counter = 0;
                s_hose.setText(`${hose_counter}`);
            }      
                
        },
        this
    );
}

// Initialize Shop Menu
export function setupShop (scene, open_shop, shop, close, remove_button, purchase, no_funds, add_hose, add_extinguisher,
    add_helicopter, add_firetruck, add_airtanker, add_hotshotcrew, add_smokejumpers,
    price_hose, price_hose_text, price_extinguisher, price_extinguisher_text, price_helicopter, price_helicopter_text, price_firetruck, price_firetruck_text, price_airtanker, 
    price_airtanker_text, price_hotshotcrew, price_hotshotcrew_text, price_smokejumpers, price_smokejumpers_text) {

    open_shop.setInteractive();
    close.setInteractive();
    remove_button.setInteractive();
    purchase.setInteractive();

    add_hose.setInteractive();
    add_extinguisher.setInteractive();
    add_helicopter.setInteractive();
    add_firetruck.setInteractive();
    add_airtanker.setInteractive();
    add_hotshotcrew.setInteractive();
    add_smokejumpers.setInteractive();
    
    manageShop(scene, purchase, no_funds, add_hose, add_extinguisher,
        add_helicopter, add_firetruck, add_airtanker, add_hotshotcrew, add_smokejumpers);

    // Opens shop on click
    open_shop.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            shop.setVisible(true);
            close.setVisible(true);
            remove_button.setVisible(true);
            purchase.setVisible(true);

            add_hose.setVisible(true);
            add_extinguisher.setVisible(true);
            add_helicopter.setVisible(true);
            add_firetruck.setVisible(true);
            add_airtanker.setVisible(true);
            add_hotshotcrew.setVisible(true);
            add_smokejumpers.setVisible(true);

            s_hose.setVisible(true);
            s_extinguisher.setVisible(true);
            s_helicopter.setVisible(true);
            s_firetruck.setVisible(true);
            s_airtanker.setVisible(true);
            s_hotshotcrew.setVisible(true);
            s_smokejumpers.setVisible(true);
            s_total.setVisible(true);
            
        },
        this
    );

    // Hide Shop Screen on click
    close.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            shop.setVisible(false);
            close.setVisible(false);
            remove_button.setVisible(false);
            purchase.setVisible(false);

            add_hose.setVisible(false);
            add_extinguisher.setVisible(false);
            add_helicopter.setVisible(false);
            add_firetruck.setVisible(false);
            add_airtanker.setVisible(false);
            add_hotshotcrew.setVisible(false);
            add_smokejumpers.setVisible(false);

            s_hose.setVisible(false);
            s_extinguisher.setVisible(false);
            s_helicopter.setVisible(false);
            s_firetruck.setVisible(false);
            s_airtanker.setVisible(false);
            s_hotshotcrew.setVisible(false);
            s_smokejumpers.setVisible(false);
            s_total.setVisible(false);

        },
        this
    );

    // Allow player to remove items from shopping cart (on click)
    remove_button.on(
        "pointerdown",
        function (pointer, localX, localY, event) {
            if (cart_toggle == true) {
                remove_button.setTexture("toggle-add-to-cart");
                add_hose.setTexture("remove-from-cart");
                add_extinguisher.setTexture("remove-from-cart");
                add_helicopter.setTexture("remove-from-cart");
                add_firetruck.setTexture("remove-from-cart");
                add_airtanker.setTexture("remove-from-cart");
                add_hotshotcrew.setTexture("remove-from-cart");
                add_smokejumpers.setTexture("remove-from-cart");
                cart_toggle = false;
            } else {
                remove_button.setTexture("remove-button");
                add_hose.setTexture("add-to-cart");
                add_extinguisher.setTexture("add-to-cart");
                add_helicopter.setTexture("add-to-cart");
                add_firetruck.setTexture("add-to-cart");
                add_airtanker.setTexture("add-to-cart");
                add_hotshotcrew.setTexture("add-to-cart");
                add_smokejumpers.setTexture("add-to-cart");
                cart_toggle = true;
            }
        },
        this
    );

    // *** Button Glow Effects & Price Tags  ***
    open_shop.on('pointerover', () => {
        open_shop.setTint(0xf4c576);
    });

    open_shop.on('pointerout', () => {
        open_shop.clearTint();
    });

    close.on('pointerover', () => {
        close.setTint(0xed6851);
    });

    close.on('pointerout', () => {
        close.clearTint();
    });

    remove_button.on('pointerover', () => {
        remove_button.setTint(0xed6851);
    });

    remove_button.on('pointerout', () => {
        remove_button.clearTint();
    });

    purchase.on('pointerover', () => {
        purchase.setTint(0x4eaf4c);
    });

    purchase.on('pointerout', () => {
        purchase.clearTint();
    });

    // Price tags are detected starting here
    add_hose.on('pointerover', () => {
        add_hose.setTint(0x4eaf4c);
        price_hose.angle = -35;
        price_hose_text.angle = -35;
        price_hose.setVisible(true);
        price_hose_text.setVisible(true);
    });

    add_hose.on('pointerout', () => {
        add_hose.clearTint();
        price_hose.setVisible(false);
        price_hose_text.setVisible(false);
    });

    add_extinguisher.on('pointerover', () => {
        add_extinguisher.setTint(0x4eaf4c);
        price_extinguisher.angle = -35;
        price_extinguisher_text.angle = -35;
        price_extinguisher.setVisible(true);
        price_extinguisher_text.setVisible(true);
    });

    add_extinguisher.on('pointerout', () => {
        add_extinguisher.clearTint();
        price_extinguisher.setVisible(false);
        price_extinguisher_text.setVisible(false);
    });

    add_helicopter.on('pointerover', () => {
        add_helicopter.setTint(0x4eaf4c);
        price_helicopter.angle = -35;
        price_helicopter_text.angle = -35;
        price_helicopter.setVisible(true);
        price_helicopter_text.setVisible(true);
    });

    add_helicopter.on('pointerout', () => {
        add_helicopter.clearTint();
        price_helicopter.setVisible(false);
        price_helicopter_text.setVisible(false);
    });

    add_firetruck.on('pointerover', () => {
        add_firetruck.setTint(0x4eaf4c);
        price_firetruck.angle = -35;
        price_firetruck_text.angle = -35;
        price_firetruck.setVisible(true);
        price_firetruck_text.setVisible(true);
    });

    add_firetruck.on('pointerout', () => {
        add_firetruck.clearTint();
        price_firetruck.setVisible(false);
        price_firetruck_text.setVisible(false);
    });

    add_airtanker.on('pointerover', () => {
        add_airtanker.setTint(0x4eaf4c);
        price_airtanker.angle = -35;
        price_airtanker_text.angle = -35;
        price_airtanker.setVisible(true);
        price_airtanker_text.setVisible(true);
    });

    add_airtanker.on('pointerout', () => {
        add_airtanker.clearTint();
        price_airtanker.setVisible(false);
        price_airtanker_text.setVisible(false);
    });

    add_hotshotcrew.on('pointerover', () => {
        add_hotshotcrew.setTint(0x4eaf4c);
        price_hotshotcrew.angle = -35;
        price_hotshotcrew_text.angle = -35;
        price_hotshotcrew.setVisible(true);
        price_hotshotcrew_text.setVisible(true);
    });

    add_hotshotcrew.on('pointerout', () => {
        add_hotshotcrew.clearTint();
        price_hotshotcrew.setVisible(false);
        price_hotshotcrew_text.setVisible(false);
    });

    add_smokejumpers.on('pointerover', () => {
        add_smokejumpers.setTint(0x4eaf4c);
        price_smokejumpers.angle = -35;
        price_smokejumpers_text.angle = -35;
        price_smokejumpers.setVisible(true);
        price_smokejumpers_text.setVisible(true);
    });

    add_smokejumpers.on('pointerout', () => {
        add_smokejumpers.clearTint();
        price_smokejumpers.setVisible(false);
        price_smokejumpers_text.setVisible(false);
    });
    
}