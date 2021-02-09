var companyList = [];   //save list of companies
var eventList = [];     //save events 
var have = [];          //save my stocks
var userList = [];      //save user Index in server
var myIndex;            //save my Index in server

function stock(){
    this.name;
    this.num;           //num of stocks
    this.totalPrice;   
}

var socket = io();