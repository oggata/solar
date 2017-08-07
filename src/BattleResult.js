var BattleResult = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.resultSprite = cc.Sprite.create("res/result2.png");
        this.resultSprite.setPosition(0,40);
        this.addChild(this.resultSprite);
        this.messageLabel2 = cc.LabelTTF.create("", "Arial", 20);
        this.messageLabel2.setPosition(80, 520);
        this.messageLabel2.setAnchorPoint(0, 1);
        this.messageLabel2.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.resultSprite.addChild(this.messageLabel2);
        var clopseButton = new cc.MenuItemImage("res/button_close9.png", "res/button_close9.png", function () {
            this.game.goToListLayer(0);
        }, this);
        clopseButton.setPosition(320, 40);
        var menu002 = new cc.Menu(clopseButton);
        menu002.setPosition(0, 0);
        this.resultSprite.addChild(menu002);
        this.message = "";
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;

this.occupiedGauge = new Gauge(510, 40, 'GREEN');
this.occupiedGauge.setAnchorPoint(0, 0);
this.occupiedGauge.setPosition(50, 580);
this.resultSprite.addChild(this.occupiedGauge);
this.gaugeScore = 60;
this.gaugeDrawScore = 0;
this.gaugeMaxScore = 100;

    },
    sendMessage: function (message) {
        this.message = message;
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;
    },
    init: function () {},
    update: function () {

if(this.gaugeScore >= this.gaugeDrawScore){
    this.gaugeDrawScore += 0.5;
}
this.occupiedGauge.update(this.gaugeDrawScore/this.gaugeMaxScore);




        if (this.message) {
            if (this.message.length > 0) {
                //メッセージ表示の管理
                this.messageTime2++;
                if (this.messageTime2 >= 1) {
                    this.messageTime2 = 0;
                    this.visibleStrLenght2++;
                }
                if (this.visibleStrLenght2 > this.message.length) {
                    this.visibleStrLenght2 = this.message.length;
                }
                var _visibleString = this.message.substring(0, this.visibleStrLenght2);
                this.messageLabel2.setString(_visibleString);
            }
        }
        return true;
    },
});