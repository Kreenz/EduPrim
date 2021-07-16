let seleccionado;
function populateRespuestaEscoger(index){
    let respuestas = document.getElementById('opciones');
    let ans = data_preguntas[index].respuestas.respuesta;
    document.getElementById("pizzarra").innerText = data_preguntas[index].enunciado;


    document.getElementById("tipo-pregunta").innerText = "Respuesta Escoger";
    respuestas.innerHTML = "";
    for(let i = 0; i < data_respuestas[index].length;i++){
        comprobarValor(index,i,seleccionado);

    }
    console.log(opciones);
}


function seleccionar(index,param){
    if(param.currentTarget == seleccionado){
      //  console.log("ES EL MISMO")
        if(document.getElementsByClassName("seleccionado")[0]){
            document.getElementsByClassName("seleccionado")[0].classList.remove("seleccionado");
            param.currentTarget.setAttribute("class", "opcionEs");
        }
        else{
            param.currentTarget.setAttribute("class","seleccionado opcionEs");
        }

    } else if(seleccionado && param.currentTarget != seleccionado){
       // console.log("ES DIFERENTE")

        if(document.getElementsByClassName("seleccionado")[0] == undefined){
          //  console.log("entra")
           seleccionado = param.currentTarget;
           seleccionado.setAttribute("class","opcionEs seleccionado");

        } else {  
          //  console.log("no entra")
             //ya esta definido (plan al volver atrás)
            if(param.currentTarget == document.getElementsByClassName("seleccionado")[0]){
                document.getElementsByClassName("seleccionado")[0].classList.remove("seleccionado");  
            }
            else{
                document.getElementsByClassName("seleccionado")[0].classList.remove("seleccionado");
                param.currentTarget.setAttribute("class", "seleccionado opcionEs");
                seleccionado = param.currentTarget;
            }
          }


    } else{
      //  console.log("NO HAY NADA")
        seleccionado = param.currentTarget;
        seleccionado.setAttribute("class","seleccionado opcionEs");

    }
    
}

function saveRespuestaEscoger(index){
    let cont = data_preguntas[index].respuestas.length;
    for(let i = 0; i < data_respuestas[index].length;i++){

        if(i >= cont){
            data_preguntas[index].respuestas[i] = {"enunciado":"","seleccionado": false};
        }

        data_preguntas[index].respuestas[i].enunciado = data_respuestas[index][i].enunciado
        data_preguntas[index].respuestas[i].seleccionado = false;

        if(seleccionado){
            if(seleccionado.lastChild.innerText == data_respuestas[index][i].enunciado){
                data_preguntas[index].respuestas[i].seleccionado = true;
            }
        }   
    }
}

