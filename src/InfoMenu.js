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
        //初期アカウント作成画面------------------------------------------------------------------------------
        this.uiWindowAccount = cc.Sprite.create("res/ui-window-account.png");
        this.uiWindowAccount.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowAccount);
        this.uiWindowAccount.setVisible(false);
        this.buttonCreateAccount = new cc.MenuItemImage("res/button_window_ok.png", "res/button_window_ok.png", function () {
            cc.log("xx");
            this.game.masterShip.status = "NO_DIST";
            this.infoNode.setVisible(false);
            this.uiWindowAccount.setVisible(false);
        }, this);
        this.buttonCreateAccount.setPosition(320, 40);
        var menu = new cc.Menu(this.buttonCreateAccount);
        menu.setPosition(0, -130);
        this.uiWindowAccount.addChild(menu);

        //ワープ確認画面------------------------------------------------------------------------------
        this.uiWindowWarp = cc.Sprite.create("res/ui-window-warp.png");
        this.uiWindowWarp.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowWarp);
        this.uiWindowWarp.setVisible(false);

        this.crystalAmountLabel = cc.LabelTTF.create("1", "Arial", 28);
        this.crystalAmountLabel.setPosition(320, 92);
        this.crystalAmountLabel.setAnchorPoint(0.5, 0.5);
        this.crystalAmountLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowWarp.addChild(this.crystalAmountLabel);

        this.buttonWarpCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.closeAllWindow();
        }, this);
        this.buttonWarpCancel.setPosition(180, 40);
        this.buttonWarpOk = new cc.MenuItemImage("res/button_landing.png", "res/button_landing.png", function () {
            if(this.game.storage.crystalAmount <= 0) return;
            this.game.masterShip.targetTime = parseInt(new Date() / 1000);
            this.game.storage.useCrystal(1);
            this.uiWindowWarp.setVisible(false);
            this.infoNode.setVisible(false);
        }, this);
        this.buttonWarpOk.setPosition(460, 40);
        var menu = new cc.Menu(this.buttonWarpCancel, this.buttonWarpOk);
        menu.setPosition(0, -130);
        this.uiWindowWarp.addChild(menu);

        //到着結果画面------------------------------------------------------------------------------
        this.uiWindowSeachResult = cc.Sprite.create("res/ui-result-window.png");
        this.uiWindowSeachResult.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowSeachResult);
        this.uiWindowSeachResult.setVisible(false);
        this.buttonGetPlanet = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            this.game.masterShip.status = "NO_DIST";
            //moveTo先の惑星がなければカードを引く。あれば、引かない。
            var _moveToPlanetId = this.game.storage.getShipParamByName("moveToPlanetId");
            if (_moveToPlanetId == 0) {
                this.goToCardLayer();
            } else {
                this.game.storage.saveShipDataToStorage(0, 0, 0, _moveToPlanetId, "NO_DIST", 0, null, null);
                this.game.loadMasterShipData();
                this.goToMissionsLayer();
            }
        }, this);
        this.buttonGetPlanet.setPosition(320, 40);
        var menu = new cc.Menu(this.buttonGetPlanet);
        menu.setPosition(0, -130);
        this.uiWindowSeachResult.addChild(menu);
        //移動結果画面------------------------------------------------------------------------------
        this.uiWindowMoveResult = cc.Sprite.create("res/ui-result-window.png");
        this.uiWindowMoveResult.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowMoveResult);
        this.uiWindowMoveResult.setVisible(false);
        this.buttonMoveReusltOk = new cc.MenuItemImage("res/button_window_ok.png", "res/button_window_ok.png", function () {
            //cc.log("xx");
            this.uiWindowAccount.setVisible(false);
            this.game.masterShip.status = "NO_DIST";
            this.infoNode.setVisible(false);
            this.uiWindowResult.setVisible(false);
        }, this);
        this.buttonMoveReusltOk.setPosition(320, 40);
        var menu = new cc.Menu(this.buttonMoveReusltOk);
        menu.setPosition(0, -130);
        this.uiWindowMoveResult.addChild(menu);
        //着陸画面------------------------------------------------------------------------------
        this.uiWindowLanding = cc.Sprite.create("res/ui-window-landing.png");
        this.uiWindowLanding.setPosition(320, 0);
        this.uiWindowLanding.setVisible(false);
        this.infoNode.addChild(this.uiWindowLanding);
        //+バッテリー残量
        this.batteryAmountLabel = cc.LabelTTF.create("100", "Arial", 28);
        this.batteryAmountLabel.setPosition(320, 92);
        this.batteryAmountLabel.setAnchorPoint(0.5, 0.5);
        this.batteryAmountLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLanding.addChild(this.batteryAmountLabel);
        this.buttonLandingCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.closeAllWindow();
            this.game.baseNode.removeChild(this.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.storage.saveShipDataToStorage(0, 0, 0, null, null, 0, 0, 0);
            this.game.loadMasterShipData();
        }, this);
        this.buttonLandingCancel.setPosition(180, 40);
        this.buttonLandingPlanet = new cc.MenuItemImage("res/button_landing.png", "res/button_landing.png", function () {
            if (this.game.storage.getBatteryAmountFromPastSecond() >= 1) {
                return;
            }
            //バッテリーをリセットする
            this.game.setTargetTime();
            this.goToGameLayer();
        }, this);
        this.buttonLandingPlanet.setPosition(460, 40);
        var menu = new cc.Menu(this.buttonLandingPlanet, this.buttonLandingCancel);
        menu.setPosition(0, -130);
        this.uiWindowLanding.addChild(menu);
        //移動画面------------------------------------------------------------------------------
        this.uiWindowMove = cc.Sprite.create("res/ui-window-move.png");
        this.uiWindowMove.setPosition(320, 0);
        this.infoNode.addChild(this.uiWindowMove);
        this.uiWindowMove.setVisible(false);
        //+コインamount
        this.moveCoinCostLabel = cc.LabelTTF.create("0", "Arial", 38);
        this.moveCoinCostLabel.setPosition(510, 92);
        this.moveCoinCostLabel.setAnchorPoint(1, 0.5);
        this.moveCoinCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowMove.addChild(this.moveCoinCostLabel);
        //+時間amount
        this.moveTimeCostLabel = cc.LabelTTF.create("00:00", "Arial", 25);
        this.moveTimeCostLabel.setPosition(360, 150);
        this.moveTimeCostLabel.setAnchorPoint(1, 0.5);
        this.moveTimeCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowMove.addChild(this.moveTimeCostLabel);
        //+燃料amount
        this.moveFuelCostLabel = cc.LabelTTF.create("0", "Arial", 38);
        this.moveFuelCostLabel.setPosition(290, 92);
        this.moveFuelCostLabel.setAnchorPoint(1, 0.5);
        this.moveFuelCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowMove.addChild(this.moveFuelCostLabel);
        this.buttonMoveCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.closeAllWindow();
            this.game.baseNode.removeChild(this.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.storage.saveShipDataToStorage(0, 0, 0, null, "NO_DIST", 0, 0, 0);
            this.game.loadMasterShipData();
        }, this);
        this.buttonMoveCancel.setPosition(180, 40);
        //移動ボタン
        this.buttonMove = new cc.MenuItemImage("res/button_window_goto.png", "res/button_window_goto.png", function () {
            if (this.game.storage.getCoinAmount() < this.fuelCnt) {
                return;
            }
            this.uiWindowMove.setVisible(false);
            this.infoNode.setVisible(false);
            this.game.storage.saveCurrentData();
            var _dx = this.game.tmpDx2 / 80;
            var _dy = this.game.tmpDy2 / 80;
            var _time = Math.ceil(this.game.pulledDist) + parseInt(new Date() / 1000);
            var _basePlanetId = this.game.storage.getShipParamByName("basePlanetId");
            var _from = this.game.storage.getShipParamByName("basePlanetId");
            var _to = this.game.storage.getShipParamByName("destinationPlanetId");
            this.game.storage.saveShipDataToStorage(_dx, _dy, _time, _basePlanetId, "MOVING", 0, _from, _to);
            this.game.loadMasterShipData();
            //ここで燃料を減らす
            this.game.storage.useCoin(this.fuelCnt);
        }, this);
        this.buttonMove.setPosition(460, 40);
        var menu = new cc.Menu(this.buttonMove, this.buttonMoveCancel);
        menu.setPosition(0, -130);
        this.uiWindowMove.addChild(menu);
        //発射画面------------------------------------------------------------------------------
        this.uiWindowLaunch = cc.Sprite.create("res/ui-window-launch.png");
        this.uiWindowLaunch.setPosition(320, 0);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.addChild(this.uiWindowLaunch);
        //+コインamount
        this.launchCoinCostLabel = cc.LabelTTF.create("332", "Arial", 38);
        this.launchCoinCostLabel.setPosition(510, 92);
        this.launchCoinCostLabel.setAnchorPoint(1, 0.5);
        this.launchCoinCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchCoinCostLabel);
        //+時間amount
        this.launchTimeCostLabel = cc.LabelTTF.create("", "Arial", 25);
        this.launchTimeCostLabel.setPosition(360, 150);
        this.launchTimeCostLabel.setAnchorPoint(1, 0.5);
        this.launchTimeCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchTimeCostLabel);
        //+燃料amount
        this.launchFuelCostLabel = cc.LabelTTF.create("100", "Arial", 38);
        this.launchFuelCostLabel.setPosition(290, 92);
        this.launchFuelCostLabel.setAnchorPoint(1, 0.5);
        this.launchFuelCostLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.launchFuelCostLabel);
        //+キャンセルボタン
        this.buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.closeAllWindow();
            this.game.baseNode.removeChild(this.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.storage.saveShipDataToStorage(0, 0, 0, null, "NO_DIST", 0, 0, 0);
            this.game.loadMasterShipData();
        }, this);
        this.buttonCancel.setPosition(180, 40);
        //+発射ボタン
        this.buttonLaunchShip = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            if (this.game.storage.getCoinAmount() < this.fuelCnt) {
                return;
            }
            this.uiWindowLanding.setVisible(false);
            this.uiWindowLaunch.setVisible(false);
            this.infoNode.setVisible(false);
            var _dx = this.game.tmpDx2 / 80;
            var _dy = this.game.tmpDy2 / 80;
            var _time = this.game.storage.getTimeFromDist(this.game.pulledDist) + parseInt(new Date() / 1000);
            var _basePlanetId = this.game.storage.getShipParamByName("basePlanetId");
            var _from = _basePlanetId;
            var _to = 0;
            this.game.storage.saveShipDataToStorage(_dx, _dy, _time, _basePlanetId, "MOVING", 0, _from, _to);
            this.game.loadMasterShipData();
            //ここで燃料を減らす
            this.game.storage.useCoin(this.fuelCnt);
        }, this);
        this.buttonLaunchShip.setPosition(460, 40);
        var menu = new cc.Menu(this.buttonCancel, this.buttonLaunchShip);
        menu.setPosition(0, -130);
        this.uiWindowLaunch.addChild(menu);
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
        var _txt = this.game.storage.getFormatedTimeLabel(this.timeCnt);

        this.launchFuelCostLabel.setString(fuelCnt);
        this.launchCoinCostLabel.setString(coinCnt);
        this.launchTimeCostLabel.setString(_txt);

        this.moveFuelCostLabel.setString(fuelCnt);
        this.moveCoinCostLabel.setString(coinCnt);
        this.moveTimeCostLabel.setString(_txt);

        if (this.game.storage.totalCoinAmount < fuelCnt) {
            this.isAbleToLaunch = false;
            this.launchFuelCostLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        } else {
            this.isAbleToLaunch = true;
            this.launchFuelCostLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        if (this.game.storage.getBatteryAmountFromPastSecond() >= 1) {
            this.batteryAmountLabel.setString("あと" + this.game.storage.getBatteryAmountFromPastSecond() + "秒で準備完了");
            this.isAbleToLanding = false;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        } else {
            this.batteryAmountLabel.setString("準備完了");
            this.isAbleToLanding = true;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
    },

    closeAllWindow:function(){
        this.uiWindowAccount.setVisible(false);
        this.uiWindowWarp.setVisible(false);
        this.uiWindowSeachResult.setVisible(false);
        this.uiWindowMoveResult.setVisible(false);
        this.uiWindowLanding.setVisible(false);
        this.uiWindowMove.setVisible(false);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.setVisible(false);
    },

    update: function () {
        if (this.game.storage.getBatteryAmountFromPastSecond() >= 1) {
            this.batteryAmountLabel.setString("あと" + this.game.storage.getBatteryAmountFromPastSecond() + "秒で準備完了");
            this.isAbleToLanding = false;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
        } else {
            this.batteryAmountLabel.setString("準備完了");
            this.isAbleToLanding = true;
            this.batteryAmountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
        if (this.isAbleToLanding == true) {
            this.buttonLandingPlanet.setOpacity(255 * 1);
        } else {
            this.buttonLandingPlanet.setOpacity(255 * 0.3);
        }
        if (this.isAbleToLaunch == true) {
            this.buttonLaunchShip.setOpacity(255 * 1);
        } else {
            this.buttonLaunchShip.setOpacity(255 * 0.3);
        }

        if(this.game.storage.crystalAmount >= 1){
            this.buttonWarpOk.setOpacity(255 * 1);
        }else{
            this.buttonWarpOk.setOpacity(255 * 0.3);
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