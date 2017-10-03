var Footer = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;
        this.baseNode = cc.Sprite.create("res/footer.png");
        this.baseNode.setAnchorPoint(0, 0);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        var buttonMenu001 = new cc.MenuItemImage("res/button_menu_discovery.png", "res/button_menu_discovery.png",
            function () {
                this.goToDiscoveryLayer();
            }, this);
        buttonMenu001.setPosition(160, 60);
        var buttonMenu002 = new cc.MenuItemImage("res/button_menu_planets.png", "res/button_menu_planets.png", function () {
            this.goToPlanetsLayer();
        }, this);
        buttonMenu002.setPosition(160 * 2, 60);
        var buttonMenu003 = new cc.MenuItemImage("res/button_menu_item.png", "res/button_menu_item.png", function () {
            this.goToItemLayer();
        }, this);
        buttonMenu003.setPosition(160 * 3, 60);
        var menu002 = new cc.Menu(buttonMenu001, buttonMenu002, buttonMenu003);
        menu002.setPosition(0, 0);
        this.baseNode.addChild(menu002);
    },
    init: function () {},
    update: function () {
        return true;
    },
    goToDiscoveryLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
    goToItemLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(MissionsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
    goToPlanetsLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(PlanetsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});
var Ship = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.rocketSprite = cc.Sprite.create("res/ship_search.png");
        this.addChild(this.rocketSprite);
        this.radars = [];
        this.radarTime = 0;

this.setScale(0.5,0.5);


/*
        this.imgWidth = 1280*2 / 8;
        this.imgHeight = 1280*2 / 8;
        this.widthCnt = 7;
        //this.setScale(0.6, 0.6);
        this.span = 0.1;

        var frameSeq = [];
        for (var i = 2; i < this.widthCnt; i++) {
            var frame = cc.SpriteFrame.create("res/planetsprite.png", cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        //this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.sprite2 = cc.Sprite.create("res/datapost.png", cc.rect(0, 0, this.imgWidth, this.imgHeight));
        //this.sprite2.setPosition(0, 40 + 15);
        this.sprite2.runAction(this.ra);
        this.sprite2.setAnchorPoint(0.5, 0.5);
        this.rocketSprite.addChild(this.sprite2);
*/


    },
    init: function () {},
    update: function () {
        this.radarTime += 1;
        if (this.radarTime >= 30 * 2) {
            this.radarTime = 0;
            this.radar = cc.Sprite.create("res/sprite_radar.png");
            this.addChild(this.radar);
            this.radars.push(this.radar);
            this.radar.radarCnt = 1;
        }
        for (var j = 0; j < this.radars.length; j++) {
            this.radars[j].setOpacity(255 * 0.3);
            this.radars[j].radarCnt += 1;
            this.radars[j].setScale(this.radars[j].radarCnt / 10);
            if (this.radars[j].radarCnt >= 30) {
                this.removeChild(this.radars[j]);
            }
        }
        return true;
    }
});


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
        //探索結果画面
        this.uiWindowResult = cc.Sprite.create("res/ui-result-window.png");
        this.uiWindowResult.setPosition(320, 120);
        this.infoNode.addChild(this.uiWindowResult);
        this.uiWindowResult.setVisible(false);
        //ランディング画面
        this.uiWindowLanding = cc.Sprite.create("res/ui-window-landing.png");
        this.uiWindowLanding.setPosition(320, 0);
        this.uiWindowLanding.setVisible(false);
        this.infoNode.addChild(this.uiWindowLanding);
        //ロケット発射画面
        this.uiWindowLaunch = cc.Sprite.create("res/ui-window-launch.png");
        this.uiWindowLaunch.setPosition(320, 0);
        this.uiWindowLaunch.setVisible(false);
        this.infoNode.addChild(this.uiWindowLaunch);
        this.shipTargetTimeLabel = cc.LabelTTF.create("所要時間 10:00", "Arial", 18);
        this.shipTargetTimeLabel.setPosition(320, 70);
        this.shipTargetTimeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.uiWindowLaunch.addChild(this.shipTargetTimeLabel);
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
    update: function () {
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
    },
    goToGameLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        var cardId = 1;
        scene.addChild(GameLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
});