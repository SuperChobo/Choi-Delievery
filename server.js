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
var isGameStart = false;

function UserInfo(socket){
    this.socket = socket;
    this.name = "";
    this.character = "";
    this.have = "";
    this.money = "";
    this.connection = true;
}

function company(name, soundness, vision, tendency, variablilty, category, price){
    this.name = name;
    this.soundness = soundness;
    this.vision = vision;
    this.tendency = tendency;
    this.variablilty = variablilty;
    this.category = category;

    this.price = price;
    this.prevPrice = price;
}

function stock(){
    this.name;
    this.num;
    this.totalPrice;
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
    res.sendFile(__dirname + '/login.html');
});

app.get('/login/next', function(req, res){
    res.redirect('/lobby');
});

app.get('/lobby', function(req, res){
    var tadd = req.ip;
    var isValid = false;
    for(i = 0; i < userList.length; i++){
        if(tadd == userList[i].socket.handshake.address){
            isValid = true;
            break;
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
            if(userList[i].name != "")
                socket.emit('skipLogin','');
            break;
        }
    }

    if(!isValid){
        console.log("클라이언트 접속 : " + tadd)
        userList.push(new UserInfo(socket));
        console.log(userList);
    }
    userList[i].connection = true;

    io.emit('refreshList', userList.length, strAddrList());

    socket.on('disconnect', function(){
        tadd = socket.handshake.address;
        var isValid = false;
        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].socket.handshake.address){
                isValid = true;
                break;
            }
        }
        if(isValid){
            userList[i].connection = false
            setTimeout(checkDisconnect, 1000, userList[i].socket.handshake.address);
        }
    });

    socket.on('btnGameStart', function(){
        isGameStart = true;
        io.emit('startGame');
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
    console.log('연결시간 체크 : ' + userList[i].socket.handshake.address)
    if(userList[i].connection == false){
        console.log('연결시간 초과 : ' + userList[i].socket.handshake.address);
        userList.splice(i, 1);
        io.emit('refreshList', userList.length, strAddrList());
    }else{
        console.log('재연결 성공 : ' + userList[i].socket.handshake.address)
    }
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
    addCompany(30); // Num of Company
    setMoney(-1, 100000);

    console.log(userList);
    console.log(companyList);
}

function addCompany(num){
    var probability_soundness = Math.ceil(Math.random() * 100);
    var probability_vision = Math.ceil(Math.random() * 100);
    var probability_tendency = Math.ceil(Math.random() * 100);
    var probability_variablilty = Math.ceil(Math.random() * 100);
    var max_price = 10000;
    var min_price = 100;
    var price_chiper = 3;

    for(var i = 0; i < num; i++){
        companyList.push(new company(numToAlphabet(company.prototype.num++),
                        probability_soundness, 
                        probability_vision, 
                        probability_tendency, 
                        probability_variablilty, 
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

function setMoney(player, money){
    if(player == -1){
        for(var i = 0; i < userList.length; i++){
            userList[i].money = money;
        }
    }else{
        userList[player].money = money;
    }
}




