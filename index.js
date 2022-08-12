//VARIABLES GLOBALES
let cantCards = 8;//se raran 2 tarjetas por cada opcion
let arrCards = [];
let container = document.getElementById("ctn-main");
let numOrden = 0
let cantClick = 0;
let arrSelected = [];

//cuando el body este listo se ejecuta funcion MAIN
document.body.onload = main();

/***FUNCTIONS */
function main() {
    console.log('Starting')
    createArrCards();
    createCardDOM();
    addEventToCards();
}

function handleClick(e) {
    //
    if (cantClick < 2) {
        cantClick++;

        let id = e.path[2].id
        let obj = arrCards.find((c) => c.id = id)
        let divInner = e.path[1];
        divInner.classList.toggle('is-flipped');
        arrSelected.push(obj);

        if (cantClick === 2) {
            console.log('entra?');

            console.log(arrSelected);
            //console.log(validate);
            cantClick = 0;
        }

    }

}

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
        numImg = numImg == 4 ? 1 : numImg;
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
                    </div>
                </div>
            </div>`
        htmlSring = htmlSring + html;
    }
    container.innerHTML = htmlSring;
}