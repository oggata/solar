var BattleResult = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.baseNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.7), 640, 1136);
        this.addChild(this.baseNode);
        this.resultSprite = cc.Sprite.create("res/ui-game-result.png");
        this.resultSprite.setPosition(320, 1136 / 2);
        this.addChild(this.resultSprite);
        this.circleSprite = cc.Sprite.create("res/ui-result-rotate-circle.png");
        this.circleSprite.setPosition(310, 310);
        this.resultSprite.addChild(this.circleSprite);
        this.cirlceDegrees = 0;
        this.circleSprite.setScale(1.4);
        this.circleSprite2 = cc.Sprite.create("res/ui-result-rotate-circle2.png");
        this.circleSprite2.setPosition(310, 310);
        this.resultSprite.addChild(this.circleSprite2);
        this.circle2Scale = 0.5;
        this.circle2ScaleAdd = 0.05;
        this.resultScore = 0;
        this.resultMaxScore = 50;
        this.resultLabel = cc.LabelTTF.create("54%", "Arial", 84);
        this.resultLabel.setPosition(310, 310);
        //this.resultLabel.setAnchorPoint(0, 1);
        this.resultSprite.addChild(this.resultLabel);
        this.titleLabel = cc.LabelTTF.create("", "Arial", 32);
        this.titleLabel.setPosition(100, 800);
        this.titleLabel.setAnchorPoint(0, 1);
        //this.titleLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.resultSprite.addChild(this.titleLabel);
        this.messageLabel2 = cc.LabelTTF.create("", "Arial", 22);
        this.messageLabel2.setPosition(70, 500);
        this.messageLabel2.setAnchorPoint(0, 1);
        this.messageLabel2.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        //this.resultSprite.addChild(this.messageLabel2);
        var retryButton = new cc.MenuItemImage("res/button_retry.png", "res/button_retry.png", function () {
            this.goToListLayer();
        }, this);
        retryButton.setPosition(320, 50);
        var menu002 = new cc.Menu(retryButton);
        menu002.setPosition(0, 0);
        this.resultSprite.addChild(menu002);
        this.message = "";
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;
        this.gaugeScore = 60;
        this.gaugeDrawScore = 0;
        this.gaugeMaxScore = 100;
    },
    sendMessage: function () {
        //this.message = message;
        this.resultScore = 0;
        this.messageTime2 = 0;
        this.visibleStrLenght2 = 0;
        //this.message = "惑星の43%の探索が完了。\n目標値レコードを更新しました。\n";
    },
    init: function () {},
    update: function () {
        this.cirlceDegrees += 1;
        this.circleSprite.setRotation(this.cirlceDegrees);
        if (this.circle2Scale >= 1.5) {
            this.circle2ScaleAdd = -0.05;
        }
        if (this.circle2Scale <= 0.8) {
            this.circle2ScaleAdd = 0.05;
        }
        this.circle2Scale += this.circle2ScaleAdd;
        this.circleSprite2.setScale(this.circle2Scale);
        if (this.resultScore <= this.resultMaxScore) {
            this.resultScore++;
        }
        this.resultLabel.setString(this.resultScore + "%");
        if (this.game.battleWindow.result == "success") {
            this.message = "ミッションを達成しました！\n惑星全体の" + Math.floor(this.game.battleWindow.gameScore) +
                "点を達成しました。\n報酬として素材を手に入れました。\n";
            this.titleLabel.setString("YOU ARE FIRST VISITER!");
        } else {
            this.message = "ミッションに失敗しました！\n惑星全体の" + Math.floor(this.game.battleWindow.gameScore) +
                "点を達成しました。\n掘削した素材は手に入りませんでした。\n";
            this.titleLabel.setString("FAILED TO INVESTIGATE..");
        }
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
    goToListLayer: function (errorNum) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(DiscoveryLayer2.create(this.storage, errorNum));
        cc.director.runScene(cc.TransitionFadeTR.create(1.0, scene));
    },
    goToCardLayer: function (pSender) {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(CardLayer.create(this.storage, [], 0));
        cc.director.runScene(cc.TransitionFade.create(0.3, scene));
    },
});