var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});
var MissionsLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //画面サイズの取得
        this.storage = storage;
        this.windowName = "MissionsLayer";
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
        this.backNode = cc.Sprite.create("res/back_top2.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);
        this.header = cc.Sprite.create("res/header_owned_mission.png");
        this.header.setAnchorPoint(0, 0);
        this.header.setPosition(0, 1136 - 136);
        this.addChild(this.header);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.infoNode.setAnchorPoint(0.5, 0.5);
        this.infoNode.setPosition(0, 0);
        this.infoNode.setOpacity(255 * 0.8);
        this.infoNode.setVisible(false);
        this.addChild(this.infoNode, 999999999);
        this.detail = new PlanetDetail(this);
        this.detail.setPosition(320, 600);
        this.infoNode.addChild(this.detail);
        this.planets = [];
        /*
        var keyCnt = Object.keys(this.storage.planetData).length;
        if (keyCnt == 0) {}
        for (var key in this.storage.planetData) {
            if (this.storage.planetData.hasOwnProperty(key)) {
                var value = this.storage.planetData[key];
                var _hoge = JSON.parse(value);
                this.planets.push(_hoge);
            }
        }
        */
        for (var i = 1; i < CONFIG.MISSION.length; i++) {
            cc.log(CONFIG.MISSION[i]);
            //var _hoge = JSON.parse(CONFIG.MISSION[i]);
            this.planets.push(CONFIG.MISSION[i]);
        }
        this.createTable();
        return true;
    },
    createTable: function () {
        var tableView = cc.TableView.create(this, cc.size(640, 1136 - 136 - 136));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(0, 136);
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();
    },
    tableCellSizeForIndex: function (table, idx) {
        return cc.size(640, 122);
    },
    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            this.spriteCell = cc.Sprite.create("res/table_cell.png");
            this.spriteCell.setAnchorPoint(0, 0);
            this.spriteCell.setPosition(0, 0);
            cell.addChild(this.spriteCell, 9999999);
            var button = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
                this.infoNode.setVisible(true);
                var _planetId = this.planets[strValue].planetId;
                this.detail.setPlanet(_planetId);
            }, this);
            button.setPosition(600, 50);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
            cell.addChild(menu001, 999999999);
            var _cardId = this.planets[strValue].id;
            var _name = CONFIG.MISSION[_cardId].name;
            var nameLabel = cc.LabelTTF.create(_name, "Helvetica", 22);
            nameLabel.setPosition(130, 86);
            nameLabel.setAnchorPoint(0, 0);
            nameLabel.setTag("nameLabel");
            this.spriteCell.addChild(nameLabel, 9999999);
        }
        return cell;
    },
    numberOfCellsInTableView: function (table) {
        return this.planets.length;
    },
    update: function (dt) {},
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    goToDiscoveryLayer1: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
    goToDiscoveryLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
    goToItemLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(MissionsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});
MissionsLayer.create = function (storage, cardId) {
    return new MissionsLayer(storage, cardId);
};
var MissionsLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new MissionsLayer(storage, cardId);
        this.addChild(layer);
    }
});