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


        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        //this.storage = storage;
        this.backNode = cc.Sprite.create("res/back_top.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);



        this.labelTitle = cc.Sprite.create("res/label_title.png");
        this.labelTitle.setPosition(320, 600);
        this.addChild(this.labelTitle,9999999);
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

        this.rocketSprite = cc.Sprite.create("res/sozai002.png");
        this.baseNode.addChild(this.rocketSprite,999999999);
        this.rocketSprite.setPosition(5000, 5000);
        this.rocketSprite.basePlanet = this.planetSprite;

        for (var i = 0; i < 100; i++) {
            var _x = this.getRandNumberFromRange(1, 10000);
            var _y = this.getRandNumberFromRange(1, 10000);
            if (this.isCloseToPlanet(_x, _y, 500) == false) {
                this.planetSprite = cc.Sprite.create("res/planet.png");
                this.planetSprite.setOpacity(0.3*255);
                this.baseNode.addChild(this.planetSprite);
                this.planetSprite.setPosition(_x, _y);
            }
            this.planets.push(this.planetSprite);
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
    isCloseToPlanet: function (_x, _y, _dist) {
        for (var i = 0; i < this.planets.length; i++) {
            if(this.planets[i] != this.rocketSprite.basePlanet) {
                var _distance = Math.sqrt(
                    (_x - this.planets[i].getPosition().x * this.battleWindowScale) * (_x - this.planets[i].getPosition().x * this.battleWindowScale) +
                    (_y - this.planets[i].getPosition().y * this.battleWindowScale) * (_y - this.planets[i].getPosition().y * this.battleWindowScale)
                );
                if (_distance <= _dist) {
                    return true;
                }
            }
        }
        return false;
    },
    update: function (dt) {

if(this.dx != 0 || this.dy != 0){
    this.labelOpacity -= 0.05;
    if(this.labelOpacity <= 0){
        this.labelOpacity = 0;
        this.labelTitle.setOpacity(this.labelOpacity * 255);
    }
}

        if (this.isCloseToPlanet(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y, 200) == true) {
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
        } else {
            this.dx = 0;
        }
        if (Math.abs(this.dy) > 1) {
            if (this.dy > 0) {
                this.dy -= this.stopPowerX;
            } else {
                this.dy += this.stopPowerX;
            }
        } else {
            this.dy = 0;
        }


if (this.isCloseToPlanet(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y, 200) == true) {
    if(this.dx == 0 && this.dy == 0){
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
        if(this.isSetPlanet == true) return ;
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