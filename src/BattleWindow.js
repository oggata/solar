var BattleWindow = cc.Node.extend({
    ctor: function (game) {
        this._super();
        this.game = game;
        this.mode = "wait";
        //フィールドを追加する
        this.field = cc.Node.create();
        this.field.setAnchorPoint(0, 0);
        this.field.setPosition(0, 0);
        this.fieldScale = 1;
        this.field.setScale(this.fieldScale);
        this.addChild(this.field);
        //配列を用意する
        this.chips = [];
        this.initMap();
        this.debris_array = [];
        this.humans = [];
        this.coins = [];
        this.escapes = [];
        //最大値を設定する
        this.maxCoinCnt = 3;
        this.orderCnt = 0;
        this.orderMaxCnt = 1;
        this.gameLevel = 1;
        this.gameNextLevelScore = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
        this.gameScore = 0;
        this.gameOccupyRate = 0;
        this.gameTimeCnt = 0;
        this.gameTime = 0;
        this.maxEnemyCnt = 0;
        this.escapeCnt = 0;
        //this.enemies = [];
        this.enemySpeed = 1;
        this.materials = [];
        this.result = null;
        //配置可能なリストを作る
        this.positionalChips = [];
        for (var j = 0; j < this.chips.length; j++) {
            ////スピードはMAPCHIPTYPEによって違う (1:普通 2:山 3:海)
            if (this.chips[j].baseMapType == 1) {
                this.positionalChips.push(this.chips[j]);
            }
        }
        //コンピューターの時は配置可能リストの中から、ランダムで配置する
        for (var i = 0; i < this.maxEnemyCnt; i++) {
            this.positionalChips.sort(this.shuffle);
            this.addHuman(this.positionalChips[0].col, this.positionalChips[0].row, "RED");
        }
        //marker
        this.selectedMarker = cc.Sprite.create("res/map-base-red.png");
        this.field.addChild(this.selectedMarker, 9999999999);
        this.selectedMarker.setPosition(100, 300);
        this.selectedMarker.col = null;
        this.selectedMarker.row = null;
        //player
        this.positionalChips.sort(this.shuffle);
        this.human = new Human(this, this.positionalChips[0].col, this.positionalChips[0].row, "GREEN", 99);
        this.field.addChild(this.human);
        this.humans.push(this.human);
        this.player = this.human;
        this.player.setVisible(false);
        //ship
        this.ship = cc.Sprite.create("res/ship.png");
        this.field.addChild(this.ship, 999999999999);
        this.shipPosY = 800;
        this.shipLandingCnt = 0;
        this.shipLandDirection = -10;
        this.scheduleUpdate();
        //materialを足す
        for (var i = 0; i < this.maxCoinCnt; i++) {
            this.positionalChips.sort(this.shuffle);
            this.addCoin(this.positionalChips[0].col, this.positionalChips[0].row);
        }
        //escape
        for (var i = 0; i < this.escapeCnt; i++) {
            this.positionalChips.sort(this.shuffle);
            this.positionalChips.sort(this.shuffle);
            this.addEscape(this.positionalChips[0].col, this.positionalChips[0].row);
        }




    },
    update: function (dt) {
        //時間を計測
        this.gameTimeCnt++;
        if (this.gameTimeCnt >= 30) {
            this.gameTimeCnt = 0;
            this.gameTime++;
        }
        if (this.humans.length < this.maxEnemyCnt) {
            this.positionalChips.sort(this.shuffle);
            this.addHuman(this.positionalChips[0].col, this.positionalChips[0].row, "RED");
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
        if (this.orderCnt >= this.orderMaxCnt) {
            this.orderCnt = 0;
            for (var j = 0; j < this.coins.length; j++) {
                this.field.reorderChild(this.coins[j], Math.floor(99999999 - (this.coins[j].col + this.coins[j].row) + 1));
            }
            for (var j = 0; j < this.chips.length; j++) {
                var _ajust = 0;
                if (this.chips[j].baseMapType == 2) {
                    //_ajust = 1;
                }
                this.field.reorderChild(this.chips[j], Math.floor(99999999 - (this.chips[j].col + this.chips[j].row) + _ajust));
            }
            for (var j = 0; j < this.escapes.length; j++) {
                var _ajust = 0;
                this.field.reorderChild(this.escapes[j], Math.floor(99999999 - (this.escapes[j].col + this.escapes[j].row) + _ajust));
            }
        }
        //ローバーをupdateする
        for (var j = 0; j < this.humans.length; j++) {
            if (this.humans[j].update() == false) {
                if (this.humans[j].colorName == "GREEN") {
                    this.addDestroy(this.humans[j].getPosition().x, this.humans[j].getPosition().y + 80);
                }
                this.field.removeChild(this.humans[j]);
                this.humans.splice(j, 1);
                //}
            } else {
                this.field.reorderChild(this.humans[j], Math.floor(99999999 - (this.humans[j].col + this.humans[j].row) + 1));
            }
        }
        if (this.mode == "gaming") {
            this.orderMaxCnt = 30;
            this.shipPosY = this.player.getPosition().y + 800;
        }
        if (this.coins.length == 0) {
            this.mode = "result";
            this.result = "success";
        }
        //humanとcoinのcollision判定
        for (var h = 0; h < this.humans.length; h++) {
            for (var c = 0; c < this.coins.length; c++) {
                if (this.humans[h].col == this.coins[c].col && this.humans[h].row == this.coins[c].row) {
                    this.coins[c].hp = 0;
                    if (this.humans[h].colorName == "GREEN") {
this.game.storage.addCoin(10);
this.game.getItemMarker.setCoin(10);
                        if (this.coins[c].typeNum) {
                            var _typeNum = this.coins[c].typeNum;
                            this.game.addMaterial(_typeNum);
                            this.addMaterial(_typeNum);
                        }
                    }
                }
            }
        }
        //human同士のcollision判定
        for (var h1 = 0; h1 < this.humans.length; h1++) {
            for (var h2 = 0; h2 < this.humans.length; h2++) {
                if (this.humans[h1] != this.humans[h2]) {
                    if (this.humans[h1].colorName != this.humans[h2].colorName) {
                        if (this.humans[h1].col == this.humans[h2].col && this.humans[h1].row == this.humans[h2].row) {
                            this.humans[h1].hp = 0;
                            this.humans[h2].hp = 0;
                        }
                    }
                }
            }
        }
        //コインをupdateする
        for (var j = 0; j < this.coins.length; j++) {
            if (this.coins[j].update() == false) {
                this.field.removeChild(this.coins[j]);
                this.coins.splice(j, 1);
            }
        }
        //自プレイヤーが死んだから試合終了
        if (this.player.hp <= 0) {
            this.mode = "result";
            this.result = "failed";
        }
    },
    getCurrentLevel: function () {
        var _level = 0;
        var _sumScore = 0;
        var _rate = 0;
        for (var i = 0; i < this.gameNextLevelScore.length; i++) {
            _sumScore += this.gameNextLevelScore[i];
            if (this.gameScore >= _sumScore) {
                _level += 1;
            } else {
                _level += 1;
                _rate = (_sumScore - this.gameScore) / this.gameNextLevelScore[i];
                break;
            }
        }
        if (this.gameLevel != _level) {
            //this.game.labelStartCnt007.setVisible(true);
        }
        this.gameLevel = _level;
        this.gameOccupyRate = (1 - _rate);
        return null;
    },
    getCurrentMarker: function (x, y) {
        var posX = (x - this.game.lastTouchGameLayerX);
        var posY = (y - this.game.lastTouchGameLayerY);
        var marker = this.getMarker(posX, posY);
        return marker;
    },
    //status : send get
    setShipLand: function (status) {
        this.ship.setVisible(true);
        this.shipPosY += this.shipLandDirection;
        if (this.player.getPosition().y + 50 >= this.shipPosY) {
            this.shipLandDirection = 0;
            this.shipLandingCnt += 1;
        }
        if (this.shipLandingCnt >= 20) {
            this.shipLandDirection = 30;
            if (status == "send") {
                this.player.setVisible(true);
            } else if (status == "get") {
                this.player.setVisible(false);
            }
        }
        this.ship.setPosition(this.player.getPosition().x, this.shipPosY);
    },
    setShipHidden: function () {
        this.shipLandingCnt = 0;
        this.shipLandDirection = -10;
        this.ship.setVisible(false);
        this.shipPosY = this.player.getPosition().y + 800;
    },
    setDifficulty: function () {
        this.maxEnemyCnt = this.gameLevel + 2;
        this.enemySpeed = 1.2 * 2 + this.gameLevel * 0.1;
    },
    addDestroy: function (x, y) {
        this.destroyEffect = new Destroy2Effect(this);
        this.field.addChild(this.destroyEffect, 99999999);
        this.destroyEffect.setPosition(x, y);
    },
    addMaterial: function (mcode) {
        var _material = new Material(this, mcode, 0, false);
        _material.setPosition(this.player.getPosition().x, this.player.getPosition().y + 50);
        this.field.addChild(_material, 9999999999999);
        this.materials.push(_material);
    },
    addEscape: function (col, row) {
        var _escape = cc.Sprite.create("res/escape.png");
        var _marker = this.getMarker2(col, row);
        _escape.col = col;
        _escape.row = row;
        _escape.setPosition(_marker.getPosition().x, _marker.getPosition().y);
        this.field.addChild(_escape, 9999999999999);
        this.escapes.push(_escape);
    },
    addHuman: function (col, row, colorName) {
        //var _rand = this.getRandNumberFromRange(1, 6);
        var _rand = 1;
        this.human = new Human(this, col, row, colorName, _rand);
        this.field.addChild(this.human);
        this.humans.push(this.human);
    },
    addCoin: function (col, row) {
        //この場所にすでにcoinが入っていないかcheckする
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
        var _incrementNum = 0;
        var _dirPath = "004";
        for (var row = 0; row < 12; row++) {
            for (var col = 0; col < 12; col++) {
                //// (1:普通 2:山岳 3:海 4:null)
                var _mapChipType = CONFIG.MAP12_2[_incrementNum];
                this.chip = cc.Sprite.create("res/planets/" + _dirPath + "/map-chip-a.png");
                if (_mapChipType == 2) {
                    this.chip = cc.Sprite.create("res/planets/" + _dirPath + "/map-chip-a.png");
                }
                if (_mapChipType == 3) {
                    this.chip = cc.Sprite.create("res/planets/" + _dirPath + "/map-chip-d.png");
                }
                if (_mapChipType == 4) {
                    this.chip = cc.Sprite.create("res/planets/" + _dirPath + "/map-chip-z.png");
                }
                this.chip.col = col;
                this.chip.row = row;
                //this.chip.setOpacity(0.8 * 255);
                this.chips.push(this.chip);
                this.chip.setAnchorPoint(0.5, 0.5);
                //this.chip.colorId = "WHITE";
                this.chip.baseMapType = _mapChipType;
                this.chip.setPosition(
                    (col + row) * _chipW / 2 * -1 + _chipW * col + 624, _chipH / 2 * (col + row) - _chipH);
                this.field.addChild(this.chip, 1 - (col + row));
                _incrementNum++;
                if (this.chip.baseMapType == 2) {
                    var _rand3 = this.getRandNumberFromRange(1, 5);
                    if (_rand3 == 1) {
                        this.tree = cc.Sprite.create("res/planets/" + _dirPath + "/map-obj-a.png");
                    } else if (_rand3 == 2) {
                        this.tree = cc.Sprite.create("res/planets/" + _dirPath + "/map-obj-b.png");
                    } else if (_rand3 == 3) {
                        this.tree = cc.Sprite.create("res/planets/" + _dirPath + "/map-obj-b.png");
                    } else {
                        this.tree = cc.Sprite.create("res/planets/" + _dirPath + "/map-obj-a.png");
                    }
                    this.tree.setAnchorPoint(0, 0);
                    this.chip.addChild(this.tree);
                }
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
        /*
        var _marker = this.getMarker(posX, posY - 200);
        if (_marker) {
            if (_marker.colorId == colorName) {
                return true;
            }
        }
        return false;
        */
    },
    isOwnTerritory: function (colorName, col, row) {
        for (var i = 0; i < this.chips.length; i++) {
            if (this.chips[i].col == col && this.chips[i].row == row && this.chips[i].colorId == colorName) {
                return true;
            }
        }
        return false;
    },
    addPoint2: function (colorName, col, row) {
        for (var i = 0; i < this.chips.length; i++) {
            if (this.chips[i].baseMapType == 1) {
                if (this.chips[i].col == col && this.chips[i].row == row) {
                    this.chips[i].colorId = colorName;
                    //this.chips[i].isRender = true;
                    return true;
                }
            }
        }
        return false;
    },
    getMarker: function (posX, posY) {
        var _mindist = 9999999;
        var _mindistMarker = null;
        for (var i = 0; i < this.chips.length; i++) {
            var _distance = Math.sqrt(
                (posX - this.chips[i].getPosition().x * this.game.battleWindowScale) * (posX - this.chips[i].getPosition().x * this.game.battleWindowScale) + (posY - this.chips[i].getPosition().y * this.game.battleWindowScale) * (posY - this.chips[i].getPosition().y * this.game.battleWindowScale));
            if (_mindist > _distance) {
                _mindist = _distance;
                _mindistMarker = this.chips[i];
            }
        }
        return _mindistMarker;
    },
    getMarker2: function (col, row) {
        for (var i = 0; i < this.chips.length; i++) {
            if (this.chips[i].col == col && this.chips[i].row == row) {
                return this.chips[i];
            }
        }
        return null;
    },
    shuffle: function () {
        return Math.random() - .5;
    }
});