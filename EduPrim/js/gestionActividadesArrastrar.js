/*
Primero tienes que guardar el texto y luego te permite seleccionar las palabras que quieres marcar
habra que controlar bastantes mas cosas que lo que he puesto por lo cabron que puede llegar a ser el usuario
pero alla le dejo a quien quiera aventurarse
*/




function loadTargets(div){
    let items = div.childNodes;
    let itemList = [];
    if(items.length == 1) {
        if(items[0].nodeType == 3){
            items = items[0].nodeValue.split(" ");
        }
    }

    items.forEach(element => {
        if(!element.nodeType){
            let span = document.createElement("span");
            span.innerText = element;
            element = span;
        }
        element.innerText = element.innerText + " ";
        if(element.innerText != "" && element.innerText && element.innerText != " " && element.innerText != "undefined ") itemList.push(element);
        
        if(element.innerText != "" && element.innerText && element.innerText != "undefined "){
            
            let testText = element.innerText;
            if(testText.substring(0, testText.length - 1).split(" ").length > 1){

                let texts = element.innerText.split(" ");
                element.innerText = texts[0] + " ";
                itemList.push(element);
    
                for(let i = 1; i < texts.length; i++){
                    let span = document.createElement("span");
                    span.innerText = texts[i] + " ";
                    itemList.push(span);
                }
            }
        }
        
    })

    

    
    document.getElementById("enunciado1").innerHTML = "";
    itemList.forEach(element => {
        document.getElementById("enunciado1").appendChild(element);
    })
    

    let spans = document.getElementById("enunciado1").childNodes;
    for(let i = 0; i < spans.length; i++){
        if(spans[i].tagName == "SPAN" && spans[i].nodeType != 3){

            spans[i].replaceWith(spans[i].cloneNode(true));

            spans[i].addEventListener("mouseover", function(){
                preLoad(spans[i]);
            })

            spans[i].addEventListener("mouseout", function(){
                unloadTarget(spans[i]);
            })
    
            spans[i].addEventListener("click", function(){
                targetSpan(spans[i]);
            })
        }
    }
}

function preLoad(span){
    if(document.getElementById("enunciado1").contentEditable == "false"){
        if(span.id == undefined || span.id == "" && span.nodeType != 3  && span.classList) span.classList.add("results");
    }
}

function unloadTarget(span){
    if(document.getElementById("enunciado1").contentEditable == "false"){
        if(span.id == undefined || span.id == "" && span.nodeType != 3 && span.classList) {
            if(span.classList.contains("results") )span.classList.remove("results");
        } 
    }
}

function targetSpan(span){
    if(document.getElementById("enunciado1").contentEditable == "false"){
        if(span.classList.contains("results") && (span.id != "" && span.id != undefined)){
            console.log("borrar");
            let items = document.getElementsByClassName("results");
            for(let i = 0; i < items.length ; i++){
                if(items[i].id > span.id){
                    items[i].innerText = items[i].innerText;
                    items[i].id = i;
                }
            }

            span.setAttribute("class", "");
            span.removeAttribute("id");
        } else {
            span.setAttribute("id", document.getElementsByClassName("results").length + 1); 
            span.classList.add("results");
        }
    }
}

function blockDocument(){
    if(document.getElementById("saveArrastrarText").innerText.includes("Guardar")) document.getElementById("saveArrastrarText").childNodes[0].innerText = "Editar";
    else document.getElementById("saveArrastrarText").childNodes[0].innerText = "Guardar Contenido";
    if(document.getElementsByClassName("arrastrar")[0].contentEditable == "true") {
        document.getElementsByClassName("arrastrar")[0].contentEditable = "false";
        console.log(document.getElementById("enunciado1").innerHTML)
        if(document.getElementById("enunciado1").innerHTML != undefined)
            loadTargets(document.getElementById("enunciado1"));
    }
    else {
        document.getElementsByClassName("arrastrar")[0].contentEditable = "true";
    }
    /* Borrar spans vacios */
    let items = document.getElementById("enunciado1").childNodes;
    for(let i = 0; i < items.length; i++){
        if(items[i].innerText == "") items[i].remove();
    }

    
}