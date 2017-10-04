
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
        //探索画面
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
        this.shipFuelLabel.setAnchorPoint(1,0.5);
        this.shipFuelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLanding.addChild(this.shipFuelLabel);

        //ロケット発射画面
        this.uiWindowLaunch = cc.Sprite.create("res/ui-window-launch.png");
        this.uiWindowLaunch.setPosition(320, 0);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.addChild(this.uiWindowLaunch);

        this.shipTargetTimeLabel = cc.LabelTTF.create("332", "Arial", 38);
        this.shipTargetTimeLabel.setPosition(510, 92);
        this.shipTargetTimeLabel.setAnchorPoint(1,0.5);
        this.shipTargetTimeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.shipTargetTimeLabel);

        this.shipFuel2Label = cc.LabelTTF.create("100", "Arial", 38);
        this.shipFuel2Label.setPosition(290, 92);
        this.shipFuel2Label.setAnchorPoint(1,0.5);
        this.shipFuel2Label.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.shipFuel2Label);

        this.buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.uiWindowLanding.setVisible(false);
            this.uiWindowLaunch.setVisible(false);
            this.infoNode.setVisible(false);
            this.game.masterShip.status = "NO_DIST";
            this.game.masterShip.dx = 0;
            this.game.masterShip.dy = 0;
            this.game.baseNode.removeChild(this.drawNode2);
            this.game.explorationArrow.setVisible(false);
            this.game.masterShip.dx = 0;
            this.game.masterShip.dy = 0;
        }, this);
        this.buttonCancel.setPosition(180, 40);
        this.buttonSearch = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            if (this.uiWindowLanding.isVisible() == true) {
                this.goToGameLayer();
            }
            if (this.uiWindowLaunch.isVisible() == true) {
                this.uiWindowLanding.setVisible(false);
                this.uiWindowLaunch.setVisible(false);
                this.infoNode.setVisible(false);
                this.game.masterShip.dx = this.game.tmpDx2 / 80;
                this.game.masterShip.dy = this.game.tmpDy2 / 80;
                this.game.masterShip.status = "MOVING";
                this.game.setMasterShipStatus(this.game.masterShip.dx, this.game.masterShip.dy, Math.ceil(this.game.pulledDist), 0, "MOVING");
                this.game.storage.saveCurrentData();
            }
        }, this);
        this.buttonSearch.setPosition(460, 40);
        this.buttonOk = new cc.MenuItemImage("res/button_window_search.png", "res/button_window_search.png", function () {
            cc.log("xx");
            this.game.masterShip.status = "NO_DIST";
            this.infoNode.setVisible(false);
            this.uiWindowResult.setVisible(false);
        }, this);
        this.buttonOk.setPosition(320, 40);
        this.buttonOk.setVisible(false);
        var menu001 = new cc.Menu(this.buttonCancel, this.buttonSearch, this.buttonOk);
        menu001.setPosition(0, -130);
        this.infoNode.addChild(menu001, 99999999999);
    },
    init: function () {},

    setCost:function(fuelCnt,timeCnt){
        this.shipFuelLabel.setString(fuelCnt);
        this.shipFuel2Label.setString(fuelCnt);
        this.shipTargetTimeLabel.setString(timeCnt);

        if(this.game.storage.totalCoinAmount < fuelCnt){
            cc.log("xxxxxx");
            this.shipFuelLabel.setFontFillColor(new cc.Color(255, 0, 0, 255));
            this.shipFuel2Label.setFontFillColor(new cc.Color(255, 0, 0, 255));
        }else{
            this.shipFuelLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
            this.shipFuel2Label.setFontFillColor(new cc.Color(255, 255, 255, 255));
        }
    },

    update: function () {
        if (this.uiWindowAccount.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonSearch.setVisible(false);
            this.buttonOk.setVisible(true);
        }
        if (this.uiWindowResult.isVisible()) {
            this.buttonCancel.setVisible(false);
            this.buttonSearch.setVisible(false);
            this.buttonOk.setVisible(true);
        }
        if (this.uiWindowLanding.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonSearch.setVisible(true);
            this.buttonOk.setVisible(false);
        }
        if (this.uiWindowLaunch.isVisible()) {
            this.buttonCancel.setVisible(true);
            this.buttonSearch.setVisible(true);
            this.buttonOk.setVisible(false);
        }

        //storageが不足しているかチェックする

        //this.game.storage.totalCoinAmount
    },
    goToGameLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        var cardId = 1;
        scene.addChild(GameLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});