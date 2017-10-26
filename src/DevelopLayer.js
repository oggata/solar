/*
var DevelopLayer = cc.Layer.extend({
    ctor: function (storage, playerColorTxt) {
        this._super();

        this.playerColorTxt = "green";
        this.back = cc.Sprite.create("res/back_top3.png");
        this.back.setPosition(0, 0);
        this.back.setAnchorPoint(0, 0);
        this.addChild(this.back);

        this.buttonBack = new cc.MenuItemImage("res/button_back.png", "res/button_back.png", function () {
            //cc.log("aa");
            this.goToTopLayer();
        }, this);
        this.buttonBack.setPosition(50, 1136 - 60);
        var menu005 = new cc.Menu(this.buttonBack);
        menu005.setPosition(0, 0);
        this.back.addChild(menu005);
    },

    update: function (dt) {

    },
    goToTopLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
});
DevelopLayer.create = function (storage) {
    return new DevelopLayer(storage);
};
var DivelopLayerScene = cc.Scene.extend({
    onEnter: function (storage) {
        this._super();
        var layer = new DevelopLayer(storage);
        this.addChild(layer);
    }
});
*/