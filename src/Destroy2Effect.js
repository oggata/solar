var Destroy2Effect = cc.Node.extend({
    ctor: function () {
        this._super();
        this.image = "res/pipo-goldensphere.png";
        this.imgWidth = 960/5;
        this.imgHeight = 768/4;
        this.span = 0.05;
        this.initializeWalkAnimation();
    },
    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var row = 2; row < 4; row++) {
            for (var col = 0; col < 5; col++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * col, this.imgHeight * row, this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setScale(2.5,2.5);
        this.addChild(this.sprite);
    },

    init: function () {},
    update: function (scaleNum) {
        //this.rectBar.setScale(scaleNum, 1);
    }
});
