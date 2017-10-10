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
        this.backNode = cc.Sprite.create("res/back_top4.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);
        this.treeNode = cc.Node.create();;
        this.treeNode.setPosition(0, 0);
        this.addChild(this.treeNode);
        this.drawNode2 = cc.DrawNode.create();
        this.treeNode.addChild(this.drawNode2);
        /*
                //拠点の惑星を取得する
                //cc.log(this.storage.getTargetPlanetId(CONFIG.CARD[1]));
                var _rootPlanetNum = this.storage.getTargetPlanetId(CONFIG.CARD[1]);
                //_rootPlanetNum = 2;
                var _planet = CONFIG.PLANET[_rootPlanetNum];
        */
        var _rootPlanetNum = this.storage.getTargetPlanetId(CONFIG.CARD[1]);
        this.treeNode.setScale(0.5);
        this.planets = CONFIG.PLANET;
        for (var j = 0; j < this.planets.length; j++) {
            if (this.planets[j].position) {
                var _image = this.planets[j].image;
                var _position = this.planets[j].position;
                var _lv = this.planets[j].lv;
                var _planetId = this.planets[j].id;
                //cc.log(_planetId);
                //cc.log(this.storage.isOwnPlanetData(CONFIG.PLANET[_planetId]));
                //cc.log(this.planets[j].position);
                if (this.storage.isOwnPlanetData(CONFIG.PLANET[_planetId])) {
                    //this.planet_marker = cc.Sprite.create(_image);
                } else {
                    //this.planet_marker = cc.Sprite.create("res/planet_w350_notfound.png");
                    _image = "res/planet_w350_notfound.png";
                }
                this.planet_marker = new cc.MenuItemImage(_image, _image, function (sender) {
                    cc.log(sender);
                    this.infoNode.setVisible(true);
                    this.detail.setPlanet(sender.planetId);
                }, this);
                this.planet_marker.planetId = _planetId;
                //this.planet_marker.setPosition(320, 60);
                var menu001 = new cc.Menu(this.planet_marker);
                menu001.setPosition(0, 0);
                this.treeNode.addChild(menu001);
                this.planet_marker.setScale(0.35);
                this.planet_marker.setPosition(_position[0], _position[1]);
                //this.treeNode.addChild(this.planet_marker);
                /*次のレベルの1個以上と線を引く*/
                var _linePlanets = [];
                for (var h = 0; h < this.planets.length; h++) {
                    if (this.planets[h].lv == _lv - 1) {
                        _linePlanets.push(this.planets[h]);
                    }
                }
                var _maxLineCnt = this.getRandNumberFromRange(1, 2);
                //_maxLineCnt = 1;
                for (var lineCnt = 0; lineCnt < _maxLineCnt; lineCnt++) {
                    if (_linePlanets[lineCnt]) {
                        this.fromP = cc.p(_linePlanets[lineCnt].position[0], _linePlanets[lineCnt].position[1]);
                        this.toP = cc.p(_position[0], _position[1]);
                        this.lineWidth = 9;
                        this.drawNode2.drawSegment(this.fromP, this.toP, this.lineWidth, cc.color(69, 162, 211, 255 * 0.3));
                    }
                }
                //自分のbasePlanetの場合は、マーカーをおく
                if (_rootPlanetNum == _planetId) {
                    this.iconHere = cc.Sprite.create("res/icon_here.png");
                    //this.iconHere.setAnchorPoint(0, 0);
                    this.iconHere.setPosition(_position[0], _position[1]);
                    this.treeNode.addChild(this.iconHere);
                }
            }
        }
        this.treeNode.setPosition(this.planets[1].position[0] + 320, this.planets[1].position[1] - 300);
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        this.lastTouchGameLayerX = this.treeNode.getPosition().x;
        this.lastTouchGameLayerY = this.treeNode.getPosition().y;
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
        for (var i = 1; i < CONFIG.MISSION.length; i++) {
            cc.log(CONFIG.MISSION[i]);
            //var _hoge = JSON.parse(CONFIG.MISSION[i]);
            this.planets.push(CONFIG.MISSION[i]);
        }
        //this.createTable();
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
        return true;
    },
    touchStart: function (location) {
        //this.fromP = cc.p(location.x, location.y);
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
        //this.targetSprite.setPosition(touchX, touchY);
        //this.targetSprite2.setPosition(touchX, touchY);
    },
    touchMove: function (location) {
        //this.targetSprite.setPosition(location.x, location.y);
        var scrollX = this.firstTouchX - location.x;
        var scrollY = this.firstTouchY - location.y;
        var x = this.lastTouchGameLayerX - scrollX;
        var y = this.lastTouchGameLayerY - scrollY;
        var _limitX = (CONFIG.MAP_WIDTH - this.viewSize.width) * -1;
        var _limitY = (CONFIG.MAP_HEIGHT - this.viewSize.height) * -1;
        //if (_limitX <= x && x <= 0 && _limitY <= y && y <= 0) {
        this.treeNode.setPosition(x, y);
        //}
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },
    touchFinish: function (location) {
        this.lastTouchGameLayerX = this.treeNode.getPosition().x;
        this.lastTouchGameLayerY = this.treeNode.getPosition().y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
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