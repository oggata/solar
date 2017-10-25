var ProfileLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (storage, cardId) {
        this._super();
        //画面サイズの取得
        this.storage = storage;
        this.windowName = "PlanetsLayer";
        this.addAlpha = 0.05;
        this.storage = new Storage();
        try {
            var _data = cc.sys.localStorage.getItem("gameStorage");
            if (_data == null) {
                cc.log("dataはnullなので新たに作成します.");
                var _getData = this.storage.getDataFromStorage();
                cc.sys.localStorage.setItem("gameStorage", _getData);
                var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                this.storage.setDataToStorage(JSON.parse(_acceptData));
            }
            if (_data != null) {
                var storageData = JSON.parse(cc.sys.localStorage.getItem("gameStorage"));
                if (storageData["saveData"] == true) {
                    cc.log("保存されたデータがあります");
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    cc.log(_acceptData);
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                } else {
                    cc.log("保存されたデータはありません");
                    var _getData = this.storage.getDataFromStorage();
                    cc.sys.localStorage.setItem("gameStorage", _getData);
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
            }
        } catch (e) {
            cc.log("例外..");
            cc.sys.localStorage.clear();
        }
        this.distanceNum = 143230;
        this.viewSize = cc.director.getVisibleSize();
        var size = cc.winSize;
        //this.storage = storage;
        this.backNode = cc.Sprite.create("res/back_top2.png");
        this.backNode.setAnchorPoint(0, 0);
        this.backNode.setPosition(0, 0);
        this.addChild(this.backNode);
        this.header = cc.Sprite.create("res/header_owned_planets.png");
        this.header.setAnchorPoint(0, 0);
        this.viewSize = cc.director.getVisibleSize();
        this.header.setPosition(0, this.viewSize.height - 136);
        //this.header.setPosition(0, 1136 - 136);
        this.addChild(this.header);
        this.footer = new Footer(this);
        this.addChild(this.footer);
        


        this.masterShip = null;
        var keyCnt = Object.keys(this.storage.shipData).length;
        if (keyCnt == 0) {
            //初回のアカウント作成
            this.InfoMenu.uiWindowAccount.setVisible(true);
            this.InfoMenu.infoNode.setVisible(true);
            var _dx = 0;
            var _dy = 0;
            var _time = 0;
            var _basePlanetId = 1;
            var _destinationPlanetId = 0;
            this.storage.saveShipDataToStorage(CONFIG.CARD[1], _dx, _dy, _time, _basePlanetId, _destinationPlanetId, "NO_DIST", 1);
        }
        for (var key in this.storage.shipData) {
            if (this.storage.shipData.hasOwnProperty(key)) {
                if (key == 'ID_1') {
                    var value = this.storage.shipData[key];
                    this.masterShip = JSON.parse(value);
                }
            }
        }


        this.debugButton = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.masterShip.targetTime = parseInt(new Date() / 1000);
        }, this);
        this.debugButton.setPosition(80, 1000);
        this.debug2Button = new cc.MenuItemImage("res/button_debug.png", "res/button_debug.png", function () {
            this.storage.addCoin(10000);
        }, this);
        this.debug2Button.setPosition(80, 950);
        var menu001 = new cc.Menu(this.debugButton, this.debug2Button);
        menu001.setPosition(0, 0);
        this.addChild(menu001, 999999999999999999);
        return true;
    },    
    update: function (dt) {},

});
ProfileLayer.create = function (storage, cardId) {
    return new ProfileLayer(storage, cardId);
};
var ProfileLayerScene = cc.Scene.extend({
    onEnter: function (storage, cardId) {
        this._super();
        var layer = new ProfileLayer(storage, cardId);
        this.addChild(layer);
    }
});