var CONFIG = CONFIG || {};

CONFIG.FONT = "PingFangHK-Light";
CONFIG.DEBUG_FLAG       = 0;
CONFIG.DEBUG_STAGE_NUM  = 4;
CONFIG.BGM_VOLUME       = 1;
CONFIG.SE_VOLUME        = 1;
CONFIG.CARD_SPEND_COST  = 3;
CONFIG.MAX_CHARGE_TIME  = 60*1;
CONFIG.DISCOVER_MESSAGE = "ワクセイタンサシステム\nアップデートチュウデス....\nアップデートチュウデス....\nアップデートチュウデス....\nアップデートチュウデス....\nアップデートカンリョウシマシタ....\n\n";

CONFIG.BASE_CARD_Y = 820;
//1:平地 2:山 3:平地 4: 5:海 6:

CONFIG.MAP2 = [
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
];

CONFIG.MAPx = [
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,
    2,1,1,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,
    2,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,
    2,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,2,1,1,2,
    2,1,1,3,3,3,3,3,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,2,2,1,1,2,
    2,1,1,1,3,3,3,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,2,2,2,1,1,2,
    2,1,1,1,3,3,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,1,2,1,1,1,1,2,
    2,1,1,1,1,3,3,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2,
    2,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,2,2,2,1,1,2,
    2,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,2,1,1,2,2,1,2,
    2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,3,1,1,2,
    2,1,1,1,2,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,2,
    2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,2,
    2,1,1,3,3,1,1,2,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,1,1,2,
    2,1,1,3,3,3,1,1,2,2,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,1,1,2,
    2,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
];

CONFIG.MAP28 = [
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,1,2,2,2,2,2,2,1,2,2,1,2,1,2,1,2,2,2,1,2,2,2,2,2,2,1,2,
    2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,2,1,2,1,2,2,2,2,2,2,1,2,
    2,1,2,2,2,2,2,2,1,2,2,1,2,1,2,1,2,1,2,1,2,2,2,2,2,2,1,2,
    2,1,1,1,1,1,1,2,1,2,2,1,2,1,2,1,2,1,2,1,2,2,2,2,2,2,1,2,
    2,1,1,1,1,1,1,2,1,1,1,1,2,1,2,1,2,1,2,1,2,2,2,2,2,2,1,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,1,2,2,2,2,2,2,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,2,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,1,1,1,2,1,1,1,1,2,1,2,1,2,2,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,1,1,1,2,1,2,2,2,2,1,2,1,2,2,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,1,1,1,2,1,2,2,1,2,
    2,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,2,1,2,
    2,2,1,2,1,2,2,2,2,2,1,2,2,1,2,2,1,2,2,1,2,1,2,1,1,1,1,2,
    2,1,1,2,1,2,2,2,2,2,1,2,2,1,2,1,1,1,2,1,2,1,2,1,2,2,1,2,
    2,1,2,2,1,2,2,2,2,2,1,2,2,1,2,1,1,1,2,1,2,1,2,1,1,2,1,2,
    2,1,2,2,1,2,2,2,2,2,1,2,2,1,2,1,1,1,2,1,2,1,2,2,1,2,1,2,
    2,1,2,2,1,2,2,2,2,2,1,2,2,1,2,2,2,2,2,1,2,1,2,2,1,2,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,2,2,1,2,1,2,
    2,2,2,2,1,2,2,2,2,2,1,2,2,1,2,2,2,2,2,1,2,2,2,2,1,2,1,2,
    2,2,2,2,1,2,2,2,2,2,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,2,2,2,1,2,2,2,2,2,1,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1,2,
    2,2,2,2,1,2,2,2,2,2,1,2,2,1,1,1,1,1,2,1,2,2,2,2,2,2,1,2,
    2,2,2,2,1,2,2,2,2,2,1,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1,2,
    2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
];

CONFIG.MAP12_1 = [
    2,2,2,2,2,2,2,2,2,2,2,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,1,1,1,1,1,1,1,1,1,1,2,
    2,2,2,2,2,2,2,2,2,2,2,2,
];

