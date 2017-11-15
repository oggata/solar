var ShipControlMenu = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        //ランディング 001
        this.uiShipMonitor = cc.Sprite.create("res/ui_menu_ship.png");
        this.uiShipMonitor.setPosition(320, 200);
        this.addChild(this.uiShipMonitor, 9999999);
        this.uiShipMonitor001 = cc.Node.create();
        this.uiShipMonitor001.setAnchorPoint(0, 0);
        this.uiShipMonitor001.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor001);
        this.buttonLanding = new cc.MenuItemImage("res/button_ship_landing.png", "res/button_ship_landing.png", function () {
            this.game.InfoMenu.uiWindowLanding.setVisible(true);
            this.game.InfoMenu.infoNode.setVisible(true);
        }, this);

        this.buttonLanding.setPosition(320, 60);
        var menu001 = new cc.Menu(this.buttonLanding);
        menu001.setPosition(0, 0);
        this.uiShipMonitor001.addChild(menu001);
        //フリー探索 002
        this.uiShipMonitor002 = cc.Node.create();
        this.uiShipMonitor002.setAnchorPoint(0, 0);
        this.uiShipMonitor002.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor002);
        
        this.buttonLaunch = new cc.MenuItemImage("res/button_ship_launch.png", "res/button_ship_launch.png", function () {
            this.game.setFuelAndCoinCost(null);
        }, this);

        this.buttonLaunch.setPosition(460, 60);
        this.buttonCancel = new cc.MenuItemImage("res/button_ship_cancel.png", "res/button_ship_cancel.png", function () {
            this.game.masterShip.status = "NO_DIST";
            this.game.masterShip.dx = 0;
            this.game.masterShip.dy = 0;
            this.game.baseNode.removeChild(this.game.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.arrowLabel.setVisible(false);
            var _basePlanetId = this.game.storage.getShipParamByName("basePlanetId");
            this.game.storage.saveShipDataToStorage(0, 0, 0, _basePlanetId, "NO_DIST", 0,0,0);
        }, this);
        this.buttonCancel.setPosition(180, 60);
        var menu001 = new cc.Menu(this.buttonLaunch, this.buttonCancel);
        menu001.setPosition(0, 0);
        this.uiShipMonitor002.addChild(menu001);
        this.uiShipMonitor003 = cc.Node.create();
        this.uiShipMonitor003.setAnchorPoint(0, 0);
        this.uiShipMonitor003.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor003);
        //探索中
        this.uiShipMonitor004 = cc.Node.create();
        this.uiShipMonitor004.setAnchorPoint(0, 0);
        this.uiShipMonitor004.setPosition(0, 0);
        this.uiShipMonitor.addChild(this.uiShipMonitor004);

        this.buttonCancel = new cc.MenuItemImage("res/button_ship_cancel.png", "res/button_ship_cancel.png", function () {
            var _basePlanetId = this.game.storage.getShipParamByName("basePlanetId");
            this.game.storage.saveShipDataToStorage(0, 0, 0, _basePlanetId, "NO_DIST", 0,0,0);
            this.game.masterShip.status = "NO_DIST";
            this.game.masterShip.dx = 0;
            this.game.masterShip.dy = 0;
            this.game.baseNode.removeChild(this.game.drawNode2);
            this.game.arrow.setVisible(false);
            this.game.arrowLabel.setVisible(false);
            this.game.footer.goToDiscoveryLayer();
        }, this);
        this.buttonCancel.setPosition(180, 60);

        this.buttonWarp = new cc.MenuItemImage("res/button_ship_warp.png", "res/button_ship_warp.png", function () {
            //this.game.masterShip.targetTime = parseInt(new Date() / 1000);
            this.game.InfoMenu.uiWindowWarp.setVisible(true);
            this.game.InfoMenu.infoNode.setVisible(true);

        }, this);
        this.buttonWarp.setPosition(460, 60);

        var menu001 = new cc.Menu(this.buttonCancel,this.buttonWarp);
        menu001.setPosition(0, 0);
        this.uiShipMonitor004.addChild(menu001);
        this.touchStatus = "none";
    },
    init: function () {},
    update: function () {
        if (this.game.masterShip.status == "NO_DIST") {
            this.uiShipMonitor001.setVisible(true);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.game.masterShip.status == "SET_FREE_DIST") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(true);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.game.masterShip.status == "TOKEN_DIST") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(true);
            this.uiShipMonitor004.setVisible(false);
        } else
        if (this.game.masterShip.status == "MOVING") {
            this.uiShipMonitor001.setVisible(false);
            this.uiShipMonitor002.setVisible(false);
            this.uiShipMonitor003.setVisible(false);
            this.uiShipMonitor004.setVisible(true);
        }
    }
});