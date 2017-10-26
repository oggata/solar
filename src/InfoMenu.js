var InfoMenu = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        //インフォメーション表示用
        this.infoNode = cc.Node.create();
        this.infoNode.setPosition(0, 500);
        this.backNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, -500);
        this.backNode.setOpacity(255 * 0.8);
        this.infoNode.addChild(this.backNode);
        this.infoNode.setVisible(false);
        this.addChild(this.infoNode, 999999999999999);
        //初期アカウント作成画面
        this.uiWindowAccount = cc.Sprite.create("res/ui-window-account.png");
        this.uiWindowAccount.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowAccount);
        this.uiWindowAccount.setVisible(false);
        //到着画面
        this.uiWindowResult = cc.Sprite.create("res/ui-result-window.png");
        this.uiWindowResult.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowResult);
        this.uiWindowResult.setVisible(false);
        //ランディング画面
        this.uiWindowLanding = cc.Sprite.create("res/ui-window-landing.png");
        this.uiWindowLanding.setPosition(320, 0);
        this.uiWindowLanding.setVisible(false);
        this.infoNode.addChild(this.uiWindowLanding);
        this.shipFuelLabel = cc.LabelTTF.create("100", "Arial", 38);
        this.shipFuelLabel.setPosition(420, 92);
        this.shipFuelLabel.setAnchorPoint(1, 0.5);
        this.shipFuelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLanding.addChild(this.shipFuelLabel);
        //ロケット発射画面
        this.uiWindowLaunch = cc.Sprite.create("res/ui-window-launch.png");
        this.uiWindowLaunch.setPosition(320, 0);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.addChild(this.uiWindowLaunch);
        this.shipTargetTimeLabel = cc.LabelTTF.create("332", "Arial", 38);
        this.shipTargetTimeLabel.setPosition(510, 92);
        this.shipTargetTimeLabel.setAnchorPoint(1, 0.5);
        this.shipTargetTimeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.shipTargetTimeLabel);
        this.shipFuel2Label = cc.LabelTTF.create("100", "Arial", 38);
        this.shipFuel2Label.setPosition(290, 92);
        this.shipFuel2Label.setAnchorPoint(1, 0.5);
        this.shipFuel2Label.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.shipFuel2Label);
        this.buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.uiWindowLanding.setVisible(false);
            this.uiWindowLaunch.setVisible(false);
            this.infoNode.setVisible(false);
            this.game.masterShip.status = "NO_DIST";
            this.game.baseNode.removeChild(this.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.masterShip.dx = 0;
            this.game.masterShip.dy = 0;
            this.game.storage.moveFromId = 0;
            this.game.storage.moveToId = 0;
            this.game.storage.targetMovePlanetId = 0;
            this.game.storage.saveCurrentData();
        }, this);
        this.buttonCancel.setPosition(180, 40);
        this.buttonSearch = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            //燃料が足りない場合はreturnする
            if (this.game.storage.getCoinAmount() < this.fuelCnt) {
                return;
            }
            //landingの場合はゲーム画面に行く
            if (this.uiWindowLanding.isVisible() == true) {
                //ここで燃料を減らす
                this.game.storage.useCoin(this.fuelCnt);
                this.goToGameLayer();
            }
            //launchの場合は、shipの状態を遷移させる
            if (this.uiWindowLaunch.isVisible() == true) {
                this.uiWindowLanding.setVisible(false);
                this.uiWindowLaunch.setVisible(false);
                this.infoNode.setVisible(false);
                this.game.masterShip.dx = this.game.tmpDx2 / 80;
                this.game.masterShip.dy = this.game.tmpDy2 / 80;
                this.game.masterShip.status = "MOVING";
                this.game.storage.saveCurrentData();
                var _dx = this.game.masterShip.dx;
                var _dy = this.game.masterShip.dy;
                var _time = Math.ceil(this.game.pulledDist) + parseInt(new Date() / 1000);
                var _basePlanetId = this.game.storage.getBasePlanetId(CONFIG.CARD[1]);
                var _destinationPlanetId = 0;
                //探索か移動かのチェック。移動の場合は、_destinationPlanetIdを入れる。
                if (this.game.storage.targetMovePlanetId != 0) {
                    _destinationPlanetId = this.game.storage.targetMovePlanetId;
                    this.game.storage.targetMovePlanetId = 0;
                    this.game.storage.moveFromId = _basePlanetId;
                    this.game.storage.moveToId = _destinationPlanetId;
                    this.game.storage.saveCurrentData();
                } else {
                    this.game.storage.moveFromId = _basePlanetId;
                    this.game.storage.moveToId = 0;
                }
                this.game.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "MOVING", 1);
                //ここで燃料を減らす
                this.game.storage.useCoin(this.fuelCnt);
            }
        }, this);
        this.buttonSearch.setPosition(460, 40);
        this.buttonOk = new cc.MenuItemImage("res/button_window_ok.png", "res/button_window_ok.png", function () {
            cc.log("xx");
            this.game.masterShip.status = "NO_DIST";
            this.infoNode.setVisible(false);
            this.uiWindowResult.setVisible(false);
        }, this);
        this.buttonOk.setPosition(320, 40);
        this.buttonOk.setVisible(false);
        this.buttonGetPlanet = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            cc.log("xx");
            this.game.masterShip.status = "NO_DIST";
            //探索の場合はカードを引く、移動の場合はカードは引かない
            var _dest = this.game.storage.getDestinationPlanetId(CONFIG.CARD[1]);
            if (_dest == 0) {
                this.goToCardLayer();
            } else {
                var _dx = 0;
                var _dy = 0;
                var _time = 0;
                var _basePlanetId = _dest;
                var _destinationPlanetId = 0;
                this.game.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST", 1);
                this.goToDiscoveryLayer();
            }
        }, this);
        this.buttonGetPlanet.setPosition(320, 40);
        this.buttonGetPlanet.setVisible(false);
        var menu001 = new cc.Menu(this.buttonCancel, this.buttonSearch, this.buttonOk, this.buttonGetPlanet);
        menu001.setPosition(0, -130);
        this.infoNode.addChild(menu001, 99999999999);
        this.isAbleToLaunch = false;
    },
    init: function () {},
    goToCardLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
    },
    goToDiscoveryLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        //windowName
        scene.addChild(DiscoveryLayer2.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    setCost: function (fuelCnt, timeCnt) {
        this.fuelCnt = fuelCnt;
        this.timeCnt = timeCnt;
        this.shipFuelLabel.setString(fuelCnt);
        this.shipFuel2Label.setString(fuelCnt);
        this.shipTargetTimeLabel.setString(timeCnt);
        if (this.game.storage.totalCoinAmount < fuelCnt) {
            this.isAbleToLaunch = false;
            this.shipFuelLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
            this.shipFuel2Label.setFontFillColor(new cc.Color(255, 0, 0, 255));
        } else {
            this.isAbleToLaunch = true;
            this.shipFuelLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
            this.shipFuel2Label.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
    },
    update: function () {
        if (this.isAbleToLaunch == true) {
            this.buttonSearch.setOpacity(255 * 1);
        } else {
            this.buttonSearch.setOpacity(255 * 0.3);
        }
        if (this.uiWindowAccount.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonSearch.setVisible(false);
            this.buttonOk.setVisible(true);
            this.buttonGetPlanet.setVisible(false);
        }
        if (this.uiWindowResult.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonSearch.setVisible(false);
            this.buttonOk.setVisible(true);
            this.buttonGetPlanet.setVisible(true);
        }
        if (this.uiWindowLanding.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonSearch.setVisible(true);
            this.buttonOk.setVisible(false);
            this.buttonGetPlanet.setVisible(false);
        }
        if (this.uiWindowLaunch.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonSearch.setVisible(true);
            this.buttonOk.setVisible(false);
            this.buttonGetPlanet.setVisible(false);
        }
    },
    goToGameLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        var cardId = 1;
        scene.addChild(GameLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});