CONFIG.MAP12_2 = [
    4,4,4,4,4,4,4,2,4,1,4,4,
    4,4,4,4,2,2,1,1,1,1,4,4,
    4,4,4,1,1,1,1,1,1,1,1,4,
    4,4,1,1,1,1,1,1,1,1,1,2,
    4,1,1,1,1,3,3,1,1,1,2,4,
    4,4,1,1,3,3,3,3,1,1,2,4,
    4,1,1,1,1,3,3,1,1,1,1,4,
    4,4,1,1,1,1,1,1,1,1,2,2,
    4,1,1,2,2,1,1,1,1,1,4,4,
    4,4,2,2,1,1,2,2,2,1,4,4,
    4,2,2,2,1,1,2,2,4,4,4,4,
    4,4,4,4,4,4,4,4,4,4,4,4,
];

CONFIG.MAP12_3 = [
    4,4,4,4,4,4,4,2,4,1,4,4,
    4,4,4,4,2,2,1,1,1,1,4,4,
    4,4,4,1,1,1,1,1,1,1,1,4,
    4,4,1,1,1,1,1,1,1,1,1,2,
    4,1,1,1,1,3,3,1,1,1,2,4,
    4,4,1,1,3,3,3,3,1,1,2,4,
    4,1,1,1,1,3,3,1,1,1,1,4,
    4,4,1,1,1,1,1,1,1,1,2,1,
    4,1,1,2,2,1,1,1,1,1,4,4,
    4,4,2,2,1,1,2,2,2,1,4,4,
    4,2,2,2,1,1,2,2,4,4,4,4,
    4,4,4,4,4,4,4,4,4,4,4,4,
];

CONFIG.MAP12_4 = [
    4,4,4,4,4,4,4,4,4,4,4,4,
    4,4,4,4,1,2,4,2,2,2,4,4,
    4,1,1,1,1,1,1,1,1,2,4,4,
    4,1,1,1,1,1,1,1,2,2,1,4,
    1,1,1,1,1,1,2,2,2,2,1,4,
    4,1,1,1,2,1,1,2,2,1,1,4,
    1,1,1,2,2,1,1,1,1,1,1,4,
    4,2,2,2,1,1,1,1,1,1,1,1,
    2,2,1,1,1,1,1,1,1,1,1,1,
    4,2,1,1,1,4,4,1,1,1,1,1,
    2,1,1,1,4,4,4,4,4,4,1,4,
    2,4,1,4,4,4,4,4,4,4,4,4,
];

CONFIG.MAP12_5 = [
    4,4,4,4,1,2,2,1,4,4,4,4,
    4,4,4,4,1,1,1,1,4,4,4,4,
    4,4,4,4,1,1,1,1,4,4,4,4,
    2,2,1,1,1,1,1,1,1,1,2,2,
    2,1,1,1,2,3,3,2,1,1,1,2,
    1,1,1,1,3,3,3,3,1,1,1,1,
    1,1,1,1,3,3,3,3,1,1,1,1,
    2,1,1,1,2,3,3,2,1,1,1,2,
    2,2,1,1,1,1,1,1,1,1,1,2,
    4,4,4,4,1,1,1,1,4,4,4,4,
    4,4,4,4,2,1,1,2,4,4,4,4,
    4,4,4,4,2,2,1,2,4,4,4,4,
];

CONFIG.MAP12_6 = [
    4,4,4,4,1,1,1,1,1,4,4,4,
    4,4,2,2,1,1,1,1,1,1,4,4,
    4,1,1,1,1,1,1,2,2,2,1,4,
    4,1,1,1,1,1,2,2,1,2,1,1,
    1,1,1,1,1,1,2,1,1,2,1,1,
    1,1,1,1,1,2,2,1,1,2,1,1,
    1,1,2,1,1,1,1,1,1,2,1,1,
    4,1,2,2,2,1,2,2,2,2,1,1,
    4,1,2,1,1,1,2,1,1,1,1,4,
    4,4,1,1,1,1,2,2,2,1,1,4,
    4,4,4,1,1,1,1,1,1,1,4,4,
    4,4,4,4,4,1,1,1,4,4,4,4,
];

CONFIG.SHIP = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "1",
        "description": "1",
        "genre"      : "1",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
    },
];


