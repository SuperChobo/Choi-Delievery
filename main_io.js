function o_companyList(){
    var output = [];
    var temp;
    var temp2;

    output.push("<회사번호를 입력하시오>");
    for(var i = 0; i < companyList.length; i++){
        temp = (i + 1) + ". " + companyList[i].name + " [" + companyList[i].category + "]&emsp;&emsp;" + "주가 : " + printPriceChange(companyList[i].price, companyList[i].prevPrice);
        for(var j = 0; j < have.length; j++){
            if(have[j].name == companyList[i].name){
                temp2 = Math.floor(have[j].totalPrice / have[j].num);
                if(have[j].num > 0)
                    temp += "&emsp;평단가: " + printPriceChange(temp2, companyList[i].price) + " <sub>" + have[j].num + "주</sub>"; 
                break;
            }
        }

        output.push(temp);
    }

    return output.join("<br>");
}

function o_companyInfo(index){
    var output = [];

    output.push((index + 1) + ". " + companyList[index].name + " [ " + companyList[index].category + " ] "+ "&emsp;&emsp;&emsp;" + "주가 : " + printPriceChange(companyList[index].price, companyList[index].prevPrice) + "&emsp;" + printHaveAmouont(index));
    output.push("<br>");
    output.push("- 건전성 : " + companyList[index].soundness);
    output.push("- 미래지향성 : " + companyList[index].vision);
    output.push("- 신뢰성 : " + companyList[index].tendency);
    output.push("- 변동성 : " + companyList[index].variability);

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("1. 구매하기");
    output.push("2. 판매하기")
    output.push("0. 리스트로 돌아가기");

    return output.join("<br>");
}

function printPriceChange(price, prevPrice){
    var change;
    var temp = price + " "

    if(price > prevPrice){
        change = '<a style="color:rgb(230,100,100)">↑';
    }else if(price == prevPrice){
        return temp + "<sub>" + "-" + "</sub>";
    }else{
        change = '<a style="color:rgb(100,100,230)">↓';
    }

    return temp + "<sub>" + change + (Math.abs(price - prevPrice) / prevPrice * 100).toFixed(2) + "% (" + Math.abs(price - prevPrice) + ")</sub></a>";
}

function printHaveAmouont(index){
    var i
    var isValid = false;
    for(i = 0; i < have.length; i++){
        if(companyList[index].name == have[i].name){
            investIndex[1] = i;
            return "평단가 : " + Math.floor(have[i].totalPrice / have[i].num) + "<sub>보유 수 : " + have[i].num + "</sub>";
        }
    }
    return "보유 수 : 0";
}

function o_investion(){
    var output = [];

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("<br>");
    output.push("1. 주식 투자 : 변동폭이 비교적 적은 주식에 투자합니다.");
    output.push("2. 코인 투자 : 변동폭이 비교적 큰 코인에 투자합니다.");

    return output.join("<br>");
}

function o_work(){
    var output = [];

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("<br>");
    output.push("1. 노동하기 : 행동력을 소비해 xxxx원을 획득합니다.");

    return output.join("<br>");
}

function o_operation(){
    var output = [];

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("<br>");
    output.push("1. [직업 능력] 해킹 : 상대방이 한 턴 동안 아무 행동도 하지 못하게 합니다.");
    output.push("2. 주식 갤러리 보기 : 앞으로 일어날 사건을 예측합니다.");
    output.push("3. 공매도 : 특정 주식의 주가 하락을 시도합니다.");


    return output.join("<br>");
}

function o_development(){
    var output = [];

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("<br>");
    output.push("1. 정보력 증진 : 정보 작전 성공 확률이 증가합니다.");
    output.push("2. 컴퓨터 개량 : 주가조작 작전 성공 확률이 증가합니다.");
    output.push("3. 보약 섭취 : 행동력이 상승합니다.");

    return output.join("<br>");
}

