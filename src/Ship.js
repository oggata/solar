var Ship = cc.Node.extend({
    ctor: function (game,basePlanet) {
        this._super();
        this.game = game;
        this.basePlanet = basePlanet;
        this.rocketSprite = cc.Sprite.create("res/ship_search.png");
        this.addChild(this.rocketSprite);
        this.radars = [];
        this.radarTime = 0;
        this.radarTime2 = 0;
        this.setScale(0.5, 0.5);
        this.rocketId = 1;
        this.dx = 0;
        this.dy = 0;
        this.targetTime = 0;
        this.targetPlanetId = "xxx";
        this.status = "xxx";
        this.addDebrisCnt = 0;

        this.timeLabel = cc.LabelTTF.create("32", "Arial", 48);
        this.timeLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.timeLabel.setPosition(115, 160);
        this.timeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.rocketSprite.addChild(this.timeLabel);
    },
    init: function () {},


    setTimeLabel:function(pastSecond){
        var _txt = this.game.storage.getFormatedTimeLabel(pastSecond);
        this.timeLabel.setString(_txt);
    },

    update: function () {

        this.radarTime += 1;
        if (this.radarTime >= 30 * 3) {
            this.radarTime = 0;
            this.radar = cc.Sprite.create("res/ship_radar.png");
            this.addChild(this.radar);
            this.radars.push(this.radar);
            this.radar.radarCnt = 1;
        }

        this.radarTime2 += 1;
        if (this.radarTime2 >= 30 * 5) {
            this.radarTime2 = 0;
            this.radar2 = cc.Sprite.create("res/ship_radar2.png");
            this.addChild(this.radar2);
            this.radars.push(this.radar2);
            this.radar2.radarCnt = 1;
        }

        for (var j = 0; j < this.radars.length; j++) {
            this.radars[j].setOpacity(255 * 0.3);
            this.radars[j].radarCnt += 1;
            this.radars[j].setScale(this.radars[j].radarCnt / 10);
            if (this.radars[j].radarCnt >= 60) {
                this.removeChild(this.radars[j]);
            }
        }
        return true;
    }
});