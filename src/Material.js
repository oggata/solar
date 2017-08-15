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
        this.amountLabel = new cc.LabelTTF(this.amount, "Arial", 36);
        this.amountLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.amountLabel.setPosition(62/2,20);
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