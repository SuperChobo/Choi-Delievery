function o_companyList(){
    var output = [];
    var temp;

    output.push("<회사번호를 입력하시오><br>");
    for(var i = 0; i < companyList.length; i++){
        temp = (i + 1) + ". " + companyList[i].name + "&emsp;&emsp;&emsp;&emsp;&emsp;" + "주가 : " + printPriceChange(companyList[i].price, companyList[i].prevPrice);
        output.push(temp);
    }

    return output.join("<br>");
}

function o_companyInfo(index){
    var output = [];

    output.push((index + 1) + ". " + companyList[index].name + " [ " + companyList[index].category + " ] "+ "&emsp;&emsp;&emsp;&emsp;&emsp;" + "주가 : " + printPriceChange(companyList[index].price, companyList[index].prevPrice));
    output.push("<br>");
    output.push("- 건전성 : " + companyList[index].soundness);
    output.push("- 미래지향성 : " + companyList[index].vision);
    output.push("- 신뢰성 : " + companyList[index].tendency);
    output.push("- 변동성 : " + companyList[index].variablilty);

    output.push("<br>");
    output.push("<원하는 행동을 선택하시오.>");
    output.push("1. 구매하기");
    output.push("2. 판매하기")
    output.push("0. 리스트로 돌아가기");

    return output.join("<br>");
}

function printPriceChange(price, prevPrice){
    var change;
    var temp = price + "&emsp;"

    if(price > prevPrice){
        change = "↑ ";
    }else if(price == prevPrice){
        return temp + "<sub>" + "- " + "</sub>";
    }else{
        chagne = "↓ ";
    }

    return temp + "<sub>" + change + (price - prevPrice) + "</sub>";
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

    for(var i = 0; i < encounterList.length; i++){
        if(turn < encounterList[i].turn)            continue;
        else if(turn - encounterList[i].turn == 0)  temp = "[방금] ";
        else                                        temp = "[" + (turn - encounterList[i].turn) + "턴 전] "
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

function o_estimateAsset(){

}