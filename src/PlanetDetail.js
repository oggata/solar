var PlanetDetail = cc.Node.extend({
    ctor: function (game, width, height, color) {
        this._super();
        this.game = game;
        this.detail = cc.Sprite.create("res/ui_planets_detail.png");
        this.addChild(this.detail);
        this.planetSprite = cc.Sprite.create("res/planet_w350_001.png");
        this.planetSprite.setPosition(140, 520);
        this.planetSprite.setScale(0.7);
        this.detail.addChild(this.planetSprite);
        this.routeAllow = cc.Sprite.create("res/route_allow.png");
        this.routeAllow.setPosition(320, 310);
        this.detail.addChild(this.routeAllow);
        this.nameLabel = cc.LabelTTF.create("NAME", CONFIG.FONT, 42);
        this.nameLabel.setPosition(320, 710);
        this.nameLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.nameLabel);
        this.detailLabel = cc.LabelTTF.create("detail", "Arial", 20);
        this.detailLabel.setPosition(280, 550);
        this.detailLabel.setAnchorPoint(0, 0.5);
        this.detailLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.detailLabel);
        this.fuelLabel = cc.LabelTTF.create("100", CONFIG.FONT, 38);
        this.fuelLabel.setPosition(290, 70);
        this.fuelLabel.setAnchorPoint(1, 0.5);
        this.fuelLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.fuelLabel);
        this.timeLabel = cc.LabelTTF.create("100", CONFIG.FONT, 38);
        this.timeLabel.setPosition(580, 70);
        this.timeLabel.setAnchorPoint(1, 0.5);
        this.timeLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        this.detail.addChild(this.timeLabel);
        var buttonClose = new cc.MenuItemImage("res/button_close.png", "res/button_close.png", function () {
            this.game.infoNode.setVisible(false);
        }, this);
        buttonClose.setPosition(55, 710);
        var buttonCancel = new cc.MenuItemImage("res/button_window_event.png", "res/button_window_event.png", function () {
            this.game.infoNode.setVisible(false);
        }, this);
        buttonCancel.setPosition(170, -40);
        var buttonSearch = new cc.MenuItemImage("res/button_window_goto.png", "res/button_window_goto.png", function () {
            this.game.goToDiscoveryLayer();
        }, this);
        buttonSearch.setPosition(470, -40);
        var menu001 = new cc.Menu(buttonCancel, buttonSearch, buttonClose);
        menu001.setPosition(0, 0);
        this.detail.addChild(menu001);
    },
    init: function () {},
    update: function (scaleNum) {},
    setPlanet: function (planetId) {
        var _name = CONFIG.PLANET[planetId].name;
        var _description = CONFIG.PLANET[planetId].description;
        var _route = CONFIG.PLANET[planetId].route;
        var _image = CONFIG.PLANET[planetId].image;
        this.detail.removeChild(this.planetSprite);

        var _isOwnPlanet = this.game.storage.isOwnPlanetData(CONFIG.PLANET[planetId]);
        cc.log(_isOwnPlanet);
        if (_isOwnPlanet == false) {
            _image = "res/planet_w350_notfound.png";
        }
        this.planetSprite = cc.Sprite.create(_image);
        this.planetSprite.setPosition(140, 520);
        this.planetSprite.setScale(0.7);
        this.detail.addChild(this.planetSprite);

        this.nameLabel.setString(_name);
        this.detail.removeChild(this.routeAllow);


        //自分がこの惑星のトークンを所有していれば表示しない

        if(_isOwnPlanet == false){
            this.routeAllow = cc.Sprite.create("res/route_allow.png");
            this.routeAllow.setPosition(320, 310);
            this.detail.addChild(this.routeAllow);
            for (var i = 0; i < _route.length; i++) {
                var _routePlanetName = CONFIG.PLANET[_route[i]].name;
                var _routePlanetImage = CONFIG.PLANET[_route[i]].image;
                var _isOwnPlanet = this.game.storage.isOwnPlanetData(CONFIG.PLANET[_route[i]]);
                cc.log(_isOwnPlanet);
                this.routePlanet002Sprite = cc.Sprite.create(_routePlanetImage);
                this.routePlanet002Sprite.setPosition(70 + 170 * i, 20);
                this.routePlanet002Sprite.setScale(0.3);
                this.routeAllow.addChild(this.routePlanet002Sprite);
                if (_isOwnPlanet == false) {
                    this.routePlanet002Sprite.setOpacity(255 * 0.5);
                }
            }
        }
    },
});