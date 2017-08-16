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
        //isCom = true;
        this.storage.saveDeckDataToStorage(1, CONFIG.CARD[1]);
        //playBattleBGM(this.storage);
        //this.isCom = isCom;
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        //this.storage = storage;
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
        //ステータス
        this.destCaptureRate = 0.1;
        this.captureCnt = 0;
        this.maxCaptureCnt = 0;
        this.captureRate = 0;
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
        this.baseNode = cc.Sprite.create("res/back_top.png");
        this.baseNode.setAnchorPoint(0, 0);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        this.battleWindow = new BattleWindow(this);
        this.addChild(this.battleWindow, 999);
        this.battleWindow.setPosition(0, 0);
        this.battleWindowScale = 0.1;
        this.maxBattleWindowScale = 1.0;
        this.battleWindow.setScale(this.battleWindowScale);
        this.setHeaderLabel();
        this.setStartLabel();
        this.resultSprite = new BattleResult(this);
        this.addChild(this.resultSprite, 9999);
        this.resultSprite.setPosition(320, 500);
        this.resultSprite.setVisible(false);
        this.scheduleUpdate();
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        return true;
    },
    setScroll: function () {
        if (Math.abs(this.targetBaseNodePosX - this.baseNodePosX) >= 2.5 * 3) {
            //差分が5以上の時
            if (this.targetBaseNodePosX > this.baseNodePosX) {
                this.baseNodePosX += 2.5 * 3;
            } else if (this.targetBaseNodePosX < this.baseNodePosX) {
                this.baseNodePosX -= 2.5 * 3;
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
                this.baseNodePosY += 2.5 * 3;
            } else if (this.targetBaseNodePosY < this.baseNodePosY) {
                this.baseNodePosY -= 2.5 * 3;
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
    update: function (dt) {
        if (this.gameStatus == "gaming") {
            this.battleWindow.setShipHidden();
        }
        //画面表示
        this.maxCaptureCnt = this.battleWindow.positionalMarkers.length * this.destCaptureRate;
        this.captureRate = Math.floor(this.captureCnt / this.maxCaptureCnt * 100) / 100;
        if (this.captureRate >= 1) {
            this.captureRate = 1;
        }
        //目標を上回ったらゲーム終了
        if (this.captureRate >= 1) {
            this.battleWindow.mode = "result";
        }
        //this.occupiedGauge.update(this.captureRate);
        this.occupiedRateLabel.setString(Math.floor(this.captureRate * 100) + "%");
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        //this.battleWindowScale
        //1:320x420  1.6:-100x400 2.2:-500
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
            _material.setPosition(610 - 62 * (this.orderCnt - 1), 110);
        }
    },
    setHeaderLabel: function () {
        this.header = cc.Sprite.create("res/header001.png");
        this.header.setPosition(320, 1136 - 150);
        this.header.setAnchorPoint(0.5, 0);
        this.addChild(this.header, 999999);
        this.occupiedRateLabel = new cc.LabelTTF(this.greenScore, "Arial", 46);
        this.occupiedRateLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.occupiedRateLabel.setAnchorPoint(1, 0);
        this.occupiedRateLabel.setPosition(240, 80);
        this.header.addChild(this.occupiedRateLabel, 999999);
        this.timeLabel = new cc.LabelTTF("123", "Arial", 24);
        this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.timeLabel.setAnchorPoint(0, 0);
        this.timeLabel.setPosition(320, 110);
        this.header.addChild(this.timeLabel, 999999);
        //this.occupiedGauge = new Gauge(530, 20, 'GREEN');
        //this.occupiedGauge.setAnchorPoint(0, 0);
        //this.occupiedGauge.setPosition(100, 70);
        //this.header.addChild(this.occupiedGauge);
    },
    updateLabel: function () {
        this.timeLabel.setString(this.battleWindow.maxGameTime - this.battleWindow.gameTime + "");
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
        this.battleWindow.setLand();
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
        if (1 * 10 < this.gameStartTimeCnt && this.gameStartTimeCnt < 10 * 2) {
            this.labelStartCnt001.setVisible(true);
        }
        if (2 * 10 < this.gameStartTimeCnt && this.gameStartTimeCnt < 10 * 3) {
            this.labelStartCnt002.setVisible(true);
        }
        if (3 * 10 < this.gameStartTimeCnt && this.gameStartTimeCnt < 10 * 4) {
            this.labelStartCnt003.setVisible(true);
        }
        if (4 * 10 < this.gameStartTimeCnt && this.gameStartTimeCnt < 10 * 5) {
            this.labelStartCnt004.setVisible(true);
        }
        if (this.gameStartTimeCnt >= 10 * 5) {
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
            this.battleWindow.setLand();
            /*
            this.maxBattleWindowScale = 2;
            this.battleWindowScale += 0.07;
            if (this.battleWindowScale >= this.maxBattleWindowScale) {
                this.battleWindowScale = this.maxBattleWindowScale;
            }
            */
            this.battleWindowScale -= 0.0025;
            if (this.battleWindowScale <= 0.1) {
                this.battleWindowScale = 0.02;
            }
            //常に中央を表示するようにする
            var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
            this.battleWindow.setScale(this.battleWindowScale);
            this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
            this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
            this.setScroll();
            //そこまで!のラベルを表示する
            if (0 <= this.endCnt && this.endCnt < 30 * 1) {
                this.labelStartCnt005.setVisible(true);
            }
            //試合結果を表示する
            if (this.endCnt == 30 * 1) {
                //cc.log("window open!!");
                //cc.sys.openURL("http://webdesign.about.com/");
                this.labelStartCnt005.setVisible(false);
                this.resultSprite.setVisible(true);
                if (this.greenScore > this.redScore) {
                    var _addCoin = 10;
                    /*
                    this.msg = "勝利しました!!!!!\nSGK残高が" + this.storage.treasureAmount + "->" + Math.ceil(this.storage.treasureAmount +
                        _addCoin) + "に\n増加しました!";
                    this.msg = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
                    this.storage.treasureAmount += _addCoin;
                    this.storage.saveCurrentData();
                    */
                } else {
                    var _addCoin = 10;
                    /*
                    this.msg = "敗北しました！\nSGK残高が" + this.storage.treasureAmount + "->" + Math.ceil(this.storage.treasureAmount -
                        _addCoin) + "に\n減少しました!";
                    this.msg = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
                    this.storage.treasureAmount -= _addCoin;
                    this.storage.saveCurrentData();
                    */
                }
                this.resultSprite.sendMessage();
            }
        }
    },
    /*
    addBattleEffect: function (colorName, cardId) {
        this.battleEffect = new BattleEffect(this, colorName, cardId);
        this.addChild(this.battleEffect, 99999999);
        this.battleEffect.setPosition(0, 240);
        this.battleEffects.push(this.battleEffect);
    },
    */
    setStartLabel: function () {
        this.labelStartCnt001 = cc.Sprite.create("res/label_starttime001.png");
        this.labelStartCnt001.setPosition(320, 500);
        this.addChild(this.labelStartCnt001, 99999999);
        this.labelStartCnt001.setVisible(false);
        this.labelStartCnt002 = cc.Sprite.create("res/label_starttime002.png");
        this.labelStartCnt002.setPosition(320, 500);
        this.addChild(this.labelStartCnt002, 99999999);
        this.labelStartCnt002.setVisible(false);
        this.labelStartCnt003 = cc.Sprite.create("res/label_starttime003.png");
        this.labelStartCnt003.setPosition(320, 500);
        this.addChild(this.labelStartCnt003, 99999999);
        this.labelStartCnt003.setVisible(false);
        this.labelStartCnt004 = cc.Sprite.create("res/label_starttime004.png");
        this.labelStartCnt004.setPosition(320, 500);
        this.addChild(this.labelStartCnt004, 99999999);
        this.labelStartCnt004.setVisible(false);
        this.labelStartCnt005 = cc.Sprite.create("res/label_starttime005.png");
        this.labelStartCnt005.setPosition(320, 500);
        this.addChild(this.labelStartCnt005, 99999999);
        this.labelStartCnt005.setVisible(false);
    },
    goToListLayer: function (errorNum) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(ListLayer.create(this.storage, errorNum));
        cc.director.runScene(cc.TransitionFadeTR.create(0.5, scene));
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    touchStart: function (location) {
        this.firstTouchX = location.x;
        this.firstTouchY = location.y;
        var marker = this.battleWindow.getMarker(location.x - this.battleWindow.getPosition().x, location.y - this.battleWindow
            .getPosition().y);
        this.battleWindow.selectedMarker.setPosition(marker.getPosition().x, marker.getPosition().y);
        this.battleWindow.selectedMarker.col = marker.col;
        this.battleWindow.selectedMarker.row = marker.row;
        //this.battleWindow.selectedMarkerCol = marker.col;
        //this.battleWindow.selectedMarkerRow = marker.row;
    },
    touchMove: function (location) {
        var marker = this.battleWindow.getMarker(location.x - this.battleWindow.getPosition().x, location.y - this.battleWindow
            .getPosition().y);
        this.battleWindow.selectedMarker.setPosition(marker.getPosition().x, marker.getPosition().y);
    },
    touchFinish: function (location) {},
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