function o_companyList(){
    var output = [];
    var temp;

    output.push("회사를 선택하시오<br>");
    console.log(companyList);
    for(var i = 0; i < companyList.length; i++){
        temp = (i + 1) + ". " + companyList[i].name + "&emsp;&emsp;&emsp;&emsp;&emsp;" + printPriceChange(companyList[i].price, companyList[i].prevPrice);
        output.push(temp);
        console.log(temp);
    }

    return output.join("<br>");
}

function o_companyInfo(index){
    var output = [];

    output.push((index + 1) + ". " + companyList[index].name + " [ " + companyList[index].category + " ] ");
    output.push("- 가격 : " + printPriceChange(companyList[index].price, companyList[index].prevPrice));
    output.push("<br>");
    output.push("- 건전성 : " + companyList[index].soundness);
    output.push("- 미래지향성 : " + companyList[index].vision);
    output.push("<br>");
    output.push("- 신뢰성 : " + companyList[index].tendency);
    output.push("- 변동성 : " + companyList[index].variablilty);

    output.push("<br>");
    output.push("<br>");
    output.push("행동을 입력하시오.");
    output.push("1. 구매하기");
    output.push("2. 판매하기")
    output.push("3. 리스트로 돌아가기");

    return output.join("<br>");
}

function printPriceChange(price, prevPrice){
    var change;

    if(price > prevPrice){
        change = "↑ ";
    }else if(price == prevPrice){
        change = "- ";
    }else{
        chagne = "↓ ";
    }

    return price + "&emsp;" + change + (price - prevPrice);
}

function o_investion(){

}

function o_work(){

}

function o_operation(){

}

function o_detailInfo(){

}

function o_briefInfo(){

}