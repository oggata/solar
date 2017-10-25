var DiscoveryLayer2 = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //cc.sys.localStorage.clear();
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
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
        this.noiseTime = 0;
        this.noiseOpacity = 0;
        this.noiseAddOpacity = 0.05;
        this.noiseNode = cc.Sprite.create("res/back_top5.png");
        this.noiseNode.setAnchorPoint(0, 0);
        this.noiseNode.setPosition(0, 0);
        this.addChild(this.noiseNode);
        this.header1 = new Header(this);
        this.addChild(this.header1, 999999);
        this.header1.setAnchorPoint(0.5, 0);
        this.viewSize = cc.director.getVisibleSize();
        this.header1.setPosition(320, this.viewSize.height - 72);
        this.maxChargeTime = 60 * 3;
        this.labelOpacity = 1;
        this.planets = [];
        this.baseNode = cc.Node.create();
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        //this.isSetPlanet = false;
        this.baseNodeScale = 1.000;
        this.baseNode.setScale(this.baseNodeScale, this.baseNodeScale);
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
        this.initializeWarpAnimation();
        this.tmpDx = 0;
        this.tmpDy = 0;
        this.touchStatus = "none";
        this.shipControlMenu = new ShipControlMenu(this);
        this.addChild(this.shipControlMenu);
        this.InfoMenu = new InfoMenu(this);
        this.addChild(this.InfoMenu);
        this.cameraSpeed = 1;
        this.fromP = cc.p(1, 1);
        this.toP = cc.p(1, 1);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        this.arrow = cc.Sprite.create("res/marker_search.png");
        this.arrow.setPosition(0, 1136 - 220);
        this.baseNode.addChild(this.arrow, 999999999999999999999999999999999999);
        this.arrow.setVisible(false);
        this.arrowLabel = cc.LabelTTF.create("500KM", "Arial", 42);
        this.arrowLabel.setPosition(160, 240);
        this.arrowLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.baseNode.addChild(this.arrowLabel, 999999999999999999999999999999999999);
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
            this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId,
                "NO_DIST", 1);
        }
        for (var key in this.storage.shipData) {
            if (this.storage.shipData.hasOwnProperty(key)) {
                if (key == 'ID_1') {
                    var value = this.storage.shipData[key];
                    this.masterShip = JSON.parse(value);
                }
            }
        }
        //拠点の惑星を取得する
        var _rootPlanetNum = this.storage.getBasePlanetId(CONFIG.CARD[1]);
        var _planet = CONFIG.PLANET[_rootPlanetNum];
        //地球を作成する
        this.basePlanet = new PlanetSprite(this, _planet);
        this.baseNode.addChild(this.basePlanet, 999);
        this.basePlanet.setPosition(5000, 5000);
        //this.basePlanet.setScale(0.5, 0.5);
        this.planets.push(this.basePlanet);
        //探索船を作る
        this.ship = new Ship(this, this.basePlanet);
        this.baseNode.addChild(this.ship, 999);
        this.ship.setPosition(5000, 5000);
        var fade = 2.5; // 消えるまでの時間
        var minSeg = 0.1; // セグメントの最小値（小さく設定すると滑らかになる）
        var stroke = 10; //描画の幅
        var texture = "res/planet_arrow.png"; //テクスチャの画像
        this.shipSmoke2 = cc.MotionStreak.create(4, 0.1, 10, cc.color.RED, texture);
        this.baseNode.addChild(this.shipSmoke2, 999);
        this.shipSmoke = cc.MotionStreak.create(2, 0.1, 8, cc.color.MAGENTA, texture);
        this.baseNode.addChild(this.shipSmoke, 9999);
        //カメラの設定
        this.cameraTargetPosX = 0;
        this.cameraTargetPosY = 0;
        if (this.ship.basePlanet == null) {
            this.cameraTargetPosX = 320 - this.ship.getPosition().x;
            this.cameraTargetPosY = 480 - this.ship.getPosition().y;
        } else {
            this.cameraTargetPosX = 320 - this.ship.basePlanet.getPosition().x;
            this.cameraTargetPosY = 480 - this.ship.basePlanet.getPosition().y;
        }
        this.cameraPosX = this.cameraTargetPosX;
        this.cameraPosY = this.cameraTargetPosY;
        this.baseNode.setPosition(this.cameraTargetPosX, this.cameraTargetPosY);
        //shipの終了判定
        this.addDebrisCnt = 0;
        this.meteorites = [];
        for (var i = 0; i <= 20; i++) {
            var _x = this.getRandNumberFromRange(this.ship.getPosition().x - 360, this.ship.getPosition().x + 360);
            var _y = this.getRandNumberFromRange(this.ship.getPosition().y - 1136 / 2, this.ship.getPosition().y + 1136 / 2);
            this.addDebrisByPos(_x, _y, 1);
        }
        if (this.masterShip.status == "MOVING") {
            this.basePlanet.setVisible(false);
        } else {
            this.basePlanet.setVisible(true);
        }
        this.debugButton = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.masterShip.targetTime = parseInt(new Date() / 1000);
        }, this);
        this.debugButton.setPosition(80, 1000);
        this.debug2Button = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.storage.addCoin(10000);
        }, this);
        this.debug2Button.setPosition(80, 950);
        var menu001 = new cc.Menu(this.debugButton, this.debug2Button);
        menu001.setPosition(0, 0);
        this.addChild(menu001, 999999999999999999);
        if (this.storage.targetMovePlanetId != 0) {
            _fuelCost = 100;
            this.InfoMenu.setCost(_fuelCost, 10);
            this.InfoMenu.uiWindowLaunch.setVisible(true);
            this.InfoMenu.infoNode.setVisible(true);
            this.masterShip.targetTime = 100 + parseInt(new Date() / 1000);
            this.masterShip.status = "SET_FREE_DIST";
            this.tmpDx2 = 200;
            this.tmpDy2 = 200;
            this.pulledDist = 500;
        }
        this.cameraGapPosX = 0;
        this.cameraGapPosY = 0;
        this.cameraGapAddPosX = 1;
        this.cameraGapAddPosY = 1;
        this.debriCnt = 0;
        return true;
    },
    update: function (dt) {
        if (this.masterShip.status != "MOVING") {
            this.debriCnt++;
            if (this.debriCnt >= 15) {
                this.debriCnt = 0;
                this.addDebris(2);
            }
            if (this.masterShip.status != "SET_FREE_DIST") {
                //cc.log(this.ship.basePlanet.degree);
                this.ship.setRotation(360 - this.basePlanet.degree + 360 + 90);
            }
        }
        //ノイズのエフェクト
        this.noiseTime++;
        if (this.noiseTime >= 30 * 15) {
            this.noiseTime = 0;
        }
        if (this.noiseTime >= 0 && this.noiseTime <= 30 * 3) {
            if (this.noiseOpacity <= 0) {
                this.noiseAddOpacity = 0.4;
            } else if (this.noiseOpacity >= 0.4) {
                this.noiseAddOpacity = -0.4;
            }
            this.noiseOpacity += this.noiseAddOpacity;
            this.noiseNode.setOpacity(255 * this.noiseOpacity);
        } else {
            this.noiseNode.setOpacity(255 * 0);
        }
        this.header1.fuelLabel.setString("" + this.storage.totalCoinAmount);
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
            this.addDebrisCnt++;
            if (this.addDebrisCnt >= 5) {
                this.addDebrisCnt = 0;
                this.addDebris(1);
            }
            this.shipSmoke.setPosition(this.ship.getPosition().x + this.masterShip.dx, this.ship.getPosition().y + this.masterShip
                .dy);
            this.shipSmoke2.setPosition(this.ship.getPosition().x + this.masterShip.dx, this.ship.getPosition().y + this.masterShip
                .dy);
        }
        for (var i = 0; i < this.meteorites.length; i++) {
            this.meteorites[i].setPosition(this.meteorites[i].getPosition().x + this.meteorites[i].dx, this.meteorites[i].getPosition()
                .y + this.meteorites[i].dy);
            this.meteorites[i].smoke.setPosition(this.meteorites[i].getPosition().x + this.meteorites[i].dx, this.meteorites[
                i].getPosition().y + this.meteorites[i].dy);
            var _dist = cc.pDistance(this.ship.getPosition(), this.meteorites[i].getPosition());
            if (_dist >= 800) {
                this.baseNode.removeChild(this.meteorites[i].smoke);
                this.baseNode.removeChild(this.meteorites[i]);
            }
        }
        this.ship.update();
        this.shipControlMenu.update();
        if (this.ship.basePlanet != null) {
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
        //this.shipControlMenu.targetTimeLabel.setString("" + this.pastSecond + "");
        this.ship.timeLabel.setString(this.pastSecond);
        if (this.masterShip.dx != 0 || this.masterShip.dy != 0) {
            this.labelOpacity -= 0.05;
            if (this.labelOpacity <= 0) {
                this.labelOpacity = 0;
            }
        }
        this.ship.setPosition(this.ship.getPosition().x + this.masterShip.dx, this.ship.getPosition().y + this.masterShip.dy);
        //this.shipSmoke.setPosition(this.ship.getPosition().x + this.masterShip.dx, this.ship.getPosition().y + this.masterShip.dy);
        this.setCameraSpeed();
        this.baseNode.setPosition(this.cameraPosX, this.cameraPosY);
    },
    addDebris: function (type) {
        //type:1 動くものと、動かないもの合わせる type:2 動くものだけ
        this.degree = this.getRandNumberFromRange(1, 360);
        var centerX = this.ship.getPosition().x;
        var centerY = this.ship.getPosition().y;
        var radius = 600;
        var rad = this.degree * Math.PI / 180;
        //X座標 = 円の中心のX座標 + 半径 × Cos(ラジアン)を出す
        var x = centerX + radius * Math.cos(rad);
        //Y座標 = 円の中心の中心Y座標 + 半径 × Sin(ラジアン)を出す
        var y = centerY + radius * Math.sin(rad);
        this.addDebrisByPos(x, y, type);
    },
    addDebrisByPos: function (x, y, type) {
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
        if (type == 1) {
            var _rand2 = this.getRandNumberFromRange(1, 10);
            if (_rand2 == 2) {
                this.hoge.dx = this.getRandNumberFromRange(1, 10) - 5;
                this.hoge.dy = this.getRandNumberFromRange(1, 10) - 5;
            } else {
                this.hoge.dx = 0;
                this.hoge.dy = 0;
            }
        } else if (type == 2) {
            this.hoge.dx = this.getRandNumberFromRange(1, 10) - 5;
            this.hoge.dy = this.getRandNumberFromRange(1, 10) - 5;
        } else {
            this.hoge.dx = 0;
            this.hoge.dy = 0;
        }
        this.hoge.dx = this.hoge.dx * 2;
        this.hoge.dx = this.hoge.dx * 2;
        var fade = this.getRandNumberFromRange(1, 6); // 消えるまでの時間
        var minSeg = 0.01; // セグメントの最小値（小さく設定すると滑らかになる）
        var stroke = this.getRandNumberFromRange(1, 4); //描画の幅
        var texture = "res/sprite_star003.png"; //テクスチャの画像
        this.smoke = cc.MotionStreak.create(fade, minSeg, stroke, cc.color.WHITE, texture);
        this.baseNode.addChild(this.smoke, 999999999999999);
        this.smoke.setPosition(320, 320);
        this.hoge.smoke = this.smoke;
        this.meteorites.push(this.hoge);
    },
    setRocketSearchCompleate: function () {
        this.pastSecond = this.getPastSecond2();
        if (this.pastSecond <= 0) {
            this.pastSecond = 0;
            //経過した秒数が0秒 + 既存のステータスがmovigの場合は到着処理を行う
            if (this.masterShip.status == "MOVING") {
                this.masterShip.status = "FINISH";
                this.masterShip.dx = 0;
                this.masterShip.dy = 0;
                this.InfoMenu.infoNode.setVisible(true);
                this.InfoMenu.uiWindowResult.setVisible(true);
                this.basePlanet.setPosition(this.ship.getPosition().x, this.ship.getPosition().y);
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
        //this.cameraPosX += 2;
        //カメラの設定
        if (this.masterShip.status == "MOVING") {
            //拠点の惑星があれば、その惑星の中心にカメラを固定する
            this.cameraTargetPosX = 320 - this.ship.getPosition().x;
            this.cameraTargetPosY = 580 - this.ship.getPosition().y;
        } else {
            //拠点の惑星があれば、ロケットをカメラが追いかける
            this.cameraTargetPosX = 320 - this.ship.basePlanet.getPosition().x;
            this.cameraTargetPosY = 580 - this.ship.basePlanet.getPosition().y;
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
        if (this.cameraGapPosX >= 30) {
            this.cameraGapAddPosX = -0.25;
        }
        if (this.cameraGapPosX <= -30) {
            this.cameraGapAddPosX = +0.25;
        }
        this.cameraGapPosX += this.cameraGapAddPosX;
        this.cameraPosX += this.cameraGapPosX;
        if (this.cameraGapPosY >= 30) {
            this.cameraGapAddPosY = -0.25;
        }
        if (this.cameraGapPosY <= -30) {
            this.cameraGapAddPosY = +0.25;
        }
        this.cameraGapPosY += this.cameraGapAddPosY;
        this.cameraPosY += this.cameraGapPosY;
        //this.baseNodeScale+=0.005;
        //this.baseNode.setScale(this.baseNodeScale, this.baseNodeScale);
    },
    setBrakingDistance: function () {
        //惑星との距離によって制動距離を変える
        var _targetPlanet = this.getMostNearPlanet(this.ship.getPosition().x, this.ship.getPosition().y, 300);
        //basePlanetがある場合は、そのplanetの衛星軌道をたどる
        if (this.masterShip.status != "MOVING") {
            if (this.ship.basePlanet != null) {
                var _targetPosX = this.ship.basePlanet.getPosition().x + this.ship.basePlanet.satelliteSprite.getPosition().x -
                    this.ship.basePlanet.planetSpriteW / 2;
                var _targetPosY = this.ship.basePlanet.getPosition().y + this.ship.basePlanet.satelliteSprite.getPosition().y -
                    this.ship.basePlanet.planetSpriteW / 2;
                var _posX = this.ship.getPosition().x;
                var _posY = this.ship.getPosition().y;
                if (Math.abs(this.ship.getPosition().x - _targetPosX) >= 5) {
                    if (this.ship.getPosition().x <= _targetPosX) {
                        _posX = this.ship.getPosition().x + 4;
                    } else {
                        _posX = this.ship.getPosition().x - 4;
                    }
                } else {
                    _posX = _targetPosX;
                }
                if (Math.abs(this.ship.getPosition().y - _targetPosY) >= 5) {
                    if (this.ship.getPosition().y <= _targetPosY) {
                        _posY = this.ship.getPosition().y + 4;
                    } else {
                        _posY = this.ship.getPosition().y - 4;
                    }
                } else {
                    _posY = _targetPosY;
                }
                this.ship.setPosition(_posX, _posY);
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
                (_x - this.planets[i].getPosition().x * this.baseNodeScale) * (_x - this.planets[i].getPosition().x * this.baseNodeScale) +
                (_y - this.planets[i].getPosition().y * this.baseNodeScale) * (_y - this.planets[i].getPosition().y * this.baseNodeScale)
            );
            if (_distance <= _dist) {
                return this.planets[i];
            }
        }
        return null;
    },
    touchStart: function (location) {
cc.log(this.masterShip.status);
        if (this.masterShip.status != "NO_DIST") return;
        this.touchStatus = "start";
        this.fromP = cc.p(location.x, location.y);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode, 99999999999);
        this.shipP = this.ship.getPosition();
        this.baseNode.removeChild(this.drawNode2);
        this.drawNode2 = cc.DrawNode.create();
        this.baseNode.addChild(this.drawNode2, 99999999999);
    },
    touchMove: function (location) {
        //if (this.isPullRocket == false) return;
        if (this.touchStatus != "start") return;
        this.removeChild(this.drawNode);
        this.drawNode = cc.DrawNode.create();
        this.addChild(this.drawNode, 99999999999);
        this.toP = cc.p(location.x, location.y);
        this.pulledDist = cc.pDistance(this.fromP, this.toP);
        if (this.pulledDist >= 50) {
            this.masterShip.status = "SET_FREE_DIST";
            var _rate = 1 / this.pulledDist;
            this.tmpDx2 = (this.fromP.x - this.toP.x) * 1;
            this.tmpDy2 = (this.fromP.y - this.toP.y) * 1;
            this.baseNode.removeChild(this.drawNode2);
            this.drawNode2 = cc.DrawNode.create();
            this.baseNode.addChild(this.drawNode2, 99999999999);
            this.shipP = this.ship.getPosition();
            this.toP = cc.p(this.shipP.x + this.tmpDx2, this.shipP.y + this.tmpDy2);
            this.lineWidth = 2;
            this.drawNode2.drawSegment(this.shipP, this.toP, this.lineWidth, this.lineColor);
            this.InfoMenu.shipTargetTimeLabel.setString("" + Math.ceil(this.pulledDist) + "");
            this.arrowLabel.setString(Math.ceil(this.pulledDist) + "KM");
            this.arrow.setVisible(true);
            this.arrowLabel.setVisible(true);
            this.arrow.setPosition(this.toP.x, this.toP.y);
            this.arrowLabel.setPosition(this.toP.x, this.toP.y - 50);
            var _rad = this.getRadian(this.fromP.x, this.fromP.y, this.toP.x, this.toP.y);
            //cc.log(_rad);
            //var _rad = this.getRadian(0,100,this.toP.x - this.fromP.x,this.toP.y - this.fromP.y);
        }
    },
    getRadian: function (x1, y1, x2, y2) {
        // マウス座標との差分を計算
        var dx = this.toP.x - this.ship.getPosition().x;
        var dy = this.toP.y - this.ship.getPosition().y;
        // 差分を元に方向を計算
        var radians = Math.atan2(dy, dx);
        // ラジアンを角度に変換
        var degrees = radians * 180 / Math.PI;
        // 表示オブジェクトの角度に反映
        //arrow.rotation = degrees;
        this.arrow.setRotation(360 - degrees + 180 + 90);
        this.ship.setRotation(360 - degrees + 360 + 90);
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
        this.shipP = this.ship.getPosition();
        this.toP = cc.p(this.shipP.x + this.tmpDx2, this.shipP.y + this.tmpDy2);
        this.lineWidth = 2;
        this.drawNode2.drawSegment(this.shipP, this.toP, this.lineWidth, this.lineColor);
        this.arrow.setVisible(true);
        this.arrow.setPosition(this.toP.x, this.toP.y);
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