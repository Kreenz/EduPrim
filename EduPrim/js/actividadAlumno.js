let num_pregunta;
let id_actividad;
let id_alumno;

let interval_tiempo;

window.onload = function () {
    tryPopulating();

    postData({
        type: "get",
        data: {
            "doing_activity": true
        }
    }, "/session").then((data) => {
        id_actividad = data.value;

        postData(
            {
                type: "search",
                query: {
                    tab: ["ACTIVIDAD"],
                    col: ["nombre_actividad"],
                    //TODO -+-+-+-+-+-+-+-+-+-+-+-+ id_actividad -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+    TODO
                    condition_and: [{ "id_actividad": id_actividad }]
                }
            }
        ).then((data) => {
            document.getElementById("actividad").innerText = data[0].nombre_actividad;
        });


        postData({
            id_usuario: true
        }, "/current_user").then((data) => {
            id_alumno = data.data.id_usuario;
            
            postData(
                {
                type: "alumno",
                id: "espera"
            },
            "htmlPregunta"
            ).then((data) => {
                document.getElementById("vista").innerHTML = data.plantilla;
                tryPopulatingElement(document.getElementById("pop-esperando"));
                //TODO -+-+-+-+ id_alumno, id_actividad -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+    TODO
                console.log(id_alumno);
                accederActividad(id_alumno, id_actividad, () => {
                    num_pregunta = 0;
                    viewPregunta(num_pregunta);
                });
            });
        })

    });

    document.getElementById("previous").addEventListener("click", function () {
        if (num_pregunta > 0)
            clearInterval(interval_tiempo);

        savePreguntaClient(data_preguntas[num_pregunta].tipo, num_pregunta);
        savePregunta(num_pregunta);

        if (num_pregunta > 0){
            num_pregunta--;   
        }
        viewPregunta(num_pregunta);
    });

    document.getElementById("next").addEventListener("click", function () {
        if (num_pregunta < data_preguntas.length - 1)
            clearInterval(interval_tiempo);

        savePreguntaClient(data_preguntas[num_pregunta].tipo, num_pregunta);
        savePregunta(num_pregunta);
        
        if (num_pregunta < data_preguntas.length - 1){
            num_pregunta++;    
        }
        viewPregunta(num_pregunta);
    });

    document.getElementById("end").addEventListener("click", function () {
        savePreguntaClient(data_preguntas[num_pregunta].tipo, num_pregunta);
        savePregunta(num_pregunta);

        document.getElementById("modal").classList.add("visible");
    });


    document.getElementById("m-cancelar").addEventListener("click", function () {
        document.getElementById("modal").classList.remove("visible");
    });

    document.getElementById("m-aceptar").addEventListener("click", function () {
        clearInterval(interval_tiempo);
        postData({
            type: "set",
            data: {
                "doing_activity": "no"
            }
        }, "/session").then((data) => {
            window.location.href = "/";
        });
    });

}

function viewPregunta(index) {
    postData(
        {
            type: "alumno",
            id: data_preguntas[index].tipo
        },
        "htmlPregunta"
    ).then((data) => {
        populatepregunta(data_preguntas[index].tipo, index, data.plantilla);
    });
}

function populatepregunta(type, index, plantilla) {
    if (!checkPregRespEqualsInit()) {
        let inter = setInterval(function () {
            if (checkPregRespEqualsInit()) {
                clearInterval(inter);
                preparePregunta(type, index, plantilla);
            }
        },1000);
    } else {
        preparePregunta(type, index, plantilla);
    }

}

function preparePregunta(type, index, plantilla) {
    document.getElementById("vista").innerHTML = plantilla;
    let n = document.getElementById("tiempo");

    if(data_preguntas[index].tiempo < 0){
        document.getElementById("bloq-window").classList.add("visible");
        n.innerText = "0:00";
    } else {
        document.getElementById("bloq-window").classList.remove("visible");
        n.innerText = secondsToClock(data_preguntas[index].tiempo);
    }

    populateSwitch(type, index);

    if(interval_tiempo){
        clearInterval(interval_tiempo);
    }
    
    interval_tiempo = setInterval(() => {
        data_preguntas[index].tiempo--;
    
        if( data_preguntas[index].tiempo < 0){
            clearInterval(interval_tiempo);
            
            document.getElementById("bloq-window").classList.add("visible");
            
            n.innerText = "0:00";
        } else
        n.innerText = secondsToClock(data_preguntas[index].tiempo);
    }, 1000);
}

