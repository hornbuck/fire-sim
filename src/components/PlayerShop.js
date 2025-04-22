import { show_notification, getCoins, setCoins } from "./DeploymentClickEvents.js";
import {
  getHose, setHose, getExtinguisher, setExtinguisher,
  getHelicopter, setHelicopter, getFiretruck, setFiretruck,
  getAirtanker, setAirtanker, getHotshotCrew, setHotshotCrew,
  getSmokejumpers, setSmokejumpers
} from "./assetValues.js";
import { createDrawnButton } from "./ButtonManager.js";

export function createNewShop(scene) {
  // Background overlay
  scene.shopBackgroundFade = scene.add.rectangle(
    scene.scale.width / 2,
    scene.scale.height / 2,
    scene.scale.width,
    scene.scale.height,
    0x000000,
    0.5
  ).setOrigin(0.5).setScrollFactor(0).setDepth(498).setVisible(false);

  // Container
  scene.shopContainer = scene.add.container(0, 0).setVisible(false).setDepth(499);

  // Shop background
  const shopBg = scene.add.rectangle(
    scene.scale.width / 2,
    scene.scale.height / 2,
    650,
    560,
    0x2d3436
  ).setOrigin(0.5);
  scene.shopContainer.add(shopBg);

  // Coins display
  scene.shopCoinsText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 230, `Coins: $${getCoins()}`, {
    fontFamily: '"Press Start 2P"',
    fontSize: '10px',
    color: '#ffffff'
  }).setOrigin(0.5);
  scene.shopContainer.add(scene.shopCoinsText);

  // Close button
  const closeBtn = createDrawnButton(scene, {
    x: scene.scale.width / 2 + 305,
    y: scene.scale.height / 2 - 260,
    width: 30,
    height: 30,
    backgroundColor: 0x8B0000,
    hoverColor: 0xA52A2A,
    text: 'X',
    fontSize: '10px',
    onClick: () => {
      scene.shopBackgroundFade.setVisible(false);
      scene.shopContainer.setVisible(false);
    }
  });
  scene.shopContainer.add([closeBtn.button, closeBtn.buttonText]);

  const startX = scene.scale.width / 2 - 200;
  const startY = scene.scale.height / 2 - 180;
  const colSpacing = 200;
  const rowSpacing = 120;

  const items = [
    { key: 'hose', price: 150, get: getHose, set: setHose },
    { key: 'extinguisher', price: 250, get: getExtinguisher, set: setExtinguisher },
    { key: 'helicopter', price: 500, get: getHelicopter, set: setHelicopter },
    { key: 'firetruck', price: 600, get: getFiretruck, set: setFiretruck },
    { key: 'airtanker', price: 800, get: getAirtanker, set: setAirtanker },
    { key: 'hotshot-crew', price: 400, get: getHotshotCrew, set: setHotshotCrew },
    { key: 'smokejumper', price: 700, get: getSmokejumpers, set: setSmokejumpers }
  ];

  scene.shopQuantities = {};

  items.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const itemX = startX + col * colSpacing;
    const itemY = startY + row * rowSpacing;

    // Icon background tile
    const bgTile = scene.add.rectangle(itemX, itemY, 52, 52, 0x3c3c3c)
      .setOrigin(0.5)
      .setStrokeStyle(1, 0xffffff, 0.1);
    scene.shopContainer.add(bgTile);

    const icon = scene.add.sprite(itemX, itemY, item.key)
      .setDisplaySize(48, 48)
      .setOrigin(0.5);

    const priceColor = getCoins() >= item.price ? '#ffffff' : '#ff5555';
    const price = scene.add.text(itemX, itemY + 32, `$${item.price}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: priceColor
    }).setOrigin(0.5);

    const qtyText = scene.add.text(itemX, itemY + 60, '0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#ffffff'
    }).setOrigin(0.5);

    scene.shopQuantities[item.key] = 0;

    const removeBtn = createDrawnButton(scene, {
      x: itemX - 40,
      y: itemY + 60,
      width: 30,
      height: 30,
      backgroundColor: 0x8B0000,
      hoverColor: 0xA52A2A,
      text: '-',
      fontSize: '10px',
      onClick: () => {
        if (scene.shopQuantities[item.key] > 0) {
          scene.shopQuantities[item.key]--;
          qtyText.setText(scene.shopQuantities[item.key].toString());
          updateShopTotal(scene, items);
        }
      }
    });

    const addBtn = createDrawnButton(scene, {
      x: itemX + 40,
      y: itemY + 60,
      width: 30,
      height: 30,
      backgroundColor: 0x228B22,
      hoverColor: 0x2E8B57,
      text: '+',
      fontSize: '10px',
      onClick: () => {
        if (getCoins() >= item.price) {
          scene.shopQuantities[item.key]++;
          qtyText.setText(scene.shopQuantities[item.key].toString());
          updateShopTotal(scene, items);
        } else {
          show_notification(scene, 'Insufficient funds!');
        }
      }
    });

    scene.shopContainer.add([
      icon, price, qtyText,
      removeBtn.button, removeBtn.buttonText,
      addBtn.button, addBtn.buttonText
    ]);
  });

  scene.totalText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 180, 'Total: $0', {
    fontFamily: '"Press Start 2P"',
    fontSize: '14px',
    color: '#ffffff'
  }).setOrigin(0.5);
  scene.shopContainer.add(scene.totalText);

  const purchaseBtn = createDrawnButton(scene, {
    x: scene.scale.width / 2,
    y: scene.scale.height / 2 + 220,
    width: 160,
    height: 40,
    backgroundColor: 0x555555,
    hoverColor: 0x777777,
    text: 'Purchase',
    fontSize: '10px',
    onClick: () => {
      for (const item of items) {
        const qty = scene.shopQuantities[item.key];
        if (qty > 0) {
          const totalCost = item.price * qty;
          if (getCoins() >= totalCost) {
            setCoins(-totalCost);
            item.set(item.get() + qty);
          } else {
            show_notification(scene, 'Not enough coins for full purchase!');
            return;
          }
        }
      }
      for (const key in scene.shopQuantities) {
        scene.shopQuantities[key] = 0;
      }
      updateShopTotal(scene, items);
    }
  });
  scene.shopContainer.add([purchaseBtn.button, purchaseBtn.buttonText]);
}

function updateShopTotal(scene, items) {
  let total = 0;
  for (const item of items) {
    total += scene.shopQuantities[item.key] * item.price;
  }
  scene.totalText.setText(`Total: $${total}`);
  if (scene.shopCoinsText) {
    scene.shopCoinsText.setText(`Coins: $${getCoins()}`);
  }
}
