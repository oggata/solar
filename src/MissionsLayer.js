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
        this.header.setAnchorPoint(0,0);
        this.header.setPosition(0, 1136-136);
        this.addChild(this.header);

this.footer = new Footer(this);
this.addChild(this.footer);

this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
this.infoNode.setAnchorPoint(0.5, 0.5);
this.infoNode.setPosition(0, 0);
this.infoNode.setOpacity(255*0.8);
this.infoNode.setVisible(false);
this.addChild(this.infoNode,999999999);

        this.uiPlanetsDetail = cc.Sprite.create("res/ui_mission_detail.png");
        this.uiPlanetsDetail.setPosition(320, 550);
        this.infoNode.addChild(this.uiPlanetsDetail);
        //this.uiPlanetsDetail.setVisible(false);
        var buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.infoNode.setVisible(false);
        }, this);
        buttonCancel.setPosition(160, 40);
        var buttonSearch = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            this.goToDiscoveryLayer();
        }, this);
        buttonSearch.setPosition(460, 40);
        var menu001 = new cc.Menu(buttonCancel, buttonSearch);
        menu001.setPosition(0, 0);
        this.uiPlanetsDetail.addChild(menu001);

        this.planets = [];
        var keyCnt = Object.keys(this.storage.planetData).length;
        if (keyCnt == 0) {}
        for (var key in this.storage.planetData) {
            if (this.storage.planetData.hasOwnProperty(key)) {
                var value = this.storage.planetData[key];
                //cc.log(JSON.parse(value));
                var _hoge = JSON.parse(value);
                //cc.log(_hoge.image);
                this.planets.push(_hoge);
            }
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
        //cc.log(">>>");
        //cc.log(strValue);
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
            }, this);
            button.setPosition(600, 50);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
            cell.addChild(menu001, 999999999);

            var _cardId = this.planets[strValue].id;
            var _name = CONFIG.PLANET[_cardId].name;
            var _description = CONFIG.PLANET[_cardId].description;
            var _genre = CONFIG.PLANET[_cardId].genre;
            var _image = CONFIG.PLANET[_cardId].image;
            _image = "res/planet_w350_mission.png";

            var nameLabel = cc.LabelTTF.create(_name, "Helvetica", 22);
            nameLabel.setPosition(130,86);
            nameLabel.setAnchorPoint(0, 0);
            nameLabel.setTag("nameLabel");
            this.spriteCell.addChild(nameLabel,9999999);

            var descriptionLabel = cc.LabelTTF.create("xxxxxxxxxxxxx", "Helvetica", 22);
            descriptionLabel.setPosition(130,54);
            descriptionLabel.setAnchorPoint(0, 0);
            descriptionLabel.setTag("descriptionLabel");
            this.spriteCell.addChild(descriptionLabel,9999999);

            var countLabel = cc.LabelTTF.create("1/999999", "Helvetica", 22);
            countLabel.setPosition(130,5);
            countLabel.setAnchorPoint(0, 0);
            countLabel.setTag("countLabel");
            this.spriteCell.addChild(countLabel,9999999);

            this.planetImage = cc.Sprite.create(_image);
            this.planetImage.setAnchorPoint(0, 0);
            this.planetImage.setPosition(10, 10);
            this.planetImage.setScale(0.25,0.25);
            cell.addChild(this.planetImage, 9999999);

        } else {
            //label = this.spriteCell.getChildByTag("comment");
            //var _label = this.planets[strValue].imageccgnbtnhrlngijrbhlnigdtuhfekriclbdtuvfhc
            //;
            //label.setString(_label);
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