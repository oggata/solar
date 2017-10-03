var Storage = cc.Class.extend(
{
    ctor : function () 
    {
        this.creatureData = new Object();

        this.planetData = new Object();

        this.shipData = new Object();
        //this.deckData = new Object();
        //this.enemyDeckData = new Object();

        //this.eventData = new Object();
        //this.enemyEventData = new Object();
        
        //this.startPositionData = [];
       // this.enemyStartPositionData = [];
        this.playerName = this.getRandNumberFromRange(1,9999999999);
        this.totalGameScore = 0;
        this.totalCoinAmount = 1;
        this.treasureAmount = 1000;
        this.maxGameScore = 0;
        this.bgmVolume = 10;
        this.seVolume = 10;
        this.targetTime = parseInt( new Date() /1000 );
        this.lastUpdatedTime = parseInt( new Date() /1000 );
        this.battleTargetUserId = 0;


/*
this.shipDx = 0;
this.shipDy = 0;
this.shipTargetSecond = 0;
this.shipTargetPlanetId = 0;
this.shipStatus = null;
*/
        /*
        this.enemyUserId = 0;
        this.enemyColorName = "";
        this.enemyTouchPosX = 0;
        this.enemyTouchPosY = 0;
        this.enemyTreasureAmount = 0;
        this.enemyTurnNum = 0;
        this.enemyUsedCardId = 0;
        this.enemyUsedCardTurn = 0;
        this.enemyUsedCardMsg = "";
        this.enemyBattleStatus = "";
        //this.webSocketHelper = new WebSocketHelper(this);
        this.users = [];
        this.userId = 0;
        */

        //this.isSteal = false;
        //this.isConnectionError = false;
    },

    init : function () { },

    addCoin:function(amount){
        this.totalCoinAmount+=amount;
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },
/*
    saveDeckDataToStorage : function(deckNum,card) 
    {
        //すでにある場合は、設定値の変更
        var _updateCnt = 0;
        for (var deckDataKey in this.deckData) {
            if (this.deckData.hasOwnProperty(deckDataKey)) {
                //var deckDataValue = savedData[deckDataKey];
                if(deckDataKey == "DECK_" + deckNum)
                {
                    //var savedDataObj = JSON.parse(deckDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(card["id"]) + 
                        ',"image":"' + card["image"] + '"' + 
                        ',"lastUpdatedTime":' + 0 + 
                        '}'
                    ;
                    this.deckData["DECK_" + deckNum] = _txt;
                    _updateCnt+=1;
                }
            }
        }
        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(card["id"]) + 
                ',"image":"' + card["image"] + '"' + 
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.deckData["DECK_" + deckNum] = _txt;
        }
        var _getData = this.getDataFromStorage();
        var _acceptData = cc.sys.localStorage.getItem("gameStorage");
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },
*/
/*
    saveEventDataToStorage : function(tickNum,card,col,row) 
    {
        //すでにある場合は、設定値の変更
        var _updateCnt = 0;
        for (var eventDataKey in this.eventData) {
            if (this.eventData.hasOwnProperty(eventDataKey)) {
                var eventDataValue = this.eventData[eventDataKey];
                if(eventDataKey == "EVENT_" + tickNum)
                {
                    //var savedDataObj = JSON.parse(eventDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(card["id"]) + 
                        ',"image":"' + card["image"] + '"' + 
                        ',"tickNum":' + tickNum + 
                        ',"col":' + col + 
                        ',"row":' + row + 
                        '}'
                    ;
                    this.eventData["EVENT_" + tickNum] = _txt;
                    _updateCnt+=1;
                }
            }
        }
        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(card["id"]) + 
                ',"image":"' + card["image"] + '"' + 
                ',"tickNum":' + tickNum + 
                ',"col":' + col + 
                ',"row":' + row + 
                '}'
            ;
            this.eventData["EVENT_" + tickNum] = _txt;
        }
        var _getData = this.getDataFromStorage();
        var _acceptData = cc.sys.localStorage.getItem("gameStorage");
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },
*/
    saveCreatureDataToStorage : function(card,addCount) 
    {
        //すでにある場合は、設定値の変更
        var savedData = this.creatureData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputCreatureId= "ID_" + card["id"];
                if(savedDataKey == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(card["id"]) + 
                        ',"image":"' + card["image"] + '"' + 
                        ',"cnt":' + Math.floor(savedDataObj.cnt + addCount) + 
                        ',"lastUpdatedTime":' + 0 + 
                        '}'
                    ;
                    this.creatureData["ID_" + card["id"]] = _txt;
                    _updateCnt+=1;
                }
            }
        }

        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(card["id"]) + 
                ',"image":"' + card["image"] + '"' + 
                ',"cnt":' + addCount + 
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.creatureData["ID_" + card["id"]] = _txt;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },


    saveShipDataToStorage : function(card,dx,dy,targetTime,targetPlanetId,status,addCount) 
    {
        //すでにある場合は、設定値の変更
        var savedData = this.shipData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputCreatureId= "ID_" + card["id"];
                if(savedDataKey == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(card["id"]) + 
                        ',"image":"' + card["image"] + '"' + 
                        //',"cnt":' + Math.floor(savedDataObj.cnt + addCount) + 
                        ',"dx":' + dx + 
                        ',"dy":' + dy + 
                        ',"targetTime":' + targetTime + 
                        ',"targetPlanetId":' + targetPlanetId + 
                        ',"status":' + '"' + status  + '"' +
                        ',"lastUpdatedTime":' + 0 + 
                        '}'
                    ;
                    this.shipData["ID_" + card["id"]] = _txt;
                    _updateCnt+=1;
                }
            }
        }

        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(card["id"]) + 
                ',"image":"' + card["image"] + '"' + 
                //',"cnt":' + Math.floor(savedDataObj.cnt + addCount) + 
                ',"dx":' + dx + 
                ',"dy":' + dy + 
                ',"targetTime":' + targetTime + 
                ',"targetPlanetId":' + targetPlanetId + 
                ',"status":' + '"' + status  + '"' +
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.shipData["ID_" + card["id"]] = _txt;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    savePlanetDataToStorage : function(card,addCount) 
    {
        //すでにある場合は、設定値の変更
        var savedData = this.planetData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputCreatureId= "ID_" + card["id"];
                if(savedDataKey == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(card["id"]) + 
                        ',"image":"' + card["image"] + '"' + 
                        ',"cnt":' + Math.floor(savedDataObj.cnt + addCount) + 
                        ',"lastUpdatedTime":' + 0 + 
                        '}'
                    ;
                    this.planetData["ID_" + card["id"]] = _txt;
                    _updateCnt+=1;
                }
            }
        }

        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(card["id"]) + 
                ',"image":"' + card["image"] + '"' + 
                ',"cnt":' + addCount + 
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.planetData["ID_" + card["id"]] = _txt;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },
    getRandNumberFromRange: function(min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },

    getPastSecond : function() {
        var diffSecond = parseInt( new Date() / 1000 ) - this.lastUpdatedTime;
        //cc.log(diffSecond);
        return diffSecond;
    },

    saveCurrentData : function()
    {
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    saveLastUpdateTime : function()
    {
        this.lastUpdatedTime = parseInt( new Date() /1000 );
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    getDataFromStorage : function ()
    {
        var _creatureData = '';
        var stData = this.creatureData;
        var keyCnt = Object.keys(stData).length;
        var incKeyCnt = 1;
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                _creatureData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _creatureData += ',';
                }
                incKeyCnt++;
            }
        }
