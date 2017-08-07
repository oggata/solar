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
        this.spriteGreen.setAnchorPoint(0, 0);
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
/*
var Ripple = cc.Node.extend({
    ctor: function (game, colorTxt) {
        this._super();
        this.game = game;
        this.colorTxt = colorTxt;
        switch (this.colorTxt) {
        case "GREEN":
            this.marker = cc.Sprite.create("res/marker_green.png");
            break;
        case "RED":
            this.marker = cc.Sprite.create("res/marker_red.png");
            break;
        case "GREEN_BLOCK":
            this.marker = cc.Sprite.create("res/marker_green_block.png");
            break;
        case "RED_BLOCK":
            this.marker = cc.Sprite.create("res/marker_red_block.png");
            break;
        }
        this.addChild(this.marker);
        this.marker.setScale(this.scaleRate);
        //this.marker.setOpacity(255 * 0.5);
        this.scaleRate = 0.1;
        this.effectTime = 0;
    },
    update: function () {
        this.effectTime += 1;
        if (this.colorTxt == "GREEN" || this.colorTxt == "RED") {
            this.scaleRate += 0.04;
        } else {
            this.scaleRate = 1;
        }
        this.marker.setScale(this.scaleRate);
        if (this.effectTime >= 30) {
            return false;
        }
        return true;
    }
});
*/