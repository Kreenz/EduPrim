function populateRespuestaCorta(index){
    let ans = data_preguntas[index].respuestas.respuesta;
    
    document.getElementById("pizzarra").innerText = data_preguntas[index].enunciado;

    document.getElementById("tipo-pregunta").innerText = "Respuesta Corta"; //TODO +-+-+-+-+-+-+-+-   cambiar a texto traducible +-+-+-+-+-+-+-+-+-      TODO

    document.getElementById("respuesta-corta").value = ans ? ans : "";
}

function saveRespuestaCorta(index){
    data_preguntas[index].respuestas.respuesta = document.getElementById("respuesta-corta").value;
}