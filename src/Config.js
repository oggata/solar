var CONFIG = CONFIG || {};

CONFIG.FONT = "PingFangHK-Light";
CONFIG.DEBUG_FLAG       = 0;
CONFIG.DEBUG_STAGE_NUM  = 4;
CONFIG.BGM_VOLUME       = 1;
CONFIG.SE_VOLUME        = 1;
CONFIG.CARD_SPEND_COST  = 3;


CONFIG.BASE_CARD_Y = 820;
//1:平地 2:山 3:平地 4: 5:海 6:

CONFIG.MAP = [
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,1,1,1,2,1,1,1,2,2,2,
    2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,
    2,2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,
    2,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,
    2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,
    2,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,
    2,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,
    2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,
    2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,2,2,
    2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,1,1,1,2,2,1,1,1,1,2,2,2,2,
    2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,
    2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,1,2,2,
    2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,2,2,1,2,1,1,1,1,1,1,2,
    2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,2,1,2,2,2,2,1,1,1,2,
    2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,2,
    2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3,3,3,3,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,2,
    2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,3,3,3,3,3,1,1,1,1,1,1,1,1,2,2,2,1,1,2,2,
    2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,2,2,2,1,2,2,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,2,2,2,1,2,2,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,2,2,2,1,1,2,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,2,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,2,
    2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,2,
    2,2,2,2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,2,
    2,2,2,2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,2,2,2,2,1,1,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,2,2,2,1,1,1,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,
    2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,
    2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
];


CONFIG.RAND_ARRAY = [1,4,6,8,3,5,4,7,2,3,1,6,7,8,5,4,1,2,6,3,2,8,2,3,6,7,8,5,6,8,3,4,1,7,6,5,1,5,8,9,4,7,2,8,3,5,3,4,5,7,2,1,1,5,1,6,4,3];

CONFIG.BATTLE_LIST_POSITION = [{},
    { 
        "x"         : 140 + 180*0,
        "y"         : 750
    },
    { 
        "x"         : 140 + 180*1,
        "y"         : 750
    },
    { 
        "x"         : 140 + 180*2,
        "y"         : 750
    },

    { 
        "x"         : 140 + 180*0,
        "y"         : 450
    },
    { 
        "x"         : 140 + 180*1,
        "y"         : 450
    },
    { 
        "x"         : 140 + 180*2,
        "y"         : 450
    },
];

CONFIG.LIST_POSITION = [{},
    { 
        "x"         : 140 + 180*0,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 0
    },
    { 
        "x"         : 140 + 180*1,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 0
    },
    { 
        "x"         : 140 + 180*2,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 0
    },
    { 
        "x"         : 140 + 180*0,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 1
    },
    { 
        "x"         : 140 + 180*1,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 1
    },
    { 
        "x"         : 140 + 180*2,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 1
    },
    { 
        "x"         : 140 + 180*0,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 2
    },
    { 
        "x"         : 140 + 180*1,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 2
    },
    { 
        "x"         : 140 + 180*2,
        "y"         : CONFIG.BASE_CARD_Y - 240 * 2
    }
];

CONFIG.CARD = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "AAA",
        "description": "AAA",
        "genre"      : "village",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card001.png",
        "weak"       : [],
        "strong"     : [1,0,0,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 2,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card002.png",
        "weak"       : [],
        "strong"     : [0,1,0,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 0,
    },
    { 
        "id"         : 3,
        "name"       : "",
        "description": "",
        "genre"      : "village",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card003.png",
        "weak"       : [],
        "strong"     : [0,0,1,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 4,
        "name"       : "",
        "description": "",
        "genre"      : "village",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card004.png",
        "weak"       : [],
        "strong"     : [0,0,0,1],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 5,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card005.png",
        "weak"       : [],
        "strong"     : [1,0,0,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 6,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card001.png",
        "weak"       : [],
        "strong"     : [0,1,0,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 7,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "新しい地点を攻略開始",
        "image"      : "res/card002.png",
        "weak"       : [6],
        "strong"     : [6],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 8,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "効果なし",
        "image"      : "res/card003.png",
        "weak"       : [6],
        "strong"     : [6],
        "isOwnTerritory" : true,
        "maxPopulation" : 2,
    },
    { 
        "id"         : 9,
        "name"       : "",
        "description": "",
        "genre"      : "castle",
        "useTxt"     : "効果なし",
        "image"      : "res/card004.png",
        "weak"       : [6],
        "strong"     : [6],
        "isOwnTerritory" : true,
        "maxPopulation" : 2,
    }
];
