var express = require('express');
var http = require('http');
const { type } = require('os');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000);

//
// Class && Global Variables
//

var userList = []; 
var companyList = [];
var encounterList = [];
var isGameStart = false;
var turnCount;
var maxHP = 5;

function action(category, target, detail){
    this.category = category;
    this.target = target;
    this.detail = detail;
}

function UserInfo(socket){
    this.socket = socket;
    this.name = "";
    this.character = "";
    this.have = [];
    this.money = "";
    this.connection = true;

    this.timeout;
    this.isReady;
    this.actionList = [];    //category, target, detail
    this.isPlaying = false;
    this.encounterList = [];
}

function company(name, soundness, vision, tendency, variability, category, price){
    this.name = name;
    this.soundness = soundness;
    this.vision = vision;
    this.tendency = tendency;
    this.variability = variability;
    this.category = category;

    this.price = price;
    this.prevPrice = price;
}

function stock(){
    this.name;
    this.num;
    this.totalPrice;
}

function encounter(category, target, detail, turn){
    this.category = category;    //0.cate, specific, tendency, kospi
    this.target = target;
    this.detail = detail;   //0 하락 1 상승
    this.turn = turn;
}

var cateList = ["생필품", "식품", "요식업", "명품", 
                "철강", "반도체", "배터리", "금속",
                "원유", "광업", 
                "백화점", "이커머스", "마트", 
                "스마트폰", "통신", "AI"]

company.prototype.setTendency = function(tendency){
    this.tendency = tendency;
}

company.prototype.num = 0;

//
// Main Server Flow
//

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    var i;
    var tadd = req.ip;
    var isValid = false;
    for(i = 0; i < userList.length; i++){
        if(tadd == userList[i].socket.handshake.address){
            if(userList[i].name == ""){
                isValid = false;
                break;
            }else{
                isValid = true;
                break;
            }
        }
    }
    if(isValid){
        res.redirect("/lobby");
        return;
    }
    res.sendFile(__dirname + '/login.html');
});

app.get('/login/next', function(req, res){
    res.redirect('/lobby');
});

app.get('/lobby', function(req, res){
    var i;
    var tadd = req.ip;
    var isValid = false;
    for(i = 0; i < userList.length; i++){
        if(tadd == userList[i].socket.handshake.address){
            if(userList[i].name == ""){
                isValid = false;
                break;
            }else{
                isValid = true;
                break;
            }
        }
    }
    if(!isValid){
        res.redirect("/login");
    }else{
        if(!isGameStart){
            res.sendFile(__dirname + '/lobby.html');
        }else{
            //res.redirect('/main');
        }
    }
});

app.get('/lobby/next', function(req, res){
    res.redirect('/main');
});

app.get('/main', function(req, res){
    res.sendFile(__dirname + '/client.html');
});

app.get('/mainVariables', function(req, res){
    res.sendFile(__dirname + '/main_variables.js');
});

app.get('/mainCommunication', function(req, res){
    res.sendFile(__dirname + '/main_communication.js');
});

app.get('/mainIO', function(req, res){
    res.sendFile(__dirname + '/main_io.js');
});

app.get('/mainFlow', function(req, res){
    res.sendFile(__dirname + '/main_flow.js');
});

app.get('/test', function(req, res){
    res.sendFile(__dirname + '/test.html');
});

app.get('/testjs', function(req, res){
    res.sendFile(__dirname + '/test.js');
});

app.get('/testjs2', function(req, res){
    res.sendFile(__dirname + '/test2.js');
});

