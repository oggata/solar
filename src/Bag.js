var Bag = cc.Node.extend({
    ctor: function (game, col, row, type) {
        this._super();
        this.game = game;

        this.bag = cc.Sprite.create("res/bag.png");
        this.bag.setOpacity(255*0.4);
        this.addChild(this.bag);

        this.bag.setPosition(320,1136/2);


this.cards = [];
this.card = new ccui.Button("res/item001.png", "res/item001.png");
this.card.material_id = 998;
this.card.addTouchEventListener(this.touchEvent, this);
this.card.setPosition(0,250);
this.addChild(this.card);
this.cards.push(this.card);

this.card = new ccui.Button("res/item001.png", "res/item001.png");
this.card.material_id = 999;
this.card.addTouchEventListener(this.touchEvent, this);
this.card.setPosition(0,250);
this.addChild(this.card);


this.cards.push(this.card);



/*
            var button = new cc.MenuItemImage("res/button_get_coin.png", "res/button_get_coin_on.png", function () {
                this.infoNode.setVisible(true);
                var _planetId = this.items[strValue].id;
                this.detail.setPlanet(_planetId);
            }, this);
            button.setPosition(600, 50);
            var menu001 = new cc.Menu(button);
            menu001.setPosition(0, 0);
*/
        /*
        this.col = col;
        this.row = row;
        this.mapChip = cc.Sprite.create("res/bag.png");
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
        */
    },
    init: function () {},
    update: function () {
        if (this.hp == 0) {
            this.game.gameScore += 1;
            return false;
        }
        return true;
    },

    touchEvent: function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                cc.log("Touch Down");
                break;
 
            case ccui.Widget.TOUCH_MOVED:
                cc.log("Touch Move");
                //cc.log(sender.material_id);
                //cc.log(sender._touchMovePosition.x + "/" + sender._touchMovePosition.y);

//                this.card.setPosition(sender._touchMovePosition.x,sender._touchMovePosition.y);

if(sender.material_id){
    for (var i = 0; i <= this.cards.length; i++) {
        if(this.cards[i].material_id == sender.material_id){
            this.cards[i].setPosition(sender._touchMovePosition.x,sender._touchMovePosition.y);
        }
    }
}


                break;
 
            case ccui.Widget.TOUCH_ENDED:
                cc.log("Touch Ended");
                break;
 
            case ccui.Widget.TOUCH_CANCELED:
                cc.log("Touch Cancelled");
                break;

            default:
                break;
        }
    },
});