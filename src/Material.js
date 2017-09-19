var Material = cc.Node.extend({
    ctor: function (game, mCode, orderCnt, isVisibleLabel) {
        this._super();
        this.game = game;
        this.amount = 1;
        this.materialCode = mCode;
        this.orderCnt = orderCnt;
        this.image = "res/sozai001.png";
        if (mCode == 1) {
            this.image = "res/sozai001.png";
        }
        if (mCode == 2) {
            this.image = "res/sozai002.png";
        }
        if (mCode == 3) {
            this.image = "res/sozai003.png";
        }
        if (mCode == 4) {
            this.image = "res/sozai004.png";
        }
        this.sprite = cc.Sprite.create(this.image);
        this.addChild(this.sprite);
        //this.sprite.setScale(0.2,0.2);
        this.amountLabel = new cc.LabelTTF("x" + this.amount, "Arial", 24);
        this.amountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        if (isVisibleLabel == true) {
            this.amountLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
            this.amountLabel.setPosition(65, 24);
            this.sprite.addChild(this.amountLabel);
        }
        this.maxSpriteScale = 0.8;
        this.spriteScale = 0.8;
        this.scaleAdd = 0.1;
    },
    init: function () {},
    update: function () {
        this.spriteScale += this.scaleAdd;
        if (this.spriteScale >= 1.7) {
            this.scaleAdd = -0.1;
        }
        if (this.spriteScale <= this.maxSpriteScale) {
            this.scaleAdd = 0;
            return false;
        }
        this.sprite.setScale(this.spriteScale);
        return true;
    },
    setAmount: function () {
        this.scaleAdd = 0.2;
        this.amountLabel.setString("x" + this.amount);
        if(this.amount == 0){
            this.amountLabel.setVisible(false);
        }
    },
});