/*
        var _deckData = '';
        var keyCnt = Object.keys(this.deckData).length;
        var incKeyCnt = 1;
        for (var key in this.deckData) {
            if (this.deckData.hasOwnProperty(key)) {
                var value = this.deckData[key];
                _deckData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _deckData += ',';
                }
                incKeyCnt++;
            }
        }

        var _eventData = '';
        var keyCnt = Object.keys(this.eventData).length;
        var incKeyCnt = 1;
        for (var key in this.eventData) {
            if (this.eventData.hasOwnProperty(key)) {
                var value = this.eventData[key];
                _eventData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _eventData += ',';
                }
                incKeyCnt++;
            }
        }
*/
        var _shipData = '';
        var keyCnt = Object.keys(this.shipData).length;
        var incKeyCnt = 1;
        for (var key in this.shipData) {
            if (this.shipData.hasOwnProperty(key)) {
                var value = this.shipData[key];
                _shipData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _shipData += ',';
                }
                incKeyCnt++;
            }
        }

        var _planetData = '';
        var keyCnt = Object.keys(this.planetData).length;
        var incKeyCnt = 1;
        for (var key in this.planetData) {
            if (this.planetData.hasOwnProperty(key)) {
                var value = this.planetData[key];
                _planetData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _planetData += ',';
                }
                incKeyCnt++;
            }
        }
        //return '{"saveData" : true, "creatureData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}';
        var rtn = '{';
        rtn += '"saveData" : true,';
        rtn += '"creatureData":{' + _creatureData + '},';
        //rtn += '"deckData":{' + _deckData + '},';
        //rtn += '"eventData":{' + _eventData + '},';
        rtn += '"shipData":{' + _shipData + '},';
        rtn += '"planetData":{' + _planetData + '},';
        rtn += '"playerName" :"' + this.playerName + '",';
        rtn += '"totalGameScore" :' + this.totalGameScore + ',';
        rtn += '"maxGameScore" :' + this.maxGameScore + ',';
        rtn += '"targetTime" :' + this.targetTime + ',';
        rtn += '"bgmVolume" :' + this.bgmVolume + ',';
        rtn += '"seVolume" :' + this.seVolume + ',';
        rtn += '"totalCoinAmount" :' + this.totalCoinAmount + ',';
        rtn += '"treasureAmount" :' + this.treasureAmount + ',';
        rtn += '"lastUpdatedTime" :' + this.lastUpdatedTime + '';
        rtn += '}';
        

