
function populateRespuestaMultiopcion(index){
    let respuestas = document.getElementById('opciones');
    let ans = data_preguntas[index].respuestas.respuesta;
    document.getElementById("pizzarra").innerText = data_preguntas[index].enunciado;

    document.getElementById("tipo-pregunta").innerText = "Respuesta Multiopcion";
    respuestas.innerHTML = "";


    for(let i = 0; i < data_respuestas[index].length;i++){
        comprobarValor(index,i);
    }
}

//EN SELECCIONAR MULTI HAY QUE HACER DOBLE CLICK PARA CANCELAR LA SELECCIÓN GUARDADA
function seleccionarMulti(index,param){
    if(param.currentTarget == seleccionado){
        //console.log("ES EL MISMO");
        seleccionado.classList.remove("seleccionado");
        seleccionado = null;

    } else if(seleccionado && param.currentTarget != seleccionado) {
       // console.log("ES DIFERENTE");
        console.log(param.currentTarget);
        console.log(seleccionado);

            if(param.currentTarget.classList.contains("seleccionado")){
            //  console.log("uwu");
                param.currentTarget.classList.remove("seleccionado");

            }else {
                param.currentTarget.setAttribute("class","opcionEs seleccionado");
                seleccionado = param.currentTarget;
            }



    } else {
        //console.log("NO HAY NADA");
        param.currentTarget.setAttribute("class","seleccionado opcionEs");
        seleccionado = param.currentTarget;
    }
}


function saveRespuestaMultiopcion(index){
    //document.getElementsByClassName("seleccionado")[0].classList.contains("seleccionado")
    let arrayOpciones = document.getElementsByClassName("opcionEs");
    let arraySel = document.getElementsByClassName("seleccionado");
    for(let i = 0; i < arrayOpciones.length; i++){
        if(i>arrayOpciones.length) data_preguntas[index].respuestas[i]={};

        let texto = arrayOpciones[i].lastChild.innerText;
        data_preguntas[index].respuestas[i].enunciado = texto



        if(arrayOpciones[i].classList.contains("seleccionado"))
            data_preguntas[index].respuestas[i].seleccionado = true;
        
        else 
            data_preguntas[index].respuestas[i].seleccionado = false;
        

    }
}