CONFIG.MATERIAL = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "プラスチックの破片",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 2,
        "name"       : "鉄の破片",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 3,
        "name"       : "銅の破片",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 4,
        "name"       : "アルミニウムの破片",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 5,
        "name"       : "鉄線",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 6,
        "name"       : "銅線",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "sozai",
    },
    { 
        "id"         : 7,
        "name"       : "モジュール",
        "description": "",
        "image"      : "res/sozai001.png",
        "genre"      : "item",
    }
];


CONFIG.ITEM = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "バッテリーモジュール",
        "description": "より多くの電気を貯めることができる",
        "genre"      : "",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "materials"  : [{material_id:1,amount:1},{material_id:2,amount:1}],
        "materialId" : 7,
    },
    { 
        "id"         : 2,
        "name"       : "ソーラーモジュール",
        "description": "単位時間あたりの充電量が増加する",
        "genre"      : "",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "materials"  : [{material_id:1,amount:5},{material_id:2,amount:5},{material_id:3,amount:5}],
        "materialId" : 7,
    },
    { 
        "id"         : 5,
        "name"       : "燃焼モジュール",
        "description": "より遠くまで飛ぶことができる",
        "genre"      : "",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "materials"  : [{material_id:1,amount:5},{material_id:2,amount:5},{material_id:3,amount:5}],
        "materialId" : 7,
    },
    { 
        "id"         : 4,
        "name"       : "エンジンモジュール",
        "description": "探索スピードが増加する",
        "genre"      : "",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "materials"  : [{material_id:1,amount:5},{material_id:2,amount:5},{material_id:3,amount:5}],
        "materialId" : 7,
    },
    { 
        "id"         : 3,
        "name"       : "アンテナモジュール",
        "description": "Sランク惑星の発見率が増加する",
        "genre"      : "",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "materials"  : [{material_id:1,amount:5},{material_id:2,amount:5},{material_id:3,amount:5}],
        "materialId" : 7,
    },
];


CONFIG.CARD = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "XXX",
        "description": "XXX",
        "genre"      : "test",
        "useTxt"     : "",
        "image"      : "res/sozai001.png",
        "weak"       : [],
        "strong"     : [1,0,0,0],
        "isOwnTerritory" : false,
        "maxPopulation" : 2,
    }
];

