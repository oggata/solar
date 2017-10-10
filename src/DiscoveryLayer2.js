var DiscoveryLayer2 = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
//cc.sys.localStorage.clear();
        //画面サイズの取得
        this.storage = storage;
        this.windowName = "DiscoveryLayer2";
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
        this.storage.savePlanetDataToStorage(CONFIG.PLANET[1], 1);
        this.distanceNum = 143230;
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.backNode = cc.Sprite.create("res/back_top2.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);
        this.header1 = new Header(this);
        this.addChild(this.header1, 999999);
        this.header1.setAnchorPoint(0.5, 0);
        this.header1.setPosition(320, 1136 - 72);
        this.maxChargeTime = 60 * 3;
        /*
        this.labelTitle = cc.Sprite.create("res/label_title.png");
        this.labelTitle.setPosition(320, 600);
        */
        this.timeCnt = 0;
        this.labelOpacity = 1;
        this.planets = [];
        this.baseNode = cc.Node.create();
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        this.isSetPlanet = false;
        this.battleWindowScale = 1;
        this.baseNode.setScale(this.battleWindowScale, this.battleWindowScale);


        //拠点の惑星を取得する
        //cc.log(this.storage.getTargetPlanetId(CONFIG.CARD[1]));
        var _rootPlanetNum = this.storage.getTargetPlanetId(CONFIG.CARD[1]);
        //_rootPlanetNum = 2;
        var _planet = CONFIG.PLANET[_rootPlanetNum];
//cc.log(_planet);
        //地球を作成する
        this.basePlanet = new PlanetSprite(this,_planet);
        this.baseNode.addChild(this.basePlanet);
        this.basePlanet.setPosition(5000, 5000);
        this.basePlanet.setScale(0.35, 0.35);
        this.planets.push(this.basePlanet);
        //救出メッセージ用
        this.rescureWindow = cc.Sprite.create("res/rescue.png");
        //this.rescureWindow.setAnchorPoint(0, 0);
        this.rescureWindow.setPosition(320, 700);
        this.addChild(this.rescureWindow);
        this.rescureWindow.setVisible(false);
        //探索船を作る
        this.rocketSprite = new Ship(this);
        this.baseNode.addChild(this.rocketSprite, 999999999);
        this.rocketSprite.setPosition(5000, 5000);
        this.rocketSprite.basePlanet = this.basePlanet;
        //this.rocketSprite.setScale(0.4, 0.4);
        this.rocketSprite.rocketId = 1;
        this.rocketSprite.dx = 0;
        this.rocketSprite.dy = 0;
        this.rocketSprite.targetTime = 0;
        this.rocketSprite.targetPlanetId = "xxx";
        this.rocketSprite.status = "xxx";
        this.rockets = [];
        this.rockets.push(this.rocketSprite);
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
        this.tmpDx = 0;
        this.tmpDy = 0;
        this.setUiShipMonitor();
        this.InfoMenu = new InfoMenu(this);
        this.addChild(this.InfoMenu);
        this.cameraSpeed = 1;
        this.fromP = cc.p(1, 1);
        this.toP = cc.p(1, 1);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.explorationArrow = cc.Sprite.create("res/marker_search.png");
        this.explorationArrow.setPosition(0, 1136 - 220);
        this.baseNode.addChild(this.explorationArrow);
        this.explorationArrow.setVisible(false);
        this.explorationDistLabel = cc.LabelTTF.create("500KM", "Arial", 42);
        this.explorationDistLabel.setPosition(160, 240);
        this.explorationDistLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.baseNode.addChild(this.explorationDistLabel);
        this.explorationRarityLabel = cc.LabelTTF.create("S:0.01%/\nA:0.02%/\nB:0.001%/\nC:0.005%", "Arial", 18);
        this.explorationRarityLabel.setPosition(160, 240);
        this.explorationRarityLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.baseNode.addChild(this.explorationRarityLabel);
        this.masterShip = null;
        var keyCnt = Object.keys(this.storage.shipData).length;
        if (keyCnt == 0) {
            //初回のアカウント作成
            this.InfoMenu.uiWindowAccount.setVisible(true);
            this.InfoMenu.infoNode.setVisible(true);
            var _dx = 0;
            var _dy = 0;
            var _time = 0;
            var _basePlanetId = 1;
            var _destinationPlanetId = 0;
            this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST", 1);
        }
        for (var key in this.storage.shipData) {
            if (this.storage.shipData.hasOwnProperty(key)) {
                if (key == 'ID_1') {
                    var value = this.storage.shipData[key];
                    this.masterShip = JSON.parse(value);
                }
            }
        }
        if (this.masterShip.status == "MOVING") {
            this.dx = this.masterShip.dx;
            this.dy = this.masterShip.dy;
        }
        //shipの終了判定
        this.addInsekiCnt = 0;
        this.meteorites = [];
        for (var i = 0; i <= 20; i++) {
            //this.planets[i].update();
            var _x = this.getRandNumberFromRange(this.rocketSprite.getPosition().x - 360, this.rocketSprite.getPosition().x +
                360);
            var _y = this.getRandNumberFromRange(this.rocketSprite.getPosition().y - 1136 / 2, this.rocketSprite.getPosition()
                .y + 1136 / 2);
            this.addInseki2(_x, _y);
        }
        if (this.masterShip.status == "MOVING") {
            this.basePlanet.setVisible(false);
        } else {
            this.basePlanet.setVisible(true);
        }
        this.debugButton = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.masterShip.targetTime = parseInt(new Date() / 1000);
            //this.storage.saveCurrentData();
            //this.setMasterShipStatus(0, 0, 0, 0, "NO_DIST");
            /*
                        this.masterShip.status = "NO_DIST";
                        this.masterShip.dx = 0;
                        this.masterShip.dy = 0;
                        this.baseNode.removeChild(this.drawNode2);
                        this.explorationArrow.setVisible(false);
                        this.explorationDistLabel.setVisible(false);
                        this.explorationRarityLabel.setVisible(false);
            */
        }, this);
        this.debugButton.setPosition(80, 1000);
        var menu001 = new cc.Menu(this.debugButton);
        menu001.setPosition(0, 0);
        this.addChild(menu001, 99999999999999);
        return true;
    },
    update: function (dt) {


//cc.log(this.storage.getTargetPlanetId(CONFIG.CARD[1]));

        if (this.rescureWindow.isVisible()) {
            this.rocketSprite.setVisible(false);
        } else {
            this.rocketSprite.setVisible(true);
        }
        this.header1.fuelLabel.setString("" + this.storage.totalCoinAmount);
        if (this.InfoMenu.infoNode.isVisible()) {
            this.uiShipMonitor.setVisible(false);
        } else {
            this.uiShipMonitor.setVisible(true);
        }
        //時間を進める
        this.header1.timeGauge.update();
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        this.fuelPastSecond = this.getPastSecond();
        if (this.fuelPastSecond <= 0) {
            this.fuelPastSecond = 0;
            this.header1.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        } else {
            this.header1.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        this.header1.timeLabel.setString("残り" + this.fuelPastSecond + "秒");
        this.InfoMenu.update();
        if (this.masterShip.status == "MOVING") {
            this.addInsekiCnt++;
            if (this.addInsekiCnt >= 5) {
                this.addInsekiCnt = 0;
                this.addRotateInseki();
            }
        }
        for (var i = 0; i < this.meteorites.length; i++) {
            this.meteorites[i].setPosition(this.meteorites[i].getPosition().x + this.meteorites[i].dx, this.meteorites[i].getPosition()
                .y + this.meteorites[i].dy);
            var _dist = cc.pDistance(this.rocketSprite.getPosition(), this.meteorites[i].getPosition());
            if (_dist >= 800) {
                this.baseNode.removeChild(this.meteorites[i]);
            }
        }
        this.rocketSprite.update();
        if (this.masterShip.status == "NO_DIST") {
            this.uiShipMonitor001.setVisible(true);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.masterShip.status == "SET_FREE_DIST") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(true);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.masterShip.status == "TOKEN_DIST") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(true);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.masterShip.status == "MOVING") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(true);
        }
        this.timeCnt++;
        if (this.timeCnt >= 30 * 3) {
            //this.labelTitle.setVisible(false);
        }
        //this.uiShipMonitor.setPosition(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y - 140);
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
            this.messageLabel.setVisible(true);
        } else {
            this.messageTime = 0;
            this.visibleStrLenght = 0;
        }
        this.setBrakingDistance();
        for (var i = 0; i < this.planets.length; i++) {
            this.planets[i].update();
        }
        //時間を進める
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
            }
        }
        this.setRocketSearchCompleate();
        //this.targetTimeLabel.setString("残り" + this.pastSecond + "秒");
        this.targetTimeLabel.setString("" + this.pastSecond + "");
        if (this.masterShip.dx != 0 || this.masterShip.dy != 0) {
            this.labelOpacity -= 0.05;
            if (this.labelOpacity <= 0) {
                this.labelOpacity = 0;
                //this.labelTitle.setOpacity(this.labelOpacity * 255);
            }
        }
        this.rocketSprite.setPosition(this.rocketSprite.getPosition().x + this.masterShip.dx, this.rocketSprite.getPosition()
            .y + this.masterShip.dy);
        this.setCameraSpeed();
        this.baseNode.setPosition(this.cameraPosX, this.cameraPosY);
    },
    addRotateInseki: function () {
        this.degree = this.getRandNumberFromRange(1, 360);
        var centerX = this.rocketSprite.getPosition().x;
        var centerY = this.rocketSprite.getPosition().y;
        var radius = 600;
        var rad = this.degree * Math.PI / 180;
        //X座標 = 円の中心のX座標 + 半径 × Cos(ラジアン)を出す
        var x = centerX + radius * Math.cos(rad);
        //Y座標 = 円の中心の中心Y座標 + 半径 × Sin(ラジアン)を出す
        var y = centerY + radius * Math.sin(rad);
        this.addInseki2(x, y);
    },
    addInseki2: function (x, y) {
        var _rand = this.getRandNumberFromRange(1, 5);
        this.starImage = "res/sprite_star001.png";
        if (_rand == 1) {
            this.starImage = "res/sprite_star001.png";
        }
        if (_rand == 2) {
            this.starImage = "res/sprite_star002.png";
        }
        if (_rand == 3) {
            this.starImage = "res/sprite_star003.png";
        }
        this.hoge = cc.Sprite.create(this.starImage);
        this.hoge.setPosition(x, y);
        this.baseNode.addChild(this.hoge);
        var _rand3 = this.getRandNumberFromRange(1, 10);
        this.hoge.setOpacity(255 * 0.1 * _rand3);
        var _rand2 = this.getRandNumberFromRange(1, 10);
        if (_rand2 == 2) {
            this.hoge.dx = this.getRandNumberFromRange(1, 10) - 5;
            this.hoge.dy = this.getRandNumberFromRange(1, 10) - 5;
        } else {
            this.hoge.dx = 0;
            this.hoge.dy = 0;
        }
        this.meteorites.push(this.hoge);
    },

    setUiShipMonitor: function () {
        //ランディング 001
        this.uiShipMonitor = cc.Sprite.create("res/menu_ship.png");
        this.uiShipMonitor.setPosition(320, 220);
        this.addChild(this.uiShipMonitor, 9999999);
        this.uiShipMonitor001 = cc.Sprite.create("res/ui_ship_monitor_001.png");
        this.uiShipMonitor001.setAnchorPoint(0, 0);
        this.uiShipMonitor001.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor001);
        this.buttonLanding = new cc.MenuItemImage("res/button_ship_landing.png", "res/button_ship_landing.png", function () {
            //cc.log("xxx");
            this.InfoMenu.setCost(10, 10);
            this.InfoMenu.uiWindowLanding.setVisible(true);
            this.InfoMenu.infoNode.setVisible(true);
        }, this);
        this.buttonLanding.setPosition(320, 60);
        var menu001 = new cc.Menu(this.buttonLanding);
        menu001.setPosition(0, 0);
        this.uiShipMonitor001.addChild(menu001);
        //フリー探索 002
        this.uiShipMonitor002 = cc.Sprite.create("res/ui_ship_monitor_001.png");
        this.uiShipMonitor002.setAnchorPoint(0, 0);
        this.uiShipMonitor002.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor002);
        this.buttonLaunch = new cc.MenuItemImage("res/button_ship_launch.png", "res/button_ship_launch.png", function () {
            this.InfoMenu.setCost(10, 10);
            this.InfoMenu.uiWindowLaunch.setVisible(true);
            this.InfoMenu.infoNode.setVisible(true);
            this.masterShip.targetTime = Math.ceil(this.pulledDist) + parseInt(new Date() / 1000);
            //this.shipTargetTimeLabel.setString("残り時間 : " + Math.ceil(this.pulledDist) + "min");
            this.baseNode.removeChild(this.drawNode2);
            this.explorationArrow.setVisible(false);
            this.explorationDistLabel.setVisible(false);
            this.explorationRarityLabel.setVisible(false);
        }, this);
        this.buttonLaunch.setPosition(460, 60);
        this.buttonCancel = new cc.MenuItemImage("res/button_ship_cancel.png", "res/button_ship_cancel.png", function () {
            //this.setMasterShipStatus(0, 0, 0, 0, "NO_DIST");
            //this.storage.saveShipDataToStorage(CONFIG.CARD[1], dx, dy, parseInt(new Date() / 1000) + targetTime, basePlanetId, destinationPlanetId,
            this.masterShip.status = "NO_DIST";
            this.masterShip.dx = 0;
            this.masterShip.dy = 0;
            this.baseNode.removeChild(this.drawNode2);
            this.explorationArrow.setVisible(false);
            this.explorationDistLabel.setVisible(false);
            this.explorationRarityLabel.setVisible(false);

            var _dx = 0;
            var _dy = 0;
            var _time = 0;
            var _basePlanetId = this.storage.getTargetPlanetId(CONFIG.CARD[1]);;
            var _destinationPlanetId = 0;
            this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST", 1);
            

        }, this);
        this.buttonCancel.setPosition(180, 60);
        var menu001 = new cc.Menu(this.buttonLaunch, this.buttonCancel);
        menu001.setPosition(0, 0);
        this.uiShipMonitor002.addChild(menu001);
        this.uiShipMonitor003 = cc.Sprite.create("res/ui_ship_monitor_001.png");
        this.uiShipMonitor003.setAnchorPoint(0, 0);
        this.uiShipMonitor003.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor003);
        //探索中
        this.uiShipMonitor004 = cc.Sprite.create("res/ui_ship_monitor_001.png");
        this.uiShipMonitor004.setAnchorPoint(0, 0);
        this.uiShipMonitor004.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor004);
        this.targetTimeLabel = cc.LabelTTF.create("", "Arial", 62);
        this.targetTimeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        //this.targetTimeLabel.enableStroke(new cc.Color(255, 255, 255, 255), 1, false);
        this.targetTimeLabel.setPosition(320, 800);
        //this.targetTimeLabel.setAnchorPoint(0, 0);
        this.targetTimeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiShipMonitor004.addChild(this.targetTimeLabel);
        this.buttonCancel = new cc.MenuItemImage("res/button_ship_cancel.png", "res/button_ship_cancel.png", function () {
            var _dx = 0;
            var _dy = 0;
            var _time = 0;
            var _basePlanetId = this.storage.getTargetPlanetId(CONFIG.CARD[1]);;
            var _destinationPlanetId = 0;
            this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST", 1);
            this.masterShip.status = "NO_DIST";
            this.masterShip.dx = 0;
            this.masterShip.dy = 0;
            this.baseNode.removeChild(this.drawNode2);
            this.explorationArrow.setVisible(false);
            this.explorationDistLabel.setVisible(false);
            this.explorationRarityLabel.setVisible(false);
            //this.basePlanet.setVisible(true);
            this.footer.goToDiscoveryLayer();
        }, this);
        this.buttonCancel.setPosition(320, 60);
        var menu001 = new cc.Menu(this.buttonCancel);
        menu001.setPosition(0, 0);
        this.uiShipMonitor004.addChild(menu001);
        this.touchStatus = "none";
    },
    setRocketSearchCompleate: function () {
        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            //経過した秒数が0秒 + 既存のステータスがmovigの場合は到着処理を行う
            if (this.masterShip.status == "MOVING") {
                //var _rand = this.getRandNumberFromRange(1, 7);
                //this.storage.savePlanetDataToStorage(CONFIG.PLANET[_rand], 1);
                this.masterShip.status = "FINISH";
                this.masterShip.dx = 0;
                this.masterShip.dy = 0;
                this.InfoMenu.infoNode.setVisible(true);
                this.InfoMenu.uiWindowResult.setVisible(true);
                this.basePlanet.setPosition(this.rocketSprite.getPosition().x, this.rocketSprite.getPosition().y);
            }
        }
        if (this.masterShip.status == "FINISH") {
            this.masterShip.dx = 0;
            this.masterShip.dy = 0;
            this.InfoMenu.infoNode.setVisible(true);
            this.InfoMenu.uiWindowResult.setVisible(true);
            this.basePlanet.setVisible(true);
        }
    },
    setCameraSpeed: function () {
        //カメラの設定
        if (this.masterShip.status == "MOVING") {
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
        //basePlanetがある場合は、そのplanetの衛星軌道をたどる
        if (this.masterShip.status != "MOVING") {
            if (this.rocketSprite.basePlanet != null) {
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
        }
    },
    getPastSecond: function () {
        var diffSecond = this.storage.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },
    getPastRescueSecond: function () {
        var diffSecond = this.masterShip.rescureTime - parseInt(new Date() / 1000);
        return diffSecond;
    },
    getPastSecond2: function () {
        var diffSecond = this.masterShip.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },
    setTargetTime: function () {
        this.maxChargeTime = 60 * 3;
        //if(this.storage.targetTime == null){
        this.storage.targetTime = parseInt(new Date() / 1000) + this.maxChargeTime;
        this.storage.saveCurrentData();
        //}
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
    touchStart: function (location) {
        if (this.masterShip.status != "NO_DIST") return;
        this.touchStatus = "start";
        this.fromP = cc.p(location.x, location.y);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
        this.shipP = this.rocketSprite.getPosition();
        this.baseNode.removeChild(this.drawNode2);
        this.drawNode2 = cc.DrawNode.create();
        this.baseNode.addChild(this.drawNode2, 99999999999);
    },
    touchMove: function (location) {
        //if (this.isPullRocket == false) return;
        if (this.touchStatus != "start") return;
        this.removeChild(this.drawNode);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode);
        this.toP = cc.p(location.x, location.y);
        this.pulledDist = cc.pDistance(this.fromP, this.toP);
        if (this.pulledDist >= 50) {
            //this.distanceLabel.setString(Math.ceil(this.pulledDist) + "km");
            //this.searchTimeLabel.setString(Math.ceil(this.pulledDist) + "min");
            this.masterShip.status = "SET_FREE_DIST";
        }
        var _rate = 1 / this.pulledDist;
        this.tmpDx2 = (this.fromP.x - this.toP.x) * 1;
        this.tmpDy2 = (this.fromP.y - this.toP.y) * 1;
        this.baseNode.removeChild(this.drawNode2);
        this.drawNode2 = cc.DrawNode.create();
        this.baseNode.addChild(this.drawNode2, 99999999999);
        this.shipP = this.rocketSprite.getPosition();
        this.toP = cc.p(this.shipP.x + this.tmpDx2, this.shipP.y + this.tmpDy2);
        this.lineWidth = 2;
        this.drawNode2.drawSegment(this.shipP, this.toP, this.lineWidth, this.lineColor);
        this.InfoMenu.shipTargetTimeLabel.setString("" + Math.ceil(this.pulledDist) + "");
        this.explorationDistLabel.setString(Math.ceil(this.pulledDist) + "KM");
        this.explorationArrow.setVisible(true);
        this.explorationDistLabel.setVisible(true);
        this.explorationRarityLabel.setVisible(true);
        this.explorationArrow.setPosition(this.toP.x, this.toP.y);
        this.explorationDistLabel.setPosition(this.toP.x, this.toP.y - 50);
        this.explorationRarityLabel.setPosition(this.toP.x, this.toP.y - 120);
        var _rad = this.getRadian(this.fromP.x, this.fromP.y, this.toP.x, this.toP.y);
        //cc.log(_rad);
        //var _rad = this.getRadian(0,100,this.toP.x - this.fromP.x,this.toP.y - this.fromP.y);
    },
    getRadian: function (x1, y1, x2, y2) {
        // マウス座標との差分を計算
        var dx = this.toP.x - this.rocketSprite.getPosition().x;
        var dy = this.toP.y - this.rocketSprite.getPosition().y;
        // 差分を元に方向を計算
        var radians = Math.atan2(dy, dx);
        // ラジアンを角度に変換
        var degrees = radians * 180 / Math.PI;
        // 表示オブジェクトの角度に反映
        //arrow.rotation = degrees;
        this.explorationArrow.setRotation(360 - degrees + 180 + 90);
        //cc.log(degrees);
    },
    touchFinish: function (location) {
        //if (this.isPullRocket == false) return;
        this.touchStatus = "end";
        if (this.touchStatus != "start") return;
        this.removeChild(this.drawNode);
        var _dist = cc.pDistance(this.fromP, this.toP);
        //cc.log(_dist);
        //100
        var _distRate = 1 / _dist;
        //this.tmpDx = (this.fromP.x - this.toP.x) / 1000;
        //this.tmpDy = (this.fromP.y - this.toP.y) / 1000;
        if (_dist >= 50) {
            this.masterShip.status = "SET_FREE_DIST";
        }
        this.baseNode.removeChild(this.drawNode2);
        this.drawNode2 = cc.DrawNode.create();
        this.baseNode.addChild(this.drawNode2, 99999999999);
        this.shipP = this.rocketSprite.getPosition();
        this.toP = cc.p(this.shipP.x + this.tmpDx2, this.shipP.y + this.tmpDy2);
        this.lineWidth = 2;
        this.drawNode2.drawSegment(this.shipP, this.toP, this.lineWidth, this.lineColor);
        this.explorationArrow.setVisible(true);
        this.explorationArrow.setPosition(this.toP.x, this.toP.y);
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
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
DiscoveryLayer2.create = function (storage, cardId) {
    return new DiscoveryLayer2(storage, cardId);
};
var DiscoveryLayer2Scene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new DiscoveryLayer2(storage, cardId);
        this.addChild(layer);
    }
});