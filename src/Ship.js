var Ship = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.rocketSprite = cc.Sprite.create("res/ship_search.png");
        this.addChild(this.rocketSprite);
        this.radars = [];
        this.radarTime = 0;
        this.setScale(0.5, 0.5);
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