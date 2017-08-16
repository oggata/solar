var BattleResult = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.resultSprite = cc.Sprite.create("res/result2.png");
        this.resultSprite.setPosition(0, 40);
        this.addChild(this.resultSprite);
        this.titleLabel = cc.LabelTTF.create("YOU ARE FIRST VISITER!", "Arial", 42);
        this.titleLabel.setPosition(70, 800);
        this.titleLabel.setAnchorPoint(0, 1);
        //this.titleLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.resultSprite.addChild(this.titleLabel);
        this.messageLabel2 = cc.LabelTTF.create("", "Arial", 22);
        this.messageLabel2.setPosition(70, 500);
        this.messageLabel2.setAnchorPoint(0, 1);
        this.messageLabel2.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.resultSprite.addChild(this.messageLabel2);
        var clopseButton = new cc.MenuItemImage("res/button_close9.png", "res/button_close9.png", function () {
            this.game.goToListLayer(0);
        }, this);
        clopseButton.setPosition(320, 70);
        var menu002 = new cc.Menu(clopseButton);
        menu002.setPosition(0, 0);
        this.resultSprite.addChild(menu002);
        this.message = "";
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;
        /*
        this.occupiedGauge = new Gauge(510, 40, 'GREEN');
        this.occupiedGauge.setAnchorPoint(0, 0);
        this.occupiedGauge.setPosition(50, 580);
        this.resultSprite.addChild(this.occupiedGauge);
        */
        this.gaugeScore = 60;
        this.gaugeDrawScore = 0;
        this.gaugeMaxScore = 100;
    },
    sendMessage: function () {
        //this.message = message;
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;
        this.message = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
        //this.storage.treasureAmount += _addCoin;
        //this.storage.saveCurrentData();
    },
    init: function () {},
    update: function () {
        if (this.game.destCaptureRate <= this.game.captureRate) {
            this.message = "ミッションを達成しました！\n惑星全体の" + Math.floor(this.game.captureRate * 100) + "%の探索が完了。\n報酬として素材を手に入れました。\n";
            this.titleLabel.setString("YOU ARE FIRST VISITER!");
        } else {
            this.message = "ミッションに失敗しました！\n惑星全体の" + Math.floor(this.game.captureRate * 100) +
                "%の探索が完了。\n掘削した素材は手に入りませんでした。\n";
            this.titleLabel.setString("FAILED TO INVESTIGATE..");
        }
        //this.occupiedGauge.update(this.game.captureRate);
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