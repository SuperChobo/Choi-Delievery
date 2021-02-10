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

socket.on('resInfo', function(data_money, data_have, data_maxHP, data_turnCount, data_name){
    money = data_money;
    have = data_have;
    hp = data_maxHP;
    maxHP = data_maxHP;
    turnCount = data_turnCount;
    loading_info = false;
    userName = data_name;
})

socket.on('nextTurn', function(){
    nextTurn();
})

function ready(){
    onGoing = false;
    socket.emit('ready', actionList);
}