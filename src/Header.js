var Header = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.header = cc.Sprite.create("res/header_owned_top.png");
        //this.back2.setAnchorPoint(0, 0);
this.addChild(this.header);



this.fuelLabel = new cc.LabelTTF("11", "Meiryo", 26);
        this.fuelLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.fuelLabel);
        this.fuelLabel.setPosition(370, 105);
        this.fuelLabel.setAnchorPoint(1, 0.5);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.coinLabel = new cc.LabelTTF("11", "Meiryo", 26);
        this.coinLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.header.addChild(this.coinLabel);
        this.coinLabel.setAnchorPoint(1, 0.5);
        this.coinLabel.setPosition(590, 105);




        this.timeLabel = new cc.LabelTTF("00:00:00", "Arial", 18);
        this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.header.addChild(this.timeLabel);
        this.timeLabel.setPosition(510, 50);
        //this.timeLabel.setString("残り" + this.pastSecond + "秒");
        this.timeGauge = new TimeGauge(this);
        this.timeGauge.setPosition(510, 50);
        this.timeGauge.setScale(0.4);
        this.header.addChild(this.timeGauge);
        var coinButton = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
            if (this.game.fuelPastSecond >= 1) {
                this.game.errorLabel.setString("" + this.game.fuelPastSecond + "秒で1クリスタルに変換できます.");
                this.game.error.setVisible(true);
                this.game.errorCnt = 1;
            } else {
                this.game.storage.addCoin(1);
                this.game.setTargetTime();
            }
        }, this);
        coinButton.setPosition(600, 50);
        var menu001 = new cc.Menu(coinButton);
        menu001.setPosition(0, 0);
        this.header.addChild(menu001);
        /*
        //this.addChild(this.back2);
        this.treasureCntLabel = new cc.LabelTTF("1000", "Arial", 22);
        this.treasureCntLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.treasureCntLabel.setAnchorPoint(1, 0);
        //this.back2.addChild(this.treasureCntLabel);
        this.treasureCntLabel.setPosition(620, 90);
        this.userCntLabel = new cc.LabelTTF("x322", "Arial", 22);
        this.userCntLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.userCntLabel.setAnchorPoint(1, 0);
        //this.back2.addChild(this.userCntLabel);
        this.userCntLabel.setPosition(620, 32);
        if (this.game.layerType == "HOME") {
            var battleButton = new cc.MenuItemImage("res/button_battle.png", "res/button_battle_on.png", function () {
                this.game.goToBattleLayer();
            }, this);
            battleButton.setPosition(120, 24);
            var menu001 = new cc.Menu(battleButton);
            menu001.setPosition(0, 0);
            this.back2.addChild(menu001);
        }
        if (this.game.layerType == "BATTLE") {
            var homeButton = new cc.MenuItemImage("res/button_home.png", "res/button_home_on.png", function () {
                this.game.goToHomeLayer();
            }, this);
            homeButton.setPosition(120, 24);
            var menu001 = new cc.Menu(homeButton);
            menu001.setPosition(0, 0);
            this.back2.addChild(menu001);
        }
        */
    },
    init: function () {},
    update: function () {
        return true;
    },
});