var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});
var SpaceListLayer = cc.Layer.extend({
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
        this.createTable();
        return true;
    },
    createTable: function () {
        //var winSize = cc.Director.getInstance().getWinSize();
        var tableView = cc.TableView.create(this, cc.size(640, 1030));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(0, 0);
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();
    },
    tableCellSizeForIndex: function (table, idx) {
        return cc.size(640, 250);
    },
    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            this.spriteCell = cc.Sprite.create("res/space_list.png");
            this.spriteCell.setAnchorPoint(0, 0);
            this.spriteCell.setPosition(0, 0);
            cell.addChild(this.spriteCell, 9999999);

            var _material = new Material(this, 1, 1, true);
            _material.setPosition(60, 50);
            _material.amount = 0;
            _material.setAmount();
            //this.materials.push(_material);
            this.spriteCell.addChild(_material, 999999);

            var _label = CONFIG.CARD[strValue];
//cc.log(_label);

label = cc.LabelTTF.create("xxx", "Helvetica", 32);
            label.setPosition(150, 30);
            label.setAnchorPoint(0, 0);
            label.setTag("comment");
            this.spriteCell.addChild(label);
            /*
                        label = cc.LabelTTF.create("x123", "Helvetica", 15);
                        label.setPosition(50,0);
                        label.setAnchorPoint(0,0);
                        label.setTag("comment");
                        cell.addChild(label);
            */
        } else {
            label = this.spriteCell.getChildByTag("comment");
            var _label = CONFIG.CARD[strValue];
//cc.log(_label.name);

            //var _label = CONFIG.CARD[idx]["name"];
            label.setString("xxx");
        }
        return cell;
    },
    numberOfCellsInTableView: function (table) {
        //return responses.length;
        return 20;
    },
    update: function (dt) {},
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
    goToGameLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
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
    initializeWarpAnimation: function () {
        this.image = "res/starburst.png";
        this.itemWidth = 640;
        this.itemHeight = 480;
        this.widthCount = 2;
        this.heightCount = 5;
        this.effectInterval = 0.05;
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
        this.sprite.setPosition(320, 1136 / 2 - 50);
        this.sprite.setScale(2.5, 2.5);
        this.sprite.setOpacity(255 * 0);
        this.addChild(this.sprite);
    },
});
SpaceListLayer.create = function (storage, cardId) {
    return new SpaceListLayer(storage, cardId);
};
var SpaceListLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new SpaceListLayer(storage, cardId);
        this.addChild(layer);
    }
});