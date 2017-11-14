var BattleResult = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        //this.baseNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 640, 1136);
        //this.addChild(this.baseNode);
        this.resultSprite = cc.Sprite.create("res/ui-game-result.png");
        this.resultSprite.setPosition(320, 1136 / 2);
        this.addChild(this.resultSprite);

        var retryButton = new cc.MenuItemImage("res/button_window_ok.png", "res/button_window_ok.png", function () {
            this.goToListLayer();
        }, this);
        retryButton.setPosition(453/2, -100);
        var menu002 = new cc.Menu(retryButton);
        menu002.setPosition(0, 0);
        this.resultSprite.addChild(menu002);

        this.maxPowerCnt = 20;
        this.maxItemCnt = 5;
        this.powerCnt = 0;
        this.itemCnt = 0;
        this.resultTxt = "";
    },
    sendMessage: function () {
        this.powerCnt = 0;
        this.itemCnt = 0;
    },
    init: function () {},
    update: function () {
        return true;
    },
    goToListLayer: function (errorNum) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage, errorNum));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    }
});