function populateSwitch(type, index) {

    switch (type) {
        case 'respuestaCorta':
            populateRespuestaCorta(index);
            break;
        case 'respuestaEscoger':
            populateRespuestaEscoger(index);
            break;
        case 'respuestaMultiopcion':
            populateRespuestaMultiopcion(index);
            break;
        case 'respuestaRelacionar':
            populateRespuestaRelacionar(index);
            break;
        case 'respuestaArrastrarVacio':
            populateRespuestaArrastrarVacio(index);
            break;
        case 'respuestasMapaConceptual':
            populateRespuestaMapaConceptual(index);
            break;
        case 'respuestaOperacionesMatematicas':
            populateRespuestaOperacionesMatematicas(index);
            break;
        case 'respuestaOrdenacion':
            populateRespuestaOrdenacion(index);
            break;
    }
}

function savePreguntaClient(type, index) {
    switch (type) {
        case 'respuestaCorta':
            saveRespuestaCorta(index);
            break;
        case 'respuestaEscoger':
            saveRespuestaEscoger(index);
            break;
        case 'respuestaMultiopcion':
            saveRespuestaMultiopcion(index);
            break;
        case 'respuestaRelacionar':
            saveRespuestaRelacionar(index);
            break;
        case 'respuestaArrastrarVacio':
            saveRespuestaArrastrarVacio(index);
            break;
        case 'respuestasMapaConceptual':
            saveRespuestaMapaConceptual(index);
            break;
        case 'respuestaOperacionesMatematicas':
            saveRespuestaOperacionesMatematicas(index);
            break;
        case 'respuestaOrdenacion':
            saveRespuestaOrdenacion(index);
            break;
    }
}

function secondsToClock(secs){
    let min = Number.parseInt(secs/60);
    let sec = secs%60;

    return min + ":" + (sec < 10 ? "0"+sec : sec);
}

function comprobarValor(index, increment,seleccionado) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    let span2 = document.createElement("span");
    span2.setAttribute("class", "pOpcion");

    div.setAttribute("class", "opcionEs");
    div.setAttribute("id", "o-" + increment);

    if (document.getElementById("tipo-pregunta").innerText == "Respuesta Escoger") {
        span2.innerText = increment + 1;
        span.innerText = data_respuestas[index][increment].enunciado;
        div.addEventListener("click", function (event) {
            seleccionar(index, event);

        });
        if(increment >= data_preguntas[index].respuestas.length){
            data_preguntas[index].respuestas[increment] = {"enunciado":"","seleccionado": false};

            
        } 
        if (data_preguntas[index].respuestas[increment].enunciado == span.innerText && data_preguntas[index].respuestas[increment].seleccionado) {
          /*  if(seleccionado ==  document.getElementsByClassName("seleccionado"[0])){
                div.classList.remove("seleccionado");
            }
            else*/ 
             div.setAttribute("class", "seleccionado opcionEs");
            
        } 

    }else {            
        span2.innerText = increment + 1;
        span.innerText = data_respuestas[index][increment].enunciado;
        div.addEventListener("click", function (event) {
            seleccionarMulti(index, event);
        });
     
        if(data_respuestas[index].length > data_preguntas[index].respuestas.length){
                data_preguntas[index].respuestas[increment]={"enunciado":"","seleccionado":false};
        }
        if (data_preguntas[index].respuestas[increment].seleccionado == true) {
            console.log("ENTRA EN SELECCIONADO")
            console.log(increment);
            div.setAttribute("class", "seleccionado opcionEs");

        }
    } //6? :/


    div.appendChild(span2);
    div.appendChild(span)
    document.getElementById("opciones").appendChild(div);
}

function checkPregRespEqualsInit(){
    let igual = true;

    //igual = data_respuestas.length != 0 && data_respuestas.length == data_preguntas.length;

    igual = __done.length == data_preguntas.length;

    return igual;
}