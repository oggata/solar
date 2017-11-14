var Coin = cc.Node.extend({
    ctor: function (game, col, row, type) {
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
        var _rand1 = this.getRandNumberFromRange(1, 5);
        //_rand1 = 1;
        if (_rand1 == 1) {
            //エネルギー
            this.name = "energy"
            this.amount = 10;
            this.isEnergy = true;
            this.initializeWalkAnimation();
        } else {
            var _rand = this.getRandNumberFromRange(1, 5);
            var _data = CONFIG.MATERIAL[_rand];
            this.name = _data["name"];
            this.amount = 1;
            this.material_id = _rand;
            this.isEnergy = false;
            this.box = cc.Sprite.create("res/material-box.png");
            this.addChild(this.box);
            this.box.setPosition(0, 15);
        }
    },
    init: function () {},
    update: function () {
        if (this.hp == 0) {
            this.game.gameScore += 1;
            return false;
        }
        return true;
    },
    getItem: function () {
        this.game.messageLabel2.message += this.name + "x" + this.amount + "を得ました.\n";
        if (this.isEnergy == true) {
            this.game.storage.addCoin(this.amount);
        } else {
            //cc.log(CONFIG.MATERIAL[this.material_id]);
            this.game.storage.saveMaterialDataToStorage(CONFIG.MATERIAL[this.material_id], this.amount);
        }
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
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
});