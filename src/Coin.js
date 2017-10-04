var Coin = cc.Node.extend({
    ctor: function (game, col, row) {
        this._super();
        this.game = game;
        this.col = col;
        this.row = row;

        /*
        var _rand2 = this.game.getRandNumberFromRange(1, 5);
        _rand2 = 1;
        this.typeNum = _rand2;
        if (_rand2 == 1) {
            this.image = "res/material-map-001.png";
        }
        if (_rand2 == 2) {
            this.image = "res/material-map-002.png";
        }
        if (_rand2 == 3) {
            this.image = "res/material-map-003.png";
        }
        if (_rand2 == 4) {
            this.image = "res/material-map-004.png";
        }
        this.sprite = cc.Sprite.create(this.image);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        */

                    this.tree = cc.Sprite.create("res/planets/004/map-chip-z.png");
                    this.addChild(this.tree);  

        this.imgWidth = 1280 / 8;
        this.imgHeight = 1280 / 8;
        this.widthCnt = 6;
        /*
        this.sprite = cc.Sprite.create("res/datapost.png", cc.rect(this.imgWidth, 0, this.imgWidth, this.imgHeight));
        this.sprite.setPosition(0, 40 + 15);
        //this.sprite.runAction(this.ra);
        this.sprite.setAnchorPoint(0.5, 0.5);
        //this.addChild(this.sprite);
        */
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
/*
        if (this.hp == 0) {

            if(this.deadTime == 0){
                this.initializeWalkAnimation();
            }

            this.deadTime+=1;
            if(this.deadTime >= 30*5){
                this.game.gameScore += 1;
                return false;
            }

            return true;
        }
*/
        return true;
    },
    initializeWalkAnimation: function () {

        this.imgWidth = 120;
        this.imgHeight = 120;
        this.widthCnt = 6;
        //this.setScale(0.6, 0.6);
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
        this.sprite2.setScale(0.5,0.5);
        this.addChild(this.sprite2);
    },
});