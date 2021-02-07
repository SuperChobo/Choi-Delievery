var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000);

var userList = []; 
var isGameStart = false;

function UserInfo(address){
    this.address = address;
    this.name = ""
    this.character = ""
    this.connection = true;
}

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
        if(tadd == userList[i].address){
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

app.get('/test', function(req, res){
    res.sendFile(__dirname + '/test.html');
});

app.get('/testjs', function(req, res){
    res.sendFile(__dirname + '/test.js');
});

io.on('connection', function(socket) {
    var tadd = "";
    var i = 0;
    tadd = socket.handshake.address;
    var isValid = false;

    for(i = 0; i < userList.length; i++){
        if(tadd == userList[i].address){
            isValid = true;
            if(userList[i].name != "")
                socket.emit('skipLogin','');
            break;
        }
    }

    if(!isValid){
        console.log("클라이언트 접속 : " + tadd)
        userList.push(new UserInfo(tadd));
        console.log(userList);
    }
    userList[i].connection = true;

    io.emit('refreshList', strAddrList());

    socket.on('disconnect', function(){
        tadd = socket.handshake.address;
        var isValid = false;
        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].address){
                isValid = true;
                break;
            }
        }
        if(isValid){
            userList[i].connection = false
            setTimeout(checkDisconnect, 1000, userList[i].address);
        }
    });

    socket.on('btnGameStart', function(){
        isGameStart = true;
        io.emit('startGame');
    });

    socket.on('login', function(name){
        tadd = socket.handshake.address;
        var isValid = false;
        var i = 0;
        for(i = 0; i < userList.length; i++){
            if(tadd == userList[i].address){
                isValid = true;
                break;
            }
        }
        if(!isValid){
            userList.push(new UserInfo(tadd));
            console.log("로그인 했는데 나 왜 없니?");
        }
        userList[i].name = name;
        socket.emit('loginSuccess');
        console.log("로그인 : " + userList[i].address);
    })
});

function checkDisconnect(addr){
    var isValid = false;
    for(i = 0; i < userList.length; i++){
        if(addr == userList[i].address){
            isValid = true;
            break;
        }
    }
    if(!isValid){
        return;
    }
    console.log('연결시간 체크 : ' + userList[i].address)
    if(userList[i].connection == false){
        console.log('연결시간 초과 : ' + userList[i].address);
        userList.splice(i, 1);
        io.emit('refreshList', strAddrList());
    }else{
        console.log('재연결 성공 : ' + userList[i].address)
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