var Gauge = cc.Node.extend({
    ctor: function (width, height, color) {
        this._super();
        this.width = width;
        this.height = height;
        this.rectBase = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), this.width, this.height);
        this.rectBase.setPosition(0, 0);
        this.addChild(this.rectBase, 1);

        var colorCode = new cc.Color(255, 255, 255, 255);
            colorCode = new cc.Color(255, 255, 255, 255);
            this.rectBack = cc.LayerColor.create(new cc.Color(128, 128, 128, 255), this.width - 2, this.height - 2);
            this.rectBack.setPosition(2, 2);
            this.addChild(this.rectBack, 2);
        this.rectBar = cc.LayerColor.create(colorCode, this.width - 2, this.height - 2);
        this.rectBar.setPosition(2, 2);
        this.addChild(this.rectBar, 3);
        this.rectBar.setAnchorPoint(0, 0);
    },
    init: function () {},
    update: function (scaleNum) {
        this.rectBar.setScale(scaleNum, 1);
    },
    setVisible: function (isVisible) {
        this.rectBase.setVisible(isVisible);
        this.rectBack.setVisible(isVisible);
        this.rectBar.setVisible(isVisible);
    }
});


var DestroyEffect = cc.Node.extend({
    ctor: function () {
        this._super();
cc.log("DestroyEffect");
        this.image = "res/pipo-btleffect144.png";
        this.width = 320;
        this.height = 240;
        this.widthCnt = 3600/240;
        this.initializeWalkAnimation();
    },

    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var i = 0; i < this.widthCnt; i++) {
            var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        //this.sprite.setAnchorPoint(0.5, 0.5);
        //this.sprite.setPosition(this.imgWidth / 4, this.imgHeight * 2 / 5);
        this.addChild(this.sprite);
    },

    init: function () {},
    update: function (scaleNum) {
        this.rectBar.setScale(scaleNum, 1);
    }
});