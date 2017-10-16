var CardLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
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
        this.baseNode = cc.LayerColor.create(new cc.Color(17, 31, 62, 255), 640, 1136);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);


/*
        var _rootPlanetNum = this.storage.getBasePlanetId(CONFIG.CARD[1]);
        var _planet = CONFIG.PLANET[_rootPlanetNum];
*/


        //var _rand = this.getRandNumberFromRange(1, 13);
        var _card = CONFIG.PLANET[1];
        this.cardPosY = 1500;
        this.card = cc.Sprite.create("res/card_location_001.png");
        this.baseNode.addChild(this.card);
        this.card.setPosition(320, this.cardPosY);
        this.labelSprite = cc.Sprite.create("res/label_get_a_normal_card.png");
        this.labelSprite.setPosition(320, 400);
        this.labelSprite.setOpacity(0);
        this.cardGetTime = 1;
        this.backCardActionOpacity = 0;
        this.cardWaitTime = 0;
        this.initializeWalkAnimation();
        this.timeCnt = 0;
        this.scheduleUpdate();



        var _rootPlanetNum = this.storage.getBasePlanetId(CONFIG.CARD[1]);
        var _rootPlanet = CONFIG.PLANET[_rootPlanetNum];
        //到着する惑星をsetする
        cc.log("-------------->");
        //cc.log(_planet);
        this.nextPlanetId = 1;
        if(_rootPlanet){
            cc.log(_rootPlanet.id);
            _planetBranchList = this.storage.getConnectedPlanets();
            cc.log(_planetBranchList);
            var _branchList = _planetBranchList[_rootPlanet.id];
            _branchList.sort(this.shuffle);
            /*
            for (var i = 0; i < _branchList.length; i++) {
                cc.log( _branchList[i]);
            }*/
            this.nextPlanetId = _branchList[0];
        }



        //var _rand = this.getRandNumberFromRange(1, 15);
        this.storage.savePlanetDataToStorage(CONFIG.PLANET[this.nextPlanetId], 1);
        this.planetSprite = cc.Sprite.create(CONFIG.PLANET[this.nextPlanetId].image);
        this.card.addChild(this.planetSprite);
        this.planetSprite.setPosition(180, 270);
        //var _planetId = 1;
        var _dx = 0;
        var _dy = 0;
        var _time = 0;
        var _basePlanetId = this.nextPlanetId;
        var _destinationPlanetId = 0;
        this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST",
            1);
        return true;
    },
    update: function (dt) {
        this.timeCnt++;
        if (this.timeCnt >= 30 * 4.2) {
            this.timeCnt = 0;
            this.goToStageLayer();
        }
        if (1 <= this.cardGetTime && this.cardGetTime < 30 * 5) {
            this.cardGetTime++;
            this.backCardActionOpacity += 0.05;
            if (this.backCardActionOpacity >= 1) {
                this.backCardActionOpacity = 1;
            }
            this.setCardMotion();
        }
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
        this.sprite.setPosition(320, 1136 / 2);
        this.sprite.setScale(2.5, 2.5);
        this.baseNode.addChild(this.sprite);
    },
    setCardMotion: function () {
        this.card.setOpacity(1 * 255);
        if (this.card.getPosition().y > 1200) {
            this.cardPosY -= 10;
        }
        if (this.card.getPosition().y <= 1200) {
            this.cardWaitTime++;
            if (30 * 1 < this.cardWaitTime) {
                if (600 <= this.card.getPosition().y && this.card.getPosition().y <= 1200) {
                    this.cardPosY -= 55;
                    this.labelSprite.setOpacity(255 * 1);
                }
            }
        }
        this.card.setPosition(320, this.cardPosY);
    },
    resetCardMotion: function () {
        this.labelSprite.setOpacity(0);
        this.card.setOpacity(1 * 255);
        this.cardWaitTime = 0;
        this.cardPosY = 1500;
        this.card.setPosition(320, this.cardPosY);
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
    goToStageLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    goToCardLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
    },
    goToBattleLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(BattleLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionSlideInR.create(1, scene));
    },
    goToFieldLayer: function (hackingType) {
        var scene = cc.Scene.create();
        scene.addChild(FieldLayer.create(this.storage, hackingType));
        cc.director.runScene(cc.TransitionFlipY.create(0.5, scene));
    }
});
CardLayer.create = function (storage, cardId) {
    return new CardLayer(storage, cardId);
};
var CardLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new CardLayer(storage, cardId);
        this.addChild(layer);
    }
});