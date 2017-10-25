var Storage = cc.Class.extend(
{
    ctor : function () 
    {
        this.creatureData = new Object();
        this.planetData = new Object();
        this.shipData = new Object();

        this.playerName = this.getRandNumberFromRange(1,9999999999);
        this.totalGameScore = 0;
        this.totalCoinAmount = 1;
        this.treasureAmount = 1000;
        this.maxGameScore = 0;
        this.bgmVolume = 10;
        this.seVolume = 10;
        this.targetTime = parseInt( new Date() /1000 );
        this.lastUpdatedTime = parseInt( new Date() /1000 );

        this.basePlanetId = 1;
        this.targetPlanetId = 0;
        this.targetMovePlanetId = 0;
        this.rescureTime = 0;
        this.targetMovePlanetId = 0;

        this.moveFromId = 0;
        this.moveToId = 0;
    },

    getConnectedPlanets:function(){
        this.connectedPlanets = new Array();

        //{id:1,difficulty:10},{id:1,difficulty:10}

        this.planets = CONFIG.PLANET;
        for (var masterCnt = 0; masterCnt < this.planets.length; masterCnt++) {
            if (this.planets[masterCnt].position) {

                //枝になる可能性のある惑星を全て_branchPlanetsに入れてシャッフルする
                var _branchPlanets = [];
                for (var branchCnt = 0; branchCnt < this.planets.length; branchCnt++) {
                    if (this.planets[branchCnt].lv == this.planets[masterCnt].lv - 1) {
                        _branchPlanets.push(this.planets[branchCnt]);
                    }
                }
                _branchPlanets.sort(this.shuffle2);

                //1つの惑星から最大何本枝が生えるかを決定する
                var _maxLineCnt = this.getRandNumberFromRange(1, 2);
                _maxLineCnt = 1;
                for (var lineCnt = 0; lineCnt < _maxLineCnt; lineCnt++) {
                    if (_branchPlanets[lineCnt]) {
                        //接続している惑星のmasterデータを作る。master->branchとbranch->masterの両方必要。
                        if(this.connectedPlanets[this.planets[masterCnt].id]){
                            this.connectedPlanets[this.planets[masterCnt].id].push(_branchPlanets[lineCnt].id);
                        }else{
                            this.connectedPlanets[this.planets[masterCnt].id] = [_branchPlanets[lineCnt].id];
                        }
                        if(this.connectedPlanets[_branchPlanets[lineCnt].id]){
                            this.connectedPlanets[_branchPlanets[lineCnt].id].push(this.planets[masterCnt].id);
                        }else{
                            this.connectedPlanets[_branchPlanets[lineCnt].id] = [this.planets[masterCnt].id];
                        }
                    }
                }
            }
        }
        return this.connectedPlanets;
    },

    getSeededRandom:function(max,min,seed){
        Math.seed = seed;
        max = max || 1;
        min = min || 0;

        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;

        return min + rnd * (max - min);
    },

    init : function () { },

    addCoin:function(amount){
        this.totalCoinAmount+=amount;
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    useCoin:function(amount){
        this.totalCoinAmount-=amount;
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    getCoinAmount:function(){
        return this.totalCoinAmount;
    },

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

    getBasePlanetId : function(ship){
        var savedData = this.shipData;
        var _planetData = '';
        var keyCnt = Object.keys(this.shipData).length;
        for (var key in this.shipData) {
            if (this.shipData.hasOwnProperty(key)) {
                var savedDataValue = this.shipData[key];
                var inputCreatureId= "ID_" + ship.id;
                if(key == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    //cc.log(savedDataObj);
                    return savedDataObj.basePlanetId;
                }
            }
        }
        return null;
    },

    getDestinationPlanetId : function(ship){
        var savedData = this.shipData;
        var _planetData = '';
        var keyCnt = Object.keys(this.shipData).length;
        for (var key in this.shipData) {
            if (this.shipData.hasOwnProperty(key)) {
                var savedDataValue = this.shipData[key];
                var inputCreatureId= "ID_" + ship.id;
                if(key == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    return savedDataObj.destinationPlanetId;
                }
            }
        }
        return null;
    },

    saveShipDataToStorage : function(card,dx,dy,targetTime,basePlanetId,destinationPlanetId,status,addCount) 
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
                        ',"basePlanetId":' + basePlanetId + 
                        ',"destinationPlanetId":' + destinationPlanetId + 
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
                ',"basePlanetId":' + basePlanetId + 
                ',"destinationPlanetId":' + destinationPlanetId + 
                ',"status":' + '"' + status  + '"' +
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.shipData["ID_" + card["id"]] = _txt;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    isOwnPlanetData:function(planet){
        var savedData = this.planetData;
        var _planetData = '';
        var keyCnt = Object.keys(this.planetData).length;
        var incKeyCnt = 1;
        var _updateCnt = 0;
        for (var key in this.planetData) {
            if (this.planetData.hasOwnProperty(key)) {
                var savedDataValue = this.planetData[key];
                var inputCreatureId= "ID_" + planet["id"];
                if(key == inputCreatureId)
                {
                    _updateCnt+=1;
                }
            }
        }
        if(_updateCnt == 0){
            return false;
        }else{
            return true;
        }
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

        rtn += '"moveToId" :' + this.moveToId + ',';
        rtn += '"moveFromId" :' + this.moveFromId + ',';

        rtn += '"basePlanetId" :' + this.basePlanetId + ',';
        rtn += '"targetPlanetId" :' + this.targetPlanetId + ',';
        rtn += '"targetMovePlanetId" :' + this.targetMovePlanetId + ',';
        rtn += '"rescureTime" :' + this.rescureTime + ',';

        rtn += '"lastUpdatedTime" :' + this.lastUpdatedTime + '';
        rtn += '}';
        



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

this.basePlanetId  = getData["basePlanetId"];
this.targetPlanetId  = getData["targetPlanetId"];
this.targetMovePlanetId  = getData["targetMovePlanetId"];
this.rescureTime  = getData["rescureTime"];


this.moveToId  = getData["moveToId"];
this.moveFromId  = getData["moveFromId"];


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