var Storage = cc.Class.extend(
{
    ctor : function () 
    {
        this.creatureData = new Object();
        this.planetData = new Object();
        this.shipData = new Object();
        this.materialData = new Object();
        this.currentShipId = 1;
        this.playerName = this.getRandNumberFromRange(1,9999999999);
        this.totalGameScore = 0;
        this.totalCoinAmount = 10000;
        this.crystalAmount = 10000;
        this.maxGameScore = 0;
        this.bgmVolume = 10;
        this.seVolume = 10;
        this.targetTime = parseInt( new Date() /1000 );
        this.lastUpdatedTime = parseInt( new Date() /1000 );
    },

    createBranch:function(){
        //惑星の枝葉情報を作る
        this.connectedPlanetsData = new Array();
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
                _branchPlanets.sort(this.shuffle);
                //cc.log(_branchPlanets);
                //1つの惑星から最大何本枝が生えるかを決定する
                var _maxLineCnt = this.getRandNumberFromRange(1, 2);
                //_maxLineCnt = 1;
                for (var lineCnt = 0; lineCnt < _maxLineCnt; lineCnt++) {
                    if (_branchPlanets[lineCnt]) {
                        //接続している惑星のmasterデータを作る。master->branchとbranch->masterの両方必要。
                        this.isExistsConnectedPlanets2(this.planets[masterCnt].id, _branchPlanets[lineCnt].id,this.connectedPlanetsData);
                        this.isExistsConnectedPlanets2(_branchPlanets[lineCnt].id, this.planets[masterCnt].id,this.connectedPlanetsData);
                    }
                }

            }
        }
        return this.connectedPlanetsData;
    },

    isExistsConnectedPlanets2: function (basePlanetId, connectedPlanetId,connectedPlanetsData) {
        for (var i = 0; i < connectedPlanetsData.length; i++) {
            if (connectedPlanetsData[i].basePlanetId == basePlanetId) {
                connectedPlanetsData[i].connectedPlanetId.push(connectedPlanetId);
                return true;
            }
        }
        //なければ足す
        var _level = CONFIG.PLANET[basePlanetId].lv;
        var _data = {
            basePlanetId: basePlanetId,
            basePlanetLevel: _level,
            connectedPlanetId: [connectedPlanetId]
        };
        connectedPlanetsData.push(_data);
        return false;
    },

    setRoute: function (_startPlanetId, _finishPlanetId, connectedPlanetsData) {
        var _routeIds = [];
        var _data = {
            planetId: _finishPlanetId,
            distance: 0,
            connected: []
        };
        _routeIds.push(_data);
        for (var i = 0; i < connectedPlanetsData.length; i++) {
            if (connectedPlanetsData[i].basePlanetId == _finishPlanetId) {
                //connectedPlanetIdで分ける
                for (var h = 0; h < connectedPlanetsData[i].connectedPlanetId.length; h++) {
                    var _planetId = connectedPlanetsData[i].connectedPlanetId[h];
                    if (this.isSetPlanetId(_planetId,_routeIds) == false) {
                        var _connected = "";
                        for (var t = 0; t < connectedPlanetsData.length; t++) {
                            if (connectedPlanetsData[t].basePlanetId == _planetId) {
                                _connected = connectedPlanetsData[t].connectedPlanetId;
                            }
                        }
                        var _data = {
                            planetId: _planetId,
                            distance: 1,
                            connected: _connected
                        };
                        _routeIds.push(_data);
                    }
                }
            }
        }
        for (var j = 0; j < _routeIds.length; j++) {
            for (var k = 0; k < _routeIds[j].connected.length; k++) {
                var _planetId = _routeIds[j].connected[k];
                if (this.isSetPlanetId(_planetId,_routeIds) == false) {
                    var _connected = "";
                    for (var t = 0; t < connectedPlanetsData.length; t++) {
                        if (connectedPlanetsData[t].basePlanetId == _planetId) {
                            _connected = connectedPlanetsData[t].connectedPlanetId;
                        }
                    }
                    var _data = {
                        planetId: _planetId,
                        distance: _routeIds[j].distance + 1,
                        connected: _connected
                    };
                    _routeIds.push(_data);
                }
            }
        }
        //maxDistanceを求める
        //var _maxDistance = 0;
        for (var j = 0; j < _routeIds.length; j++) {
            if (_routeIds[j].planetId == _startPlanetId) {
                _maxDistanceData = _routeIds[j];
            }
        }
        //var _minDistance = 0;
        for (var j = 0; j < _routeIds.length; j++) {
            if (_routeIds[j].planetId == _finishPlanetId) {
                _minDistanceData = _routeIds[j];
            }
        }
        //cc.log(_maxDistance);
        //今度は startからfinishまで逆に辿って行く
        var _connected = [];
        var _distance = 999;
        var _hoge = "";
        this.setHogeData = "";
        this._hoge = [];
        //finishを入れる
        this._hoge.push(_maxDistanceData);
        for (var j = 0; j < _routeIds.length; j++) {
            if (_routeIds[j].planetId == _startPlanetId) {
                _connected = _routeIds[j].connected;
                _distance = _routeIds[j].distance;
                this.setHogeData = this.setHoge(_connected, _distance,_routeIds);
                for (var u = 0; u < 5; u++) {
                    this.setHogeData = this.setHoge(this.setHogeData.connected, this.setHogeData.distance,_routeIds);
                    if (!this.setHogeData) break;
                    if (this.setHogeData.distance <= 1) {
                        cc.log("break");
                        break;
                    }
                }
            }
        }
        this._hoge.push(_minDistanceData);
        return this._hoge;
    },
    setHoge: function (_connected, _distance, _routeIds) {
        var _hogedata = "";
        if (!_connected) return;
        for (var h = 0; h < _connected.length; h++) {
            for (var t = 0; t < _routeIds.length; t++) {
                if (_routeIds[t].planetId == _connected[h]) {
                    if (_routeIds[t].distance == _distance - 1) {
                        this._hoge.push(_routeIds[t]);
                        _hogedata = _routeIds[t];
                    }
                }
            }
        }
        return _hogedata;
    },
    isSetPlanetId: function (targetPlanetId,_routeIds) {
        for (var j = 0; j < _routeIds.length; j++) {
            if (_routeIds[j].planetId == targetPlanetId) {
                return true;
            }
        }
        return false;
    },
    //移動距離に応じてスピードを返す
    getTimeFromDist:function(dist){
        //初回は1Mkm=1Min
        return dist * 30;
    },

    getBatteryAmountFromPastSecond: function () {
        var diffSecond = this.targetTime - parseInt(new Date() / 1000);
        return diffSecond;
    },

    getFormatedTimeLabel:function(pastSecond){
        var _hour = 0;
        if(pastSecond >= 3600){
            _hour = Math.floor(pastSecond/3600);
        }
        var _min = 0;
        if(pastSecond >= 60){
            var _pastSecondMinusHour = pastSecond - ( 3600 * _hour );
            _min = Math.floor(_pastSecondMinusHour/60);
        }
        var _second = Math.floor(pastSecond - ( 3600 * _hour + 60 * _min )) ;
        //var _second = Math.ceil(_secondTime%60);
        var _txt = this.getdoubleDigestNumer(_hour) + ":" + this.getdoubleDigestNumer(_min) + ":" + this.getdoubleDigestNumer(_second);
        //cc.log(pastSecond + "/" + "aa" + Math.floor(3600 * _hour + 60 * _min) + "///" + _second);
        return _txt;
    },

    getdoubleDigestNumer:function(number) {
      return ("0" + number).slice(-2)
    },

    getConnectedPlanets:function(){
        this.connectedPlanets = new Array();
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
                _branchPlanets.sort(this.shuffle);
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
        if(this.totalCoinAmount < 0){
            this.totalCoinAmount = 0;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    useCoin:function(amount){
        this.totalCoinAmount-=amount;
        if(this.totalCoinAmount < 0){
            this.totalCoinAmount = 0;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    getCoinAmount:function(){
        return this.totalCoinAmount;
    },

    addCrystal:function(amount){
        this.crystalAmount+=amount;
        if(this.crystalAmount < 0){
            this.crystalAmount = 0;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    useCrystal:function(amount){
        this.crystalAmount-=amount;
        if(this.crystalAmount < 0){
            this.crystalAmount = 0;
        }
        var _getData = this.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage",_getData);
    },

    getCrystalAmount:function(){
        return this.crystalAmount;
    },




    getShipParamByName : function(type){
        var savedData = this.shipData;
        var _planetData = '';
        var keyCnt = Object.keys(this.shipData).length;
        for (var key in this.shipData) {
            if (this.shipData.hasOwnProperty(key)) {
                var savedDataValue = this.shipData[key];
                var inputCreatureId= "ID_" + this.currentShipId;
                if(key == inputCreatureId)
                {
                    var savedDataObj = JSON.parse(savedDataValue);
                    //cc.log(savedDataObj);
                    if(type == "dx"){
                        return savedDataObj.dx;
                    }
                    if(type == "dy"){
                        return savedDataObj.dy;
                    }
                    if(type == "targetTime"){
                        return savedDataObj.targetTime;
                    }
                    if(type == "basePlanetId"){
                        return savedDataObj.basePlanetId;
                    }
                    if(type == "destinationPlanetId"){
                        return savedDataObj.destinationPlanetId;
                    }
                    if(type == "status"){
                        return savedDataObj.status;
                    }
                    if(type == "moveToPlanetId"){
                        return savedDataObj.moveToPlanetId;
                    }
                    if(type == "moveFromPlanetId"){
                        return savedDataObj.moveFromPlanetId;
                    }
                }
            }
        }
        return null;
    },

    saveShipDataToStorage : function(dx,dy,targetTime,basePlanetId,status,destinationPlanetId,moveFromPlanetId,moveToPlanetId) 
    {
        //すでにある場合は、設定値の変更
        var _ship = CONFIG.CARD[this.currentShipId];

        var savedData = this.shipData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputCreatureId= "ID_" + this.currentShipId;
                if(savedDataKey == inputCreatureId)
                {
                    var _dx = 0;
                    var _dy = 0;
                    var _targetTime = 0;
                    var _basePlanetId = 0;
                    var _destinationPlanetId = 0;
                    var _moveToPlanetId = 0;
                    var _moveFromPlanetId = 0;
                    var _status = "AAA";
                    var _lastUpdatedTime = 0;
                    try {
                        var savedDataObj = JSON.parse(savedDataValue);
                        _dx = savedDataObj.dx;
                        _dy = savedDataObj.dy;
                        _targetTime = savedDataObj.targetTime;
                        _basePlanetId = savedDataObj.basePlanetId;
                        _destinationPlanetId = savedDataObj.destinationPlanetId;
                        _moveToPlanetId = savedDataObj.moveToPlanetId;
                        _moveFromPlanetId = savedDataObj.moveFromPlanetId;
                        _status = savedDataObj.status;
                        _lastUpdatedTime = savedDataObj.lastUpdatedTime;
                    } catch (e) {
                    }

                    if(dx != null){
                        _dx = dx;
                    }
                    if(dy != null){
                        _dy = dy;
                    }
                    if(targetTime != null){
                        _targetTime = targetTime;
                    }
                    if(basePlanetId != null){
                        _basePlanetId = basePlanetId;
                    }
                    if(destinationPlanetId != null){
                        _destinationPlanetId = destinationPlanetId;
                    }
                    if(moveToPlanetId != null){
                        _moveToPlanetId = moveToPlanetId;
                    }
                    if(moveFromPlanetId != null){
                        _moveFromPlanetId = moveFromPlanetId;
                    }
                    if(status != null){
                        _status = status;
                    }
                    //if(lastUpdatedTime != null){
                    //    _lastUpdatedTime = lastUpdatedTime;
                    //}
                    var _txt = 
                        '{"id":' + Math.floor(_ship["id"]) + 
                        ',"image":"' + _ship["image"] + '"' + 
                        ',"dx":' + _dx + 
                        ',"dy":' + _dy + 
                        ',"targetTime":' + _targetTime + 
                        ',"basePlanetId":' + _basePlanetId + 
                        ',"destinationPlanetId":' + _destinationPlanetId + 
                        ',"moveToPlanetId":' + _moveToPlanetId + 
                        ',"moveFromPlanetId":' + _moveFromPlanetId + 
                        ',"status":' + '"' + _status  + '"' +
                        ',"lastUpdatedTime":' + _lastUpdatedTime + 
                        '}'
                    ;
                    this.shipData["ID_" + _ship["id"]] = _txt;
                    _updateCnt+=1;
                }
            }
        }

        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(_ship["id"]) + 
                ',"image":"' + _ship["image"] + '"' + 
                ',"dx":' + _dx + 
                ',"dy":' + _dy + 
                ',"targetTime":' + _targetTime + 
                ',"basePlanetId":' + _basePlanetId + 
                ',"destinationPlanetId":' + _destinationPlanetId + 
                ',"moveToPlanetId":' + _moveToPlanetId + 
                ',"moveFromPlanetId":' + _moveFromPlanetId + 
                ',"status":' + '"' + _status  + '"' +
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.shipData["ID_" + _ship["id"]] = _txt;
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

    isOwnPlanetData2:function(planet){
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
                    return JSON.parse(savedDataValue);
                }
            }
        }
        return null;
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

    countOwnMaterialData:function(material_id){
        var savedData = this.materialData;
        var keyCnt = Object.keys(this.materialData).length;
        var incKeyCnt = 1;
        var _updateCnt = 0;
        for (var key in this.materialData) {
            if (this.materialData.hasOwnProperty(key)) {
                var savedDataValue = this.materialData[key];
                var inputCreatureId= "ID_" + material_id;
                if(key == inputCreatureId)
                {
                    //cc.log(JSON.parse(savedDataValue).cnt);
                    return JSON.parse(savedDataValue).cnt;
                }
            }
        }
        return 0;
    },

    getConfigItem : function(itemId){
        for (var i = 0; i <= CONFIG.ITEM.length; i++) {
            if(!CONFIG.ITEM[i]) return;
            if(CONFIG.ITEM[i].id == itemId){
                return CONFIG.ITEM[i];
            }
        }
    },

    getConfigMaterial : function(materialId){
        for (var i = 0; i <= CONFIG.MATERIAL.length; i++) {
            if(!CONFIG.MATERIAL[i]) return;
            if(CONFIG.MATERIAL[i].id == materialId){
                return CONFIG.MATERIAL[i];
            }
        }
    },

    saveMaterialDataToStorage : function(materialId,addCount) 
    {
        var material = this.getConfigMaterial(materialId);
        if(material == null) return ;
        //すでにある場合は、設定値の変更
        var savedData = this.materialData;
        var _updateCnt = 0;
        for (var savedDataKey in savedData) {
            if (savedData.hasOwnProperty(savedDataKey)) {
                var savedDataValue = savedData[savedDataKey];
                var inputCreatureId= "ID_" + material["id"];
                if(savedDataKey == inputCreatureId)
                {
                    cc.log(savedDataValue);
                    var savedDataObj = JSON.parse(savedDataValue);
                    var _txt = 
                        '{"id":' + Math.floor(material["id"]) + 
                        ',"name":"' + material["name"] + '"' + 
                        ',"cnt":' + Math.floor(savedDataObj.cnt + addCount) + 
                        ',"lastUpdatedTime":' + 0 + 
                        '}'
                    ;
                    this.materialData["ID_" + material["id"]] = _txt;
                    _updateCnt+=1;
                }
            }
        }

        if(_updateCnt == 0)
        {
            var _txt = 
                '{"id":' + Math.floor(material["id"]) + 
                ',"name":"' + material["name"] + '"' + 
                ',"cnt":' + addCount + 
                ',"lastUpdatedTime":' + 0 + 
                '}'
            ;
            this.materialData["ID_" + material["id"]] = _txt;
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

        var _materialData = '';
        var keyCnt = Object.keys(this.materialData).length;
        var incKeyCnt = 1;
        for (var key in this.materialData) {
            if (this.materialData.hasOwnProperty(key)) {
                var value = this.materialData[key];
                _materialData += '"' + key + '":' + JSON.stringify(value);
                if(incKeyCnt != keyCnt)
                {
                    _materialData += ',';
                }
                incKeyCnt++;
            }
        }

        //return '{"saveData" : true, "creatureData":{"111":{"id":1,"score":123},"222":{"id":1,"score":123},"333":{"id":1,"score":123}}}';
        var rtn = '{';
        rtn += '"saveData" : true,';
        rtn += '"creatureData":{' + _creatureData + '},';
        rtn += '"shipData":{' + _shipData + '},';
        rtn += '"planetData":{' + _planetData + '},';
        rtn += '"materialData":{' + _materialData + '},';
        rtn += '"playerName" :"' + this.playerName + '",';
        rtn += '"totalGameScore" :' + this.totalGameScore + ',';
        rtn += '"maxGameScore" :' + this.maxGameScore + ',';
        rtn += '"targetTime" :' + this.targetTime + ',';
        rtn += '"bgmVolume" :' + this.bgmVolume + ',';
        rtn += '"seVolume" :' + this.seVolume + ',';
        rtn += '"totalCoinAmount" :' + this.totalCoinAmount + ',';
        rtn += '"crystalAmount" :' + this.crystalAmount + ',';
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

        this.materialData = new Object();
        var stData = getData['materialData'];
        for (var key in stData) {
            if (stData.hasOwnProperty(key)) {
                var value = stData[key];
                this.materialData[key] = value;
            }
        }

        this.playerName       = getData["playerName"];
        this.totalGameScore   = getData["totalGameScore"];
        this.totalCoinAmount  = getData["totalCoinAmount"];
        this.crystalAmount  = getData["crystalAmount"];
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
    },

    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    shuffle2: function () {
        Math.seed = 6666;
        max = 1;
        min = 9999;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;
        return rnd - .5;
    },
    getSeededRandom: function (max, min, seed) {
        Math.seed = seed;
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;
        return min + rnd * (max - min);
    },
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