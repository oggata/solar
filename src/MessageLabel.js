var MessageLabel = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.message = "";
        this.messageTime = 0;
        this.visibleStrLenght = 0;
        this.messageLabel = cc.LabelTTF.create("", "Arial", 24);
        this.messageLabel.setAnchorPoint(0, 1);
        this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.addChild(this.messageLabel, 9999999999999);
        this.messageLabel.setAnchorPoint(0, 1);
    },
    init: function () {},
    update: function () {
        //メッセージ表示の管理
        if (this.messageTime >= 2) {
            this.messageTime = 0;
            this.visibleStrLenght++;
        }
        if (this.visibleStrLenght > this.message.length) {
            //this.visibleStrLenght = 0;
            this.messageTime = 0;
        }else{
            this.messageTime++;
        }
        var _visibleString = this.message.substring(0, this.visibleStrLenght);
        this.messageLabel.setString(_visibleString);
        this.messageLabel.setVisible(true);

        return true;
    },
});