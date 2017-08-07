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
        //カード使用回復
        this.cardUsePower = 100;
        this.cardUseMaxPower = 100;
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
        this.gameStatus = "wait";
        this.result = null;
        this.ripples = [];
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
        this.battleWindow = new BattleWindow(this);
        this.addChild(this.battleWindow, 999);
        this.battleWindow.setPosition(0, 0);
        this.battleWindowScale = 0.1;
        this.battleWindow.setScale(this.battleWindowScale);
        this.setHeaderLabel();
        this.setStartLabel();
        /*
        this.battleMessage = new BattleMessage(this);
        this.addChild(this.battleMessage, 9999);
        */
        this.resultSprite = new BattleResult(this);
        this.addChild(this.resultSprite, 9999);
        this.resultSprite.setPosition(320, 500);
        this.resultSprite.setVisible(false);
        /*
        this.battleCardDeck = new BattleCardDeck(this);
        this.addChild(this.battleCardDeck, 9999);
        this.battleCardDeck.setPosition(0, 30);
        */
        this.scheduleUpdate();
        this.testCnt = 0;
        this.usedTickNum = 0;
        this.usedEnemyTickNum = 0;
        this.tutorial001 = cc.Sprite.create("res/tutorial001.png");
        this.tutorial001.setPosition(320, 550);
        //this.addChild(this.tutorial001, 99999);
        this.isComCnt = 0;
        this.firstTouchX = 0;
        this.firstTouchY = 0;
        //this.lastTouchGameLayerX = this.battleWindow.getPosition().x;
        //this.lastTouchGameLayerY = this.battleWindow.getPosition().y;
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        
        this.scrollSpeed = 2;
        return true;
    },
    setScroll: function () {
        //if(this.gameStatus != "gaming") return;
        if (this.targetBaseNodePosX > this.baseNodePosX) {
            this.baseNodePosX += this.scrollSpeed;
        } else if (this.targetBaseNodePosX < this.baseNodePosX) {
            this.baseNodePosX -= this.scrollSpeed;
        }
        if (this.targetBaseNodePosY > this.baseNodePosY) {
            this.baseNodePosY += this.scrollSpeed;
        } else if (this.targetBaseNodePosY < this.baseNodePosY) {
            this.baseNodePosY -= this.scrollSpeed;
        }
        this.battleWindow.setPosition(this.baseNodePosX, this.baseNodePosY);
    },
    update: function (dt) {
        //常に中央を表示するようにする
        var _centerMarker = this.battleWindow.getMarker2(this.battleWindow.player.col, this.battleWindow.player.row);
        //this.battleWindowScale
        //1:320x420  1.6:-100x400 2.2:-500
        this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;
        //this.baseNodePosX = this.targetBaseNodePosX = 320 - _centerMarker.getPosition().x * this.battleWindowScale;
        //this.baseNodePosY = this.targetBaseNodePosY = 400 - _centerMarker.getPosition().y * this.battleWindowScale;


if(this.gameStatus == "gaming"){
    this.setScroll();
}




/*

        //コネクションエラー時はバトル画面にリダイレクトする
        if (this.storage.isConnectionError == true) {
            this.storage.isConnectionError = false;
            this.goToListLayer(1);
            return;
        }
*/

/*
        //イベントを処理する(味方)
        for (var eventDataKey in this.storage.eventData) {
            if (this.storage.eventData.hasOwnProperty(eventDataKey)) {
                var eventDataValue = this.storage.eventData[eventDataKey];
                if (eventDataValue) {
                    var eventDataObj = JSON.parse(eventDataValue);
                    if (eventDataObj) {
                        if (this.battleWindow.turnCnt >= 1 && this.usedTickNum != eventDataObj["tickNum"] && this.battleWindow.turnCnt ==
                            eventDataObj["tickNum"]) {
                            this.usedTickNum = eventDataObj["tickNum"];
                            //this.addRipple(this.colorName, eventDataObj["col"], eventDataObj["row"]);
                            this.battleWindow.addPoint2(this.colorName, eventDataObj["col"], eventDataObj["row"]);
                            var _cardId = eventDataObj["id"];
                            if (CONFIG.CARD[_cardId]) {
                                var _cardData = CONFIG.CARD[_cardId];
                                if (_cardData) {
                                    var _genre = _cardData["genre"];
                                    var _maxPopulation = _cardData["maxPopulation"];
                                }
                            }
                            var _marker = this.battleWindow.getMarker2(eventDataObj["col"], eventDataObj["row"]);
                            //cc.log(">>" + _marker.col + "/" + _marker.row);
                            this.battleWindow.addHuman(_marker.col, _marker.row, "GREEN", _marker.markerId, 1);
                            //建設中表示を消す
                            //this.battleCardDeck.touchMovedSprite.setVisible(false);
                            if (this.colorName == "GREEN") {
                                this.battleWindow.addGreenMessage(CONFIG.CARD[eventDataObj["id"]]["useTxt"]);
                            } else {
                                this.battleWindow.addRedMessage(CONFIG.CARD[eventDataObj["id"]]["useTxt"]);
                            }
                        }
                    }
                }
            }
        }
        //イベントを処理する(敵)
        for (var eventDataKey in this.storage.enemyEventData) {
            if (this.storage.enemyEventData.hasOwnProperty(eventDataKey)) {
                var eventDataValue = this.storage.enemyEventData[eventDataKey];
                if (eventDataValue) {
                    var eventDataObj = JSON.parse(eventDataValue);
                    if (eventDataObj) {
                        if (this.battleWindow.turnCnt >= 1 && this.usedEnemyTickNum != eventDataObj["tickNum"] && this.battleWindow.turnCnt ==
                            eventDataObj["tickNum"]) {
                            this.usedEnemyTickNum = eventDataObj["tickNum"];
                            //this.addRipple(this.enemyColorName, eventDataObj["col"], eventDataObj["row"]);
                            this.battleWindow.addPoint2(this.enemyColorName, eventDataObj["col"], eventDataObj["row"]);
                            var _cardId = eventDataObj["id"];
                            if (CONFIG.CARD[_cardId]) {
                                var _cardData = CONFIG.CARD[_cardId];
                                if (_cardData["genre"]) {
                                    //cc.log(_cardData["genre"]);
                                }
                            }
                            //城を建てる
                            //this.battleWindow.addCastleIcon(eventDataObj["col"], eventDataObj["row"], 1);
                            if (this.colorName == "GREEN") {
                                this.battleWindow.addRedMessage(CONFIG.CARD[eventDataObj["id"]]["useTxt"]);
                            } else {
                                this.battleWindow.addGreenMessage(CONFIG.CARD[eventDataObj["id"]]["useTxt"]);
                            }
                        }
                    }
                }
            }
        }

*/

/*
        for (var i = 0; i < this.battleEffects.length; i++) {
            if (this.battleEffects[i].update() == false) {
                this.removeChild(this.battleEffects[i]);
                this.battleEffects.splice(i, 1);
            }
        }
*/
        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i].update() == false) {
                //this.removeChild(this.battleEffects[i]);
                //this.battleEffects.splice(i, 1);
            }
        }
        this.updateLabel();
        //this.battleCardDeck.update();
        //this.battleMessage.update();
        this.resultSprite.update();
        //this.countScore();
        //モニターをupdateする
        this.battleWindow.update();
        //マーカーをupdate表示する
        for (var i = 0; i < this.ripples.length; i++) {
            if (this.ripples[i].update() == false) {
                this.removeChild(this.ripples[i]);
                this.ripples.splice(i, 1);
            }
        }
        this.gameStartTimeCnt++;
        this.setPrepareStatus();
        this.setStartStatus();
        this.updateCardPower();
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
            var _material = new Material(this, mcode, this.orderCnt);
            this.materials.push(_material);
            this.header.addChild(_material, 999999);
            _material.setPosition(610 - 62 * (this.orderCnt - 1), 30);
        }
    },
    setHeaderLabel: function () {
        this.header = cc.Sprite.create("res/header001.png");
        this.header.setPosition(320, 1136 - 100);
        this.header.setAnchorPoint(0.5, 0);
        this.addChild(this.header, 999999);
        this.occupiedRate = new cc.LabelTTF(this.greenScore, "Arial", 38);
        this.occupiedRate.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.occupiedRate.setAnchorPoint(0, 0);
        this.occupiedRate.setPosition(20, 30);
        this.header.addChild(this.occupiedRate, 999999);
        this.fuelRateLabel = new cc.LabelTTF("123", "Arial", 24);
        this.fuelRateLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.fuelRateLabel.setAnchorPoint(0, 0);
        this.fuelRateLabel.setPosition(130, 20);
        this.header.addChild(this.fuelRateLabel, 999999);
    },
    updateLabel: function () {
        this.fuelRateLabel.setString(this.battleWindow.maxGameTime - this.battleWindow.gameTime + "");
    },
    isUseCard: function () {
        if (this.cardUsePower >= this.cardUseMaxPower) {
            return true;
        }
        return false;
    },
    updateCardPower: function () {
        if (this.gameStatus == "gaming") {
            //カードのパワーを更新する
            this.cardUsePower++;
            if (this.cardUsePower >= this.cardUseMaxPower) {
                this.cardUsePower = this.cardUseMaxPower;
            }
        }
    },
    setPrepareStatus: function () {
        if (this.gameStatus == "prepare") {
            this.gameStatus = "wait";
        }
    },
    setStartStatus: function () {

        if(this.gameStatus != "wait") return;

        this.labelStartCnt001.setVisible(false);
        this.labelStartCnt002.setVisible(false);
        this.labelStartCnt003.setVisible(false);
        this.labelStartCnt004.setVisible(false);
        //if (this.battleMessage.isReadTutorial == false) return;
        this.battleWindow.setLand();
        this.battleWindowScale += 0.07;
        if (this.battleWindowScale >= 2.2) {
            this.battleWindowScale = 2.2;
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
            //そこまで!のラベルを表示する
            if (0 <= this.endCnt && this.endCnt < 30 * 1) {
                this.labelStartCnt005.setVisible(true);
            }

            //試合結果を表示する
            if (this.endCnt == 30 * 1) {
                this.labelStartCnt005.setVisible(false);
                this.resultSprite.setVisible(true);
                if (this.greenScore > this.redScore) {
                    var _addCoin = 10;
                    this.msg = "勝利しました!!!!!\nSGK残高が" + this.storage.treasureAmount + "->" + Math.ceil(this.storage.treasureAmount +
                        _addCoin) + "に\n増加しました!";
                    this.msg = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
                    this.storage.treasureAmount += _addCoin;
                    this.storage.saveCurrentData();
                } else {
                    var _addCoin = 10;
                    this.msg = "敗北しました！\nSGK残高が" + this.storage.treasureAmount + "->" + Math.ceil(this.storage.treasureAmount -
                        _addCoin) + "に\n減少しました!";
                    this.msg = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
                    this.storage.treasureAmount -= _addCoin;
                    this.storage.saveCurrentData();
                }
            
                this.resultSprite.sendMessage(this.msg);
            }
        }
    },
    addBattleEffect: function (colorName, cardId) {
        this.battleEffect = new BattleEffect(this, colorName, cardId);
        this.addChild(this.battleEffect, 99999999);
        this.battleEffect.setPosition(0, 240);
        this.battleEffects.push(this.battleEffect);
    },
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
        this.battleWindow.selectedMarker.col = marker.row;
        this.battleWindow.selectedMarkerCol = marker.col;
        this.battleWindow.selectedMarkerRow = marker.row;
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