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



