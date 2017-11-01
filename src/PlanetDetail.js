var PlanetDetail = cc.Node.extend({
    ctor: function (game, width, height, color) {
        this._super();
        this.game = game;
        this.planetId = 0;
        this.detail = cc.Sprite.create("res/ui_planets_detail2.png");
        this.addChild(this.detail);

        this.planetSprite = cc.Sprite.create("res/planet_w350_001.png");
        this.planetSprite.setPosition(547/2, 200);
        this.planetSprite.setScale(2);
        this.detail.addChild(this.planetSprite);

        this.nameLabel = cc.LabelTTF.create("NAME", CONFIG.FONT, 38);
        this.nameLabel.setPosition(547/2, 700);
        this.nameLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.nameLabel);

        this.detailLabel = cc.LabelTTF.create("detail", "Arial", 20);
        this.detailLabel.setDimensions(450,200);
        this.detailLabel.setPosition(50, 60);
        this.detailLabel.setAnchorPoint(0, 0.5);
        this.detailLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.detailLabel);

        this.isOwnPlanet = false;
        this.buttonCancel = new cc.MenuItemImage("res/button_window_cancel.png", "res/button_window_cancel.png", function () {
            this.game.infoNode.setVisible(false);
            //ここで消す
            this.game.storage.targetMovePlanetId = 0;
            //this.game.storage.moveToId = 0;

            this.game.storage.saveCurrentData();
        }, this);
        this.buttonCancel.setPosition(150-30, -40);
        this.buttonGoto = new cc.MenuItemImage("res/button_window_goto.png", "res/button_window_goto.png", function () {
            if (this.isOwnPlanet == false) return;
            this.game.storage.targetMovePlanetId = this.planetId;
            //this.game.storage.moveToId = this.planetId;

            this.game.storage.saveCurrentData();
            this.game.goToDiscoveryLayer();
        }, this);
        this.buttonGoto.setPosition(450-30, -40);
        var menu001 = new cc.Menu(this.buttonCancel, this.buttonGoto);
        menu001.setPosition(0, 0);
        this.detail.addChild(menu001);
    },
    init: function () {},
    update: function (scaleNum) {},
    setPlanet: function (planetId) {
        this.planetId = planetId;
        var _image = CONFIG.PLANET[planetId].image;
        this.detail.removeChild(this.planetSprite);
        this.isOwnPlanet = this.game.storage.isOwnPlanetData(CONFIG.PLANET[planetId]);
        if (this.isOwnPlanet == false) {
            _image = "res/planet_w350_notfound.png";
            this.buttonGoto.setOpacity(255 * 0.3);
            _name = "???????";
            _detail = "???????";
        } else {
            this.buttonGoto.setOpacity(255 * 1);
            _name = CONFIG.PLANET[planetId].name;
            _detail = CONFIG.PLANET[planetId].description;
        }
        this.planetSprite = cc.Sprite.create(_image);
        this.planetSprite.setPosition(547/2, 420);
        this.planetSprite.setScale(1.3);
        this.detail.addChild(this.planetSprite);
        this.nameLabel.setString(_name);
        this.detailLabel.setString(_detail);
    },
});