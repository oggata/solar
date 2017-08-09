var Marker = cc.Node.extend({
    ctor: function (game, col, row, baseMapType, buildingMapType, colorName) {
        this._super();
        this.game = game;
        /*
                this.testLabel = new cc.LabelTTF("", "Arial", 13);
                this.testLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
                this.testLabel.setPosition(10,8);
                this.addChild(this.testLabel);
        */
        this.myColorName = colorName;

        this.spriteGreen = cc.Sprite.create("res/map-base-green.png");
        this.addChild(this.spriteGreen);
        this.spriteGreen.setAnchorPoint(0.5, 0.5);
        this.spriteGreen.setVisible(false);
        
        this.markerId = getRandNumberFromRange(1, 99999);
        this.mapChipType = baseMapType;
        this.baseMapType = baseMapType;
        this.buildingMapType = buildingMapType;
        this.colorId = "WHITE";
        this.col = col;
        this.row = row;
    },
    update: function () {
        return true;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
});
