var Noise = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;

        this.noiseNode = cc.Sprite.create("res/back_top5.png");
        this.noiseNode.setAnchorPoint(0, 0);
        this.noiseNode.setPosition(0, 0);
        this.addChild(this.noiseNode);



        this.noiseTime = 0;
        this.noiseOpacity = 0;
        this.noiseAddOpacity = 0.05;

    },
    init: function () {},
    update: function () {
        //ノイズのエフェクト
        this.noiseTime++;
        if (this.noiseTime >= 30 * 6) {
            this.noiseTime = 0;
        }
        if (this.noiseTime >= 0 && this.noiseTime <= 30 * 3) {
            if (this.noiseOpacity <= 0) {
                this.noiseAddOpacity = 0.4;
            } else if (this.noiseOpacity >= 0.4) {
                this.noiseAddOpacity = -0.4;
            }
            this.noiseOpacity += this.noiseAddOpacity;
            this.noiseNode.setOpacity(255 * this.noiseOpacity);
        } else {
            this.noiseNode.setOpacity(255 * 0);
        }
        return true;
    },
});