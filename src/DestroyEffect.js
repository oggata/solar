var DestroyEffect = cc.Node.extend({
    ctor: function () {
        this._super();
        this.image = "res/pipo-btleffect144.png";
        this.imgWidth = 320;
        this.imgHeight = 240;
        this.widthCnt = 3600/240;
        this.span = 0.1;
        this.initializeWalkAnimation();
    },

    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var i = 0; i < 9; i++) {
            var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * 0, this.imgHeight * i, this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setScale(3,3);
        this.addChild(this.sprite);
    },

    init: function () {},
    update: function (scaleNum) {
        //this.rectBar.setScale(scaleNum, 1);
    }
});
