var Footer = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.storage = this.game.storage;
        this.baseNode = cc.Sprite.create("res/footer.png");
        this.baseNode.setAnchorPoint(0, 0);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);

        var buttonMenu001 = new cc.MenuItemImage("res/button_menu_planet.png", "res/button_menu_planet.png", function () {
            this.goToDiscoveryLayer();
        }, this);
        buttonMenu001.setPosition(160 - 80, 60);

        var buttonMenu002 = new cc.MenuItemImage("res/button_menu_route.png", "res/button_menu_route.png", function () {
            this.goToItemLayer();
        }, this);
        buttonMenu002.setPosition(160 * 2 - 80, 60);

        var buttonMenu003 = new cc.MenuItemImage("res/button_menu_trade.png", "res/button_menu_trade.png", function () {
            //this.goToItemLayer();
            this.goToPlanetsLayer();
        }, this);
        buttonMenu003.setPosition(160 * 3 - 80, 60);

        var buttonMenu004 = new cc.MenuItemImage("res/button_menu_profile.png", "res/button_menu_profile.png", function () {
            //this.goToItemLayer();
            this.goToProfileLayer();
        }, this);
        buttonMenu004.setPosition(160 * 4 - 80, 60);
        var menu002 = new cc.Menu(buttonMenu001, buttonMenu002, buttonMenu003,buttonMenu004);
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
        //windowName
        scene.addChild(DiscoveryLayer2.create(this.storage, cardId));
        //cc.director.runScene(cc.TransitionSlideInR.create(1.5, scene));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    goToItemLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(MissionsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    goToPlanetsLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(PlanetsLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
    goToProfileLayer: function (cardId) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(ProfileLayer.create(this.storage, cardId));
        cc.director.runScene(cc.TransitionFadeDown.create(0.4, scene));
    },
});