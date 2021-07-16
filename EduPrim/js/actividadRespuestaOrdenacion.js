function populateRespuestaOrdenacion(index) {
    document.getElementById("opciones").innerHTML = "";
    document.getElementById("pizzarra").innerHTML = ("");

    console.log(data_respuestas)
    let respuestas = document.getElementById("opciones");
    let ans = (data_respuestas[index]);
    console.log(ans)

    document.getElementById("tipo-pregunta").innerText = "Ordenacion";

    let cadena = []; //(data_preguntas[index].enunciado).split(" ");

    for(let i = 0; i < data_respuestas[index].length; i++){
        cadena[i] = data_respuestas[index][i].resultado;
    }

    console.log(cadena);
    
    
    let enunciado = document.createElement("span");
    enunciado.innerText = data_preguntas[index].enunciado;
    document.getElementById("pizzarra").appendChild(enunciado);
    document.getElementById("pizzarra").appendChild(document.createElement("br"));

    generarHuecosPizzarra(cadena, index, ans)
    desordenar(cadena, index, ans);
    anadirEventListenerOrdenacionMobile();
    anadirEventListenerOrdenacion();


}

function generarHuecosPizzarra(cadena, index, ans) {
   console.log(cadena)
   console.log(ans)

   //cadena.forEach(element => {
       for(let i = 0; i <cadena.length;i++){
       let span = document.createElement("span");
       span.setAttribute("class","vacio");
        //console.log(element);
       if(data_preguntas[index].respuestas[0].resultado == ""){
           console.log("ENTRA")
        span.innerText = "?";
       }
       else{
           span.innerText = data_preguntas[index].respuestas[i].resultado;
       }
       document.getElementById("pizzarra").appendChild(span);
       document.getElementById("pizzarra").appendChild(document.createElement("br"));
    }
  // });
}


function desordenar(cadena, index, ans) {

    let random = cadena.sort(function () {
        return Math.random() - 0.5
    });
    console.log(random);
    let txt = random.toString();
    console.log(txt.replace())

    // document.getElementById("opciones").innerText = random.join(" ")
    mostrarOpcionesDesordenadas(random, index);
}

function mostrarOpcionesDesordenadas(cadena, index) {
    let opciones = data_respuestas[index];
    console.log(opciones);

    cadena.forEach(element => {
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.innerText = element
        div.setAttribute("class", "opcionOrd");
        div.setAttribute("draggable", "true");


        div.appendChild(span)
        document.getElementById("opciones").appendChild(div);
    });
}


/*------ORDENADOR------*/
function anadirEventListenerOrdenacion(){
   let listado = document.getElementsByClassName("opcionOrd");
   let hueco = document.getElementsByClassName("vacio");

   for(let i = 0; i < listado.length; i++){
        listado[i].addEventListener("dragstart",drag);
   }

   for(let i = 0; i < hueco.length;i++){
       hueco[i].addEventListener("dragover",allowDrop);
       hueco[i].addEventListener("drop",drop);

   }
}

/*------TABLET------*/
function anadirEventListenerOrdenacionMobile(){
    let listado = document.getElementsByClassName("opcionOrd");
    let hueco = document.getElementsByClassName("vacio");
 
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
        hueco[j].addEventListener("touchend", dropM);

    }
 }

 function saveRespuestaOrdenacion(index){
    let vacio = document.getElementsByClassName("vacio");
    for(let i = 0; i < vacio.length;i++){
        if(!vacio.innerText == "" ||vacio.innerText == undefined){
            data_preguntas[index].respuestas[i] = { "resultado": vacio[i].textContent };
        }
    }
}