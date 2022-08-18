//VARIABLES GLOBALES
//const path = require('./img/imgCardsfront');
let cantCards = 1;//se raran 2 tarjetas por cada opcion
let arrCards = [];
let container = document.getElementById("ctn-main");
let numOrden = 0
let cantClick = 0;
let arrSelected = [];
let arrDiv = [];
let spanScore = document.getElementById("score");
let score = 0;
let spanTime = document.getElementById("time");
let timeInit = 30;//tiempo de los niveles
let spanUsage = document.getElementById("usages");
let usage = 0;
let divGameOver = document.getElementById("game_over");
let repeat = false;
let divLevelComplete = document.getElementById("Level_complete");
let idInterval = 0;
let spanLevel = document.getElementById("level");
let Level = 1;
//cuando el body este listo se ejecuta funcion MAIle
let spanScore2 = document.getElementById("score_c");
let spanTime2 = document.getElementById("time_c");
let spanUsage2 = document.getElementById("usage_c");
let spanScoreTotal = document.getElementById("score_total");
let next = document.getElementById("next");
let retry = document.getElementById("retry");
let divWelcome = document.getElementById("welcome");
let divPlayer = document.getElementById("container-info-player");
let spanStart = document.getElementById("start");

retry.onclick = retryLevel;
next.onclick = nextLevel;
spanStart.onclick = startGame;

divWelcome.style.display = 'flex';
divPlayer.style.display = 'none';
container.style.display = 'none';

document.body.onload = () => {
    console.log('on load;')
}

function startGame(params) {
    divWelcome.style.display = 'none';
    divPlayer.style.display = 'flex';
    container.style.display = 'flex';

    main(1);
}

/***FUNCTIONS PRINCIPALES */
function main(levelMain = 1) {
    console.log('Starting');
    //spanScore.textContent = 1 + 1;
    showWinner(false);
    showGameOver(false);
    initializeVariables();
    calcCardsAndTime();
    createArrCards();
    createCardDOM();
    addEventToCards();
    runTime();
    validateWinOrOver();
}
function retryLevel() {
    Level = 1;
    cantCards = 1;
    main(Level);
}
function nextLevel() {
    // console.log('level');
    Level++
    main(Level);
}

function initializeVariables() {
    arrCards = [];
    numOrden = 0
    cantClick = 0;
    arrSelected = [];
    arrDiv = [];
    score = 0;
    timeInit = 30;//tiempo de los niveles
    usage = 0;
    repeat = false;
    idInterval = 0;
    spanLevel.textContent = Level;

    spanScore.textContent = score;
    spanTime.textContent = timeInit;
    spanUsage.textContent = usage;

    spanScore2.textContent = score;
    spanTime2.textContent = timeInit;
    spanUsage2.textContent = usage;
}
function calcCardsAndTime() {
    cantCards = cantCards + 1;

}

function showWinner(bool) {

    bool ? divLevelComplete.style.display = 'flex'
        : divLevelComplete.style.display = 'none'
    bool ? container.style.display = 'none'
        : container.style.display = 'flex'

    spanScore2.textContent = score;
    spanTime2.textContent = timeInit;
    spanUsage2.textContent = usage;
    spanTime.textContent = timeInit;
    let result = (score * timeInit) - (usage * 10)
    spanScoreTotal.textContent = result

}
function showGameOver(bool) {
    bool ? divGameOver.style.display = 'flex'
        : divGameOver.style.display = 'none'
    bool ? container.style.display = 'none'
        : container.style.display = 'flex'
}
//esta funcionse 
//encarga de verificar a medida que se juega si gana o pierde
function validateWinOrOver() {
    var idIntervalW = setInterval(() => {
        let arrResult = arrCards.filter(e => e.selected == true);
        if (timeInit == 0) {
            //se acabó el tiempo
            showGameOver(true);
        } else {
            if (arrResult.length == arrCards.length) {
                //console.log('WINNER!!!!!')
                clearInterval(idIntervalW);//para parar el proceso del interval
                clearInterval(idIntervalTime);
                showWinner(true);
            }
        }
    }, 900);
}

