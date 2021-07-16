/*
    "respuestaRelacionar": {
        "izq": [
            {
                "enunciado": "bbbb"
            }
        ],
        "der": [
            {
                "enunciado": "aaaa"
            }
        ]
    }
*/

let canvas
let __index;
let pizarra;

let rrand;
let rback;

window.onresize = function () {
    canvas = document.getElementById("lines");
    
    if (canvas && __index !== undefined) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        canvas.height = Number.parseInt(document.getElementsByClassName("el")[0].clientHeight) * data_respuestas[__index].der.length;

        normalizeLines(data_preguntas[__index].respuestas.rel);
    }
}

function populateRespuestaRelacionar(index) {
    __index = index;

    pizarra = document.getElementById("pizarra-wide");
    canvas = document.getElementById("lines");

    var img = new Image;

    img.onload = function () {
        canvas.getContext('2d').strokeStyle = canvas.getContext('2d').createPattern(img, 'repeat');
    };
    img.src = "/?type=res&file=tiza.png&dir=textura/";

    let listElement = document.createElement("div");

    listElement.setAttribute("class", "el");

    let auxElement;
    let aux;

    document.getElementsByClassName("col-left")[0].innerHTML = "";
    document.getElementsByClassName("col-right")[0].innerHTML = "";

    rrand = shake(data_respuestas[index].der);

    for(let i = 0; i < data_preguntas[index].respuestas.rel.length; i++){
        data_preguntas[index].respuestas.rel[i].d = backToRand(data_preguntas[index].respuestas.rel[i].d);
    }

    for (let i = 0; i < data_respuestas[index].izq.length; i++) {
        aux = listElement.cloneNode();

        //left
        auxElement = document.createElement("div");
        auxElement.setAttribute("class", "rel");
        auxElement.innerText = data_respuestas[index].izq[i].enunciado;
        aux.appendChild(auxElement);

        auxElement = document.createElement("div");
        auxElement.setAttribute("class", "dot");
        aux.appendChild(auxElement);

        document.getElementsByClassName("col-left")[0].appendChild(aux);

        aux = listElement.cloneNode();
        //right
        auxElement = document.createElement("div");
        auxElement.setAttribute("class", "dot");
        aux.appendChild(auxElement);

        auxElement = document.createElement("div");
        auxElement.setAttribute("class", "rel");
        auxElement.innerText = rrand[i].enunciado;
        aux.appendChild(auxElement);

        document.getElementsByClassName("col-right")[0].appendChild(aux);
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.height = Number.parseInt(document.getElementsByClassName("el")[0].clientHeight) * data_respuestas[index].der.length;

    normalizeLines(data_preguntas[__index].respuestas.rel);

    setEventListeners();

}

function saveRespuestaRelacionar(index) {
    for(let i = 0; i < data_preguntas[index].respuestas.rel.length; i++){
        data_preguntas[index].respuestas.rel[i].d = randToBack(data_preguntas[index].respuestas.rel[i].d);
    }

    data_preguntas[index].respuestas.izq = data_respuestas[index].izq;
    data_preguntas[index].respuestas.der = data_respuestas[index].der;
}

//numeros magicos porque el touchmove hace cosas raras en firefox
const vayaX = -90;
const vayaY = -240;

function setEventListeners() {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    let context = canvas.getContext('2d');

    let left;
    let right;

    //document.getElementById("a").addEventListener("mousedown")
    canvas.addEventListener("mousedown", e => {
        x = e.offsetX;
        y = e.offsetY;

        let op = getLeftSelected(x, y);

        if (op !== null) {
            left = op;
            isDrawing = true;
        }

        //console.log(data_preguntas[__index].respuestas.rel);
    });

    canvas.addEventListener("touchstart", e => {
        console.log(e);
        x = e.targetTouches[0].pageX + (e.layerX ? e.layerX : - canvas.getBoundingClientRect().left);
        y = e.targetTouches[0].pageY + (e.layerY ? e.layerY : - canvas.getBoundingClientRect().top);

        let op = getLeftSelected(x, y);
        
        if (op !== null) {
            left = op;
            isDrawing = true;
        }

        //console.log(data_preguntas[__index].respuestas.rel);
    });

    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    canvas.addEventListener('touchmove', e => {

        if (isDrawing === true) {
            drawLine(
                context,
                x,
                y,
                e.targetTouches[0].clientX + (e.layerX ? e.layerX + vayaX : - canvas.getBoundingClientRect().left),
                e.targetTouches[0].clientY + (e.layerY ? e.layerY + vayaY + pizarra.scrollTop : - canvas.getBoundingClientRect().top)
            );
            x = e.targetTouches[0].clientX + (e.layerX ? e.layerX + vayaX : - canvas.getBoundingClientRect().left);
            y = e.targetTouches[0].clientY + (e.layerY ? e.layerY + vayaY + pizarra.scrollTop : - canvas.getBoundingClientRect().top);
        }
    });

    canvas.addEventListener("mouseup", e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);

            let op = getRightSelected(x, y);
            let erase = getLeftSelected(x, y);

            x = 0;
            y = 0;

            isDrawing = false;

            if(erase === left && erase !== null){
                eraseLines(left, data_preguntas[__index].respuestas.rel);
            }

            if (op !== null) {
                right = op;
                
                if (!relExists(data_preguntas[__index].respuestas.rel, { i: left, d: right }))
                    data_preguntas[__index].respuestas.rel.push({ i: left, d: right });
                
            }

            left = -1;
            right = -1;

            clearCanvas(canvas);

            normalizeLines(data_preguntas[__index].respuestas.rel);

            /////////////////// TODO: hacer que se generen lineas al acabar de redimensionar, guardar opciones relacionadas y regenerar lineas
        }
    });


    canvas.addEventListener("touchend", e => {

        if (isDrawing === true) {
            drawLine(context, x, y, e.changedTouches[0].pageX + (e.layerX ? e.layerX : - canvas.getBoundingClientRect().left), e.changedTouches[0].pageY + (e.layerY ? e.layerY : - canvas.getBoundingClientRect().top));

            let op = getRightSelected(x, y);
            let erase = getLeftSelected(x, y);

            x = 0;
            y = 0;

            isDrawing = false;

            if(erase === left && erase !== null){
                eraseLines(left, data_preguntas[__index].respuestas.rel);
            }

            if (op !== null) {
                right = op;
                if (!relExists(data_preguntas[__index].respuestas.rel, { i: left, d: right }))
                    data_preguntas[__index].respuestas.rel.push({ i: left, d: right });
            }

            left = -1;
            right = -1;

            clearCanvas(canvas);

            normalizeLines(data_preguntas[__index].respuestas.rel);

            /////////////////// TODO: hacer que se generen lineas al acabar de redimensionar, guardar opciones relacionadas y regenerar lineas
        }
    });


}

