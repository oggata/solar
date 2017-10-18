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
        //this.addAlpha = 0.05;
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
        //treeNode
        this.treeNode = cc.Node.create();;
        this.treeNode.setPosition(0, 0);
        this.addChild(this.treeNode);
        this.drawNode2 = cc.DrawNode.create();
        this.treeNode.addChild(this.drawNode2);
        //var _rootPlanetNum = this.storage.getBasePlanetId(CONFIG.CARD[1]);
        this.basePlanetId = this.storage.getBasePlanetId(CONFIG.CARD[1]);
        this.treeNodeScale = 0.5;
        this.treeNode.setScale(this.treeNodeScale);
        this.connectedPlanets = new Array();
        this.planetButtons = [];
        //masterの惑星をループさせて配置する
        this.planets = CONFIG.PLANET;
        for (var masterCnt = 0; masterCnt < this.planets.length; masterCnt++) {
            if (this.planets[masterCnt].position) {
                var _image = this.planets[masterCnt].image;
                var _planetId = this.planets[masterCnt].id;
                if (this.storage.isOwnPlanetData(CONFIG.PLANET[_planetId])) {} else {
                    _image = "res/planet_w350_notfound.png";
                }
                this.buttonPlanet = new cc.MenuItemImage(_image, _image, function (sender) {
                    this.infoNode.setVisible(true);
                    this.detail.setPlanet(sender.planetId);
                }, this);
                this.buttonPlanet.planetId = _planetId;
                this.planetButtons.push(this.buttonPlanet);
                /*
                for debug
                this.planetIdLabel = new cc.LabelTTF(_planetId, "Arial", 99);
                this.planetIdLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
                this.buttonPlanet.addChild(this.planetIdLabel);
                this.planetIdLabel.setPosition(20, 20);
                */
                this.buttonPlanet.planetId = _planetId;
                var menu001 = new cc.Menu(this.buttonPlanet);
                menu001.setPosition(0, 0);
                this.treeNode.addChild(menu001);
                this.buttonPlanet.setScale(0.54);
                this.buttonPlanet.setPosition(this.planets[masterCnt].position[0], this.planets[masterCnt].position[1]);
                //枝になる可能性のある惑星を全て_branchPlanetsに入れてシャッフルする
                var _branchPlanets = [];
                for (var branchCnt = 0; branchCnt < this.planets.length; branchCnt++) {
                    if (this.planets[branchCnt].lv == this.planets[masterCnt].lv - 1) {
                        _branchPlanets.push(this.planets[branchCnt]);
                    }
                }
                _branchPlanets.sort(this.shuffle2);
                //1つの惑星から最大何本枝が生えるかを決定する
                var _maxLineCnt = this.getRandNumberFromRange(1, 2);
                _maxLineCnt = 1;
                for (var lineCnt = 0; lineCnt < _maxLineCnt; lineCnt++) {
                    if (_branchPlanets[lineCnt]) {
                        //masterからbranchに線を引く
                        this.fromP = cc.p(_branchPlanets[lineCnt].position[0], _branchPlanets[lineCnt].position[1]);
                        this.toP = cc.p(this.planets[masterCnt].position[0], this.planets[masterCnt].position[1]);
                        this.lineWidth = 9;
                        this.drawNode2.drawSegment(this.fromP, this.toP, this.lineWidth, cc.color(69, 162, 211, 255 * 0.3));
                        //接続している惑星のmasterデータを作る。master->branchとbranch->masterの両方必要。
                        if (this.connectedPlanets[this.planets[masterCnt].id]) {
                            this.connectedPlanets[this.planets[masterCnt].id].push(_branchPlanets[lineCnt].id);
                        } else {
                            this.connectedPlanets[this.planets[masterCnt].id] = [_branchPlanets[lineCnt].id];
                        }
                        if (this.connectedPlanets[_branchPlanets[lineCnt].id]) {
                            this.connectedPlanets[_branchPlanets[lineCnt].id].push(this.planets[masterCnt].id);
                        } else {
                            this.connectedPlanets[_branchPlanets[lineCnt].id] = [this.planets[masterCnt].id];
                        }
                    }
                }
                /*
                //自分のbasePlanetの場合は、マーカーをおく
                if (this.basePlanetId == _planetId) {
                    this.iconHere = cc.Sprite.create("res/icon_here.png");
                    this.iconHere.setPosition(this.planets[masterCnt].position[0], this.planets[masterCnt].position[1]);
                    this.treeNode.addChild(this.iconHere);
                }
                */
                //イベントマーカーを設置する
                /*
                var _eventId = this.getRandNumberFromRange(1, 5);
                if (_eventId == 3) {
                    this.eventMarker = cc.Sprite.create("res/sprite_weekly_event.png");
                    //this.iconHere.setPosition(this.planets[masterCnt].position[0], this.planets[masterCnt].position[1]);
                    this.eventMarker.setPosition(351 / 2, 351 / 2);
                    this.buttonPlanet.addChild(this.eventMarker);
                }
                */
            }
        }
        this.treeNode.setPosition((this.planets[this.basePlanetId].position[0] - 600) * -1 / 2, (this.planets[this.basePlanetId]
            .position[1] - 900) * -1 / 2);
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        this.lastTouchGameLayerX = this.treeNode.getPosition().x;
        this.lastTouchGameLayerY = this.treeNode.getPosition().y;
        this.header = cc.Sprite.create("res/header_owned_mission.png");
        this.header.setAnchorPoint(0, 0);
        this.viewSize = cc.director.getVisibleSize();
        this.header.setPosition(0, this.viewSize.height - 136);
        //this.header.setPosition(0, 1136 - 136);
        this.addChild(this.header);
        this.scaleButton001 = new cc.MenuItemImage("res/button_scale_001.png", "res/button_scale_001.png", function (
            sender) {

            this.treeNodeScale += 0.2;

        }, this);
        this.scaleButton002 = new cc.MenuItemImage("res/button_scale_002.png", "res/button_scale_002.png", function (
            sender) {
            this.treeNodeScale -= 0.2;
        }, this);
        this.scaleButton001.setPosition(100,100);
        this.scaleButton001.setPosition(100,-100);
        var scaleMenu = new cc.Menu(this.scaleButton001, this.scaleButton002);
        scaleMenu.setPosition(0, 0);
        this.header.addChild(scaleMenu);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.infoNode.setAnchorPoint(0.5, 0.5);
        this.infoNode.setPosition(0, 0);
        //this.infoNode.setOpacity(255 * 0.8);
        this.infoNode.setVisible(false);
        this.addChild(this.infoNode, 999999999);
        this.detail = new PlanetDetail(this);
        this.detail.setPosition(320, 600);
        this.infoNode.addChild(this.detail);
        this.planets = [];
        for (var i = 1; i < CONFIG.MISSION.length; i++) {
            //cc.log(CONFIG.MISSION[i]);
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

        this.basePlanetOpacity = 1;
        this.addPlanetOpacity = 0.05;

        cc.log("bb");
        this.scheduleUpdate();
        cc.log("bb");
        return true;
    },

    update: function (dt) {

        this.treeNode.setScale(this.treeNodeScale);


        if(this.basePlanetOpacity <= 0.2){
            this.addPlanetOpacity = 0.05;
        }else if(this.basePlanetOpacity >= 1){
            this.addPlanetOpacity = -0.05;
        }
        this.basePlanetOpacity+=this.addPlanetOpacity;
        for (var i = 0; i < this.planetButtons.length; i++) {
            if(this.basePlanetId == this.planetButtons[i].planetId){
                this.planetButtons[i].setOpacity(this.basePlanetOpacity * 255);
            }
        }
    },
    touchStart: function (location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },
    touchMove: function (location) {
        var scrollX = this.firstTouchX - location.x;
        var scrollY = this.firstTouchY - location.y;
        var x = this.lastTouchGameLayerX - scrollX;
        var y = this.lastTouchGameLayerY - scrollY;
        var _limitX = (CONFIG.MAP_WIDTH - this.viewSize.width) * -1;
        var _limitY = (CONFIG.MAP_HEIGHT - this.viewSize.height) * -1;
        this.treeNode.setPosition(x, y);
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },
    touchFinish: function (location) {
        this.lastTouchGameLayerX = this.treeNode.getPosition().x;
        this.lastTouchGameLayerY = this.treeNode.getPosition().y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },

/*
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
*/

    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    shuffle2: function () {
        Math.seed = 6666;
        max = 1;
        min = 9999;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;
        return rnd - .5;
    },
    getSeededRandom: function (max, min, seed) {
        Math.seed = seed;
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;
        return min + rnd * (max - min);
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