nextTurn = function(){
    onGoing = false;
    loadData();
    event_loading = window.setInterval(waitForLoading, 100);
}

nextTurn();

function mainFlow(){
    window.clearInterval(event_loading);

    turnCount++;
    onGoing = true;
    fillData();
}

function fillData(){
    document.getElementById("tabtwoza").innerHTML = o_companyList();
    document.getElementById("tabevent").innerHTML = o_eventList();
    document.getElementById("tabjak").innerHTML = o_operation();
    document.getElementById("tabjagi").innerHTML = o_development();
    document.getElementById("tabnodon").innerHTML = o_work();
}

function loadData(){
    loading_companyList = true;
    loading_encounterList = true;
    loading_cateList = true;

    socket.emit('reqCompanyList');
    socket.emit('reqEncounterList');
    socket.emit('reqCateList');
}

function waitForLoading(){
    if(!isLoading()){
        mainFlow();
    }
}

function isLoading(){
    if(loading_companyList || loading_encounterList || loading_cateList)
        return true;
    return false;
    
}