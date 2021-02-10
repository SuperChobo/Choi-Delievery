var companyList = [];   //save list of companies
var encounterList = []; //save encounters 
var have = [];          //save my stocks
var userList = [];      //save user Index in server
var myIndex;            //save my Index in server 
var turnCount = 4;      //now turn
var onGoing = false;    //Is my turn ongoing

var nextTurn            //function to next turn

var loading_companyList = false;
var loading_encounterList = false;
var loading_cateList = false;
var event_loading       //for loading event;

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
    this.category = category;
    this.target = target;
    this.detail = detail;
}

var socket = io();