//Previous version 2017 Jesús Cirino Rosales Palestino
//This is a example of building bot for didactic purposes

var MIN  = 0.00000001, PATTERN = 2, DELAY= 1300,
    L    = 0, H = 1, R = -1, LLO = 4750, LHI = 5250;
var _bal = document.getElementById('balance2');
var _bet = document.getElementById('double_your_btc_stake');
var _l   = document.getElementById('double_your_btc_bet_lo_button');
var _h   = document.getElementById('double_your_btc_bet_hi_button');
var _lastRoll = 
       document.getElementsByClassName(
      "large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell");

// Reading Last Roll
function getBal (){
    return parseFloat(_bal.innerText);
}
function getLastRoll(){
    return Number(_lastRoll[6].innerText);
}

function sleep(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, DELAY);
  });
}

// Auto-bet

async function bet(iter,satos,types){
    _bet.value = (satos*MIN).toFixed(8);
    for (var i = 0; i<=iter;i++){
        var x = await sleep(0);
        if(types===L)
            _l.click();
        else if(types===H)
            _h.click();
    }
}

// Repeat Pattern

function existRep(array,n){
    var r={}; r.len=0; r.type=R;
    var c = 1, flag = H, length = array.length;
    if(array.length < n)
        return r;
    for(var i=length - 1; i>=length - n;i--)
    {
            if(array[i] > LLO && array[i] < LHI)
            return r;
        else if(array[i]>LHI && array[i-1]>LHI)
            c++;
        else if(array[i]<LLO && array[i-1]<LLO)
            c++;
        else
            i=0;
    }
    r.len  = c;
    r.type = (array[length - 1]>LHI)? H :(array[length - 1]<LLO)? L: R;
    return r;
}

// Auto-bet with pattern

function unicBet(satos,types){
    _bet.value = (satos*MIN).toFixed(8);
        if(types===L)
    _l.click();
    else if(types===H)
    _h.click();
    else
        if(Math.random()>.49)
            _h.click() ;
        else 
            _l.click();
}

function getMajor(array){
    var rHi = array.filter(function(i){
    return i>5000;    
});
    return (rHi.length/array.length > 0.5)? H:L;
}

// Init bot
var EVENTS=[];
async function jicer(n, bet=3,patt=PATTERN, objetive=30, limit=50){
    var balIni  = getBal(), lastBet = H, flag = false, myBet = bet;
    PATTERN     = patt;
    for(var i=0; i<PATTERN; i++){
        unicBet(1, R);
        var x = await sleep(0);
        EVENTS.push(getLastRoll());
    }
    var pattern = existRep(EVENTS,PATTERN);
    for(var i=0; i<(n-patt); i++){
        if(pattern.len >= PATTERN){
            if (pattern.type === H){
                unicBet(myBet, L);
                lastBet = L;
                flag = true;
            }
            if (pattern.type === L){
                unicBet(myBet, H);
                lastBet = H;
                flag = true;
            }
        }
        else if (flag && (pattern.type === R)){
            unicBet(myBet, getMajor(EVENTS));
                flag = false;
            myBet  = bet;
        }
        else{
            unicBet(1, getMajor(EVENTS));
        }
        var x = await sleep(0);
        EVENTS.push(getLastRoll());
        pattern = existRep(EVENTS,PATTERN);
        if (flag && (lastBet === pattern.type)){
                flag = false;
            myBet  = bet;
        }
        else if (flag){
                myBet = myBet * 2;
            if (myBet*MIN > getBal()*limit*.01)
                myBet = bet;
        }
        if((getBal() - balIni) >= objetive * MIN)
            i = n;
    }
}
//end bot
