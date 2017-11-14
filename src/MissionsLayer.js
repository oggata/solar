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
        this.basePlanetId = this.storage.getShipParamByName("basePlanetId");
        this.treeNodeScale = 0.6;
        this.treeNode.setScale(this.treeNodeScale);
        //this.storage = storage;
        this.ship = cc.Sprite.create("res/ship_search.png");
        //this.ship.setAnchorPoint(0, 0);
        this.ship.setPosition(100, 100);
        this.treeNode.addChild(this.ship, 9999999999999999);
        this.planetButtons = [];
        this.connectedPlanetsData = new Array();
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
                //for debug
                this.planetIdLabel = new cc.LabelTTF(_planetId, "Arial", 48);
                this.planetIdLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
                this.buttonPlanet.addChild(this.planetIdLabel);
                this.planetIdLabel.setPosition(40, 40);
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
                        this.isExistsConnectedPlanets2(this.planets[masterCnt].id, _branchPlanets[lineCnt].id);
                        this.isExistsConnectedPlanets2(_branchPlanets[lineCnt].id, this.planets[masterCnt].id);
                    }
                }
            }
        }
        this.treeNode.setPosition((this.planets[this.basePlanetId].position[0] - 600) * -1 / 2, (this.planets[this.basePlanetId].position[1] - 900) * -1 / 2);
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
        this.scaleButton001 = new cc.MenuItemImage("res/button_scale_001.png", "res/button_scale_001.png", function (sender) {
            this.treeNodeScale += 0.2;
        }, this);
        this.scaleButton002 = new cc.MenuItemImage("res/button_scale_002.png", "res/button_scale_002.png", function (sender) {
            this.treeNodeScale -= 0.2;
        }, this);
        this.scaleButton001.setPosition(100, 100);
        this.scaleButton001.setPosition(100, -100);
        var scaleMenu = new cc.Menu(this.scaleButton001, this.scaleButton002);
        scaleMenu.setPosition(0, 0);
        //this.header.addChild(scaleMenu);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.infoNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.infoNode.setAnchorPoint(0.5, 0.5);
        this.infoNode.setPosition(0, 0);
        this.infoNode.setVisible(false);
        this.addChild(this.infoNode, 999999999);
        this.detail = new PlanetDetail(this);
        this.detail.setPosition(320, 600);
        this.infoNode.addChild(this.detail);
        this.planets = [];
        for (var i = 1; i < CONFIG.MISSION.length; i++) {
            this.planets.push(CONFIG.MISSION[i]);
        }
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
        this.scheduleUpdate();


        //fromとtoがセットされているか確認する
        var _startPlanetId = this.storage.getShipParamByName("moveFromPlanetId");
        var _finishPlanetId = this.storage.getShipParamByName("moveToPlanetId");
        if (_startPlanetId > 0 && _finishPlanetId > 0) {
            var _route = [];
            var _aaa = this.setRoute(_startPlanetId, _finishPlanetId);
            var _planet = CONFIG.PLANET[_aaa[0].planetId]
            this.ship.setPosition(_planet.position[0], _planet.position[1]);
            this.aaa = _aaa;
            this.shipTargetPlanet = CONFIG.PLANET[_aaa[1].planetId];
            this.treeNode.setPosition((this.ship.getPosition().x - 600) * -1 / 2, (this.ship.getPosition().y - 900) * -1 / 2);
        } else {
            var _basePlanetId = this.storage.getShipParamByName("basePlanetId");
            var _planet = CONFIG.PLANET[_basePlanetId];
            this.ship.setPosition(_planet.position[0], _planet.position[1]);
        }
        return true;
    },
    update: function (dt) {
        if (this.aaa) {
            if (this.aaa.length > 0) {
                this.shipTargetPlanet = CONFIG.PLANET[this.aaa[0].planetId];
                var speed = 10;
                var targetDist = 10;
                var dX = -this.ship.getPosition().x + this.shipTargetPlanet.position[0];
                var dY = -this.ship.getPosition().y + this.shipTargetPlanet.position[1];
                var dist = Math.sqrt(dX * dX + dY * dY);
                if (dist > targetDist) {
                    var rad = Math.atan2(dX, dY);
                    var speedX = speed * Math.sin(rad);
                    var speedY = speed * Math.cos(rad);
                    this.ship.setPosition(this.ship.getPosition().x + speedX, this.ship.getPosition().y + speedY);
                    this.treeNode.setPosition((this.ship.getPosition().x - 600) * -1 / 2, (this.ship.getPosition().y - 900) * -1 / 2);
                } else {
                    this.aaa.splice(0, 1);
                }
            }
        }
        this.treeNode.setScale(this.treeNodeScale);
        if (this.basePlanetOpacity <= 0.2) {
            this.addPlanetOpacity = 0.05;
        } else if (this.basePlanetOpacity >= 1) {
            this.addPlanetOpacity = -0.05;
        }
        this.basePlanetOpacity += this.addPlanetOpacity;
        for (var i = 0; i < this.planetButtons.length; i++) {
            if (this.basePlanetId == this.planetButtons[i].planetId) {
                this.planetButtons[i].setOpacity(this.basePlanetOpacity * 255);
            }
        }
    },
    setRoute: function (_startPlanetId, _finishPlanetId) {
        this._routeIds = [];
        this.connectedIds = [];
        var _data = {
            planetId: _finishPlanetId,
            distance: 0,
            connected: []
        };
        this._routeIds.push(_data);
        for (var i = 0; i < this.connectedPlanetsData.length; i++) {
            if (this.connectedPlanetsData[i].basePlanetId == _finishPlanetId) {
                //connectedPlanetIdで分ける
                for (var h = 0; h < this.connectedPlanetsData[i].connectedPlanetId.length; h++) {
                    var _planetId = this.connectedPlanetsData[i].connectedPlanetId[h];
                    if (this.isSetPlanetId(_planetId) == false) {
                        var _connected = "";
                        for (var t = 0; t < this.connectedPlanetsData.length; t++) {
                            if (this.connectedPlanetsData[t].basePlanetId == _planetId) {
                                _connected = this.connectedPlanetsData[t].connectedPlanetId;
                            }
                        }
                        var _data = {
                            planetId: _planetId,
                            distance: 1,
                            connected: _connected
                        };
                        this._routeIds.push(_data);
                    }
                }
            }
        }
        for (var j = 0; j < this._routeIds.length; j++) {
            for (var k = 0; k < this._routeIds[j].connected.length; k++) {
                var _planetId = this._routeIds[j].connected[k];
                if (this.isSetPlanetId(_planetId) == false) {
                    var _connected = "";
                    for (var t = 0; t < this.connectedPlanetsData.length; t++) {
                        if (this.connectedPlanetsData[t].basePlanetId == _planetId) {
                            _connected = this.connectedPlanetsData[t].connectedPlanetId;
                        }
                    }
                    var _data = {
                        planetId: _planetId,
                        distance: this._routeIds[j].distance + 1,
                        connected: _connected
                    };
                    this._routeIds.push(_data);
                }
            }
        }
        //maxDistanceを求める
        //var _maxDistance = 0;
        for (var j = 0; j < this._routeIds.length; j++) {
            if (this._routeIds[j].planetId == _startPlanetId) {
                _maxDistanceData = this._routeIds[j];
            }
        }
        //var _minDistance = 0;
        for (var j = 0; j < this._routeIds.length; j++) {
            if (this._routeIds[j].planetId == _finishPlanetId) {
                _minDistanceData = this._routeIds[j];
            }
        }
        //cc.log(_maxDistance);
        //今度は startからfinishまで逆に辿って行く
        var _connected = [];
        var _distance = 999;
        var _hoge = "";
        this.setHogeData = "";
        this._hoge = [];
        //finishを入れる
        this._hoge.push(_maxDistanceData);
        for (var j = 0; j < this._routeIds.length; j++) {
            if (this._routeIds[j].planetId == _startPlanetId) {
                _connected = this._routeIds[j].connected;
                _distance = this._routeIds[j].distance;
                this.setHogeData = this.setHoge(_connected, _distance);
                for (var u = 0; u < 5; u++) {
                    this.setHogeData = this.setHoge(this.setHogeData.connected, this.setHogeData.distance);
                    //cc.log("distance:");
                    //cc.log(this.setHogeData.distance);
                    if (!this.setHogeData) break;
                    if (this.setHogeData.distance <= 1) {
                        cc.log("break");
                        break;
                    }
                }
            }
        }
        this._hoge.push(_minDistanceData);
        cc.log(this._hoge);
        return this._hoge;
    },
    setHoge: function (_connected, _distance) {
        var _hogedata = "";
        if (!_connected) return;
        for (var h = 0; h < _connected.length; h++) {
            for (var t = 0; t < this._routeIds.length; t++) {
                if (this._routeIds[t].planetId == _connected[h]) {
                    if (this._routeIds[t].distance == _distance - 1) {
                        this._hoge.push(this._routeIds[t]);
                        _hogedata = this._routeIds[t];
                    }
                }
            }
        }
        return _hogedata;
    },
    isSetPlanetId: function (targetPlanetId) {
        for (var j = 0; j < this._routeIds.length; j++) {
            if (this._routeIds[j].planetId == targetPlanetId) {
                return true;
            }
        }
        return false;
    },
    isExistsConnectedPlanets2: function (basePlanetId, connectedPlanetId) {
        for (var i = 0; i < this.connectedPlanetsData.length; i++) {
            if (this.connectedPlanetsData[i].basePlanetId == basePlanetId) {
                this.connectedPlanetsData[i].connectedPlanetId.push(connectedPlanetId);
                return true;
            }
        }
        //なければ足す
        var _level = CONFIG.PLANET[basePlanetId].lv;
        var _data = {
            basePlanetId: basePlanetId,
            basePlanetLevel: _level,
            connectedPlanetId: [connectedPlanetId]
        };
        this.connectedPlanetsData.push(_data);
        return false;
    },
    touchStart: function (location) {
        if (this.aaa) {
            if (this.aaa.length > 0) return;
        }
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },
    touchMove: function (location) {
        if (this.aaa) {
            if (this.aaa.length > 0) return;
        }
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
        if (this.aaa) {
            if (this.aaa.length > 0) return;
        }
        this.lastTouchGameLayerX = this.treeNode.getPosition().x;
        this.lastTouchGameLayerY = this.treeNode.getPosition().y;
        var touchX = location.x - this.lastTouchGameLayerX;
        var touchY = location.y - this.lastTouchGameLayerY;
    },
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