var companyList = [];   //save list of companies
var encounterList = []; //save encounters 
var have = [];          //save my stocks
var userList = [];      //save user Index in server
var myIndex;            //save my Index in server 
var turnCount = 4;      //now turn
var onGoing = false;    //Is my turn ongoing
var actionList = [];
var money;

var nextTurn            //function to next turn
var isTurnInvest = false;    //can invest or not
var hp = 0;
var maxHP;

var loading_companyList = false;
var loading_encounterList = false;
var loading_cateList = false;
var loading_info = false;
var event_loading       //for loading event;

var btnSubmit = document.getElementById("btnSubmit");
var textArea = document.getElementById("textArea")

var nowTab = tabevent; //tabevent, tabtwoza, tabjak, tabnodon, tabjagi
var tabDepth = [1, 1, 1, 1, 1];
var investIndex = [0, 0, 0];  //[0] selected company in list , [1] selected stock in have, [2] 1. buy 2. sell

function stock(){
    this.name;
    this.num;           //num of stocks
    this.totalPrice;   
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

function action(category, target, detail){
    this.category = category;   //1. buy, 2. sell, 3. work, 4. operation
    this.target = target;
    this.detail = detail;
}

var socket = io();