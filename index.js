//VARIABLES GLOBALES
let cantCards = 6;//se raran 2 tarjetas por cada opcion
let arrCards = [];
let container = document.getElementById("ctn-main");
let numOrden = 0
let cantClick = 0;
let arrSelected = [];
let arrDiv = [];

//cuando el body este listo se ejecuta funcion MAIN
document.body.onload = main();

/***FUNCTIONS PRINCIPALES */
function main() {
    console.log('Starting')
    createArrCards();
    createCardDOM();
    addEventToCards();
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
}


const disableCardToMatch = async (arr) => {
    setTimeout(() =>
        arr.forEach(element => element.classList.toggle('is-disabled'))
        , 800);
}

function handleClick(e) {
    //
    if (cantClick < 2) {
        let id = e.path[2].id
        let obj = arrCards.find((c) => c.id == id)

        if (!obj.selected) {
            cantClick++;
            let divInner = e.path[1];
            divInner.classList.toggle('is-flipped');
            arrSelected.push(obj);
            checkedCards(arrSelected);
            arrDiv.push(divInner);

            if (cantClick === 2) {
                //esto debería estar en una funcion afuera del bloque??????
                if (todoIgual(arrSelected)) {
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

const todoIgual = (x) => x.every(v => v.img_front === x[0].img_front);


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

        numImg = numImg == 7 ? 1 : numImg;

        for (let c = 0; c < 2; c++) {

            let numOrden = getRandomInt(1, 100);
            let front = `/img/cardFront${numImg}.JPG`;
            let obCard = {
                id: `card${cardnum}`,
                img_back: '/img/cardback.JPG',
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
                    <div class="card__face card__face--front" style="background-image: url('/img/cardBack.JPG')">
                    </div>
                    <div class="card__face card__face--back" style="background-image: url('${arrCards[index].img_front}')">
                        <div class="eye-image">
                        </div>
                    </div>
                </div>
            </div>`
        htmlSring = htmlSring + html;
    }
    container.innerHTML = htmlSring;
}