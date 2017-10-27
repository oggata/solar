var Coin = cc.Node.extend({
    ctor: function (game, col, row) {
        this._super();
        this.game = game;
        this.col = col;
        this.row = row;

        this.mapChip = cc.Sprite.create("res/planets/004/map-chip-z.png");
        this.addChild(this.mapChip);
        this.imgWidth = 1280 / 8;
        this.imgHeight = 1280 / 8;
        this.widthCnt = 6;

        this.hp = 100;
        this.deadTime = 0;
        this.initializeWalkAnimation();
    },
    init: function () {},
    update: function () {
        if (this.hp == 0) {
            this.game.gameScore += 1;
            return false;
        }
        return true;
    },
    initializeWalkAnimation: function () {
        this.imgWidth = 120;
        this.imgHeight = 120;
        this.widthCnt = 6;
        this.span = 0.1;
        var frameSeq = [];
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 5; col++) {
                var frame = cc.SpriteFrame.create("res/pipo-mapeffect012j.png", cc.rect(this.imgWidth * col, this.imgHeight * row, this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        //this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.sprite2 = cc.Sprite.create("res/pipo-mapeffect012j.png", cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite2.setPosition(0, 40);
        this.sprite2.runAction(this.ra);
        this.sprite2.setAnchorPoint(0.5, 0.5);
        this.sprite2.setScale(0.5, 0.5);
        this.addChild(this.sprite2);
    },
});