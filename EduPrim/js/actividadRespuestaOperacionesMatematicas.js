function populateRespuestaOperacionesMatematicas(index){
    let col1 = document.getElementById("col1");
    let col2 = document.getElementById("col2");
    let col3 = document.getElementById("col3");

    let cols = [col1, col2, col3];

    let aux;
    let enunciado;
    let input;

    col1.innerHTML = "";
    col2.innerHTML = "";
    col3.innerHTML = "";

    for(let i = 0; i < data_respuestas[index].length; i++){
        aux = document.createElement("div");
        aux.setAttribute("class", "operacion");

        enunciado = document.createElement("span");
        enunciado.setAttribute("id", "o-" + i);
        enunciado.innerText = data_respuestas[index][i].enunciado;
        
        input = document.createElement("input");
        input.setAttribute("id", "r-" + i);
        input.setAttribute("class", "r-math");
        input.value = data_preguntas[index].respuestas[i] ? data_preguntas[index].respuestas[i].resultado : "";

        aux.appendChild(enunciado);
        aux.appendChild(input);

        cols[i == 0 ? 0 : i % 3].appendChild(aux);
    }
}


function saveRespuestaOperacionesMatematicas(index){

    for(let i = 0; i < data_respuestas[index].length; i++){
        if(data_preguntas[index].respuestas[i]){
            data_preguntas[index].respuestas[i].enunciado = data_respuestas[index][i].enunciado
            data_preguntas[index].respuestas[i].resultado = document.getElementById("r-" + i).value
        } else {
            data_preguntas[index].respuestas.push({enunciado: data_respuestas[index][i].enunciado, resultado: document.getElementById("r-" + i).value});
        }
    }

}