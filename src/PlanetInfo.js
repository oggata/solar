var PlanetInfo = cc.Node.extend({
    ctor: function (game, width, height, color) {
        this._super();
        this.game = game;
        var _x = this.getRandNumberFromRange(1, 10000);
        var _y = this.getRandNumberFromRange(1, 10000);
        if (this.isCloseToPlanet(_x, _y, 500) == false) {
            this.planetSprite = cc.Sprite.create("res/planet.png");
            this.planetSprite.setOpacity(0.3 * 255);
            this.baseNode.addChild(this.planetSprite);
            this.planetSprite.setPosition(_x, _y);
            this.planets.push(this.planetSprite);
            this.names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            this.names.sort(this.shuffle);
            this.names.sort(this.shuffle);
            this.names.sort(this.shuffle);
            var _planetName = this.names[0] + this.names[1] + this.names[2] + this.names[3] + this.names[4];
            this.planetName = cc.LabelTTF.create(_planetName, "Arial", 38);
            this.planetName.setPosition(351 / 2, 351 / 2);
            this.planetName.setOpacity(255 * 0.7);
            this.planetSprite.addChild(this.planetName);
            var _distance = this.getRandNumberFromRange(10000, 99999999);
            this.planetDistance = cc.LabelTTF.create(_distance + "km", "Arial", 22);
            this.planetDistance.setPosition(351 / 2, 351 / 2 - 50);
            this.planetDistance.setOpacity(255 * 0.7);
            this.planetSprite.addChild(this.planetDistance);
        }
    },
    init: function () {},
    update: function (scaleNum) {},
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    isCloseToPlanet: function (_x, _y, _dist) {
        for (var i = 0; i < this.planets.length; i++) {
            if (this.planets[i] != this.rocketSprite.basePlanet) {
                var _distance = Math.sqrt(
                    (_x - this.planets[i].getPosition().x * this.battleWindowScale) * (_x - this.planets[i].getPosition().x * this.battleWindowScale) + (_y - this.planets[i].getPosition().y * this.battleWindowScale) * (_y - this.planets[i].getPosition().y * this.battleWindowScale));
                if (_distance <= _dist) {
                    return true;
                }
            }
        }
        return false;
    },
});