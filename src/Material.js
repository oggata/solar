var Material = cc.Node.extend({
    ctor: function (game, mCode,orderCnt,isVisibleLabel) {
        this._super();
        this.game = game;
        this.amount = 1;
        this.materialCode = mCode;
        this.orderCnt = orderCnt;

/*
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
*/

        //this.image = "res/sozai001.png";
        if(mCode == 1){
            this.image = "res/material-map-001.png";
        }
        if(mCode == 2){
            this.image = "res/material-map-002.png";
        }
        if(mCode == 3){
            this.image = "res/material-map-001.png";
        }
        if(mCode == 4){
            this.image = "res/material-map-002.png";
        }
        if(mCode == 5){
            this.image = "res/sozai005.png";
        }
        if(mCode == 6){
            this.image = "res/sozai006.png";
        }
        this.sprite = cc.Sprite.create(this.image);
        this.addChild(this.sprite);
//this.sprite.setOpacity(0.1);

        this.amountLabel = new cc.LabelTTF(this.amount, "Arial", 28);
        this.amountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
if(isVisibleLabel == true){
        //this.amountLabel.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.amountLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.amountLabel.setPosition(62/2,20);
        this.sprite.addChild(this.amountLabel);
}
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