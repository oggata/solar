var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});
var PlanetsLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //画面サイズの取得
        this.storage = storage;
        this.windowName = "PlanetsLayer";
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
        this.header = cc.Sprite.create("res/header_owned_planets.png");
        this.header.setAnchorPoint(0, 0);
        this.viewSize = cc.director.getVisibleSize();
        this.header.setPosition(0, this.viewSize.height - 136);
        //this.header.setPosition(0, 1136 - 136);
        this.addChild(this.header);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, this.viewSize.height);
        this.infoNode.setAnchorPoint(0.5, 0.5);
        this.infoNode.setPosition(0, 0);
        this.infoNode.setOpacity(255 * 0.8);
        this.infoNode.setVisible(false);
        this.addChild(this.infoNode, 999999999);

        this.detail = new PlanetDetail(this);
        this.detail.setPosition(320, 600);
        this.infoNode.addChild(this.detail);

        //own planets
        this.planets = [];
        var keyCnt = Object.keys(this.storage.planetData).length;
        if (keyCnt == 0) {}
        for (var key in this.storage.planetData) {
            if (this.storage.planetData.hasOwnProperty(key)) {
                var value = this.storage.planetData[key];
                var _hoge = JSON.parse(value);
                this.planets.push(_hoge);
            }
        }
        this.createTable();
        return true;
    },
    createTable: function () {
        var tableView = cc.TableView.create(this, cc.size(640, this.viewSize.height - 136 - 136));
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
                var _planetId = this.planets[strValue].id;
                this.detail.setPlanet(_planetId);
            }, this);
            button.setPosition(600, 50);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
            //cell.addChild(menu001, 999999999);
            var _cardId = this.planets[strValue].id;
            var _name = CONFIG.PLANET[_cardId].name;
            var _description = CONFIG.PLANET[_cardId].description;
            var _genre = CONFIG.PLANET[_cardId].genre;
            var _image = CONFIG.PLANET[_cardId].image;
            var nameLabel = cc.LabelTTF.create(_name, "Helvetica", 22);
            nameLabel.setPosition(130, 86);
            nameLabel.setAnchorPoint(0, 0);
            nameLabel.setTag("nameLabel");
            this.spriteCell.addChild(nameLabel, 9999999);
            var descriptionLabel = cc.LabelTTF.create("xxxxxxxxxxxxx", "Helvetica", 22);
            descriptionLabel.setPosition(130, 54);
            descriptionLabel.setAnchorPoint(0, 0);
            descriptionLabel.setTag("descriptionLabel");
            this.spriteCell.addChild(descriptionLabel, 9999999);
            var countLabel = cc.LabelTTF.create("1/999999", "Helvetica", 22);
            countLabel.setPosition(130, 5);
            countLabel.setAnchorPoint(0, 0);
            countLabel.setTag("countLabel");
            this.spriteCell.addChild(countLabel, 9999999);
            this.planetImage = cc.Sprite.create(_image);
            this.planetImage.setAnchorPoint(0, 0);
            this.planetImage.setPosition(10, 10);
            this.planetImage.setScale(0.25, 0.25);
            cell.addChild(this.planetImage, 9999999);
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
        scene.addChild(ItemLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});
PlanetsLayer.create = function (storage, cardId) {
    return new PlanetsLayer(storage, cardId);
};
var PlanetsLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new PlanetsLayer(storage, cardId);
        this.addChild(layer);
    }
});