function o_eventList(){
    var output = [];
    var message = ["하락하였습니다", "상승하였습니다"]

    output.push("<이벤트 목록>");
    var temp;

    if(encounterList == null)
        return output;
    for(var i = 0; i < encounterList.length; i++){
        if(turnCount < encounterList[i].turn)   temp = "[" + (encounterList[i].turn - turnCount) + "턴 후] ";
        else if(turnCount - encounterList[i].turn == 0)  temp = "[방금] ";
        else                                        temp = "[" + (turnCount - encounterList[i].turn) + "턴 전] "
        switch(encounterList[i].category){
            //cate, specific, tendency, kospi
            case 0:
                temp = temp + cateList[encounterList[i].target] + " 산업의 주가가 " + message[encounterList[i].detail];
                break;
            case 1:
                temp = temp + "회사 " + companyList[encounterList[i].target].name + "의 주가가 " + message[encounterList[i].detail];
                break;
            case 2:
                temp = temp + "회사 " + companyList[encounterList[i].target].name + "의 경향성의 바뀌었습니다."
                break;
            case 3:
                temp = temp + "전체 시장 증시가 " + message[encounterList[i].detail];
                break;
        }

        output.push(temp);
    }
    return output.join("<br>");
}

function o_haveInfo(){

}

function o_action(){
    var output = [];
    output.push("&emsp;&emsp;&emsp;&emsp;[행동 리스트]")
    var temp;
    for(var i = 0; i < actionList.length; i++){
        switch(actionList[i].category){
            case 1:
                output.push(companyList[actionList[i].target].name + " 주식 " + actionList[i].detail + " 주 구매.");
                break;
            case 2:
                output.push(companyList[actionList[i].target].name + " 주식 " + actionList[i].detail + " 주 판매.");
                break;
            case 3:
                output.push("노동");
                break;
        }
    }
    return output.join("<br>");
}

function o_estimateAsset(){
    var temp = money;
    for(var i = 0; i < have.length; i++){
        for(var j = 0; j < companyList.length; j++){
            if(companyList[j].name == have[i].name){
                temp += companyList[j].price * have[i].num;
                break;
            }
        }
    }
    return temp;
}

function inputFlow(){
    if(textArea.value == ""){
    }
    else{
        switch(nowTab){
            case "tabtwoza":
                i_investion();
                break;
            case "tabjak":
                i_operation();
                break;
            case "tabnodon":
                i_work();
                break;
            case "tabjagi":
                i_development();
                break;
        }
    }
    fillRTData();
    textArea.value = "";
}

