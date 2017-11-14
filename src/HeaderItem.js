var HeaderItem = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.header = cc.Sprite.create("res/header_materials.png");
        this.header.setAnchorPoint(0,0);
        //this.header.setPosition();
        this.addChild(this.header);

        var buttonMaterial = new cc.MenuItemImage("res/button_materials.png", "res/button_materials.png", function () {
            this.goTo001Layer();
        }, this);
        buttonMaterial.setPosition(100 + 220 * 0, 50);


        var buttonMaterial2 = new cc.MenuItemImage("res/button_materials_create.png", "res/button_materials_create.png", function () {
            this.goTo002Layer();
        }, this);
        buttonMaterial2.setPosition(100 + 220 * 1, 50);

        var buttonMaterial3 = new cc.MenuItemImage("res/button_materials_dock.png", "res/button_materials_dock.png", function () {

        }, this);
        buttonMaterial3.setPosition(100 + 220 * 2, 50);


        var menu001 = new cc.Menu(buttonMaterial,buttonMaterial2,buttonMaterial3);
        menu001.setPosition(0, 0);
        this.header.addChild(menu001);
/*
        this.fuelLabel = new cc.LabelTTF("0", "Meiryo", 26);
        this.fuelLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.fuelLabel);
        this.fuelLabel.setPosition(370, 105);
        this.fuelLabel.setAnchorPoint(1, 0.5);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_RIGHT;

        this.coinLabel = new cc.LabelTTF("0", "Meiryo", 26);
        this.coinLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.coinLabel);
        this.coinLabel.setAnchorPoint(1, 0.5);
        this.coinLabel.setPosition(590, 105);

        this.batteryGauge = new Gauge(120, 25, "");
        this.header.addChild(this.batteryGauge);
        this.batteryGauge.setPosition(28, 96);

        this.batteryIcon = cc.Sprite.create("res/icon_battery.png");
        this.header.addChild(this.batteryIcon);
        this.batteryIcon.setPosition(30,110);

        this.batteryAmountLabel = new cc.LabelTTF("00:00:00", "Arial", 22);
        this.batteryAmountLabel.setFontFillColor(new cc.Color(0, 255, 255, 255));
        this.header.addChild(this.batteryAmountLabel);
        this.batteryAmountLabel.setPosition(80, 70);
*/
    },
    init: function () {},
    update: function () {
/*
        var _rate  = 1 - this.game.storage.getBatteryAmountFromPastSecond() / 180;
        if(_rate >= 1){
            _rate = 1;
        }
        if(_rate <= 0){
            _rate = 0;
        }
        this.batteryGauge.update(_rate);
        this.fuelLabel.setString(this.game.storage.totalCoinAmount);
*/
        return true;
    },
    goTo001Layer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(MaterialsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    goTo002Layer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CreateLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    goTo003Layer: function (cardId) {
        //var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        //scene.addChild(ProfileLayer.create(this.storage, cardId));
        //cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
});