io.on('connection', function(socket) {
    var tadd = "";
    var i = 0;
    tadd = socket.handshake.address;
    var isValid = false;

    for(i = 0; i < userList.length; i++){
        if(tadd == userList[i].socket.handshake.address){
            isValid = true;
            if(userList[i].timeout){
                clearTimeout(userList[i].timeout);
                userList[i].timeout = ""
                console.log('재연결 성공 : ' + userList[i].socket.handshake.address)     
            }

            if(userList[i].name != "")
                socket.emit('skipLogin','');
            break;
        }
    }

    if(!isValid){
        console.log("클라이언트 접속 : " + tadd)
        userList.push(new UserInfo(socket));
    }
    userList[i].connection = true;

    io.emit('refreshList', strAddrList());

    socket.on('disconnect', function(){
        tadd = socket.handshake.address;
        var i;
        var isValid = false;
        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].socket.handshake.address){
                isValid = true;
                break;
            }
        }
        if(isValid){
            userList[i].connection = false
            console.log("연결 끊김 : " + userList[i].socket.handshake.address);
            userList[i].timeout = setTimeout(checkDisconnect, 5000, userList[i].socket.handshake.address);
        }
    });

    socket.on('btnGameStart', function(){
        gameInit();
    });

    socket.on('login', function(name){
        tadd = socket.handshake.address;
        var isValid = false;
        var i = 0;
        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].socket.handshake.address){
                isValid = true;
                break;
            }
        }
        if(!isValid){
            userList.push(new UserInfo(socket));
            console.log("로그인 했는데 나 왜 없니?");
        }
        userList[i].name = name;
        socket.emit('loginSuccess');
        console.log("로그인 : " + userList[i].socket.handshake.address);
    })

    socket.on('reqCompanyList', function(){
        socket.emit('resCompanyList', companyList);
    })
    socket.on('reqEncounterList', function(){
        var sendEncounterList;
        for(var i = 0; i < encounterList.length; i++){
            if(encounterList[i].turn > turnCount){
                sendEncounterList = encounterList.slice(0, i);
                break;
            }
        }
        socket.emit('resEncounterList', sendEncounterList);
    })
    socket.on('reqCateList', function(){
        socket.emit('resCateList', cateList);
    })

    socket.on('reqInfo', function(){
        for(var i = 0; i < userList.length; i++){
            if(userList[i].socket.handshake.address == socket.handshake.address){
                socket.emit('resInfo', userList[i].money, userList[i].have, maxHP, turnCount)
                break;
            }else{
            }
        }
    })

    socket.on('ready', function(actionList){
        tadd = socket.handshake.address;
        var isValid = false;
        var allReady = true;
        var i = 0;

        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].socket.handshake.address){
                isValid = true;
                userList[i].isReady = true;
                userList[i].actionList = actionList;
                console.log("결정 완료 : " + userList[i].socket.handshake.address);
            }
            if(!userList[i].isReady && userList[i].isPlaying){
                allReady = false;
            }
        }
        if(allReady){
            nextTurn();
        }
    })
});

function checkDisconnect(addr){
    var isValid = false;
    for(i = 0; i < userList.length; i++){
        if(addr == userList[i].socket.handshake.address){
            isValid = true;
            break;
        }
    }
    if(!isValid){
        return;
    }

    console.log('연결시간 초과 : ' + userList[i].socket.handshake.address);
    userList.splice(i, 1);
    io.emit('refreshList', userList.length, strAddrList());
}

function strAddrList(){
    if(userList.length == 0)    return ""
    var nameList = [];
    for(var i = 0; i < userList.length; i++){
        if(userList[i].name != ""){
            nameList.push(userList[i].name)
        }
    }
    return nameList.join('<br>');
}

//
//  Main Game Flow
//

function gameInit(){
    isGameStart = true;
    turnCount = 1;

    io.emit('startGame');

    addCompany(12); // Num of Company
    setMoney(-1, 100000);  // if -1 all or personal, amount of money
    
    for(var i = 0; i < 5; i++){
        addEncounters(6, i + 2);
    }

    for(var i = 0; i < userList.length; i++){
        if(!userList[i].name == ""){
            userList[i].isReady = false;
            userList[i].isPlaying = true;
        }
    }
    //console.log(userList);
    //console.log(companyList);
}