function i_investion(){
    var output = [];
    if(Number.isNaN(textArea.value)) return;
    switch(tabDepth[1]){
        case 1: //주가정보
            if(textArea.value > 0 && textArea.value <= companyList.length){
                document.getElementById("tabtwoza").innerHTML = o_companyInfo(textArea.value - 1);
                tabDepth[1]++;
                investIndex[0] = textArea.value - 1
            }
            break;
        case 2: //세부 회사 정보
            switch(textArea.value){
                case '1': //구매하기
                    if(!onGoing){
                        alert("턴이 종료되었습니다.");
                        return;
                    }
                    if(hp != maxHP && !isTurnInvest){
                        alert("행동력이 부족합니다.");
                        break;
                    }

                    output.push("<구매할 수량을 입력하여 주십시오. (0을 입력시 처음으로)>");
                    output.push("<br>");
                    output.push((investIndex[0] + 1) + ". " + companyList[investIndex[0]].name + " [ " + companyList[investIndex[0]].category + " ] ");
                    output.push("<br>");
                    output.push("주가 : " + printPriceChange(companyList[investIndex[0]].price, companyList[investIndex[0]].prevPrice));
                    output.push(printHaveAmouont(investIndex[0]));
                    output.push("<br>");
                    output.push("구매가능 수량 : " + Math.floor(money / companyList[investIndex[0]].price));               

                    document.getElementById("tabtwoza").innerHTML = output.join("<br>");
                    tabDepth[1]++;
                    investIndex[2] = 1;
                    break;
                case '2': //판매하기
                    if(!onGoing){
                        alert("턴이 종료되었습니다.");
                        return;
                    }
                    if(hp != maxHP && !isTurnInvest){
                        alert("행동력이 부족합니다.");
                        break;
                    }
                    output.push("<판매할 수량을 입력하여 주십시오. (0을 입력시 처음으로)>");
                    output.push("<br>");
                    output.push((investIndex[0] + 1) + ". " + companyList[investIndex[0]].name + " [ " + companyList[investIndex[0]].category + " ] ");
                    output.push("<br>");
                    output.push("주가 : " + printPriceChange(companyList[investIndex[0]].price, companyList[investIndex[0]].prevPrice));
                    output.push(printHaveAmouont(investIndex[0]));
                    output.push("<br>");            

                    document.getElementById("tabtwoza").innerHTML = output.join("<br>");
                    tabDepth[1]++;
                    investIndex[2] = 2;
                    break;
                case '0': //돌아가기
                    document.getElementById("tabtwoza").innerHTML = o_companyList();
                    tabDepth[1] = 1;
                    break;
            }
            break;
        case 3: //구매, 판매
            if(textArea.value == '0'){
                document.getElementById("tabtwoza").innerHTML = o_companyList();
                tabDepth[1] = 1;
                break;
            }else{
                switch(investIndex[2]){
                    case 1: //구매
                        if(textArea.value > Math.floor(money / companyList[investIndex[0]].price)){
                            alert("구매 가능 수량을 초과하였습니다.");
                            break;
                        }else{
                            money -= companyList[investIndex[0]].price * textArea.value;
                            hp = 0;
                            isTurnInvest = true;
                            actionList.push(new action(1, investIndex[0], textArea.value));     
                            alert("구매 예약 완료되었습니다.");
                            document.getElementById("tabtwoza").innerHTML = o_companyList();
                            tabDepth[1] = 1;
                        }
                        break;
                    case 2: //판매
                        if(textArea.value > have[investIndex[1]].num){
                            alert("판매 가능 수량을 초과하였습니다.");
                            break;
                        }else{
                            hp = 0;
                            isTurnInvest = true;
                            for(var i = 0; i < have.length; i++){
                                if(have[i].name == companyList[investIndex[0]].name){
                                    have[i].num = have[i].num - Number(textArea.value);
                                    break;
                                }
                            }
                            actionList.push(new action(2, investIndex[0], textArea.value));
                            alert("판매 예약 완료되었습니다.");
                            document.getElementById("tabtwoza").innerHTML = o_companyList();
                            tabDepth[1] = 1;
                        }
                        break;
                }
            }
            break;
    }
}

function i_operation(){

}

function i_work(){
    if(!onGoing){
        alert("턴이 종료되었습니다.");
        return;
    }
    if(isNaN(textArea.value)) return;



    switch(Number(textArea.value)){
        case 1:
            var hp_cost = 5;
            if(hp < hp_cost){
                alert("체력이 부족합니다.");
                return;
            }

            alert("노동을 선택하였습니다.");
            actionList.push(new action(3, 0, 1));
            hp -= hp_cost;
            break;
    }
}

function i_development(){

}

btnSubmit.onclick = function(){
    if(onGoing){
        inputFlow();
    }
}

textArea.onkeydown = function(e){

}

document.getElementById("btnSkip").onclick = function(){
    ready();
}

textArea.onkeyup = function(e){
    if(e.keyCode == 13){ //key ENTER
        textArea.value = "";
    }
}

window.onkeydown = function(e){

}

window.onkeydown = function(e){
    if(document.getElementById("textArea") == document.activeElement){
        switch(e.keyCode){
        case 13: //key ENTER
            if(onGoing)
                inputFlow();
            break;
        case 27:
            document.getElementById("textArea").blur();
            break;
        }   
    }else{
        switch(e.keyCode){
        case 27:
            ready();
            break;
        case 13:
            document.getElementById("textArea").focus();
            break;
        case 49:case 50:case 51:case 52:case 53:
        case 97:case 98:case 99:case 100:case 101:
            var tempTab;
            switch(e.keyCode){
                case 49: case 97: tempTab = 'tabevent'; break;
                case 50: case 98: tempTab = 'tabtwoza'; break;
                case 51: case 99: tempTab = 'tabjak'; break;
                case 52: case 100: tempTab = 'tabnodon'; break;
                case 53: case 101: tempTab = 'tabjagi'; break;
            }
            $('ul.tabs li').removeClass('current');
            $('.tab-content').removeClass('current');

            $('#'+tempTab).addClass('current');
            $('#'+tempTab+'1').addClass('current');
            nowTab = tempTab
            break;
        default:
        }

    }
}