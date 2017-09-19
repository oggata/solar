var Human = cc.Node.extend({
    ctor: function (game, col, row, colorName, markerId, algorithmId, moveType) {
        this._super();
        this.game = game;
        this.hp = 100;
        this.maxHp = 100;
        this.colorName = colorName;
        this.markerId = markerId;
        this.algorithmId = algorithmId;
        if (colorName == "RED") {
            this.image = "res/enemy99.png";
            this.imgWidth = 1280 / 8;
            this.imgHeight = 1280 / 8;
            this.widthCnt = 7;
            this.setScale(1.3, 1.3);
            this.span = 0.08;
        } else {
            this.image = "res/utyu.png";
            this.imgWidth = 1280 / 8;
            this.imgHeight = 1280 / 8;
            this.widthCnt = 8;
            this.setScale(0.6, 0.6);
            this.span = 0.05;
        }
        //init
        this.direction = "front";
        this.walkingDirection = "up";
        this.tmpWalkingDirection = "up";
        this.initializeWalkAnimation();
        this._mostNearMarker = null;
        this._mostNearDistance = 99999;
        this.col = col;
        this.row = row;
        var marker = this.getMarker(col, row);
        this.setPosition(marker.getPosition().x, marker.getPosition().y);
        this.timeCnt = 0;
        //this.setScale(0.6, 0.6);
        this.tmpTargetDist = null;
        this.baseMarker = null;
        this.targetMarkers = [];
        this.targetMarker = null;
        this.route = [];
        this.reverseArr = [];
        this.distances = [];
        this.setDistance(this.col, this.row);
        this.moveType = moveType;
        if (this.moveType == 99) {
            this.setRouteType000();
        } else if (this.moveType == 1) {
            this.setRouteType033();
        } else if (this.moveType == 2) {
            this.setRouteType033();
        } else {
            this.setRouteType033();
        }
        this.walkSpeed = 2.5;
        this.maxDistance = 5;
        this.deadCnt = 0;
        this.isDead = false;
        this.flushCnt = 0;
        this.isSpriteVisible = true;
    },
    update: function () {
        if (this.game.game.gameDirection == "right_up") {
            var _marker = this.getMarker(this.col + 1, this.row);
            if (_marker) {
                this.game.selectedMarker.col = this.col + 1;
                this.game.selectedMarker.row = this.row;
                if (this.colorName == "GREEN") {
                    this.game.selectedMarker.setPosition(_marker.getPosition().x, _marker.getPosition().y);
                }
            }
        }
        if (this.game.game.gameDirection == "right_down") {
            var _marker = this.getMarker(this.col, this.row - 1);
            if (_marker) {
                this.game.selectedMarker.col = this.col;
                this.game.selectedMarker.row = this.row - 1;
                if (this.colorName == "GREEN") {
                    this.game.selectedMarker.setPosition(_marker.getPosition().x, _marker.getPosition().y);
                }
            }
        }
        if (this.game.game.gameDirection == "left_up") {
            var _marker = this.getMarker(this.col, this.row + 1);
            if (_marker) {
                this.game.selectedMarker.col = this.col;
                this.game.selectedMarker.row = this.row + 1;
                if (this.colorName == "GREEN") {
                    this.game.selectedMarker.setPosition(_marker.getPosition().x, _marker.getPosition().y);
                }
            }
        }
        if (this.game.game.gameDirection == "left_down") {
            var _marker = this.getMarker(this.col - 1, this.row);
            if (_marker) {
                this.game.selectedMarker.col = this.col - 1;
                this.game.selectedMarker.row = this.row;
                if (this.colorName == "GREEN") {
                    this.game.selectedMarker.setPosition(_marker.getPosition().x, _marker.getPosition().y);
                }
            }
        }
        if (this.hp <= 0) {
            this.flushCnt++;
            if (this.flushCnt >= 3) {
                this.flushCnt = 0;
                if (this.isSpriteVisible == true) {
                    this.isSpriteVisible = false;
                } else {
                    this.isSpriteVisible = true;
                }
                this.sprite.setVisible(this.isSpriteVisible);
            }
            this.deadCnt++;
            if (this.deadCnt >= 30 * 3) {
                this.isDead = true;
                //this.game.addDeburis(this.getPosition().x + 50, this.getPosition().y + 50, 1);
                for (var i = 0; i <= 5; i++) {
                    //this.game.addDeburis(this.getPosition().x + 70, this.getPosition().y + 70, 1);
                }
                return false;
            }
            /*
                        for (var i = 0; i <= 3; i++) {
                            this.game.addDeburis(this.getPosition().x + 50, this.getPosition().y + 50, 1);
                        }
            */
            //return false;
        }
        if (this.hp > 0) {
            if (this.game.mode != "gaming") return;
            this.timeCnt++;
            if (this.timeCnt >= 30 * 1) {
                this.timeCnt = 0;
            }
            if (this.reverseArr.length >= 1) {
                if (this.reverseArr[0]) {
                    this.targetMarker = this.getMarker(this.reverseArr[0].col, this.reverseArr[0].row);
                    //このターゲットに敵がいないことを確認する
                    if (this.targetMarker) {
                        var _cnt = this.getHumanCnt(this.targetMarker.col, this.targetMarker.row);
                        if (_cnt == 0) {
                            this.moveToTarget(this.targetMarker, this.walkSpeed, this.walkSpeed);
                        } else {
                            this.targetMarker = null;
                        }
                    }
                }
            } else {
                this.baseMarker = null;
                this.targetMarkers = [];
                this.targetMarker = null;
                this.route = [];
                this.reverseArr = [];
                this.distances = [];
                this.setDistance(this.col, this.row);
                if (this.moveType == 99) {
                    this.setRouteType000();
                } else if (this.moveType == 1) {
                    this.setRouteType033();
                } else if (this.moveType == 2) {
                    this.setRouteType033();
                } else {
                    this.setRouteType033();
                }
            }
        }
        return true;
    },
    getHumanCnt: function (targetCol, targetRow) {
        return 0;
        var cnt = 0;
        for (var h = 0; h < this.game.humans.length; h++) {
            if (this.game.humans[h].col == targetCol && this.game.humans[h].row == targetRow && this.game.humans[h].colorName ==
                "RED") {
                cnt++;
            }
        }
        return cnt;
    },
    setDistance: function (col, row) {
        this.distances = [];
        this.distances.push({
            col: col,
            row: row,
            dist: 0,
            colorName: 'WHITE'
        });
        for (var i = 0; i <= this.maxDistance; i++) {
            this.setTestMarker(i);
        }
    },
    setTestMarker: function (_distNum) {
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].dist == _distNum - 1) {
                var _targetMaker = this.distances[i];
                var _marker001 = {
                    col: _targetMaker.col + 1,
                    row: _targetMaker.row + 0
                };
                var _marker002 = {
                    col: _targetMaker.col - 1,
                    row: _targetMaker.row + 0
                };
                var _marker003 = {
                    col: _targetMaker.col + 0,
                    row: _targetMaker.row + 1
                };
                var _marker004 = {
                    col: _targetMaker.col + 0,
                    row: _targetMaker.row - 1
                };
                var _next001Marker = this.getMarker3(_marker001.col, _marker001.row);
                if (_next001Marker) {
                    this.distances.push({
                        col: _marker001.col,
                        row: _marker001.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next002Marker = this.getMarker3(_marker002.col, _marker002.row);
                if (_next002Marker) {
                    this.distances.push({
                        col: _marker002.col,
                        row: _marker002.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next003Marker = this.getMarker3(_marker003.col, _marker003.row);
                if (_next003Marker) {
                    this.distances.push({
                        col: _marker003.col,
                        row: _marker003.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
                var _next004Marker = this.getMarker3(_marker004.col, _marker004.row);
                if (_next004Marker) {
                    this.distances.push({
                        col: _marker004.col,
                        row: _marker004.row,
                        dist: _distNum,
                        colorName: 'WHITE'
                    });
                }
            }
        }
    },
    //プレイヤー用。ターゲットされたマーカーを追いかける
    setRouteType000: function () {
        this.maxDistance = 2;
        this.walkSpeed = 2.1 * 2;
        //自分が配置されたマーカーから、特定距離(5)のマーカーを全部取得する
        //this.targetDistance = this.getRandNumberFromRange(1, 5);
        for (var i = 0; i < this.distances.length; i++) {
            if (this.game.selectedMarker.col == null && this.game.selectedMarker.col == null) return;
            if (this.distances[i].col == this.game.selectedMarker.col && this.distances[i].row == this.game.selectedMarker.row) {
                this.targetMarkers.push(this.distances[i]);
            }
        }
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
            this.targetDistance = this.targetMarker.dist;
        } else {
            this.targetMarker = null;
        }
        this.setRoute();
    },
    setRouteType033: function () {
        this.maxDistance = 6;
        //this.maxDistance = 2;
        //this.walkSpeed = 1.2 * 2;
        this.walkSpeed = this.game.enemySpeed;
        //敵のenemyの存在するマーカーを全部取得する
        if (this.colorName == "GREEN") {
            this.enemyColorName = "RED";
        } else {
            this.enemyColorName = "GREEN";
        }
        this.hasPlayer = false;
        for (var c = 0; c < this.game.humans.length; c++) {
            for (var i = 0; i < this.distances.length; i++) {
                if (this.game.humans[c].colorName == this.enemyColorName && this.distances[i].col == this.game.humans[c].col &&
                    this.distances[i].row == this.game.humans[c].row) {
                    var _marker = this.getMarker(this.distances[i].col, this.distances[i].row);
                    this.targetMarkers.push(this.distances[i]);
                    this.hasPlayer = true;
                }
            }
        }
        //マーカーからの距離でsortする
        this.targetMarkers.sort(function (a, b) {
            if (a.dist < b.dist) return -1;
            if (a.dist > b.dist) return 1;
            return 0;
        });
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
            this.targetDistance = this.targetMarker.dist;
        } else {
            this.targetMarker = null;
        }
        if (this.hasPlayer == true && this.targetDistance <= 5) {
            this.setRoute();
        } else {
            this.targetMarkers = [];
            //自分が配置されたマーカーから、特定距離(5)のマーカーを全部取得する
            this.targetDistance = this.getRandNumberFromRange(1, 4);
            for (var i = 0; i < this.distances.length; i++) {
                if (this.distances[i].dist == this.targetDistance) {
                    var _marker = this.getMarker(this.distances[i].col, this.distances[i].row);
                    this.targetMarkers.push(this.distances[i]);
                }
            }
            //選択されたマーカー一覧から一つを選ぶ
            if (this.targetMarkers.length > 0) {
                this.targetMarker = this.targetMarkers[this.getRandNumberFromRange(0, this.targetMarkers.length - 1)];
            } else {
                this.targetMarker = null;
            }
            this.setRoute();
        }
    },
    //(ドローワーtype)自陣を塗っていく
    setRouteType001: function () {
        this.walkSpeed = 2.5 * 3;
        //自分が配置されたマーカーから、特定距離(5)のマーカーを全部取得する
        this.targetDistance = this.getRandNumberFromRange(1, 4);
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].dist == this.targetDistance) {
                var _marker = this.getMarker(this.distances[i].col, this.distances[i].row);
                this.targetMarkers.push(this.distances[i]);
            }
        }
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[this.getRandNumberFromRange(0, this.targetMarkers.length - 1)];
        } else {
            this.targetMarker = null;
        }
        this.setRoute();
    },
    //(コイナーtype)コインを取得する
    setRouteType002: function () {
        this.walkSpeed = 2.5 * 3;
        //coinの存在するマーカーを全部取得する
        for (var c = 0; c < this.game.coins.length; c++) {
            for (var i = 0; i < this.distances.length; i++) {
                if (this.distances[i].col == this.game.coins[c].col && this.distances[i].row == this.game.coins[c].row) {
                    var _marker = this.getMarker(this.distances[i].col, this.distances[i].row);
                    this.targetMarkers.push(this.distances[i]);
                }
            }
        }
        //マーカーからの距離でsortする
        this.targetMarkers.sort(function (a, b) {
            if (a.dist < b.dist) return -1;
            if (a.dist > b.dist) return 1;
            return 0;
        });
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
            this.targetDistance = this.targetMarker.dist;
        } else {
            this.targetMarker = null;
        }
        this.setRoute();
    },
    //(アタッカーtype)敵に攻撃を仕掛ける
    setRouteType003: function () {
        this.walkSpeed = 2 * 3;
        //敵のenemyの存在するマーカーを全部取得する
        if (this.colorName == "GREEN") {
            this.enemyColorName = "RED";
        } else {
            this.enemyColorName = "GREEN";
        }
        for (var c = 0; c < this.game.humans.length; c++) {
            for (var i = 0; i < this.distances.length; i++) {
                if (this.game.humans[c].colorName == this.enemyColorName && this.distances[i].col == this.game.humans[c].col &&
                    this.distances[i].row == this.game.humans[c].row) {
                    var _marker = this.getMarker(this.distances[i].col, this.distances[i].row);
                    this.targetMarkers.push(this.distances[i]);
                }
            }
        }
        //マーカーからの距離でsortする
        this.targetMarkers.sort(function (a, b) {
            if (a.dist < b.dist) return -1;
            if (a.dist > b.dist) return 1;
            return 0;
        });
        //選択されたマーカー一覧から一つを選ぶ
        if (this.targetMarkers.length > 0) {
            this.targetMarker = this.targetMarkers[0];
            this.targetDistance = this.targetMarker.dist;
        } else {
            this.targetMarker = null;
        }
        this.setRoute();
    },
    setRoute: function () {
        this.route = [];
        if (this.targetMarker != null) {
            this.route.push(this.targetMarker);
            //仮に5だとしたら、4回繰り返して、元をたどる
            this.nextMarker = this.targetMarker;
            //cc.log("next");
            for (var dist = 1; dist < this.targetDistance; dist++) {
                if (this.nextMarker) {
                    this.nextMarker = this.findDistance(this.nextMarker.col, this.nextMarker.row, this.targetDistance - dist);
                    if (this.nextMarker) {
                        this.route.push(this.nextMarker);
                    }
                }
            }
        }
        var count = 0;
        this.reverseArr = [];
        for (var i = this.route.length - 1; i >= 0; i--) {
            this.reverseArr[count] = this.route[i];
            count++;
        };
    },
    getMarker3: function (col, row) {
        /*既に含まれている場合は省く*/
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].col == col && this.distances[i].row == row) {
                return;
            }
        }
        for (var j = 0; j < this.game.chips.length; j++) {
            if (this.game.chips[j].col == col && this.game.chips[j].row == row && this.game.chips[j].colorId == "WHITE") {
                if (this.game.chips[j].baseMapType == 1) {
                    return this.game.chips[j];
                }
            }
        }
        for (var j = 0; j < this.game.chips.length; j++) {
            if (this.game.chips[j].col == col && this.game.chips[j].row == row) {
                if (this.game.chips[j].baseMapType == 1) {
                    return this.game.chips[j];
                }
            }
        }
        /*
        for (var j = 0; j < this.game.markers.length; j++) {
            if (this.game.markers[j].col == col && this.game.markers[j].row == row && this.game.markers[j].colorId == "WHITE") {
                if (this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType ==
                    4) {
                    return this.game.markers[j];
                }
            }
        }*/
        /*
        if (this.enemyColorName != null) {
            for (var j = 0; j < this.game.markers.length; j++) {
                if (this.game.markers[j].col == col && this.game.markers[j].row == row && this.game.markers[j].colorId == this.enemyColorName) {
                    if (this.game.markers[j].baseMapType == 1 || this.game.markers[j].baseMapType == 3 || this.game.markers[j].baseMapType ==
                        4) {
                        return this.game.markers[j];
                    }
                }
            }
        }
        */
        return null;
    },
    getRandNumberFromRange: function (min, max) {
        var rand = min + Math.floor(Math.random() * (max - min));
        return rand;
    },
    getMarker: function (col, row) {
        for (var j = 0; j < this.game.chips.length; j++) {
            if (this.game.chips[j].col == col && this.game.chips[j].row == row) {
                return this.game.chips[j];
            }
        }
        return null;
    },
    init: function () {},
    findDistance: function (col, row, dist) {
        for (var i = 0; i < this.distances.length; i++) {
            if (this.distances[i].col == col + 1 && this.distances[i].row == row && this.distances[i].dist == dist) {
                return this.distances[i];
            }
            if (this.distances[i].col == col - 1 && this.distances[i].row == row && this.distances[i].dist == dist) {
                return this.distances[i];
            }
            if (this.distances[i].col == col && this.distances[i].row == row + 1 && this.distances[i].dist == dist) {
                return this.distances[i];
            }
            if (this.distances[i].col == col && this.distances[i].row == row - 1 && this.distances[i].dist == dist) {
                return this.distances[i];
            }
        }
        return null;
    },
    object_array_sort: function (data, key, order, fn) {
        //デフォは降順(DESC)
        var num_a = -1;
        var num_b = 1;
        if (order === 'asc') { //指定があれば昇順(ASC)
            num_a = 1;
            num_b = -1;
        }
        data = data.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            if (x > y) return num_a;
            if (x < y) return num_b;
            return 0;
        });
        fn(data); // ソート後の配列を返す
    },
    shuffle: function () {
        return Math.random() - .5;
    },
    remove: function () {
        this.removeChild(this.sprite);
    },
    getDirection: function () {
        return this.direction;
    },
    initializeWalkAnimation: function () {
        var frameSeq = [];
        for (var i = 0; i < this.widthCnt; i++) {
            var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, this.span);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(this.imgWidth / 4, this.imgHeight * 2 / 5);
        this.addChild(this.sprite);
    },
    moveToTarget: function (object, speed, targetDist) {
        var diffX = Math.floor(object.getPosition().x - this.getPosition().x);
        var diffY = Math.floor(object.getPosition().y - this.getPosition().y);
        if (diffX > 0 && diffY > 0) {
            this.walkRightUp();
        }
        if (diffX > 0 && diffY < 0) {
            this.walkRightDown();
        }
        if (diffX < 0 && diffY > 0) {
            this.walkLeftUp();
        }
        if (diffX < 0 && diffY < 0) {
            this.walkLeftDown();
        }
        var dX = object.getPosition().x - this.getPosition().x;
        var dY = object.getPosition().y - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if (dist > targetDist) {
            var rad = Math.atan2(dX, dY);
            var speedX = speed * Math.sin(rad);
            var speedY = speed * Math.cos(rad);
            this.setPosition(this.getPosition().x + speedX, this.getPosition().y + speedY);
        } else {
            this.setPosition(object.getPosition().x, object.getPosition().y);
            if (this.colorName == "GREEN") {
                if (object.colorId == "WHITE") {
                    object.colorId = this.colorName;
                    //object.isRender = true;
                    //object.spriteBlack.setVisible(false);
                }
            }
            this.col = object.col;
            this.row = object.row;
            this.targetMarker = null;
            this.reverseArr.splice(0, 1);
        }
    },
    moveToRight: function (speed, target) {
        var _ySPeed = 0;
        if (target) {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 20) {
                _ySPeed = speed;
            }
            if (dY <= -20) {
                _ySPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + speed, this.getPosition().y + _ySPeed);
        this.walkRight();
    },
    moveToLeft: function (speed, target) {
        var _ySPeed = 0;
        if (target) {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 2) {
                _ySPeed = speed;
            }
            if (dY <= -2) {
                _ySPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x - speed, this.getPosition().y + _ySPeed);
        this.walkLeft();
    },
    moveToUp: function (speed, target) {
        var _xSPeed = 0;
        if (target) {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 2) {
                _xSPeed = speed;
            }
            if (dX <= -2) {
                _xSPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + _xSPeed, this.getPosition().y + speed);
        this.walkBack();
    },
    moveToDown: function (speed, target) {
        var _xSPeed = 0;
        if (target) {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 2) {
                _xSPeed = speed;
            }
            if (dX <= -2) {
                _xSPeed = speed * -1;
            }
        }
        this.setPosition(this.getPosition().x + _xSPeed, this.getPosition().y - speed);
        this.walkLeftDown();
    },
    walkLeftDown: function () {
        if (this.direction != "front") {
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < this.widthCnt; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 1, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, this.span);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkRightDown: function () {
        if (this.direction != "left") {
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < this.widthCnt; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, this.span);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkLeftUp: function () {
        if (this.direction != "right") {
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < this.widthCnt; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 2, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, this.span);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkRightUp: function () {
        if (this.direction != "back") {
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < this.widthCnt; i++) {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 3, this.imgWidth, this
                    .imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, this.span);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});