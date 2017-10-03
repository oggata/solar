var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});
var ItemLayer2 = cc.Layer.extend({
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

this.footer = new Footer(this);
this.addChild(this.footer);


        /*
        this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.infoNode.setAnchorPoint(0, 0);
        this.infoNode.setPosition(0, -500);
        this.infoNode.setOpacity(255*0.5);
        this.addChild(this.infoNode,999999999);
        */
        this.warpWindow = cc.Sprite.create("res/ui_warp_window.png");
        //this.warpWindow.setAnchorPoint(0, 0);
        this.warpWindow.setPosition(320, 550);
        this.addChild(this.warpWindow);
        this.warpWindow.setVisible(false);
        var buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.warpWindow.setVisible(false);
        }, this);
        buttonCancel.setPosition(160, 40);
        var buttonSearch = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            this.goToDiscoveryLayer();
        }, this);
        buttonSearch.setPosition(460, 40);
        var menu001 = new cc.Menu(buttonCancel, buttonSearch);
        menu001.setPosition(0, 0);
        this.warpWindow.addChild(menu001);
        return true;
    },
    createTable: function () {
        //var winSize = cc.Director.getInstance().getWinSize();
        var tableView = cc.TableView.create(this, cc.size(640, 1136 - 136));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(0, 136);
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();
    },
    tableCellSizeForIndex: function (table, idx) {
        return cc.size(640, 100);
    },
    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            this.spriteCell = cc.Sprite.create("res/table_cell2.png");
            this.spriteCell.setAnchorPoint(0, 0);
            this.spriteCell.setPosition(0, 0);
            cell.addChild(this.spriteCell, 9999999);
            var button = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
                //this.goToDiscoveryLayer1();
                this.warpWindow.setVisible(true);
            }, this);
            button.setPosition(600, 50);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
            cell.addChild(menu001, 999999999);
            var _material = new Material(this, 1, 1, true);
            _material.setPosition(60, 50);
            _material.amount = 0;
            _material.setAmount();
            //this.materials.push(_material);
            //this.spriteCell.addChild(_material, 999999);
            var _label = CONFIG.CARD[strValue];
            label = cc.LabelTTF.create("xxx", "Helvetica", 21);
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
ItemLayer2.create = function (storage, cardId) {
    return new ItemLayer2(storage, cardId);
};
var ItemLayer2Scene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new ItemLayer2(storage, cardId);
        this.addChild(layer);
    }
});