export function createDrawnButton(scene, {
    x, y,
    width = 80, height = 30,
    backgroundColor = 0x8B0000,
    hoverColor = 0xA52A2A,
    text = 'Button',
    fontSize = '10px',
    onClick = () => {}
}) {
    const button = scene.add.rectangle(x, y, width, height, backgroundColor)
    .setOrigin(0.5)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(10);

    const buttonText = scene.add.text(x, y, text, {
        fontFamily: '"Press Start 2P"',
        fontStyle: 'normal',
        fontSize: fontSize,
        color: '#FFFFFF',
        align: 'center'
    }).setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(11);

    button.on('pointerover', () => button.setFillStyle(hoverColor));
    button.on('pointerout', () => button.setFillStyle(backgroundColor));

    // Add pop animation behavior:
    button.on('pointerdown', () => {
        scene.tweens.add({
        targets: [button, buttonText],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        ease: 'Power2'
    });
});

    button.on('pointerup', () => {
        scene.tweens.add({
        targets: [button, buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2',
        onComplete: onClick  // Fire the click action after pop
    });
});

    return { button, buttonText };
}