function nextTurn(){
    console.log(turnCount + " 턴 종료");

    turnCount++;
    for(var i = 0; i < encounterList.length; i++){
        if(encounterList[i].turn >= turnCount){
            encounterList.splice(0, i);
            break;
        }
    }
    for(var i = 0; i < companyList.length; i++){
        companyList[i].prevPrice = companyList[i].price;
    }

    eventAction();
    changeStockPrice();
    playerAction();


    addEncounters(6, turnCount + 5); //num of Encounter, turn
    for(var i = 0; i < userList.length; i++){
        userList[i].isReady = false;
    }

    console.log("--------------------------------------------------------");
    console.log(turnCount + " 턴 시작");
    io.emit('nextTurn');
}

function addCompany(num){
    var soundness
    var vision
    var tendency
    var variability
    var max_price = 5000;
    var min_price = 5000;
    var price_chiper = 3;

    for(var i = 0; i < num; i++){
        soundness = Math.ceil(Math.random() * 100);
        vision = Math.ceil(Math.random() * 100);
        tendency = Math.ceil(Math.random() * 100);
        variability = Math.ceil(Math.random() * 100);

        companyList.push(new company(numToAlphabet(company.prototype.num++),
                        soundness, vision, tendency, variability, 
                        cateList[Math.floor(Math.random() * cateList.length)],
                        Math.floor(Math.random() * ((max_price - min_price) / Math.pow(10,price_chiper - 1) + 1)) * Math.pow(10 ,price_chiper - 1) + min_price
                        ));
    }
}

function numToAlphabet(num){
    if(num < 26){
        return String.fromCharCode(65 + num);
    }else if(num < 602){
        return String.fromCharCode(65  + Math.floor(num / 26) - 1) + String.fromCharCode(65 + (num % 26));
    }else{
        return num;
    }
}

function addEncounters(num, turn){
    var probabilityList = [3, 3, 3, 1];
    //cate, specific, tendency, kospi

    var type_num = [];
    var sum = 0;
    var abs_sum;
    var type_probability = [];
    var i, j, k;

    for(i = 0; i < probabilityList.length; i++){
        type_num.push(0);
        sum += probabilityList[i];
    }
    abs_sum = sum;
    sum -= probabilityList[3]

    for(i = 0; i < probabilityList.length - 1; i++){
        type_probability.push(probabilityList[i] / sum);
        sum -= probabilityList[i];
    }

    type_probability[3] = probabilityList[3] / abs_sum;
    if(Math.random() < type_probability[3]){
        type_num[3]++;
        num--;
    }

    for(i = 0; i < num; i++){
        for(j = 0; j < probabilityList.length - 1; j++){
            if(Math.random() < type_probability[j]){
                type_num[j]++;
                break;
            }
        }
    }
    var detail;
    var companyCheck;
    for(i = 0; i < type_num.length; i++){
        switch(i){
            case 0:
                companyCheck = getCompanyCheck(type_num[i], 2);
                for(j = 0; j < companyCheck.length; j++){
                    if(companyCheck[j] == 1){
                        encounterList.push(new encounter(i, j, Math.floor(Math.random() * 2), turn));
                    }
                }
                break;
            case 1:
            case 2:
                companyCheck = getCompanyCheck(type_num[i], 1);
                for(j = 0; j < companyCheck.length; j++){
                    if(companyCheck[j] == 1){
                        if(i == 1){
                            detail = Math.floor(Math.random() * 2);
                        }else{
                            detail = Math.floor(Math.random() * 40 + 30);
                        }
                        encounterList.push(new encounter(i, j, detail, turn));
                    }
                }
                break;
            case 3:
                for(j = 0; j < type_num[i]; j++){
                    encounterList.push(new encounter(3, 1, Math.floor(Math.random() * 2), turn));
                }
                break;
        }

    }
}

