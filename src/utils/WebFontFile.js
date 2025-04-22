import WebFontLoader from 'webfontloader';
import Phaser from 'phaser';


export default class WebFontFile extends Phaser.Loader.File {
    constructor(loader, fontNames, service = 'google') {
        super(loader, {
            type: 'webfont',
            key: fontNames.toString()
        });

        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
        this.service = service;
    }

    load() {
        const config = {
            active: () => {
                this.loader.nextFile(this, true);
            }
        };

        if (this.service === 'google') {
            config['google'] = { families: this.fontNames };
        } else {
            throw new Error('Unsupported font service: ' + this.service);
        }

        WebFontLoader.load(config);
    }
}