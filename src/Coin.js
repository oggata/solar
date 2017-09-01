var Coin = cc.Node.extend({
    ctor: function (game, col, row) {
        this._super();
        this.game = game;
        this.col = col;
        this.row = row;
        var _rand2 = this.game.getRandNumberFromRange(1, 5);
        //_rand2 = 1;
        this.typeNum = _rand2;
        if (_rand2 == 1) {
            this.image = "res/material-map-001.png";
        }
        if (_rand2 == 2) {
            this.image = "res/material-map-002.png";
        }
        if (_rand2 == 3) {
            this.image = "res/material-map-001.png";
        }
        if (_rand2 == 4) {
            this.image = "res/material-map-002.png";
        }
        this.sprite = cc.Sprite.create(this.image);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);
        this.hp = 100;
    },
    init: function () {},
    update: function () {
        if (this.hp == 0) {
            return false;
        }
        return true;
    },
});