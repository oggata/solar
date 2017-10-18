var PlanetSprite = cc.Node.extend({
    ctor: function (game,planetData) {
        this._super();
        this.game = game;
        //var _rand = this.getRandNumberFromRange(1, 4);
        //_rand = 1;
        cc.log(planetData);



if(planetData){
    this.planetSprite = cc.Sprite.create(planetData.image);
}else{
    this.planetSprite = cc.Sprite.create("res/planet_w350_001.png");
}
        //this.planetSprite = cc.Sprite.create(planetData.image);
        this.addChild(this.planetSprite);
        this.planetSpriteW = 120;
        this.satelliteSprite = cc.Sprite.create("res/start.png");
        this.planetSprite.addChild(this.satelliteSprite);
        this.satelliteSprite.setOpacity(255 * 0);
        this.names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        this.names.sort(this.shuffle);
        this.names.sort(this.shuffle);
        this.names.sort(this.shuffle);
        var _planetName = this.names[0] + this.names[1] + this.names[2] + this.names[3] + this.names[4];
        this.planetName = cc.LabelTTF.create(_planetName, "Arial", 38);
        this.planetName.setPosition(351 / 2, 351 / 2);
        this.planetName.setOpacity(255 * 0.7);
        //this.planetSprite.addChild(this.planetName);
        var _distance = this.getRandNumberFromRange(10000, 99999999);
        this.planetDistance = cc.LabelTTF.create(_distance + "km", "Arial", 22);
        this.planetDistance.setPosition(351 / 2, 351 / 2 - 50);
        this.planetDistance.setOpacity(255 * 0.7);
        //this.planetSprite.addChild(this.planetDistance);
        this.degree = 0;


    },
    shuffle: function () {
        return Math.random() - .5;
    },
    update: function () {
//cc.log(this.degree);
        //if(this.game.shipDistType == "SET_FREE_DIST") return true;
        if (this.game.masterShip.status == "SET_FREE_DIST") return true;
        //角度を増やします
        this.degree += 1;
        var centerX = this.planetSpriteW / 2;
        var centerY = this.planetSpriteW / 2;
        var radius = this.planetSpriteW / 2 + 140;
        //角度をラジアンに変換します
        var rad = this.degree * Math.PI / 180;
        //X座標 = 円の中心のX座標 + 半径 × Cos(ラジアン)を出す
        var x = centerX + radius * Math.cos(rad);
        //Y座標 = 円の中心の中心Y座標 + 半径 × Sin(ラジアン)を出す
        var y = centerY + radius * Math.sin(rad);
        //X,Yをもとに座標をセット
        this.satelliteSprite.setPosition(x, y);
        return true;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
});