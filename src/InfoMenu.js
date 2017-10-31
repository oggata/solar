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
        //バッテリー残量
        this.batteryAmountLabel = cc.LabelTTF.create("100", "Arial", 28);
        this.batteryAmountLabel.setPosition(320, 92);
        this.batteryAmountLabel.setAnchorPoint(0.5, 0.5);
        this.batteryAmountLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLanding.addChild(this.batteryAmountLabel);
        //ロケット発射画面
        this.uiWindowLaunch = cc.Sprite.create("res/ui-window-launch.png");
        this.uiWindowLaunch.setPosition(320, 0);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.addChild(this.uiWindowLaunch);

        this.launchCoinCostLabel = cc.LabelTTF.create("332", "Arial", 38);
        this.launchCoinCostLabel.setPosition(510, 92);
        this.launchCoinCostLabel.setAnchorPoint(1, 0.5);
        this.launchCoinCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchCoinCostLabel);

        this.launchTimeCostLabel = cc.LabelTTF.create("11:11", "Arial", 25);
        this.launchTimeCostLabel.setPosition(360, 150);
        this.launchTimeCostLabel.setAnchorPoint(1, 0.5);
        this.launchTimeCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchTimeCostLabel);


        this.launchFuelCostLabel = cc.LabelTTF.create("100", "Arial", 38);
        this.launchFuelCostLabel.setPosition(290, 92);
        this.launchFuelCostLabel.setAnchorPoint(1, 0.5);
        this.launchFuelCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchFuelCostLabel);
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
        //発射ボタン
        this.buttonLaunchShip = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            if (this.game.storage.getCoinAmount() < this.fuelCnt) {
                return;
            }
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
                this.game.storage.targetMovePlanetId = 0;
                this.game.storage.moveFromId = _basePlanetId;
                this.game.storage.moveToId = this.game.storage.targetMovePlanetId;
                this.game.storage.saveCurrentData();
            } else {
                this.game.storage.moveFromId = _basePlanetId;
                this.game.storage.moveToId = 0;
            }
            this.game.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, this.game.storage.targetMovePlanetId, "MOVING", 1);
            //ここで燃料を減らす
            this.game.storage.useCoin(this.fuelCnt);
        }, this);
        this.buttonLaunchShip.setPosition(460, 40);

        this.buttonLandingPlanet = new cc.MenuItemImage("res/button_landing.png", "res/button_landing.png", function () {
            if(this.game.getPastSecond() >= 1){
                return;
            }
            //バッテリーをリセットする
            this.game.setTargetTime();
            this.goToGameLayer();            
        }, this);
        this.buttonLandingPlanet.setPosition(460, 40);

        this.buttonOk = new cc.MenuItemImage("res/button_window_ok.png", "res/button_window_ok.png", function () {
            cc.log("xx");
            this.uiWindowAccount.setVisible(false);

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
                var _basePlanetId = _dest;
                var _destinationPlanetId = 0;
                this.game.storage.saveShipDataToStorage(CONFIG.CARD[1], 0, 0, 0, _basePlanetId, 0, "NO_DIST", 1);
                this.goToMissionsLayer();
            }
        }, this);
        this.buttonGetPlanet.setPosition(320, 40);
        this.buttonGetPlanet.setVisible(false);
        var menu001 = new cc.Menu(this.buttonCancel, this.buttonLandingPlanet, this.buttonOk, this.buttonGetPlanet,this.buttonLaunchShip);
        menu001.setPosition(0, -130);
        this.infoNode.addChild(menu001, 99999999999);
        this.isAbleToLaunch = false;
        this.isAbleToLanding = false;
    },
    init: function () {},
    goToCardLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
    },
    goToMissionsLayer: function (cardId) {
        var scene = cc.Scene.create();
        scene.addChild(MissionsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    setCost: function (fuelCnt, coinCnt, timeCnt) {
        this.fuelCnt = fuelCnt;
        this.coinCnt = coinCnt;
        this.timeCnt = timeCnt;
        
        this.launchFuelCostLabel.setString(fuelCnt);
        this.launchCoinCostLabel.setString(coinCnt);
        var _txt = this.game.storage.getFormatedTimeLabel(this.timeCnt);
        this.launchTimeCostLabel.setString(_txt);

        if (this.game.storage.totalCoinAmount < fuelCnt) {
            this.isAbleToLaunch = false;
            this.launchFuelCostLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        } else {
            this.isAbleToLaunch = true;
            this.launchFuelCostLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }

        if(this.game.getPastSecond() >= 1){
            this.batteryAmountLabel.setString("あと" + this.game.getPastSecond() + "秒で準備完了");
            this.isAbleToLanding = false;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        }else{
            this.batteryAmountLabel.setString("準備完了");
            this.isAbleToLanding = true;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
    },
    update: function () {
        if(this.game.getPastSecond() >= 1){
            this.batteryAmountLabel.setString("あと" + this.game.getPastSecond() + "秒で準備完了");
            this.isAbleToLanding = false;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        }else{
            this.batteryAmountLabel.setString("準備完了");
            this.isAbleToLanding = true;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }



        if (this.isAbleToLanding == true) {
            this.buttonLandingPlanet.setOpacity(255 * 1);
        } else {
            this.buttonLandingPlanet.setOpacity(255 * 0.3);
        }
        if(this.isAbleToLaunch == true){
            this.buttonLaunchShip.setOpacity(255 * 1);
        }else{
            this.buttonLaunchShip.setOpacity(255 * 0.3);
        }


        if (this.uiWindowAccount.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonLandingPlanet.setVisible(false);
            this.buttonLaunchShip.setVisible(false);
            this.buttonOk.setVisible(true);
            this.buttonGetPlanet.setVisible(false);
        }
        if (this.uiWindowResult.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonLandingPlanet.setVisible(false);
            this.buttonLaunchShip.setVisible(false);
            this.buttonOk.setVisible(true);
            this.buttonGetPlanet.setVisible(true);
        }
        if (this.uiWindowLanding.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonLandingPlanet.setVisible(true);
            this.buttonLaunchShip.setVisible(false);
            this.buttonOk.setVisible(false);
            this.buttonGetPlanet.setVisible(false);
        }
        if (this.uiWindowLaunch.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonLandingPlanet.setVisible(false);
            this.buttonLaunchShip.setVisible(true);
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