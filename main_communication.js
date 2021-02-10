socket.on('resCompanyList', function(data){
    companyList = data;
    loading_companyList = false;
})

socket.on('resEncounterList', function(data){
    encounterList = data;
    loading_encounterList = false;
})

socket.on('resCateList', function(data){
    cateList = data;
    loading_cateList = false;
})

socket.on('resInfo', function(data_money, data_have, data_maxHP, data_turnCount){
    money = data_money;
    have = data_have;
    hp = data_maxHP;
    maxHP = data_maxHP;
    turnCount = data_turnCount;
    loading_info = false;
})

socket.on('nextTurn', function(){
    nextTurn();
})

function ready(){
    socket.emit('ready', actionList);
}