/*
this.shipDx = 0;
this.shipDy = 0;
this.shipTargetSecond = 0;
this.shipTargetPlanetId = 0;
this.shipStatus = null;
*/
        /*
        cc.log("------------------------>");
        cc.log(rtn);
        cc.log('{"saveData" : true, "creatureData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}');
        cc.log("------------------------>");
        */
        return rtn;
    },

    setDataToStorage : function (getData)
    {
        this.creatureData = new Object();
        var stData = getData['creatureData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.creatureData[key] = value;
            }
        }


        this.shipData = new Object();
        var stData = getData['shipData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.shipData[key] = value;
            }
        }

        this.planetData = new Object();
        var stData = getData['planetData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.planetData[key] = value;
            }
        }

        this.playerName       = getData["playerName"];
        this.totalGameScore   = getData["totalGameScore"];
        this.totalCoinAmount  = getData["totalCoinAmount"];
        this.treasureAmount  = getData["treasureAmount"];
        this.maxGameScore     = getData["maxGameScore"];
        this.targetTime       = getData["targetTime"];
        this.bgmVolume        = getData["bgmVolume"];
        this.seVolume         = getData["seVolume"];
        this.lastUpdatedTime  = getData["lastUpdatedTime"];
    },

    initSDK : function() 
    {
        if ("undefined" == typeof(sdkbox)) {
            console.log("sdkbox is not exist")
            return
        }

        if ("undefined" != typeof(sdkbox.PluginShare)) {
            var plugin = sdkbox.PluginShare
            plugin.setListener({
              onShareState: function(response) {
                console.log("PluginShare onSharestate:" + response.state + " error:" + response.error)
                if (response.state == sdkbox.PluginShare.ShareState.ShareStateSuccess) {
                    console.log("post success")
                }
            }
            })
            plugin.init()
            //plugin.logout()
            console.log('Share plugin initialized')
        } else {
            console.log("no plugin init")
        }
    }
});

var saveData = function (storage)
{
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    this.storage = new Storage();
    if (platform == 100 || platform == 101)
    {
        var toObjString = storage.getJson();
        var toObj = JSON.parse(toObjString);
        window.localStorage.setItem("gameStorage", JSON.stringify(toObj));
    }
};

var changeLoadingImage = function ()
{
    //3:android 4:iphone 5:ipad 100:mobile_web 101:pc_web
    var platform = cc.Application.getInstance().getTargetPlatform();
    if (platform == 100 || platform == 101)
    {
        //ローディング画像を変更
        var loaderScene = new cc.LoaderScene();
        loaderScene.init();
        loaderScene._logoTexture.src = "res/loading.png";
        loaderScene._logoTexture.width = 104;
        loaderScene._logoTexture.height = 215;
        cc.LoaderScene._instance = loaderScene;
    }
};