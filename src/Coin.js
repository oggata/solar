var Material = cc.Node.extend({
    ctor: function (game, mCode,orderCnt) {
        this._super();
        this.game = game;
        this.amount = 1;
        this.materialCode = mCode;
        this.orderCnt = orderCnt;    
        this.image = "res/sozai001.png";
        if(mCode == 1){
            this.image = "res/sozai001.png";
        }
        if(mCode == 2){
            this.image = "res/sozai002.png";
        }
        if(mCode == 3){
            this.image = "res/sozai003.png";
        }
        if(mCode == 4){
            this.image = "res/sozai004.png";
        }
        if(mCode == 5){
            this.image = "res/sozai005.png";
        }
        if(mCode == 6){
            this.image = "res/sozai006.png";
        }
        this.sprite = cc.Sprite.create(this.image);
        this.addChild(this.sprite);
        this.amountLabel = new cc.LabelTTF(this.amount, "Arial", 25);
        this.amountLabel.setPosition(15,17);
        this.sprite.addChild(this.amountLabel);
        this.spriteScale = 1;
        this.scaleAdd = 0.1;
    },
    init: function () {},

    update: function () {
        this.spriteScale += this.scaleAdd;
        if(this.spriteScale >= 1.7){
            this.scaleAdd = -0.1;
        }
        if(this.spriteScale <= 1){
            this.scaleAdd = 0;
            return false;
        }
        this.sprite.setScale(this.spriteScale);

        return true;
    },

    setAmount:function(){
        this.scaleAdd = 0.2;
        this.amountLabel.setString(this.amount);
    },
});



var Debris = cc.Node.extend({
    ctor: function (game, blockNum) {
        this._super();
        this.game = game;
        this.blockNum = blockNum;
        if (this.blockNum) {
            this.blockNum = blockNum;
        } else {
            this.blockNum = this.game.getRandNumberFromRange(1, 1);
        }
        this.sprite = cc.Sprite.create("res/bit_021.png");
        if (this.blockNum == 21) {
            this.sprite = cc.Sprite.create("res/bit_021.png");
        }
        this.sprite.setScale(0.64);

        this.addChild(this.sprite);
        this.dx = 0;
        this._rand = this.game.getRandNumberFromRange(1, 6);
        if (this._rand == 1) {
            this.dx = -2;
        }
        if (this._rand == 2) {
            this.dx = -1.5;
        }
        if (this._rand == 3) {
            this.dx = -1;
        }
        if (this._rand == 4) {
            this.dx = 1;
        }
        if (this._rand == 5) {
            this.dx = 1.5;
        }
        if (this._rand == 5) {
            this.dx = 2;
        }
        this.effectTime = 0;
        this.speed = this.game.getRandNumberFromRange(5, 25);
        this.speed = 7;
        this.isTouchedPlayer = false;
        this.isTouchCnt = 0;
        this.debriScale = 1;
    },
    init: function () {},
    update: function () {
        this.effectTime++;
        var _y = 0;
        var _x = 0;
        //お金の時は上昇していく
        _y = this.speed * (this.effectTime) - 1 / 2 * 9.8 * (this.effectTime / 5) * (this.effectTime / 5) + 0;
        _x = this.effectTime * this.dx;
        this.sprite.setPosition(_x, _y);
        if (this.effectTime >= 50) {
            return false;
        }
        return true;
    },
});

var Coin = cc.Node.extend({
    ctor: function (game, col, row) {
        this._super();
        this.game = game;
        this.col = col;
        this.row = row;
        this.sprite = cc.Sprite.create("res/map-base-coin.png");
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.image = "res/pipo-mapeffect009.png";
        this.imgWidth = 240;
        this.imgHeight = 240;
        //this.initializeWalkAnimation();
        this.hp = 100;
    },
    init: function () {},

    update: function () {
        if(this.hp == 0){
            return false;            
        }
        return true;
    },

    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var row = 0; row < 1; row++) {
            for (var col = 0; col < 10; col++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * col, this.imgHeight * row, this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, 0.05);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setAnchorPoint(0.5, 0.5);
        //this.sprite.setPosition(6,6);
        //this.sprite.setPosition(8,8);
        this.sprite.setScale(0.3,0.3);
        this.addChild(this.sprite);
    },
});



var Debris = cc.Node.extend({
    ctor: function (game, blockNum) {
        this._super();
        this.game = game;
        this.blockNum = blockNum;
        if (this.blockNum) {
            this.blockNum = blockNum;
        } else {
            this.blockNum = this.game.getRandNumberFromRange(1, 1);
        }
        this.sprite = cc.Sprite.create("res/bit_021.png");
        if (this.blockNum == 21) {
            this.sprite = cc.Sprite.create("res/bit_021.png");
        }
        this.sprite.setScale(0.64);

        this.addChild(this.sprite);
        this.dx = 0;
        this._rand = this.game.getRandNumberFromRange(1, 6);
        if (this._rand == 1) {
            this.dx = -2;
        }
        if (this._rand == 2) {
            this.dx = -1.5;
        }
        if (this._rand == 3) {
            this.dx = -1;
        }
        if (this._rand == 4) {
            this.dx = 1;
        }
        if (this._rand == 5) {
            this.dx = 1.5;
        }
        if (this._rand == 5) {
            this.dx = 2;
        }
        this.effectTime = 0;
        this.speed = this.game.getRandNumberFromRange(5, 25);
        this.speed = 7;
        this.isTouchedPlayer = false;
        this.isTouchCnt = 0;
        this.debriScale = 1;
    },
    init: function () {},
    update: function () {
        this.effectTime++;
        var _y = 0;
        var _x = 0;
        //お金の時は上昇していく
        _y = this.speed * (this.effectTime) - 1 / 2 * 9.8 * (this.effectTime / 5) * (this.effectTime / 5) + 0;
        _x = this.effectTime * this.dx;
        this.sprite.setPosition(_x, _y);
        if (this.effectTime >= 30) {
            return false;
        }
        return true;
    },
});



