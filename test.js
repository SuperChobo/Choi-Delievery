var socket = io();

socket.on('refreshList', function(msg){
    document.getElementById('userList').innerHTML = msg
    console.log("refreshed")
});
