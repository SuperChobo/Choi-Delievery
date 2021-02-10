var express = require('express');
var http = require('http');
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
    this.category = category;
    this.target = target;
    this.detail = detail;
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
            userList[i].timeout = setTimeout(checkDisconnect, 1000, userList[i].socket.handshake.address);
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
        socket.emit('resEncounterList', encounterList);
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
    addEncounters(500, 1); //num of Encounter, turn
    setMoney(-1, 100000);  // if -1 all or personal, amount of money

    for(var i = 0; i < userList.length; i++){
        if(!userList[i].name == ""){
            userList[i].isReady = false;
            userList[i].isPlaying = true;
        }
    }

    //console.log(userList);
    //console.log(companyList);
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

    var probability_sum = 0;
    var remain;
    var category;
    var target;
    var detail; //0: 하락, 1: 상승

    for(var i = 0; i < probabilityList.length; i++){
        probability_sum += probabilityList[i]
    }

    for(var i = 0; i < num; i++){
        remain = probability_sum;
        category = probabilityList.length - 1;

        for(var j = 0; j < probabilityList.length; j++){
            if(Math.random() < probabilityList[j] / remain){
                category = j;
                break;
            }
            remain -= probabilityList[j];
        }

        switch(category){
            case 0: // cate
                target = Math.floor(Math.random() * (cateList.length));
                detail = Math.floor(Math.random() * 2);
                break;
            case 1: // specific
                target = Math.floor(Math.random() * (companyList.length));
                detail = Math.floor(Math.random() * 2);
                break;        
            case 2: // tendency
                target = Math.floor(Math.random() * (companyList.length));
                detail = Math.floor(Math.random() * 100) + 1;
                break;
            case 3: // kospi
                target = 1;
                detail = Math.floor(Math.random() * 2);
                break;
        }
        encounterList.push(new encounter(category, target, detail, Math.floor(Math.random() * 5)));
    }
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

function nextTurn(){
    console.log(turnCount + " 턴 종료");
    changeStockPrice();
    eventAction();
    playerAction();
    
    for(var i = 0; i < userList.length; i++){
        userList[i].isReady = false;
    }

    turnCount++;
    console.log(turnCount + " 턴 시작");
    io.emit('nextTurn');
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
    
}

function changeStockPrice(){
    for(var i = 0; i < companyList.length; i++){
        companyList[i].prevPrice = companyList[i].price;
        companyList[i].price = Math.floor(companyList[i].prevPrice * (1 + ((companyList[i].tendency - 30) / 1500 + ((0.5 - Math.random()) / 500 * companyList[i].variability))));
    }
}