function runTime() {
    idIntervalTime = setInterval(() => {
        spanTime.textContent = timeInit;
        timeInit--;
        if (timeInit == 0) {
            timeInit = 0;//por el momento lo reinicio
            spanTime.textContent = timeInit;
            clearInterval(idIntervalTime);//para parar el proceso del interval
        }
    }, 1000);
}

//se define dentro del arreglo als cards que ya se marcaron para usar
function checkedCards(arr, bool = true) {
    arr.map((el) => {
        let pos = arrCards.findIndex(card => card.id == el.id);
        arrCards[pos].selected = bool;
    })
}

//funcion que permite voltear las tarjetas QUE no coiciden tiene una espera de seugndos 
//es necesaria que si no no se aprecia el cambio
const flipCardsNoMatch = async (arr) => {
    setTimeout(() =>
        arr.forEach(element => element.classList.toggle('is-flipped'))
        , 800);
    addUsages();//agrego un uso por cada equivocación
}

const disableCardToMatch = async (arr) => {
    setTimeout(() =>
        arr.forEach(element => element.classList.toggle('is-disabled'))
        , 800);
    addScore();

}

function addScore() {
    score = score + 10;
    spanScore.textContent = score;
}

function addUsages() {
    usage++
    spanUsage.textContent = usage;
}

function handleClick(e) {
    //
    if (cantClick < 2) {
        let id = e.path[2].id
        let obj = arrCards.find((c) => c.id == id)
        //console.log(obj);
        //agregue este if ya que//cuando se da vuelta la tarjeta 
        //y se hace click rápido el ob no existe 
        if (obj) {
            if (!obj.selected) {
                cantClick++;
                let divInner = e.path[1];
                divInner.classList.toggle('is-flipped');
                arrSelected.push(obj);
                checkedCards(arrSelected);
                arrDiv.push(divInner);
                if (cantClick === 2) {
                    //esto debería estar en una funcion afuera del bloque??????
                    if (allMatch(arrSelected)) {
                        checkedCards(arrSelected);
                        disableCardToMatch(arrDiv);
                    } else {
                        //console.log('son diferentes')
                        flipCardsNoMatch(arrDiv);
                        checkedCards(arrSelected, false);
                    }
                    arrSelected = [];
                    arrDiv = [];
                    cantClick = 0;
                }
            }
        }

    }

}

const allMatch = (x) => x.every(v => v.img_front === x[0].img_front);


function addEventToCards() {
    arrCards.map((card) => {
        let div = document.getElementById(card.id);
        div.addEventListener('click', handleClick);
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function createArrCards() {
    let cardnum = 0;
    let numImg = 1;
    //esta funcion llenara el arrays de objetos con valores random
    //-crear numero random para el orde
    for (let index = 0; index < cantCards; index++) {
        numImg = numImg == 16 ? 1 : numImg;
        for (let c = 0; c < 2; c++) {
            let numOrden = getRandomInt(1, 100);
            let front = `./img/cardFront${numImg}.JPG`;
            let obCard = {
                id: `card${cardnum}`,
                img_back: './img/cardback.JPG',
                img_front: front,
                selected: false,
                order: numOrden
            }
            arrCards.push(obCard);
            cardnum++;
        }
        numImg++;
    }
    //se ordena de menor a mayor por numero aleatorios
    arrCards.sort(((a, b) => a.order - b.order));
}


function createCardDOM() {

    let htmlSring = '';
    for (let index = 0; index < arrCards.length; index++) {
        let html = `
            <div class="card" id="${arrCards[index].id}">
                <div class="card__inner" id="inner_${arrCards[index].id}">
                    <div class="card__face card__face--front" style="background-image: url('./img/cardBack.JPG')">
                    </div>
                    <div class="card__face card__face--back" style="background-image: url('${arrCards[index].img_front}')">
                        <div class="eye-image">
                        </div>
                    </div>
                </div>
            </div>`
        htmlSring = htmlSring + html;
    }
    container.innerHTML = '';
    container.innerHTML = htmlSring;
}