var GameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, colorName, isCom) {
        this._super();
        //ゲーム状態
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
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        //storageのリセット
        this.storage.isSteal = false;
        this.storage.eventData = new Object();
        this.storage.enemyEventData = new Object();
        //カラーの分別
        this.colorName = colorName;
        if (this.colorName == "GREEN") {
            this.enemyColorName = "RED";
            this.greenUserId = this.storage.userId;
            this.redUserId = this.storage.battleTargetUserId;
        } else {
            this.enemyColorName = "GREEN";
            this.greenUserId = this.storage.battleTargetUserId;
            this.redUserId = this.storage.userId;
        }
        this.gameStatus = "wait";
        this.result = null;
        this.gameStartTimeCnt = 0;
        this.battleEffects = [];
        this.materials = [];
        this.endCnt = 0;
        this.orderCnt = 0;
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
        //this.header1 = new Header(this);
        //this.addChild(this.header1, 999999);
        //this.header1.setAnchorPoint(0.5, 0);
        //this.header1.setPosition(320, 1136 - 72);
        this.backNode = cc.Sprite.create("res/back_top2.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);
        this.baseNode = cc.Sprite.create("res/back_top.png");
        this.baseNode.setAnchorPoint(0, 0);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        this.battleWindow = new BattleWindow(this);
        this.addChild(this.battleWindow);
        this.battleWindow.setPosition(0, 0);
        this.battleWindowScale = 0.1;
        this.maxBattleWindowScale = 0.8;
        this.resultBattleWindowScale = 1.0;
        this.battleWindow.setScale(this.battleWindowScale);

/*
        //ノイズを乗せる
        this.noiseNode = cc.Sprite.create("res/back_top5.png");
        this.noiseNode.setAnchorPoint(0, 0);
        this.noiseNode.setPosition(0, 0);
        this.addChild(this.noiseNode);
*/

this.noise = new Noise();
this.addChild(this.noise);

        this.setHeaderLabel();
        this.setStartLabel();
        this.resultSprite = new BattleResult(this);
        this.addChild(this.resultSprite, 9999);
        this.resultSprite.setVisible(false);
        this.scheduleUpdate();
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        this.gameDirection = "";
        this.isMapMoving = false;
        this.labelStartCnt007Cnt = 0;
        this.noiseTime = 0;
        this.noiseOpacity = 0;
        this.noiseAddOpacity = 0;
        return true;
    },
    update: function (dt) {
        this.noiseNode.update();
        if (this.gameStatus == "gaming") {
            this.battleWindow.setShipHidden();
        }
        if (this.labelStartCnt007.isVisible()) {
            this.labelStartCnt007Cnt++;
        }
        if (this.labelStartCnt007Cnt >= 30) {
            this.labelStartCnt007Cnt = 0;
            this.labelStartCnt007.setVisible(false);
        }
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        if (this.gameStatus == "gaming") {
            this.setScroll();
        }
        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i].update() == false) {}
        }
        this.updateLabel();
        this.resultSprite.update();
        //モニターをupdateする
        this.battleWindow.update();
        this.gameStartTimeCnt++;
        this.setPrepareStatus();
        this.setStartStatus();
        this.setResultStatus();
    },
    setScroll: function () {
        //this.walkSpeed = 1 * 2;
        this.cameraSpeed = this.battleWindow.player.walkSpeed;
        if (Math.abs(this.targetBaseNodePosX - this.baseNodePosX) >= 2.5 * 3) {
            //差分が5以上の時
            if (this.targetBaseNodePosX > this.baseNodePosX) {
                this.baseNodePosX += this.cameraSpeed;
            } else if (this.targetBaseNodePosX < this.baseNodePosX) {
                this.baseNodePosX -= this.cameraSpeed;
            }
        } else {
            //差分が5以下の時
            if (this.targetBaseNodePosX > this.baseNodePosX) {
                this.baseNodePosX += 1;
            } else if (this.targetBaseNodePosX < this.baseNodePosX) {
                this.baseNodePosX -= 1;
            }
        }
        if (Math.abs(this.targetBaseNodePosY - this.baseNodePosY) >= 5) {
            //差分が5以上の時
            if (this.targetBaseNodePosY > this.baseNodePosY) {
                this.baseNodePosY += this.cameraSpeed;
            } else if (this.targetBaseNodePosY < this.baseNodePosY) {
                this.baseNodePosY -= this.cameraSpeed;
            }
        } else {
            //差分が5以下の時
            if (this.targetBaseNodePosY > this.baseNodePosY) {
                this.baseNodePosY += 1;
            } else if (this.targetBaseNodePosY < this.baseNodePosY) {
                this.baseNodePosY -= 1;
            }
        }
        this.battleWindow.setPosition(this.baseNodePosX, this.baseNodePosY);
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
            this.header.addChild(_material, 999999);
            //_material.setPosition(610 - 62 * (this.orderCnt - 1), 110);
            _material.setPosition(570, 160 - this.orderCnt * 45);
        }
    },
    setHeaderLabel: function () {
        this.header = cc.Sprite.create("res/header001.png");
        this.header.setPosition(320, 1136 - 150);
        this.header.setAnchorPoint(0.5, 0);
        //this.addChild(this.header, 999999999999);
        this.scoreLabel = new cc.LabelTTF(this.greenScore, "Arial", 20);
        this.scoreLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.scoreLabel.setAnchorPoint(1, 0);
        this.scoreLabel.setPosition(340, 105);
        //this.header.addChild(this.scoreLabel, 999999);
        this.gauge = new Gauge(256, 10, "white");
        //this.header.addChild(this.gauge);
        this.gauge.setPosition(87, 87);
        this.alertLevelLabel = new cc.LabelTTF("LV:1", "Arial", 42);
        this.alertLevelLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.alertLevelLabel.setAnchorPoint(0.5, 0);
        this.alertLevelLabel.setPosition(45, 80);
        //this.header.addChild(this.alertLevelLabel, 999999);
    },
    updateLabel: function () {
        //this.timeLabel.setString(this.battleWindow.gameTime + "");
        this.scoreLabel.setString(this.battleWindow.gameScore + "");
        this.alertLevelLabel.setString(this.battleWindow.gameLevel);
        this.gauge.update(this.battleWindow.gameOccupyRate);
    },
    setPrepareStatus: function () {
        if (this.gameStatus == "prepare") {
            this.gameStatus = "wait";
        }
    },
    setStartStatus: function () {
        if (this.gameStatus != "wait") return;
        this.labelStartCnt001.setVisible(false);
        this.labelStartCnt002.setVisible(false);
        this.labelStartCnt003.setVisible(false);
        this.labelStartCnt004.setVisible(false);
        //if (this.battleMessage.isReadTutorial == false) return;
        this.battleWindow.setShipLand("send");
        this.battleWindowScale += 0.07;
        if (this.battleWindowScale >= this.maxBattleWindowScale) {
            this.battleWindowScale = this.maxBattleWindowScale;
        }
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        this.battleWindow.setScale(this.battleWindowScale);
        this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        this.setScroll();
        if (1 * 30 < this.gameStartTimeCnt && this.gameStartTimeCnt < 30 * 2) {
            this.labelStartCnt001.setVisible(true);
        }
        if (2 * 30 < this.gameStartTimeCnt && this.gameStartTimeCnt < 30 * 3) {
            this.labelStartCnt002.setVisible(true);
        }
        if (3 * 30 < this.gameStartTimeCnt && this.gameStartTimeCnt < 30 * 4) {
            this.labelStartCnt003.setVisible(true);
        }
        if (4 * 30 < this.gameStartTimeCnt && this.gameStartTimeCnt < 30 * 5) {
            this.labelStartCnt004.setVisible(true);
        }
        if (this.gameStartTimeCnt >= 30 * 5) {
            if (this.gameStatus == "wait") {
                this.gameStatus = "gaming";
                this.message = "";
                this.battleWindow.mode = "gaming";
            }
        }
    },
    setResultStatus: function () {
        if (this.battleWindow.mode == "result") {
            this.gameStatus = "end";
            this.result = this.battleWindow.result;
            this.endCnt++;
            //成功時のみshipがお迎えに来る
            if (this.battleWindow.result == "success") {
                this.battleWindow.setShipLand("get");
                this.battleWindowScale += 0.02;
                if (this.battleWindowScale >= this.resultBattleWindowScale ) {
                    this.battleWindowScale = this.resultBattleWindowScale ;
                }
            } else {
                this.battleWindowScale += 0.02;
                if (this.battleWindowScale >= this.resultBattleWindowScale ) {
                    this.battleWindowScale = this.resultBattleWindowScale ;
                }
            }
            //常に中央を表示するようにする
            var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
            this.battleWindow.setScale(this.battleWindowScale);
            this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
            this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
            this.setScroll();
            //そこまで!のラベルを表示する
            if (0 <= this.endCnt && this.endCnt < 30 * 1) {
                if (this.battleWindow.result == "success") {
                    this.labelStartCnt006.setVisible(true);
                } else {
                    this.labelStartCnt005.setVisible(true);
                }
            }
            //試合結果を表示する
            if (this.endCnt == 30 * 2.2) {
                //cc.sys.openURL("http://webdesign.about.com/");
                this.labelStartCnt005.setVisible(false);
                this.labelStartCnt006.setVisible(false);
                this.resultSprite.setVisible(true);
                this.resultSprite.sendMessage();
            }
        }
    },
    setStartLabel: function () {
        this.labelStartCnt001 = cc.Sprite.create("res/label_starttime001.png");
        this.labelStartCnt001.setPosition(320, 600);
        this.addChild(this.labelStartCnt001, 99999999);
        this.labelStartCnt001.setVisible(false);
        this.labelStartCnt002 = cc.Sprite.create("res/label_starttime002.png");
        this.labelStartCnt002.setPosition(320, 600);
        this.addChild(this.labelStartCnt002, 99999999);
        this.labelStartCnt002.setVisible(false);
        this.labelStartCnt003 = cc.Sprite.create("res/label_starttime003.png");
        this.labelStartCnt003.setPosition(320, 600);
        this.addChild(this.labelStartCnt003, 99999999);
        this.labelStartCnt003.setVisible(false);
        this.labelStartCnt004 = cc.Sprite.create("res/label_starttime004.png");
        this.labelStartCnt004.setPosition(320, 600);
        this.addChild(this.labelStartCnt004, 99999999);
        this.labelStartCnt004.setVisible(false);
        this.labelStartCnt005 = cc.Sprite.create("res/label_starttime005.png");
        this.labelStartCnt005.setPosition(320, 600);
        this.addChild(this.labelStartCnt005, 99999999);
        this.labelStartCnt005.setVisible(false);
        this.labelStartCnt006 = cc.Sprite.create("res/label_starttime006.png");
        this.labelStartCnt006.setPosition(320, 600);
        this.addChild(this.labelStartCnt006, 99999999);
        this.labelStartCnt006.setVisible(false);
        this.labelStartCnt007 = cc.Sprite.create("res/label_starttime007.png");
        this.labelStartCnt007.setPosition(320, 600);
        this.addChild(this.labelStartCnt007, 99999999);
        this.labelStartCnt007.setVisible(false);
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    touchStart: function (location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
    },
    touchMove: function (location) {
        var roopCnt = 1;
        var dist = Math.sqrt((this.firstTouchX - location.x) * (this.firstTouchX - location.x) + (this.firstTouchY - location.y) * (this.firstTouchY - location.y));
        if (this.isMapMoving == false && dist >= 10) {
            if (this.firstTouchX < location.x && this.firstTouchY < location.y) {
                //右上
                cc.log("右上");
                this.gameDirection = "right_up";
                this.isMapMoving = true;
            } else
            if (this.firstTouchX < location.x && this.firstTouchY > location.y) {
                //右下
                cc.log("右下");
                this.gameDirection = "right_down";
                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY < location.y) {
                //左上
                cc.log("左上");
                this.gameDirection = "left_up";
                this.isMapMoving = true;
            } else
            if (this.firstTouchX > location.x && this.firstTouchY > location.y) {
                //左下
                cc.log("左下");
                this.gameDirection = "left_down";
                this.isMapMoving = true;
            } else {}
        }
    },
    touchFinish: function (location) {
        this.isMapMoving = false;
    },
});
GameLayer.create = function (storage, hackingType, isCom) {
    return new GameLayer(storage, hackingType, isCom);
};
var GameLayerScene = cc.Scene.extend({
    onEnter: function (storage, hackingType, isCom) {
        this._super();
        var layer = new GameLayer(storage, hackingType, isCom);
        this.addChild(layer);
    }
});