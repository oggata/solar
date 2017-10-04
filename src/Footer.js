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
