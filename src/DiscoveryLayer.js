var DiscoveryLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //画面サイズの取得
        this.storage = storage;
        this.addAlpha = 0.05;
        this.storage = new Storage();
        try {
            var _data = cc.sys.localStorage.getItem("gameStorage");
            if (_data == null) {
                cc.log("dataはnullなので新たに作成します.");
                var _getData = this.storage.getDataFromStorage();
                cc.sys.localStorage.setItem("gameStorage", _getData);
                var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                this.storage.setDataToStorage(JSON.parse(_acceptData));
            }
            if (_data != null) {
                var storageData = JSON.parse(cc.sys.localStorage.getItem("gameStorage"));
                if (storageData["saveData"] == true) {
                    cc.log("保存されたデータがあります");
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    cc.log(_acceptData);
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                } else {
                    cc.log("保存されたデータはありません");
                    var _getData = this.storage.getDataFromStorage();
                    cc.sys.localStorage.setItem("gameStorage", _getData);
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
            }
        } catch (e) {
            cc.log("例外..");
            cc.sys.localStorage.clear();
        }
        this.distanceNum = 143230;
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        //this.storage = storage;
        this.backNode = cc.Sprite.create("res/back_top.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);


this.setInfoWindow();

this.maxChargeTime = 60 * 3;


        
        this.labelTitle = cc.Sprite.create("res/label_title.png");
        this.labelTitle.setPosition(320, 600);
        this.addChild(this.labelTitle, 9999999);
        this.labelOpacity = 1;
        this.stopPowerX = 0.05;
        this.planets = [];
        this.baseNode = cc.Node.create();
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        //this.baseNode.setScale(0.5);
        this.isSetPlanet = false;
        this.battleWindowScale = 1;
        for (var i = 0; i < 600; i++) {
            var _x = this.getRandNumberFromRange(1, 10000);
            var _y = this.getRandNumberFromRange(1, 10000);
            this.planetSprite = cc.Sprite.create("res/start.png");
            this.baseNode.addChild(this.planetSprite);
            this.planetSprite.setPosition(_x, _y);
        }
        this.planetSprite = cc.Sprite.create("res/planet.png");
        this.baseNode.addChild(this.planetSprite);
        this.planetSprite.setPosition(5000, 5000);
        this.planets.push(this.planetSprite);
        this.planetName = cc.LabelTTF.create("ABCDE", "Arial", 38);
        this.planetName.setPosition(351 / 2, 351 / 2);
        this.planetName.setOpacity(255 * 0.7);
        this.planetSprite.addChild(this.planetName);
        this.planetDistance = cc.LabelTTF.create("1249595km", "Arial", 22);
        this.planetDistance.setPosition(351 / 2, 351 / 2 - 50);
        this.planetDistance.setOpacity(255 * 0.7);
        this.planetSprite.addChild(this.planetDistance);
        /*
                this.planetDistance = cc.LabelTTF.create("1249595km", "Arial", 22);
                this.planetDistance.setPosition(351/2, 351/2 - 50);
                this.planetDistance.setOpacity(255*0.7);
                this.planetSprite.addChild(this.planetDistance);
        */
        this.errorCnt = 0;
        this.error = cc.Sprite.create("res/error.png");
        this.error.setPosition(320, 500);
        this.addChild(this.error, 9999999);
        this.error.setVisible(false);

        this.errorLabel = new cc.LabelTTF("", "Arial", 28);
        this.errorLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.error.addChild(this.errorLabel);
        this.errorLabel.setPosition(320, 120);

        this.rocketSprite = cc.Sprite.create("res/sozai002.png");
        this.baseNode.addChild(this.rocketSprite, 999999999);
        this.rocketSprite.setPosition(5000, 5000);
        this.rocketSprite.basePlanet = this.planetSprite;
        for (var i = 0; i < 100; i++) {
            var _x = this.getRandNumberFromRange(1, 10000);
            var _y = this.getRandNumberFromRange(1, 10000);
            if (this.isCloseToPlanet(_x, _y, 500) == false) {
                this.planetSprite = cc.Sprite.create("res/planet.png");
                this.planetSprite.setOpacity(0.3 * 255);
                this.baseNode.addChild(this.planetSprite);
                this.planetSprite.setPosition(_x, _y);
            }
            this.planets.push(this.planetSprite);
            this.names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                'U', 'V', 'W', 'X', 'Y', 'Z'
            ];
            this.names.sort(this.shuffle);
            this.names.sort(this.shuffle);
            this.names.sort(this.shuffle);
            var _planetName = this.names[0] + this.names[1] + this.names[2] + this.names[3] + this.names[4];
            this.planetName = cc.LabelTTF.create(_planetName, "Arial", 38);
            this.planetName.setPosition(351 / 2, 351 / 2);
            this.planetName.setOpacity(255 * 0.7);
            this.planetSprite.addChild(this.planetName);
            var _distance = this.getRandNumberFromRange(10000, 99999999);
            this.planetDistance = cc.LabelTTF.create(_distance + "km", "Arial", 22);
            this.planetDistance.setPosition(351 / 2, 351 / 2 - 50);
            this.planetDistance.setOpacity(255 * 0.7);
            this.planetSprite.addChild(this.planetDistance);
        }
        
        this.dx = 0;
        this.dy = 0;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchStart(touches[0].getLocation());
            },
            onTouchesMoved: function (touches, event) {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchMove(touches[0].getLocation());
            },
            onTouchesEnded: function (touches, event) {
                event.getCurrentTarget().touchFinish(touches[0].getLocation());
            }
        }), this);
        this.scheduleUpdate();
        return true;
    },
    getPastSecond2: function () {
        var diffSecond = this.storage.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },

    setInfoWindow:function(){
        this.infoWindow = cc.Sprite.create("res/info.png");
        //this.infoWindow.setAnchorPoint(0, 0);
        this.infoWindow.setPosition(320, 1040);
        this.addChild(this.infoWindow);
        this.fuelLabel = cc.LabelTTF.create("123 / 143", "Arial", 25);
        this.fuelLabel.setPosition(120, 160);
        this.fuelLabel.setAnchorPoint(0, 1);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.infoWindow.addChild(this.fuelLabel);
        //this.fuelLabel.setAnchorPoint(0, 1);
        this.levelLabel = cc.LabelTTF.create("12", "Arial", 25);
        this.levelLabel.setPosition(120, 105);
        this.levelLabel.setAnchorPoint(0, 1);
        this.levelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.infoWindow.addChild(this.levelLabel);
        this.planetCntLabel = cc.LabelTTF.create("1 / 12312234", "Arial", 25);
        this.planetCntLabel.setPosition(620, 50);
        this.planetCntLabel.setAnchorPoint(1, 1);
        this.planetCntLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.infoWindow.addChild(this.planetCntLabel);
        this.distanceLabel = cc.LabelTTF.create("123242343km", "Arial", 25);
        this.distanceLabel.setPosition(620, 105);
        this.distanceLabel.setAnchorPoint(1, 1);
        this.distanceLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.infoWindow.addChild(this.distanceLabel);




        this.timeLabel = new cc.LabelTTF("00:00:00", "Arial", 18);
        this.timeLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.infoWindow.addChild(this.timeLabel);
        this.timeLabel.setPosition(450, 145);

        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        } else {
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");

        this.timeGauge = new TimeGauge(this);
        this.timeGauge.setPosition(470, 145);
        this.timeGauge.setScale(0.4);
        this.infoWindow.addChild(this.timeGauge);
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
        coinButton.setPosition(560, 140);
        var menu001 = new cc.Menu(coinButton);
        menu001.setPosition(0, 0);
        this.infoWindow.addChild(menu001);
    },

    isCloseToPlanet: function (_x, _y, _dist) {
        for (var i = 0; i < this.planets.length; i++) {
            if (this.planets[i] != this.rocketSprite.basePlanet) {
                var _distance = Math.sqrt(
                    (_x - this.planets[i].getPosition().x * this.battleWindowScale) * (_x - this.planets[i].getPosition().x * this
                        .battleWindowScale) + (_y - this.planets[i].getPosition().y * this.battleWindowScale) * (_y - this.planets[i]
                        .getPosition().y * this.battleWindowScale));
                if (_distance <= _dist) {
                    return true;
                }
            }
        }
        return false;
    },
    setTargetTime: function () {
        //if(this.storage.targetTime == null){
        this.storage.targetTime = parseInt(new Date() / 1000) + this.maxChargeTime;
        this.storage.saveCurrentData();
        //}
    },
    update: function (dt) {
        this.timeGauge.update();
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        this.distanceLabel.setString(this.distanceNum + "km");
        /*
                this.header.userCntLabel.setString("x " + this.storage.users.length);
                this.header.treasureCntLabel.setString("x " + this.storage.treasureAmount);
                this.coinAmountLabel.setString("FUEL : 1 / " + this.storage.totalCoinAmount);
        */

        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        } else {
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");

        if (this.dx != 0 || this.dy != 0) {
            this.labelOpacity -= 0.05;
            if (this.labelOpacity <= 0) {
                this.labelOpacity = 0;
                this.labelTitle.setOpacity(this.labelOpacity * 255);
            }
        }
        if (this.isCloseToPlanet(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y, 100) == true) {
            this.stopPowerX = 0.78;
        } else {
            this.stopPowerX = 0.05;
        }
        if (Math.abs(this.dx) > 1) {
            if (this.dx > 0) {
                this.dx -= this.stopPowerX;
            } else {
                this.dx += this.stopPowerX;
            }
            this.distanceNum += 1;
        } else {
            this.dx = 0;
        }
        if (Math.abs(this.dy) > 1) {
            if (this.dy > 0) {
                this.dy -= this.stopPowerX;
            } else {
                this.dy += this.stopPowerX;
            }
            this.distanceNum += 1;
        } else {
            this.dy = 0;
        }
        if (this.isCloseToPlanet(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y, 100) == true) {
            if (this.dx == 0 && this.dy == 0) {
                this.goToFieldLayer();
            }
        }
        this.rocketSprite.setPosition(this.rocketSprite.getPosition().x + this.dx, this.rocketSprite.getPosition().y +
            this.dy);
        this.baseNode.setPosition(320 - this.rocketSprite.getPosition().x, 480 - this.rocketSprite.getPosition().y);
    },
    touchStart: function (location) {
        this.fromP = cc.p(location.x, location.y);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
    },
    touchMove: function (location) {
        this.removeChild(this.drawNode);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
        this.toP = cc.p(location.x, location.y);
        this.drawNode.drawSegment(this.fromP, this.toP, this.lineWidth, this.lineColor);
    },
    touchFinish: function (location) {
        //launch
        this.dx = (this.fromP.x - this.toP.x) / 20;
        this.dy = (this.fromP.y - this.toP.y) / 20;
        this.removeChild(this.drawNode);
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    goToTopLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(TopLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    //シーンの切り替え----->
    goToFieldLayer: function (typeText, isCom) {
        if (this.isSetPlanet == true) return;
        this.isSetPlanet = true;
        //playSE_Button(this.storage);
        var scene = cc.Scene.create();
        scene.addChild(PlanetLayer.create(this.storage, typeText, isCom));
        cc.director.runScene(cc.TransitionFadeTR.create(0.5, scene));
    },
    //シーンの切り替え----->
    goToStageLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFadeTR.create(1.5, scene));
    },
    goToDiscoveryLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFadeTR.create(0.3, scene));
    },
    goToBattleLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(BattleLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFadeTR.create(1, scene));
    },
});
DiscoveryLayer.create = function (storage, cardId) {
    return new DiscoveryLayer(storage, cardId);
};
var DiscoveryLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new DiscoveryLayer(storage, cardId);
        this.addChild(layer);
    }
});