function getCompanyCheck(num, mode){ //1 : company, 2 : category
    var companyCheck = [];
    var remain;
    var remain_org;

    var temp;
    var i, j;
    var count;
    if(mode == 1){
        remain = companyList.length;
    }else if(mode == 2){
        remain = cateList.length;
    }

    for(i = 0; i < remain; i++){
        companyCheck.push(0);
    }
    remain_org = remain;
    for(i = 0; i < num; i++){
        temp = Math.floor(Math.random() * remain);
        count = 0;
        for(j = 0; j < remain_org; j++){
            if(companyCheck[j] == 1)
                continue;
            if(count == temp){
                companyCheck[j] = 1;
                break;
            }
            count++;
        }
        remain--;
    }

    return companyCheck;
}

function setMoney(player, money){
    if(player == -1){
        for(var i = 0; i < userList.length; i++){
            userList[i].money = money;
        }
    }else{
        userList[player].money = money;
    }
}

function playerAction(){
    var tempAction;
    var k;
    var isValid;
    for(var i = 0; i < userList.length; i++){
        for(var j = 0; j < userList[i].actionList.length; j++){
            tempAction = userList[i].actionList[j];
            switch(Number(tempAction.category)){
                case 1: //buy
                case 2: //sell
                    isValid = false;
                    for(k = 0; k < userList[i].have.length; k++){
                        if(userList[i].have[k].name == companyList[tempAction.target].name){
                            isValid = true;
                            break;
                        }
                    }
                    if(!isValid){
                        userList[i].have.push({"name": companyList[tempAction.target].name, 
                                                "num": 0, 
                                                "totalPrice": 0
                                                })
                    }
                    if(tempAction.category == 1){
                        userList[i].have[k].num += Number(tempAction.detail);
                        userList[i].have[k].totalPrice += tempAction.detail * companyList[tempAction.target].prevPrice;
                        userList[i].money -= tempAction.detail * companyList[tempAction.target].prevPrice;
                    }else{
                        userList[i].have[k].num -= tempAction.detail;
                        userList[i].have[k].totalPrice -= tempAction.detail * companyList[tempAction.target].prevPrice;
                        if(userList[i].have[k].num == 0){
                            userList[i].have.splice(k, 1);
                        }
                        userList[i].money += tempAction.detail * companyList[tempAction.target].prevPrice;
                    }
                    break;
                default:
            }
        }
    }
}

function eventAction(){
    var endIndex;
    var i, j;
    for(i = 0; i < encounterList.length; i++){
        if(turnCount < encounterList[i].turn){
            endIndex = i;
            break;
        }
    }
    for(i = 0; i < endIndex; i++){
        switch(encounterList[i].category){
            case 0:
                for(j = 0; j < companyList.length; j++){
                    if(companyList[j].category == cateList[encounterList[i].target]){
                        eventPriceChange(j, encounterList[i].detail);
                        break;
                    }
                }
                break;
            case 1:
                eventPriceChange(encounterList[i].target, encounterList[i].detail);
                break;
            case 2:
                companyList[encounterList[i].target].tendency += encounterList[i].detail;
                if(companyList[encounterList[i].target].tendency > 100){
                    companyList[encounterList[i].target].tendency -= 100;
                }
                break;
            case 3:
                break;
            default:
                console.log("??");
        }
    }

}

function eventPriceChange(index, detail){
    var sensitive;
    if(detail == 0){
        sensitive = companyList[index].soundness * (-1);
    }else{
        sensitive = companyList[index].vision;
    }
    companyList[index].price = Math.floor(companyList[index].price * (1 + ((Math.random() * 0.5 + 0.5) * sensitive / 300)));
}

function changeStockPrice(){
    for(var i = 0; i < companyList.length; i++){
        companyList[i].price = Math.floor(companyList[i].price * (1 + ((companyList[i].tendency - 30) / 1500 + ((0.5 - Math.random()) / 500 * companyList[i].variability))));
    }
}