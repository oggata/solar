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
        //var _rand = this.getRandNumberFromRange(1, 13);
        var _card = CONFIG.PLANET[1];
        this.card = cc.Sprite.create("res/card_location_001.png");
        this.baseNode.addChild(this.card);
        this.card.setPosition(320, 550);
        this.cardScale = 0.001;

        this.cardGetTime = 1;
        this.backCardActionOpacity = 0;
        this.cardWaitTime = 0;
        this.initializeWalkAnimation();
        this.timeCnt = 0;
        this.scheduleUpdate();

        var _basePlanetNum = this.storage.getShipParamByName("basePlanetId");
        var _rootPlanet = CONFIG.PLANET[_basePlanetNum];
        this.nextPlanetId = 1;
        if (_rootPlanet) {
            _planetBranchList = this.storage.getConnectedPlanets();
            cc.log(_planetBranchList);
            var _branchList = _planetBranchList[_basePlanetNum];
            _branchList.sort(this.shuffle);
            this.nextPlanetId = _branchList[0];
        }

        //このカードを持っているか調べる
        var _isOwnPlanet = this.storage.isOwnPlanetData(CONFIG.PLANET[this.nextPlanetId]);
        //cc.log(_isOwnPlanet);
        if(_isOwnPlanet == true){
            this.labelSprite = cc.Sprite.create("res/label_get_card.png");
        }else{
            this.labelSprite = cc.Sprite.create("res/label_get_newcard.png");
        }
        this.labelSprite.setPosition(320, 540);
        this.labelSprite.setOpacity(0);
        this.baseNode.addChild(this.labelSprite);

        this.storage.savePlanetDataToStorage(CONFIG.PLANET[this.nextPlanetId], 1);
        this.planetSprite = cc.Sprite.create(CONFIG.PLANET[this.nextPlanetId].image);
        this.card.addChild(this.planetSprite);

       this.storage.saveShipDataToStorage(0, 0, 0, this.nextPlanetId, "NO_DIST", 0, _basePlanetNum, this.nextPlanetId);
        return true;
    },
    update: function (dt) {
        this.timeCnt++;
        if (this.timeCnt >= 30 * 4.2) {
            this.timeCnt = 0;
            this.goToItemLayer();
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
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth, this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setPosition(320, 1136 / 2);
        this.sprite.setScale(2.5, 2.5);
        this.baseNode.addChild(this.sprite);
    },
    setCardMotion: function () {
        this.card.setOpacity(1 * 255);
        this.cardScale += 0.01;
        this.planetSprite.setScale(this.cardScale);
        this.cardWaitTime++;
        if (30 * 1.5 < this.cardWaitTime) {
            this.labelSprite.setOpacity(255 * 1);
        }
    },
    resetCardMotion: function () {
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
    goToItemLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(MissionsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
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