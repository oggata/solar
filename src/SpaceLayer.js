var SpaceLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage,errorCode) {
        this._super();
        this.storage = storage;

        return true;
    },

    update: function (dt) {
        
    },

    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    //シーンの切り替え----->
    goToFieldLayer: function (typeText, isCom) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        scene.addChild(PlanetLayer.create(this.storage, typeText, isCom));
        cc.director.runScene(cc.TransitionFadeTR.create(0.5, scene));
    },
    showInfo: function (text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },
});
SpaceLayer.create = function (storage,errorCode) {
    return new ListLayer(storage,errorCode);
};
var SpaceLayerScene = cc.Scene.extend({
    onEnter: function (storage,errorCode) {
        this._super();
        var layer = new SpaceLayer(storage,errorCode);
        this.addChild(layer);
    }
});