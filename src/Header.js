var Header = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.header = cc.Sprite.create("res/header_owned_top.png");
        this.addChild(this.header);

        this.fuelLabel = new cc.LabelTTF("0", "Meiryo", 26);
        this.fuelLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.fuelLabel);
        this.fuelLabel.setPosition(370, 105);
        this.fuelLabel.setAnchorPoint(1, 0.5);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_RIGHT;

        this.crystalLabel = new cc.LabelTTF("1110", "Meiryo", 26);
        this.crystalLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.crystalLabel);
        this.crystalLabel.setAnchorPoint(1, 0.5);
        this.crystalLabel.setPosition(590, 105);

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
    },
    init: function () {},
    update: function () {
        var _rate  = 1 - this.game.storage.getBatteryAmountFromPastSecond() / CONFIG.MAX_CHARGE_TIME;
        if(_rate >= 1){
            _rate = 1;
        }
        if(_rate <= 0){
            _rate = 0;
        }
        this.batteryGauge.update(_rate);
        this.fuelLabel.setString(this.game.storage.totalCoinAmount);
        this.crystalLabel.setString(this.game.storage.crystalAmount);
        return true;
    },
});