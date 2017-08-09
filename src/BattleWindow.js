var BattleWindow = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.mode = "wait";
        this.field = cc.Sprite.create("res/monitor_battle.png");
        this.field.setAnchorPoint(0, 0);
        this.field.setPosition(0, 0);
        this.fieldScale = 1;
        this.field.setScale(this.fieldScale);
        this.addChild(this.field);
        this.markers = [];
        this.chips = [];
        this.initMap();
        this.debris_array = [];
        this.humans = [];
        this.coins = [];
        this.maxCoinCnt = 30;
        this.orderCnt = 0;
        this.gameTimeCnt = 0;
        this.gameTime = 0;
        this.maxGameTime = 60*1;
        this.enemyCnt = 7;
        this.materials= [];
        //配置可能なリストを作る
        this.positionalMarkers = [];
        for (var j = 0; j < this.markers.length; j++) {
            ////スピードはMAPCHIPTYPEによって違う (1:普通 2:山岳 3:森 4:砂 5:海 6:その他)
            if (this.markers[j].mapChipType == 1 || this.markers[j].mapChipType == 3 || this.markers[j].mapChipType == 4) {
                this.positionalMarkers.push(this.markers[j]);
            }
        }
        //コンピューターの時は配置可能リストの中から、ランダムで配置する
        //if (this.game.isCom == true) {
            for (var i = 0; i < this.enemyCnt; i++) {
                this.positionalMarkers.sort(this.shuffle);
                this.addHuman(this.positionalMarkers[0].col, this.positionalMarkers[0].row, "RED", 1, 1);
            }
        //}
        //marker
        this.selectedMarker = cc.Sprite.create("res/map-base-red.png");
        this.field.addChild(this.selectedMarker, 9999999999);
        this.selectedMarker.setPosition(100, 300);
        this.selectedMarker.col = 1;
        this.selectedMarker.row = 1;
        //this.selectedMarkerCol = 1;
        //this.selectedMarkerRow = 1;

        //player
        this.human = new Human(this, 10, 10, "GREEN", 1, 1, 99);
        this.field.addChild(this.human);
        this.humans.push(this.human);
        this.player = this.human;
        this.player.setVisible(false);
        this.human.moveType = 99;

        //ship
        this.ship = cc.Sprite.create("res/ship.png");
        this.field.addChild(this.ship,999999999999);
        this.shipPosY = 800;
        this.shipLandingCnt = 0;
        this.shipLandDirection = -30;

        this.scheduleUpdate();
    },
    getCurrentMarker: function (x, y) {
        var posX = (x - this.game.lastTouchGameLayerX);
        var posY = (y - this.game.lastTouchGameLayerY);
        var marker = this.getMarker(posX, posY);
        //this.launchedMarker.setPosition(marker.getPosition().x, marker.getPosition().y);
        return marker;
    },
    setLand:function(){
        this.shipPosY += this.shipLandDirection;
        if(this.player.getPosition().y + 100 >= this.shipPosY){
            this.shipLandDirection = 0;
            this.shipLandingCnt+=1;
        }
        if(this.shipLandingCnt >= 10){
            this.shipLandDirection = 30;
            this.player.setVisible(true);
        }
        if(this.shipPosY >= 10000){
            this.shipPosY = 10000;
            this.shipLandingCnt = 0;
        }
        this.ship.setPosition(this.player.getPosition().x,this.shipPosY);
    },

    update: function (dt) {
        //時間を計測
        this.gameTimeCnt++;
        if(this.gameTimeCnt >= 30){
            this.gameTimeCnt = 0;
            this.gameTime++;
        }

        //デブリをupdate
        for (var i = 0; i < this.debris_array.length; i++) {
            if (this.debris_array[i].update() == false) {
                this.field.removeChild(this.debris_array[i]);
                this.debris_array.splice(i, 1);
            }
        }

        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i].update() == false) {
                this.field.removeChild(this.materials[i]);
                this.materials.splice(i, 1);
            }
        }

        //定期的にマップを再描画する
        this.orderCnt++;
        if (this.orderCnt >= 10) {
            this.orderCnt = 0;
            for (var j = 0; j < this.coins.length; j++) {
                this.field.reorderChild(this.coins[j], Math.floor(99999999 - (this.coins[j].col + this.coins[j].row) + 10));
            }
            for (var j = 0; j < this.chips.length; j++) {
                this.field.reorderChild(this.chips[j], Math.floor(99999999 - (this.chips[j].col + this.chips[j].row) + 0));
            }
            for (var j = 0; j < this.markers.length; j++) {
                this.field.reorderChild(this.markers[j], Math.floor(99999999 - (this.markers[j].col + this.markers[j].row) + 0));
            }
            for (var j = 0; j < this.humans.length; j++) {
                this.field.reorderChild(this.humans[j], Math.floor(99999999 - (this.humans[j].col + this.humans[j].row) + 10));
            }
        }
        for (var j = 0; j < this.humans.length; j++) {
            this.field.reorderChild(this.humans[j], Math.floor(99999999 - (this.humans[j].col + this.humans[j].row) + 10));
        }
        if (this.coins.length <= this.maxCoinCnt) {
            this.positionalMarkers.sort(this.shuffle);
            this.addCoin(this.positionalMarkers[0].col, this.positionalMarkers[0].row);
        }
        if (this.mode == "gaming") {
            //ローバーをupdateする
            for (var j = 0; j < this.humans.length; j++) {
                if (this.humans[j].update() == false) {
                    this.field.removeChild(this.humans[j]);
                    this.humans.splice(j, 1);
                }
            }
        }
        //markerとplayerのcollision判定
        for (var m = 0; m < this.markers.length; m++) {
            if (this.player.col == this.markers[m].col && this.player.row == this.markers[m].row) {
                
                //cc.log("col:" + this.player.col + "row:" + this.player.row + "/select col:" + this.selectedMarker.col + "select row:" + this.selectedMarker.row);
                this.markers[m].spriteGreen.setVisible(true);
            }
        }
        //humanとcoinのcollision判定
        for (var h = 0; h < this.humans.length; h++) {
            for (var c = 0; c < this.coins.length; c++) {
                if (this.humans[h].col == this.coins[c].col && this.humans[h].row == this.coins[c].row) {
                    this.coins[c].hp = 0;
                    for (var i = 0; i <= 3; i++) {
                        this.addDeburis(this.coins[c].getPosition().x + 20, this.coins[c].getPosition().y + 20, 1);
                    }
                    if (this.humans[h].colorName == "GREEN") {
                        //ランダムで素材をaddする
                        var _rand = this.getRandNumberFromRange(1, 5);
                        this.game.addMaterial(_rand);
                        this.addMaterial(_rand);
                    }
                }
            }
        }
        //human同士のcollision判定
        for (var h1 = 0; h1 < this.humans.length; h1++) {
            for (var h2 = 0; h2 < this.humans.length; h2++) {
                if (this.humans[h1] != this.humans[h2]) {
                    //if(this.humans[h1] != this.player){
                    if (this.humans[h1].colorName != this.humans[h2].colorName) {
                        if (this.humans[h1].col == this.humans[h2].col && this.humans[h1].row == this.humans[h2].row) {
                            this.humans[h1].hp = 0;
                            this.humans[h2].hp = 0;
                            //for (var i = 0; i <= 5; i++) {
                            this.addDeburis(this.humans[h1].getPosition().x + 20, this.humans[h1].getPosition().y + 20, 1);
                            //}
                        }
                    }
                }
            }
        }
        //占領率の測定
        var _occupiedCnt = 0;
        for (var m = 0; m < this.markers.length; m++) {
            if (this.markers[m].spriteGreen.isVisible() == true) {
                _occupiedCnt++;
            }
        }
        this.game.captureCnt = _occupiedCnt;

        //コインをupdateする
        for (var j = 0; j < this.coins.length; j++) {
            if (this.coins[j].update() == false) {
                this.field.removeChild(this.coins[j]);
                this.coins.splice(j, 1);
            }
        }
        //時間がなくなったら試合終了
        if(this.gameTime >= this.maxGameTime){
            this.mode = "result";
        }
        //自プレイヤーが死んだから試合終了
        if (this.player.hp <= 0) {
            this.mode = "result";
        }
    },
    addMaterial: function (mcode) {
        var _material = new Material(this, 1, 0);
        _material.setPosition(this.player.getPosition().x,this.player.getPosition().y + 50);
        this.field.addChild(_material, 9999999999999);
        this.materials.push(_material);
    },

    addHuman: function (col, row, colorName, markerId, algorithmId) {
        //if (this.humans.length >= 20) return;
        var _rand = this.getRandNumberFromRange(1, 6);
        var _rand = 1;
        this.human = new Human(this, col, row, colorName, markerId, algorithmId, _rand);
        this.field.addChild(this.human);
        this.humans.push(this.human);
    },
    addCoin: function (col, row) {
        this.coin = new Coin(this, col, row);
        this.coin.col = col;
        this.coin.row = row;
        var _marker = this.getMarker2(col, row);
        this.coin.setPosition(_marker.getPosition().x, _marker.getPosition().y);
        this.field.addChild(this.coin);
        this.coins.push(this.coin);
    },
    initMap: function () {
        var _chipW = 32 * 3;
        var _chipH = 20 * 3;
////スピードはMAPCHIPTYPEによって違う (1:普通 2:山岳 3:森 4:砂 5:海 6:その他)
        var _incrementNum = 0;
        for (var row = 0; row < 40; row++) {
            for (var col = 0; col < 40; col++) {
                var _rand = CONFIG.MAP[_incrementNum];
                if (_rand == 1) {
                    this.chip = cc.Sprite.create("res/map-chip-3-001.png");
                }
                if (_rand == 2) {
                    this.chip = cc.Sprite.create("res/map-chip-3-002.png");
                }
                if (_rand == 3) {
                    this.chip = cc.Sprite.create("res/map-chip-3-003.png");
                }
                if (_rand == 4) {
                    this.chip = cc.Sprite.create("res/map-chip-3-004.png");
                }
                if (_rand == 5) {
                    this.chip = cc.Sprite.create("res/map-chip-3-005.png");
                }
                if (_rand == 6) {
                    this.chip = cc.Sprite.create("res/map-chip-3-006.png");
                }
                if (_rand == 7) {
                    this.chip = cc.Sprite.create("res/map-chip-3-001.png");
                }
                this.chip.col = col;
                this.chip.row = row;
                this.chips.push(this.chip);
                this.chip.setAnchorPoint(0.5, 0.5);
                //左端
                //-320, 300
                //右端
                //(39 + 0) * -16 + 32 * 39 + 320
                //-624 + 944
                //(0 + 39) * -16 + 32 * 0 + x = 0
                //-624 + 0 + x = 0
                //x = 624
                //(col + row) * -16 + 32 * col + 624
                //10 * (col + row) + x = 0
                //10 * (1 + 1) + x = 0
                //390 + x = 0
                //x = -390
                //314
                //20
                this.chip.setPosition(
                    (col + row) * _chipW/2 * -1 + _chipW * col + 624, 
                    _chipH/2 * (col + row) - _chipH
                );
                this.field.addChild(this.chip, 1 - (col + row));
                this.marker = new Marker(this, col, row, _rand, null, this.game.colorName);
                this.marker.setPosition(
                    (col + row) * _chipW/2 * -1 + _chipW * col + 624, 
                    _chipH/2 * (col + row) - _chipH
                );
                /*
                var _rand2 = CONFIG.HIDDEN_MAP[_incrementNum];
                if (_rand2 == 1) {
                    //this.marker.spriteBlack.setVisible(true);
                } else {
                    this.marker.spriteBlack.setVisible(false);
                }
                */
                this.field.addChild(this.marker);
                this.markers.push(this.marker);
                _incrementNum++;
            }
        }
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    addDeburis: function (x, y, typeNum) {
        this.debris = new Debris(this, typeNum);
        this.debris_array.push(this.debris);
        this.debris.setPosition(x, y);
        this.field.addChild(this.debris, 999999999999999);
    },
    isOwnTerritory2: function (colorName, posX, posY) {
        var _marker = this.getMarker(posX, posY - 200);
        if (_marker) {
            if (_marker.colorId == colorName) {
                return true;
            }
        }
        return false;
    },
    isOwnTerritory: function (colorName, col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].col == col && this.markers[i].row == row && this.markers[i].colorId == colorName) {
                return true;
            }
        }
        return false;
    },
    addPoint2: function (colorName, col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].mapChipType == 1 || this.markers[i].mapChipType == 3 || this.markers[i].mapChipType == 4) {
                if (this.markers[i].col == col && this.markers[i].row == row) {
                    this.markers[i].colorId = colorName;
                    this.markers[i].isRender = true;
                    return true;
                }
            }
        }
        return false;
    },
    getMarker: function (posX, posY) {
        var _mindist = 9999999;
        var _mindistMarker = null;
        for (var i = 0; i < this.markers.length; i++) {
            var _distance = Math.sqrt(
                (posX - this.markers[i].getPosition().x * this.game.battleWindowScale) * (posX - this.markers[i].getPosition().x *
                    this.game.battleWindowScale) + (posY - this.markers[i].getPosition().y * this.game.battleWindowScale) * (posY -
                    this.markers[i].getPosition().y * this.game.battleWindowScale));
            if (_mindist > _distance) {
                _mindist = _distance;
                _mindistMarker = this.markers[i];
            }
        }
        return _mindistMarker;
    },
    getMarker2: function (col, row) {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].col == col && this.markers[i].row == row) {
                return this.markers[i];
            }
        }
        return null;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    shuffle: function () {
        return Math.random() - .5;
    }
});