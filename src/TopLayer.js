var TopLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        //cc.sys.localStorage.clear();
        //////////////////////////////
        // 1. super init first
        this._super();

        this.baseNode = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 640, 1136);
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);

        this.labelTitle = cc.Sprite.create("res/label_title.png");
        this.labelTitle.setPosition(320,500);
        this.addChild(this.labelTitle);

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


this.storage.saveCreatureDataToStorage(CONFIG.CARD[1]);
this.storage.saveCreatureDataToStorage(CONFIG.CARD[1]);

        playBGM(this.storage);

        var startButton = new cc.MenuItemImage("res/button_start.png", "res/button_start_on.png", function () {
            //playSE_Button(this.game.storage);
            //if(this.tutorial.isVisible() == false){
            this.goToStageLayer();
            //}
        }, this);
        startButton.setPosition(320, 150);
        var menu001 = new cc.Menu(startButton);
        menu001.setPosition(0, 0);
        this.addChild(menu001,999);
        this.scheduleUpdate();
        this.initializeWalkAnimation();
        return true;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    update: function (dt) {
    },
    initializeWalkAnimation: function () {
        this.image = "res/starburst.png";
        this.itemWidth = 640;
        this.itemHeight = 480;
        this.widthCount = 2;
        this.heightCount = 5;
        this.effectInterval = 0.1;
        this.effectTime = 0;

        var frameSeq = [];
        for (var i = 0; i < this.heightCount; i++) {
            for (var j = 0; j < this.widthCount; j++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.itemWidth * j, this.itemHeight * i, this.itemWidth,
                    this.itemHeight));
                frameSeq.push(frame);
            }
        }
        this.wa = cc.Animation.create(frameSeq, this.effectInterval);
        //this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.itemWidth, this.itemHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setPosition(320,1136/2 - 50);
        this.sprite.setScale(2.5,2.5);
        this.sprite.setOpacity(255*0.3);
        this.addChild(this.sprite);
    },
    //シーンの切り替え----->
    goToStageLayer: function (pSender) {
        playSE_Button(this.storage);
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        //scene.addChild(BattleLayer2.create(this.storage));
        scene.addChild(ListLayer.create(this.storage));
        //scene.addChild(FieldLayer2.create(this.storage, "GREEN", true));
        cc.director.runScene(cc.TransitionFadeTR.create(1.5, scene));
    },

    showInfo: function (text) {
        console.log(text);
        if (this.infoLabel) {
            var lines = this.infoLabel.string.split('\n');
            var t = '';
            if (lines.length > 0) {
                t = lines[lines.length - 1] + '\n';
            }
            t += text;
            this.infoLabel.string = t;
        }
    },
    admobInit: function () {
        if ('undefined' == typeof (sdkbox)) {
            this.showInfo('sdkbox is undefined')
            return;
        }
        if ('undefined' == typeof (sdkbox.PluginAdMob)) {
            this.showInfo('sdkbox.PluginAdMob is undefined')
            return;
        }
        var self = this
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function (name) {
                self.showInfo('adViewDidReceiveAd name=' + name);
            },
            adViewDidFailToReceiveAdWithError: function (name, msg) {
                self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            },
            adViewWillPresentScreen: function (name) {
                self.showInfo('adViewWillPresentScreen name=' + name);
            },
            adViewDidDismissScreen: function (name) {
                self.showInfo('adViewDidDismissScreen name=' + name);
            },
            adViewWillDismissScreen: function (name) {
                self.showInfo('adViewWillDismissScreen=' + name);
            },
            adViewWillLeaveApplication: function (name) {
                self.showInfo('adViewWillLeaveApplication=' + name);
            }
        });
        sdkbox.PluginAdMob.init();
        // just for test
        var plugin = sdkbox.PluginAdMob
        if ("undefined" != typeof (plugin.deviceid) && plugin.deviceid.length > 0) {
            this.showInfo('deviceid=' + plugin.deviceid);
            // plugin.setTestDevices(plugin.deviceid);
        }
    },
});
TopLayer.create = function () {
    return new TopLayer();
};
var TopLayerScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new TopLayer();
        this.addChild(layer);
    }
});