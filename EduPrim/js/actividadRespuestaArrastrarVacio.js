var contenido = null;

function populateRespuestaArrastrarVacio(index) {
    console.log(data_respuestas)
    let respuestas = document.getElementById("opciones")
    document.getElementById("pizzarra").innerHTML="";
    document.getElementById("opciones").innerHTML ="";
    document.getElementById("pizzarra").innerText = data_preguntas[index].enunciado;

    let cadena = data_preguntas[index].enunciado.split(" ");

    console.log(cadena)

    document.getElementById("tipo-pregunta").innerText = "Arrastrar al vacio";
    respuestas.innerHTML = "";

    for (let i = 0; i < data_respuestas[index].opciones.length; i++) {
        if(data_respuestas[index].opciones.length > data_preguntas[index].respuestas.opciones.length){
        console.log("ENTRA")

            data_preguntas[index].respuestas.opciones[i]={"opcion":""};
        }
        mostrarOpciones(index, i);
        // COMPROBANTE DE RELACIÓN OPCION Y TEXTO
        for (let j = 0; j < cadena.length; j++) {
            if(cadena[j] == "#"){
                console.log(data_preguntas[index].respuestas.opciones[i].opcion)
                //SI AL HABER VARIOS RESULTADOS, SOLO SE VE UNO CERRADO POSIBLEMENTE SEA POR EL 0
                console.log("valor #--i" + cadena[j]+"--"+ i)
                if (data_preguntas[index].respuestas.opciones[i].opcion == "") {
                    cadena[j] = '<span id="' + i + '" class="vacio">?</span>';
                } else {
                    
                    cadena[j] = '<span id="' + i + '" class="vacio">' + data_preguntas[index].respuestas.opciones[i].opcion + '</span>'
                }
                document.getElementById("pizzarra").innerHTML = "";
                
                document.getElementById("pizzarra").innerHTML = cadena.join(" ")
                break;
            }
        }

        console.log("--------------------------");
    }

    anadirEventListenerMobile(index)
    anadirEventListener(index)
}


function mostrarOpciones(index, i) {
    let opciones = data_respuestas[index].opciones[i];
console.log("I: "+i);
console.log(opciones.opcion)
    let div = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = opciones.opcion
    div.setAttribute("class", "opcionEs");
    div.setAttribute("draggable", "true");

    //  div.setAttribute("draggable","true");
    // for(let i = 0; i < opciones.length; i++){
    //div.setAttribute("id",i);
    //  }    


    div.appendChild(span)
    document.getElementById("opciones").appendChild(div);

}



function anadirEventListener(index) {
    let listado = document.getElementsByClassName("opcionEs");
    let hueco = document.getElementsByClassName("vacio");
    console.log(hueco)
    for (let i = 0; i < listado.length; i++) {
        console.log(listado[i]);
        listado[i].addEventListener("dragstart", drag);
    }
    for (let j = 0; j < hueco.length; j++) {
        console.log(hueco[j]);
        hueco[j].addEventListener("dragover", allowDrop);
        hueco[j].addEventListener("drop", drop);

    }

}

 // ORDENADOR
function allowDrop(ev) {
  //  console.log("ESTA ENCIMA")
    console.log(contenido)
    ev.preventDefault();
}

function drag(ev) {
 //   console.log("LO COGE");
    ev.dataTransfer.setData("text/plain", ev.target.innerText);
    contenido = ev.target.innerHTML
    console.log(ev)
}

function drop(ev) {
//    console.log("LO DEJA CAER")
    ev.preventDefault();
    let texto = ev.dataTransfer.getData("text/plain");
    console.log(texto)

    ev.target.textContent = texto;
    // ev.target.appendChild(document.getElementById(texto));



}



 //TABLET
function anadirEventListenerMobile(index) {
    let listado = document.getElementsByClassName("opcionEs");
    let hueco = document.getElementsByClassName("vacio");
    console.log(hueco)

    // document.getElementById("vista").addEventListener("mouseup",dropM);
    document.getElementById("vista").addEventListener("touchend", dropM);


    for (let i = 0; i < listado.length; i++) {
        console.log(listado[i]);
        // listado[i].addEventListener("mousedown", pickup);
        listado[i].addEventListener("touchmove", pickup, {
            passive: true
        });

        //listado[i].addEventListener("mousemove",move);
        listado[i].addEventListener("touchmove", move, {
            passive: true
        });

    }
    for (let j = 0; j < hueco.length; j++) {
        console.log(hueco[j]);
        //hueco[j].addEventListener("mouseup",dropM);
        hueco[j].addEventListener("touchend", dropM);

    }
} 

function pickup(event) {
    moving = event.currentTarget;
    moving.style.height = moving.clientHeight;
    moving.style.width = moving.clientWidth;
    moving.style.zIndex = '-10';
    moving.style.position = "relative"
    moving.classList.add("mark-item");
}

function move(event) {
    if (contenido) {
        if (event.clientX) {
            //Mouse
            console.log("RATON");
           contenido.style.left = event.clientX - contenido.clientWidth / 2
           contenido.style.top = event.clientY - contenido.clientHeight / 2
        } else {
            console.log("TOUCH");
            contenido.style.left = event.changedTouches[0].clientX - contenido.clientWidth/2;
            contenido.style.top = event.changedTouches[0].clientY - contenido.clientHeight/2; 
        }
    }
}

function dropM(event) {

    console.log("lo suelta");
    if (moving) {
        console.log(event.currentTarget.tagName)
        if (event.currentTarget.tagName !== 'HTML') {
            console.log(event.currentTarget.className)
            let target = null;
            if (event.clientX) {
                target = document.elementFromPoint(event.clientX, event.clientY);
            } else {
                target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            }
            console.log(target);
  
            if(target.tagName == "SPAN") target.innerText = moving.innerText;
            
        }

        // Resent elemento 
        moving.style.left = '';
        moving.style.top = '';
        moving.style.height = '';
        moving.style.width = '';
        moving.style.position = '';
        moving.style.zIndex = '';

        moving = null;
    }
}

function saveRespuestaArrastrarVacio(index) {
    let vacio = document.getElementsByClassName("vacio");
    for (let i = 0; i < vacio.length; i++) {
        if (!vacio.innerText == "" || vacio.innerText == undefined) {
            //SI DA ERROR EL GUARDARLO, POSIBLEMENTE SEA EL textContent
           // data_preguntas[index].respuestas[i] = vacio[i].textContent;
           console.log(i);
            data_preguntas[index].respuestas.opciones[i].opcion = document.getElementById(i).innerText;
            data_preguntas[index].respuestas.rel = document.getElementById("pizzarra").textContent.trim();

        }
    }
}