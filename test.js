var socket = io();

var a = 2;

socket.on('refreshList', function(msg){
    document.getElementById('userList').innerHTML = msg
    console.log("refreshed")
});

function setA(num){
    a = num;
}
