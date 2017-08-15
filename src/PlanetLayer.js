var item001Cnt = 0;
var isCancelAd = false;
var isFailedAd = false;
var PlanetLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage) {
        this._super();
        this.layerType = "HOME";
        this.selectedCardNum = 1;
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.storage = storage;
        this.storage.isSteal = false;
        this.status = "gaming";
/*
        this.baseNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
*/
        this.baseNode = cc.Sprite.create("res/back_top.png");
        this.baseNode.setAnchorPoint(0,0);
        this.baseNode.setPosition(0,0);
        this.addChild(this.baseNode);

        this.inputNode = cc.Node.create();
        this.inputNode.setPosition(0, -150);
        this.addChild(this.inputNode);

        //this.pngCristal = cc.Sprite.create("res/cristal.png");
        //this.pngCristal.setPosition(280,350);
        //this.inputNode.addChild(this.pngCristal);

        //惑星を表示する
        this.planet = cc.Sprite.create("res/planet.png");
        this.planet.setPosition(320, 600);
        this.baseNode.addChild(this.planet);
        this.planetScale = 1;

        this.planetInfo = cc.Sprite.create("res/planet_info.png");
        this.planetInfo.setPosition(320,700);
        this.inputNode.addChild(this.planetInfo);

        //メッセージの制御
        this.messageLabel = cc.LabelTTF.create("", "Arial", 22);
        this.messageLabel.setPosition(70, 350);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.planetInfo.addChild(this.messageLabel);
        this.messageLabel.setAnchorPoint(0, 1);
        this.message = "名称: AOXP-12345！\n所有者: なし\n成功目標: 25%以上の探索\n敵対反応: あり\n採掘できる鉱物: 銅、ニッケル、鉄など";
        this.messageTime = 0;
        this.visibleStrLenght = 0;

        this.launchCnt = 0;

        var backButton = new cc.MenuItemImage("res/button_home.png", "res/button_home.png", function () {
            this.goToListLayer();
        }, this);
        backButton.setPosition(150, 1240);

        var launchButton = new cc.MenuItemImage("res/button_get_card.png", "res/button_get_card_on.png", function () {

            this.launchCnt = 1;

            this.sprite.setOpacity(255*4);
            /*
            if (this.storage.totalCoinAmount <= 0) {
                this.errorLabel.setString("クリスタルが不足しています.");
                this.error.setVisible(true);
                this.errorCnt = 1;
            } else {
                this.storage.totalCoinAmount -= 1;
                //var _rand = this.getRandNumberFromRange(1, 6);
                //var _card = CONFIG.CARD[_rand];
                //this.storage.saveCreatureDataToStorage(_card);
                this.goToGameLayer();
            }
            */
        }, this);
        launchButton.setPosition(320, 340);

        var coinButton = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
            if (this.pastSecond >= 1) {
                this.errorLabel.setString("" + this.pastSecond + "秒で1クリスタルに変換できます.");
                this.error.setVisible(true);
                this.errorCnt = 1;
            } else {
                this.setTargetTime();
                this.storage.addCoin(1);
            }
        }, this);
        coinButton.setPosition(520, 450);

        var battleBit = new cc.MenuItemImage("res/button_bit.png", "res/button_bit.png", function () {
            this.goToCreditLayer();
        }, this);
        battleBit.setPosition(550, 50);
        var battleButton = new cc.MenuItemImage("res/button_battle.png", "res/button_battle_on.png", function () {
            this.goToBattleLayer();
        }, this);
        battleButton.setPosition(120, 1000);
        var debugButton = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.goToFieldLayer("GREEN");
        }, this);
        debugButton.setPosition(100, 100);
        var debugButton2 = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            cc.sys.localStorage.clear();
        }, this);
        debugButton2.setPosition(100, 50);
        var menu001 = new cc.Menu(launchButton, coinButton, debugButton, debugButton2,backButton);
        menu001.setPosition(0, 0);
        this.inputNode.addChild(menu001);
        this.coinAmountLabel = new cc.LabelTTF("x " + this.storage.totalCoinAmount, "Arial", 24);
        this.coinAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.coinAmountLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.inputNode.addChild(this.coinAmountLabel);
        this.coinAmountLabel.setAnchorPoint(0.5, 0.5);
        this.coinAmountLabel.setPosition(320, 410);
        this.timeLabel = new cc.LabelTTF("00:00:00", "Arial", 20);
        this.timeLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        //this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        //this.inputNode.addChild(this.timeLabel);
        this.timeLabel.setPosition(320, 450);

        this.playerNameLabel = new cc.LabelTTF(this.storage.playerName, "Arial", 18);
        this.playerNameLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.addChild(this.playerNameLabel);
        this.playerNameLabel.setPosition(320, 670);
        this.targetTime = 0;
        this.maxChargeTime = 60 * 3;

        this.timeGauge = new TimeGauge(this);
        this.timeGauge.setPosition(320, 450);
        this.timeGauge.setScale(0.55);
        this.inputNode.addChild(this.timeGauge);

        this.errorCnt = 0;
        this.error = cc.Sprite.create("res/error.png");
        this.error.setPosition(320, 500);
        this.addChild(this.error, 9999999);
        this.error.setVisible(false);
        this.errorLabel = new cc.LabelTTF("", "Arial", 28);
        this.errorLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.error.addChild(this.errorLabel);
        this.errorLabel.setPosition(320, 120);
        this.header = new Header(this);
        this.addChild(this.header);
        this._time = 0;
        this.scheduleUpdate();

        this.initializeWalkAnimation();
        return true;
    },
    update: function (dt) {
        //発射
        if(this.launchCnt >= 1){
            this.launchCnt++;
            this.planetScale += 0.05;
            this.planet.setScale(this.planetScale);


            if(this.launchCnt >= 30 * 1){
                this.launchCnt = 0;
                this.goToGameLayer();
            }
        }

        //メッセージ表示の管理
        this.messageTime++;
        if (this.messageTime >= 1) {
            this.messageTime = 0;
            this.visibleStrLenght++;
        }
        if (this.visibleStrLenght > this.message.length) {
            this.visibleStrLenght = this.message.length;
        }
        var _visibleString = this.message.substring(0, this.visibleStrLenght);
        this.messageLabel.setString(_visibleString);

        this.timeGauge.update();
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        if (this.storage.isSteal == true) {
            this.goToFieldLayer("RED");
        }
        this.header.userCntLabel.setString("x " + this.storage.users.length);
        this.header.treasureCntLabel.setString("x " + this.storage.treasureAmount);
        this.coinAmountLabel.setString("FUEL : 1 / " + this.storage.totalCoinAmount);

        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }else{
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");
    },

    initializeWalkAnimation: function () {
        this.image = "res/starburst.png";
        this.itemWidth = 640;
        this.itemHeight = 480;
        this.widthCount = 2;
        this.heightCount = 5;
        this.effectInterval = 0.1;
        this.effectTime = 0;

        var frameSeq = [];
        for (var i = 0; i < this.heightCount; i++) {
            for (var j = 0; j < this.widthCount; j++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth,
                    this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        //this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setPosition(320,1136/2 - 50);
        this.sprite.setScale(2.5,2.5);
        this.sprite.setOpacity(255*0);
        this.baseNode.addChild(this.sprite);
    },


    setTargetTime: function () {
        //if(this.storage.targetTime == null){
        this.storage.targetTime = parseInt(new Date() / 1000) + this.maxChargeTime;
        this.storage.saveCurrentData();
        //}
    },
    getPastSecond2: function () {
        var diffSecond = this.storage.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    touchStart: function (location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
    },
    touchMove: function (location) {},
    touchFinish: function (location) {},
    //シーンの切り替え----->
    goToListLayer: function (pSender) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        scene.addChild(ListLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFadeTR.create(0.5, scene));
    },

    goToGameLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(0.3, scene));
    },

    showInfo: function (text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },
    admobInit: function () {
        if ('undefined' == typeof (sdkbox)) {
            isFailedAd = true;
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof (sdkbox.PluginAdMob)) {
            isFailedAd = true;
            this.showInfo('sdkbox.PluginAdMob is undefined')
            return;
        }
        var self = this
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function (name) {
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function (name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            },
            adViewWillPresentScreen: function (name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function (name) {
                isCancelAd = true;
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function (name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function (name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
                if (name == "gameover") {
                    sdkbox.PluginAdMob.hide("gameover");
                    item001Cnt = 1;
                }
            }
        });
        sdkbox.PluginAdMob.init();
        // just for test
        var plugin = sdkbox.PluginAdMob
        if ("undefined" != typeof (plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    }
});
PlanetLayer.create = function (storage) {
    return new PlanetLayer(storage);
};
var PlanetLayerScene = cc.Scene.extend({
    onEnter: function (storage) {
        this._super();
        var layer = new PlanetLayer(storage);
        this.addChild(layer);
    }
});