function getLeftSelected(x, y) {
    auxg = document.getElementsByClassName("col-left")[0];
    auxp = auxg.getElementsByClassName("el")[0];
    aux = auxg.getElementsByClassName("dot")[0];

    xi = aux.offsetLeft + auxp.offsetLeft + auxg.offsetLeft + aux.clientWidth;
    yi = (aux.offsetTop + auxg.offsetTop + aux.clientHeight / 2) * 2;

    return (x < xi) ? Number.parseInt(y / yi) : null;
}

function getRightSelected(x, y) {
    auxg = document.getElementsByClassName("col-right")[0];
    auxp = auxg.getElementsByClassName("el")[0];
    aux = auxg.getElementsByClassName("dot")[0];

    xi = aux.offsetLeft + auxp.offsetLeft + auxg.offsetLeft - aux.clientWidth;
    yi = (aux.offsetTop + auxg.offsetTop + aux.clientHeight / 2) * 2;

    return (x > xi) ? Number.parseInt(y / yi) : null;
}

function relExists(arr, rel) {
    let i = 0;
    let exists = false;

    while (!exists && i < arr.length) {
        exists = (arr[i].i == rel.i && arr[i].d == rel.d);
        i++;
    }

    return exists;
}

function eraseLines(dot, arr){
    for(let i = 0; i < arr.length ; i++){
        if(arr[i].i == dot){
            arr.splice(i, 1);
            i--;
        }
    }
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    //context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function clearCanvas(canvas) {
    let c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);
}

function normalizeLines(rel) {
    let xi;
    let yi;
    let xj;
    let yj;

    let aux;
    let auxp;
    let auxg;

    let img = new Image;

    img.onload = function () {
        canvas.getContext('2d').strokeStyle = canvas.getContext('2d').createPattern(img, 'repeat');
        for (let i = 0; i < rel.length; i++) {
            auxg = document.getElementsByClassName("col-left")[0];
            auxp = auxg.getElementsByClassName("el")[rel[i].i];
            aux = auxg.getElementsByClassName("dot")[rel[i].i];

            xi = aux.offsetLeft + auxp.offsetLeft + auxg.offsetLeft + aux.clientWidth / 2;
            yi = aux.offsetTop + auxg.offsetTop + aux.clientHeight / 2;


            auxg = document.getElementsByClassName("col-right")[0];
            auxp = auxg.getElementsByClassName("el")[rel[i].d];
            aux = auxg.getElementsByClassName("dot")[rel[i].d];

            xj = aux.offsetLeft + auxp.offsetLeft + auxg.offsetLeft + aux.clientWidth / 2;
            yj = aux.offsetTop + auxg.offsetTop + aux.clientHeight / 2;


            drawLine(canvas.getContext("2d"), xi, yi, xj, yj);
        }
    };
    img.src = "/?type=res&file=tiza.png&dir=textura/";

}

function shake(arr) {
    let aux = [];
    let npos;

    rback = [];

    for(let i = 0; i < arr.length; i++){
        do {
            npos = Number.parseInt(Math.random() * arr.length);
        } while(isInArray(rback, npos));

        aux[i] = arr[npos];
        rback[i] = npos;
    }

    return aux;
}

function isInArray(arr, npos) {
    let esta = false;
    let i = 0;

    while(i < arr.length && !esta){
        esta = arr[i] === npos;
        i++;
    }

    return esta;
}

function randToBack(num) {
    return rback[num];
}

function backToRand(num) {
    let i = 0;
    let found = false;

    while(!found && i < rback.length) {
        if(num === rback[i]) {
            found = true;
        } else {
            i++;
        }
    }

    return i;
}