CONFIG.MISSION = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "レア惑星を探せ",
        "description": "AAA",
        "genre"      : "aaa",
        "planetId"   : 5
    },
    { 
        "id"         : 2,
        "name"       : "レア惑星を探せ",
        "description": "AAA",
        "genre"      : "aaa",
        "planetId"   : 5
    },
    { 
        "id"         : 3,
        "name"       : "レア惑星を探せ",
        "description": "AAA",
        "genre"      : "aaa",
        "planetId"   : 5
    },
    { 
        "id"         : 4,
        "name"       : "レア惑星を探せ",
        "description": "AAA",
        "genre"      : "aaa",
        "planetId"   : 5
    },
    { 
        "id"         : 5,
        "name"       : "レア惑星を探せ",
        "description": "AAA",
        "genre"      : "aaa",
        "planetId"   : 5
    },
];
//名前の生成
//http://groovy-life.sakura.ne.jp/AutoGenerator/RandKanaName.cgi
CONFIG.PLANET = [
    { 
    },
    { 
        "id"         : 1,
        "name"       : "トケンショソダヒ",
        "lv"         : 1,
        "description": "ワクセイノセツメイ",
        "genre"      : "aaa",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [0,400*1],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 2,
        "name"       : "モンロンワン",
        "lv"         : 2,
        "description": "ワクセイノセツメイ",
        "genre"      : "bbb",
        "image"      : "res/planet_w350_002.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-400,400*2],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 3,
        "name"       : "コネチェーガ",
        "lv"         : 2,
        "description": "ワクセイノセツメイ",
        "genre"      : "ccc",
        "image"      : "res/planet_w350_003.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [700,400*2],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 4,
        "name"       : "ゼガーフクコシ",
        "lv"         : 2,
        "description": "ワクセイノセツメイ",
        "genre"      : "ccc",
        "image"      : "res/planet_w350_004.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-200,400*2],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 5,
        "name"       : "タハテヒチンゼ",
        "lv"         : 2,
        "description": "ワクセイノセツメイ",
        "genre"      : "ccc",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [400,400*2],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 6,
        "name"       : "ゲンキュンゴアマ",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "ddd",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [0,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 7,
        "name"       : "ウェゲテーヴォオ",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-200,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 8,
        "name"       : "ムエメドニー",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [400,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 9,
        "name"       : "ファズノーヨ",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [800,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 10,
        "name"       : "ガンモンズンウォ",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-800,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 11,
        "name"       : "スジワセチ",
        "lv"         : 3,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [600,400*3],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 12,
        "name"       : "ルーパヴィ",
        "lv"         : 4,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-400,400*4],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 13,
        "name"       : "ザフソーピ",
        "lv"         : 4,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [400,400*4],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 14,
        "name"       : "ファズノーヨ",
        "lv"         : 5,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [0,400*5],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 15,
        "name"       : "ガンモンズンウォ",
        "lv"         : 5,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [300,400*5],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 16,
        "name"       : "スーリットゥン",
        "lv"         : 6,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [600,400*6],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 17,
        "name"       : "ディトベウエセ",
        "lv"         : 6,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-500,400*6],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 18,
        "name"       : "ホァミク",
        "lv"         : 7,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [0,400*7],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 19,
        "name"       : "ティンパンバデー",
        "lv"         : 7,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-400,400*7],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 20,
        "name"       : "ネーケンピーシ",
        "lv"         : 7,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [-600,400*7],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 21,
        "name"       : "ゲデツフトゥウ",
        "lv"         : 7,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [500,400*7],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 22,
        "name"       : "クィリャチ",
        "lv"         : 8,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 100,
        "position"   : [0,400*8],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 23,
        "name"       : "ゾネネヴ",
        "lv"         : 8,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [200,400*8],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 24,
        "name"       : "ナタグーワーモ",
        "lv"         : 8,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [400,400*8],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 25,
        "name"       : "ギバリョシャンモ",
        "lv"         : 8,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-400,400*8],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 26,
        "name"       : "オゴタ",
        "lv"         : 9,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [0,400*9],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 27,
        "name"       : "ゼーコ",
        "lv"         : 9,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-800,400*9],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 28,
        "name"       : "ムーリョン",
        "lv"         : 9,
        "description": "ワクセイノセツメイ",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [800,400*9],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 29,
        "name"       : "カバメチボン",
        "lv"         : 9,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [200,400*9],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 30,
        "name"       : "チェーベイーマ",
        "lv"         : 10,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [1000,400*10],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 31,
        "name"       : "ワウロコティサ",
        "lv"         : 10,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [500,400*10],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 32,
        "name"       : "ウオデヌ",
        "lv"         : 10,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_001.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [100,400*10],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 33,
        "name"       : "ピュトゥ",
        "lv"         : 11,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-400,400*11],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 34,
        "name"       : "ピュトゥ",
        "lv"         : 11,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [100,400*11],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 35,
        "name"       : "ピュトゥ",
        "lv"         : 11,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [400,400*11],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 36,
        "name"       : "ピュトゥ",
        "lv"         : 11,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [1000,400*11],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 37,
        "name"       : "ピュトゥ",
        "lv"         : 12,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-100,400*12],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 38,
        "name"       : "ピュトゥ",
        "lv"         : 12,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [200,400*12],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 39,
        "name"       : "ピュトゥ",
        "lv"         : 12,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [800,400*12],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 40,
        "name"       : "ピュトゥ",
        "lv"         : 13,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-1000,400*13],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 41,
        "name"       : "ピュトゥ",
        "lv"         : 13,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [1000,400*13],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
    { 
        "id"         : 42,
        "name"       : "ピュトゥ",
        "lv"         : 13,
        "description": "EEE",
        "genre"      : "eee",
        "image"      : "res/planet_w350_005.png",
        "fuel"       : 2,
        "time"       : 0,
        "position"   : [-500,400*13],
        "materials"  : [{material_id:1,rate:0.1},{material_id:2,rate:0.1},{material_id:3,rate:0.1}]
    },
];