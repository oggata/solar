var ListLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, errorCode) {
        this._super();
        this.storage = storage;
        playBGM(this.storage);
        //画面サイズの取得
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        this.storage = storage;
        this.storage.isSteal = false;
        this.storage.enemyTurnNum = 0;
        this.storage.startPositionData = [];
        this.storage.enemyStartPositionData = [];
        this.status = "gaming";
        this.layerType = "BATTLE";
        this.back = cc.Sprite.create("res/back_top.png");
        this.back.setAnchorPoint(0, 0);
        this.back.setPosition(0, 0);
        this.addChild(this.back);
        //list-column
        for (var i = 0; i < 7; i++) {
            this.listColumn = cc.Sprite.create("res/listcolumn.png");
            this.listColumn.setAnchorPoint(0, 0);
            this.listColumn.setPosition(20, 800 - 110 * i);
            this.back.addChild(this.listColumn);
            var button = new cc.MenuItemImage("res/button_goto.png", "res/button_goto.png", function () {
                this.goToFieldLayer("RED", false);
            }, this);
            button.setPosition(550, 60);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
            this.listColumn.addChild(menu001);
        }
        this.buttonList = cc.Sprite.create("res/button_list.png");
        //this.buttonList.setAnchorPoint(0, 0);
        this.buttonList.setPosition(320, 980);
        this.back.addChild(this.buttonList);
        var button1 = new cc.MenuItemImage("res/button_select.png", "res/button_select.png", function () {
            this.goToFieldLayer("RED", false);
        }, this);
        button1.setAnchorPoint(0, 0);
        button1.setPosition(142 * 0, 0);
        var button2 = new cc.MenuItemImage("res/button_select.png", "res/button_select.png", function () {
            this.goToFieldLayer("RED", false);
        }, this);
        button2.setAnchorPoint(0, 0);
        button2.setPosition(142 * 1, 0);
        var button3 = new cc.MenuItemImage("res/button_select.png", "res/button_select.png", function () {
            this.goToFieldLayer("RED", false);
        }, this);
        button3.setAnchorPoint(0, 0);
        button3.setPosition(142 * 2, 0);
        var menu001 = new cc.Menu(button1, button2, button3);
        menu001.setPosition(0, 0);
        this.buttonList.addChild(menu001);
        /*
                var battleButton = new cc.MenuItemImage("res/button_attack.png", "res/button_attack_on.png", function () {
                    this.targetUsers = [];
                    for (var i = 0; i < this.storage.users.length; i++) {
                        if (this.storage.users[i].userId != this.storage.userId) {
                            if (this.storage.users[i].userStatus == 0) {
                                this.targetUsers.push(this.storage.users[i]);
                            }
                        }
                    }
                    this.targetUsers.sort(this.shuffle);
                    this.targetUsers.sort(this.shuffle);
                    if (this.cardSetCnt == 0) {
                        this.errorCnt = 1;
                        this.error.setVisible(true);
                        this.errorLabel.setString("少なくとも1枚はカードをセットしてください.");
                    } else if (this.targetUsers.length > 0) {
                        var _data = '{' 
                        + '"type":"STEAL_PLAYER",' 
                        + '"userId":' + this.targetUsers[0].userId 
                        + '}';
                        this.storage.webSocketHelper.sendMsg(_data);
                        this.goToFieldLayer("GREEN",false);
                        this.storage.battleTargetUserId = this.targetUsers[0].userId;
                        this.storage.enemyUserId = this.targetUsers[0].userId;
                    } else {
                        this.errorCnt = 1;
                        this.error.setVisible(true);
                        this.errorLabel.setString("攻撃対象がいませんでした.");
                    }
                }, this);
                battleButton.setPosition(320, 260);
        */
        /*
                var computerBattleButton = new cc.MenuItemImage("res/button_attack_com.png", "res/button_attack_com.png", function () {
                    this.targetUsers = [];
                    for (var i = 0; i < this.storage.users.length; i++) {
                        if (this.storage.users[i].userId != this.storage.userId) {
                            if (this.storage.users[i].userStatus == 0) {
                                this.targetUsers.push(this.storage.users[i]);
                            }
                        }
                    }
                    this.targetUsers.sort(this.shuffle);
                    this.targetUsers.sort(this.shuffle);
                    this.goToFieldLayer("GREEN",true);
                }, this);
                computerBattleButton.setPosition(320, 140);

                var menu001 = new cc.Menu(computerBattleButton);
                menu001.setPosition(0, 0);
                this.addChild(menu001);
        */
        this.menus = [];
        this.replaceCard();
        this.targetCardPositionNum = null;
        this.cardList = new CardList(this);
        this.addChild(this.cardList, 99999999999);
        this.cardList.setVisible(false);
        this.targetTime = 0;
        this.scheduleUpdate();
        this.errorCnt = 0;
        this.error = cc.Sprite.create("res/error.png");
        this.error.setPosition(320, 500);
        this.addChild(this.error, 9999999);
        this.error.setVisible(false);
        this.errorLabel = new cc.LabelTTF("", "Arial", 28);
        this.errorLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.error.addChild(this.errorLabel);
        this.errorLabel.setPosition(320, 120);
        this.header = new Header(this);
        this.addChild(this.header);
        this._time = 0;
        this._webSocketIntervalCnt = 0;
        if (errorCode > 0) {
            this.errorCnt = errorCode;
            this.error.setVisible(true);
            this.errorLabel.setString("通信エラーが起きました.");
        }
        //this.initializeWalkAnimation();
        return true;
    },
    replaceCard: function () {
        //全てのカードを一旦削除する
        for (var i = 0; i <= this.menus.length; i++) {
            this.menus.splice(i, 1);
            this.removeChild(this.menus[i]);
        }
        //置き換える
        this.cardSetCnt = 0;
        for (var i = 1; i <= 3; i++) {
            this.image = this.getCardImage(i);
            var card = new cc.MenuItemImage(this.image, "res/card000_on.png", function (val) {
                this.setCardWindow(val.orderNum);
            }, this);
            card.orderNum = i;
            card.setPosition(CONFIG.BATTLE_LIST_POSITION[i].x, CONFIG.BATTLE_LIST_POSITION[i].y - 180);
            card.setScale(0.45);
            var menu = new cc.Menu(card);
            menu.setPosition(0, 0);
            menu.orderNum = i;
            this.menus.push(menu);
            //this.addChild(menu);
        }
    },
    getCardImage: function (deckNum) {
        var image = "res/card000.png";
        for (var key in this.storage.deckData) {
            if (key == "DECK_" + deckNum) {
                var value = this.storage.deckData[key];
                var value2 = (new Function("return " + value))();
                image = value2.image;
                this.cardSetCnt += 1;
            }
        }
        return image;
    },
    update: function (dt) {
        //バトルを仕掛けられたらフィールドへ移動する
        if (this.storage.isSteal == true) {
            this.goToFieldLayer("RED", false);
        }
        //ヘッダーに状態をsetする
        this.header.userCntLabel.setString("x " + this.storage.users.length);
        this.header.treasureCntLabel.setString("x " + this.storage.treasureAmount);
        if (this.errorCnt >= 1) {
            this.errorCnt++;
            if (this.errorCnt >= 30 * 2) {
                this.errorCnt = 0;
                this.error.setVisible(false);
            }
        }
        /*
        //全てのプレイヤーデータをsyncするために自身のデータをsocket通信で1秒おきにpushする
        this._webSocketIntervalCnt++;
        if (this._webSocketIntervalCnt >= 30) {
            //this.storage.webSocketHelper.sendMsg("sendMsg! UserId:" + this.storage.userId);
            var _data = '{' 
                + '"type":"SYNC_PLAYERS",' 
                + '"userId":' + this.storage.userId 
                + ',' 
                + '"userStatus":' + 0 
                + ',' 
                + '"cardId001":' + 0 
                + ',' 
                + '"cardId002":' + 0 
                + ',' 
                + '"cardId003":' + 0 
                + ',' 
                + '"treasureAmount":' + this.storage.treasureAmount 
                + '}';
            //this.storage.webSocketHelper.sendMsg(_data);
            this._webSocketIntervalCnt = 0;
        }
        */
    },
    initializeWalkAnimation: function () {
        this.image = "res/starburst.png";
        this.itemWidth = 640;
        this.itemHeight = 480;
        this.widthCount = 2;
        this.heightCount = 5;
        this.effectInterval = 0.1;
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
        this.sprite.setOpacity(255 * 0.1);
        this.back.addChild(this.sprite);
    },
    setCardWindow: function (targetCardPositionNum) {
        if (this.cardList.isVisible() == false) {
            if (this.cardList.isVisible() == true) {
                this.cardList.setVisible(false);
            } else {
                this.targetCardPositionNum = targetCardPositionNum;
                this.cardList.setVisible(true);
            }
        }
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    //シーンの切り替え----->
    goToFieldLayer: function (typeText, isCom) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        scene.addChild(PlanetLayer.create(this.storage, typeText, isCom));
        cc.director.runScene(cc.TransitionFadeTR.create(0.5, scene));
    },
    showInfo: function (text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },
});
ListLayer.create = function (storage, errorCode) {
    return new ListLayer(storage, errorCode);
};
var ListLayerScene = cc.Scene.extend({
    onEnter: function (storage, errorCode) {
        this._super();
        var layer = new ListLayer(storage, errorCode);
        this.addChild(layer);
    }
});