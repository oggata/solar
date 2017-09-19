var CustomTableViewCell = cc.TableViewCell.extend({
    draw: function (ctx) {
        this._super(ctx);
    }
});
var DiscoveryLayer = cc.Layer.extend({
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
        this.setInfoWindow();
        this.maxChargeTime = 60 * 3;
        this.labelTitle = cc.Sprite.create("res/label_title.png");
        this.labelTitle.setPosition(320, 600);
        this.addChild(this.labelTitle, 9999999);
        this.timeCnt = 0;
        this.labelOpacity = 1;
        this.stopPowerX = 0.05;
        this.planets = [];
        this.baseNode = cc.Node.create();
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        //this.baseNode.setScale(0.5);
        this.isSetPlanet = false;
        this.battleWindowScale = 1;
        for (var i = 0; i < 600; i++) {
            var _x = this.getRandNumberFromRange(1, 10000);
            var _y = this.getRandNumberFromRange(1, 10000);
            this.planetSprite = cc.Sprite.create("res/start.png");
            this.baseNode.addChild(this.planetSprite);
            this.planetSprite.setPosition(_x, _y);
        }
        //地球を作成する
        this.basePlanet = new PlanetSprite(this);
        this.baseNode.addChild(this.basePlanet);
        this.basePlanet.setPosition(5000, 5000);
        this.planets.push(this.basePlanet);
        //探索船を作る
        this.rocketSprite = cc.Sprite.create("res/ship_search.png");
        this.baseNode.addChild(this.rocketSprite, 999999999);
        this.rocketSprite.setPosition(5000, 5000);
        this.rocketSprite.basePlanet = this.basePlanet;
        //宇宙に惑星を配置する
        for (var i = 0; i < 100; i++) {
            var _x = this.getRandNumberFromRange(1, 10000);
            var _y = this.getRandNumberFromRange(1, 10000);
            if (this.getMostNearPlanet(_x, _y, 800) == null) {
                this.planetSprite = new PlanetSprite(this);
                this.baseNode.addChild(this.planetSprite);
                this.planets.push(this.planetSprite);
                this.planetSprite.setPosition(_x, _y);
            }
        }
        this.dx = 0;
        this.dy = 0;
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
        this.scheduleUpdate();
        //エラー画面を作る
        this.errorCnt = 0;
        this.error = cc.Sprite.create("res/error.png");
        this.error.setPosition(320, 500);
        this.addChild(this.error, 9999999);
        this.error.setVisible(false);
        this.errorLabel = new cc.LabelTTF("", "Arial", 28);
        this.errorLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.error.addChild(this.errorLabel);
        this.errorLabel.setPosition(320, 120);
        this.cameraTargetPosX = 0;
        this.cameraTargetPosY = 0;
        //カメラの設定
        if (this.rocketSprite.basePlanet == null) {
            this.cameraTargetPosX = 320 - this.rocketSprite.getPosition().x;
            this.cameraTargetPosY = 480 - this.rocketSprite.getPosition().y;
        } else {
            this.cameraTargetPosX = 320 - this.rocketSprite.basePlanet.getPosition().x;
            this.cameraTargetPosY = 480 - this.rocketSprite.basePlanet.getPosition().y;
        }
        this.cameraPosX = this.cameraTargetPosX;
        this.cameraPosY = this.cameraTargetPosY;
        this.baseNode.setPosition(this.cameraTargetPosX, this.cameraTargetPosY);
        //メッセージの制御
        this.messageLabel = cc.LabelTTF.create("", "Arial", 18);
        this.messageLabel.setPosition(160, 240);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.addChild(this.messageLabel);
        this.messageLabel.setAnchorPoint(0, 1);
        this.message = "名称: AOXP-12345！\n所有者: なし\n成功目標: 25%以上の探索\n敵対反応: あり\n採掘できる鉱物: 銅、ニッケル、鉄など";
        this.messageTime = 0;
        this.visibleStrLenght = 0;
        this.launchCnt = 0;
        this.baseNodeScale = 1;
        this.initializeWarpAnimation();
        this.howto = cc.Sprite.create("res/howto.png");
        this.howto.setPosition(320, 200);
        //this.addChild(this.howto, 9999999);
        this.tutorial = cc.Sprite.create("res/icon_howto.png");
        this.baseNode.addChild(this.tutorial, 9999999);
        this.cameraSpeed = 1;
        this.fromP = cc.p(1, 1);
        this.toP = cc.p(1, 1);
        this.header = cc.Sprite.create("res/header002.png");
        this.header.setPosition(320, 1136 - 150);
        this.header.setAnchorPoint(0.5, 0);
        this.addChild(this.header, 999999999999);
        this.orderCnt = 0;
        this.materials = [];
        this.addMaterial(1);
        this.addMaterial(2);
        this.addMaterial(1);
        this.addMaterial(3);
        this.addMaterial(3);
        this.isPullRocket = false;
        this.createTable();
        return true;
    },
    createTable: function () {
        //var winSize = cc.Director.getInstance().getWinSize();
        var tableView = cc.TableView.create(this, cc.size(600, 1130));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(0, 0);
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();
    },
    tableCellSizeForIndex: function (table, idx) {
        return cc.size(300, 100);
    },
    tableCellAtIndex: function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            label = cc.LabelTTF.create(strValue, "Helvetica", 15);
            label.setPosition(50, 0);
            label.setAnchorPoint(0, 0);
            label.setTag("comment");
            cell.addChild(label);
        } else {
            label = cell.getChildByTag("comment");
            //var txt = responses[strValue];
            label.setString("xxx");
        }
        return cell;
    },
    numberOfCellsInTableView: function (table) {
        //return responses.length;
        return 20;
    },
    addMaterial: function (mcode) {
        var _isFristMat = true;
        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i].materialCode == mcode) {
                _isFristMat = false;
                this.materials[i].amount += 1;
                this.materials[i].setAmount();
            }
        }
        if (_isFristMat == true) {
            this.orderCnt += 1;
            var _material = new Material(this, mcode, this.orderCnt, true);
            this.materials.push(_material);
            this.addChild(_material, 999999);
            //_material.setPosition(610 - 62 * (this.orderCnt - 1), 110);
            //_material.setPosition(570, 160 - this.orderCnt * 45);
            cc.log(this.orderCnt);
            _material.setPosition(540, 1100 - this.orderCnt * 55);
        }
    },
    update: function (dt) {
        this.timeCnt++;
        if (this.timeCnt >= 30 * 3) {
            this.labelTitle.setVisible(false);
        }
        this.tutorial.setPosition(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y - 140);
        //基盤の惑星があれば、探索できる
        if (this.rocketSprite.basePlanet == null) {
            this.launchButton.setVisible(false);
        } else {
            this.launchButton.setVisible(true);
        }
        //動いていない場合、引っ張ることができる
        if (this.dx == 0 && this.dy == 0) {
            this.tutorial.setVisible(true);
            this.isPullRocket = true;
        } else {
            this.tutorial.setVisible(false);
            this.isPullRocket = false;
        }
        //発射
        if (this.launchCnt >= 1) {
            this.launchCnt++;
            this.baseNodeScale += 0.05;
            this.rocketSprite.basePlanet.setScale(this.baseNodeScale);
            if (this.launchCnt >= 30 * 1) {
                this.launchCnt = 0;
                this.goToGameLayer();
            }
        }
        if (this.rocketSprite.basePlanet != null) {
            //メッセージ表示の管理
            this.messageTime++;
            if (this.messageTime >= 1) {
                this.messageTime = 0;
                this.visibleStrLenght++;
            }
            if (this.visibleStrLenght > this.message.length) {
                this.visibleStrLenght = this.message.length;
            }
            var _visibleString = this.message.substring(0, this.visibleStrLenght);
            this.messageLabel.setString(_visibleString);
            this.messageLabel.setVisible(true);
        } else {
            this.messageTime = 0;
            this.visibleStrLenght = 0;
            this.launchCnt = 0;
            this.messageLabel.setVisible(false);
        }
        this.setBrakingDistance();
        //for(this.planets)
        for (var i = 0; i < this.planets.length; i++) {
            this.planets[i].update();
        }
        //時間を進める
        this.timeGauge.update();
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        this.distanceLabel.setString(this.distanceNum + "km");
        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        } else {
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");
        if (this.dx != 0 || this.dy != 0) {
            this.labelOpacity -= 0.05;
            if (this.labelOpacity <= 0) {
                this.labelOpacity = 0;
                this.labelTitle.setOpacity(this.labelOpacity * 255);
            }
        }
        this.rocketSprite.setPosition(this.rocketSprite.getPosition().x + this.dx, this.rocketSprite.getPosition().y +
            this.dy);
        this.setCameraSpeed();
        this.baseNode.setPosition(this.cameraPosX, this.cameraPosY);
    },
    setCameraSpeed: function () {
        //カメラの設定
        if (this.rocketSprite.basePlanet == null) {
            //拠点の惑星があれば、その惑星の中心にカメラを固定する
            this.cameraTargetPosX = 320 - this.rocketSprite.getPosition().x;
            this.cameraTargetPosY = 580 - this.rocketSprite.getPosition().y;
        } else {
            //拠点の惑星があれば、ロケットをカメラが追いかける
            this.cameraTargetPosX = 320 - this.rocketSprite.basePlanet.getPosition().x;
            this.cameraTargetPosY = 580 - this.rocketSprite.basePlanet.getPosition().y;
        }
        //カメラスピードの決定
        if (Math.abs(this.baseNode.getPosition().x - this.cameraTargetPosX) >= 50) {
            this.cameraSpeedX = 50;
        } else {
            this.cameraSpeedX = Math.abs(this.baseNode.getPosition().x - this.cameraTargetPosX);
        }
        if (this.baseNode.getPosition().x <= this.cameraTargetPosX) {
            this.cameraPosX += this.cameraSpeedX;
        } else {
            this.cameraPosX -= this.cameraSpeedX;
        }
        if (Math.abs(this.baseNode.getPosition().y - this.cameraTargetPosY) >= 50) {
            this.cameraSpeedY = 50;
        } else {
            this.cameraSpeedY = Math.abs(this.baseNode.getPosition().y - this.cameraTargetPosY);
        }
        if (this.baseNode.getPosition().y <= this.cameraTargetPosY) {
            this.cameraPosY += this.cameraSpeedY;
        } else {
            this.cameraPosY -= this.cameraSpeedY;
        }
    },
    setBrakingDistance: function () {
        //惑星との距離によって制動距離を変える
        var _targetPlanet = this.getMostNearPlanet(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y,
            300);
        if (_targetPlanet != null) {
            this.stopPowerX = 0.22;
            if (this.dx == 0 || this.dy == 0) {
                this.rocketSprite.basePlanet = _targetPlanet;
            } else {
                this.rocketSprite.basePlanet = null;
            }
        } else {
            this.rocketSprite.basePlanet = null;
            this.stopPowerX = 0.05;
        }
        //一定以下の場合は制動距離を0にする
        if (Math.abs(this.dx) > 1) {
            if (this.dx > 0) {
                this.dx -= this.stopPowerX;
            } else {
                this.dx += this.stopPowerX;
            }
            this.distanceNum += 1;
        } else {
            this.dx = 0;
        }
        if (Math.abs(this.dy) > 1) {
            if (this.dy > 0) {
                this.dy -= this.stopPowerX;
            } else {
                this.dy += this.stopPowerX;
            }
            this.distanceNum += 1;
        } else {
            this.dy = 0;
        }
        //basePlanetがある場合は、そのplanetの衛星軌道をたどる
        if (this.rocketSprite.basePlanet) {
            var _targetPosX = this.rocketSprite.basePlanet.getPosition().x + this.rocketSprite.basePlanet.satelliteSprite.getPosition()
                .x - this.rocketSprite.basePlanet.planetSpriteW / 2;
            var _targetPosY = this.rocketSprite.basePlanet.getPosition().y + this.rocketSprite.basePlanet.satelliteSprite.getPosition()
                .y - this.rocketSprite.basePlanet.planetSpriteW / 2;
            var _posX = this.rocketSprite.getPosition().x;
            var _posY = this.rocketSprite.getPosition().y;
            if (Math.abs(this.rocketSprite.getPosition().x - _targetPosX) >= 5) {
                if (this.rocketSprite.getPosition().x <= _targetPosX) {
                    _posX = this.rocketSprite.getPosition().x + 4;
                } else {
                    _posX = this.rocketSprite.getPosition().x - 4;
                }
            } else {
                _posX = _targetPosX;
            }
            if (Math.abs(this.rocketSprite.getPosition().y - _targetPosY) >= 5) {
                if (this.rocketSprite.getPosition().y <= _targetPosY) {
                    _posY = this.rocketSprite.getPosition().y + 4;
                } else {
                    _posY = this.rocketSprite.getPosition().y - 4;
                }
            } else {
                _posY = _targetPosY;
            }
            this.rocketSprite.setPosition(_posX, _posY);
        }
    },
    getPastSecond2: function () {
        var diffSecond = this.storage.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },
    setInfoWindow: function () {
        this.infoWindow = cc.Sprite.create("res/info.png");
        this.infoWindow.setAnchorPoint(0, 0);
        this.infoWindow.setPosition(0, 1136 - 220);
        this.addChild(this.infoWindow, 999999999);
        this.fuelLabel = cc.LabelTTF.create("123 / 143", "Arial", 25);
        this.fuelLabel.setPosition(120, 160);
        this.fuelLabel.setAnchorPoint(0, 1);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.infoWindow.addChild(this.fuelLabel);
        //this.fuelLabel.setAnchorPoint(0, 1);
        this.levelLabel = cc.LabelTTF.create("12", "Arial", 25);
        this.levelLabel.setPosition(120, 105);
        this.levelLabel.setAnchorPoint(0, 1);
        this.levelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.infoWindow.addChild(this.levelLabel);
        this.planetCntLabel = cc.LabelTTF.create("1 / 12312234", "Arial", 25);
        this.planetCntLabel.setPosition(620, 50);
        this.planetCntLabel.setAnchorPoint(1, 1);
        this.planetCntLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.infoWindow.addChild(this.planetCntLabel);
        this.distanceLabel = cc.LabelTTF.create("123242343km", "Arial", 25);
        this.distanceLabel.setPosition(620, 105);
        this.distanceLabel.setAnchorPoint(1, 1);
        this.distanceLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.infoWindow.addChild(this.distanceLabel);
        this.timeLabel = new cc.LabelTTF("00:00:00", "Arial", 18);
        this.timeLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.addChild(this.timeLabel);
        this.timeLabel.setPosition(320, 340);
        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        } else {
            this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.timeLabel.setString("残り" + this.pastSecond + "秒");
        this.timeGauge = new TimeGauge(this);
        this.timeGauge.setPosition(330, 360);
        this.timeGauge.setScale(0.4);
        this.addChild(this.timeGauge);
        var coinButton = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
            if (this.pastSecond >= 1) {
                this.errorLabel.setString("" + this.pastSecond + "秒で1クリスタルに変換できます.");
                this.error.setVisible(true);
                this.errorCnt = 1;
            } else {
                this.setTargetTime();
                this.storage.addCoin(1);
            }
        }, this);
        coinButton.setPosition(450, 360);
        var menu001 = new cc.Menu(coinButton);
        menu001.setPosition(0, 0);
        this.addChild(menu001);
        this.launchButton = new cc.MenuItemImage("res/button_launch.png", "res/button_launch.png", function () {
            this.launchCnt = 1;
            this.sprite.setOpacity(255 * 4);
        }, this);
        this.launchButton.setPosition(320, 300);
        var menu001 = new cc.Menu(this.launchButton);
        menu001.setPosition(0, 0);
        this.addChild(menu001);
    },
    getMostNearPlanet: function (_x, _y, _dist) {
        for (var i = 0; i < this.planets.length; i++) {
            var _distance = Math.sqrt(
                (_x - this.planets[i].getPosition().x * this.battleWindowScale) * (_x - this.planets[i].getPosition().x * this.battleWindowScale) +
                (_y - this.planets[i].getPosition().y * this.battleWindowScale) * (_y - this.planets[i].getPosition().y * this.battleWindowScale)
            );
            if (_distance <= _dist) {
                return this.planets[i];
            }
        }
        return null;
    },
    setTargetTime: function () {
        //if(this.storage.targetTime == null){
        this.storage.targetTime = parseInt(new Date() / 1000) + this.maxChargeTime;
        this.storage.saveCurrentData();
        //}
    },
    touchStart: function (location) {
        if (this.isPullRocket == false) return;
        this.fromP = cc.p(location.x, location.y);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
    },
    touchMove: function (location) {
        if (this.isPullRocket == false) return;
        this.removeChild(this.drawNode);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
        this.toP = cc.p(location.x, location.y);
        this.drawNode.drawSegment(this.fromP, this.toP, this.lineWidth, this.lineColor);
    },
    touchFinish: function (location) {
        if (this.isPullRocket == false) return;
        //launch
        this.dx = (this.fromP.x - this.toP.x) / 20;
        this.dy = (this.fromP.y - this.toP.y) / 20;
        this.removeChild(this.drawNode);
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
DiscoveryLayer.create = function (storage, cardId) {
    return new DiscoveryLayer(storage, cardId);
};
var DiscoveryLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new DiscoveryLayer(storage, cardId);
        this.addChild(layer);
    }
});