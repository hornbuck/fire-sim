import { bank, open_shop, shop } from "./ui.js";

let cart_toggle = true;

export function setupShop (open_shop, shop, close, remove_button, purchase, add_hose, add_extinguisher,
    add_helicopter, add_firetruck, add_airtanker, add_hotshotcrew, add_smokejumpers
) {
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
            
        },
        this
    );

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
        },
        this
    );

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

    // *** Button Glow Effects ***
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

    add_hose.on('pointerover', () => {
        add_hose.setTint(0x4eaf4c);
    });

    add_hose.on('pointerout', () => {
        add_hose.clearTint();
    });

    add_extinguisher.on('pointerover', () => {
        add_extinguisher.setTint(0x4eaf4c);
    });

    add_extinguisher.on('pointerout', () => {
        add_extinguisher.clearTint();
    });

    add_helicopter.on('pointerover', () => {
        add_helicopter.setTint(0x4eaf4c);
    });

    add_helicopter.on('pointerout', () => {
        add_helicopter.clearTint();
    });

    add_firetruck.on('pointerover', () => {
        add_firetruck.setTint(0x4eaf4c);
    });

    add_firetruck.on('pointerout', () => {
        add_firetruck.clearTint();
    });

    add_airtanker.on('pointerover', () => {
        add_airtanker.setTint(0x4eaf4c);
    });

    add_airtanker.on('pointerout', () => {
        add_airtanker.clearTint();
    });

    add_hotshotcrew.on('pointerover', () => {
        add_hotshotcrew.setTint(0x4eaf4c);
    });

    add_hotshotcrew.on('pointerout', () => {
        add_hotshotcrew.clearTint();
    });

    add_smokejumpers.on('pointerover', () => {
        add_smokejumpers.setTint(0x4eaf4c);
    });

    add_smokejumpers.on('pointerout', () => {
        add_smokejumpers.clearTint();
    });
    
}