var currentGrupo;
var currentActividad;
var currentPregunta;
var loaded = false;

var yamlFiles;

window.onload = function () {
    /*   IDIOMAS   */
    //populate("es");

    let cerrar = document.getElementsByClassName("recarga");
    for (let i = 0; i < cerrar.length; i++) {
        cerrar[i].addEventListener("click", function () {
            recargaLista("menu1")
        })
    }
    recargaLista("menu1");
    recargaLista("menu2");
    recargaLista("menu3");

            
    document.getElementById("prevQ").addEventListener("click", () => {
        cambiarPreguntaACT(-1);
    });

    document.getElementById("nextQ").addEventListener("click", () => {
        cambiarPreguntaACT(1);
    })

    document.getElementById("search").addEventListener("keyup", (e) => {
        let val = document.getElementById("search").value;
        let listaActividades = document.getElementById("menu1").childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].innerText.toLowerCase().includes(val.toLowerCase())) listaActividades[i].style.display = "flex";
            else listaActividades[i].style.display = "none";
        }
    })

    document.getElementById("addItem").addEventListener("click", function(){
        let input = "<p class='head-row  t-yusei t-m t-bold'>Añade el nombre de una Actividad nueva:</p><input id='nActividad'>";
        loadModalConfirmation(crearActividad, true, true, input);
    });
    document.getElementById("removeItem").addEventListener("click", function(){
        loadModalConfirmation(deleteActividad, true, true);
    });
    document.getElementById("confirmar").addEventListener("click",() => {
        crearPregunta().then(resolve => {
            if(resolve){
                console.log(document.getElementsByClassName("mark-modPreview")[0]);
                let oldPregunta = parseInt(document.getElementsByClassName("mark-modPreview")[0].firstChild.firstChild.innerText) - 1;
                cargarPreviewPreguntas(getId(document.getElementsByClassName("mark-item")[0].id)).then(data => {
                    if(data){
                        loadMarkEventListeners(document.getElementById("modActivityPreview"), "item-preview", "mark-modPreview", function() {
                            cargarPregunta(getId(document.getElementsByClassName("mark-item")[0].id), getId(document.getElementsByClassName("mark-modPreview")[0].childNodes[1].id));
                        }, true);
                        console.log(oldPregunta + "<-- antiguo index")
                        document.getElementById("modActivityPreview").firstChild.classList.add("mark-modPreview");
                        cambiarPregunta(oldPregunta);
                    }
                });
            }
        });
    });

    document.getElementById("addNewPage").addEventListener("click", () => {
        document.getElementsByClassName("mark-modPreview")[0].classList.remove("mark-modPreview");
        crearPregunta().then(resolve => {
            if(resolve) {
                cargarPreviewPreguntas(getId(document.getElementsByClassName("mark-item")[0].id)).then(resolve => {
                    if(resolve){
                        loadMarkEventListeners(document.getElementById("modActivityPreview"), "item-preview", "mark-modPreview", function() {
                            cargarPregunta(getId(document.getElementsByClassName("mark-item")[0].id), getId(document.getElementsByClassName("mark-modPreview")[0].childNodes[1].id));
                        }, true);
                        let menu = document.getElementById("modActivityPreview");
                        document.getElementById("modActivityPreview").childNodes[menu.childNodes.length - 1].classList.add("mark-modPreview");
                        cambiarPregunta(1);
                    }
                })
            }
        })
        
    });
    document.getElementById("nextP").addEventListener("click", function() {
        cambiarPregunta(1);
    })

    document.getElementById("previousP").addEventListener("click", function(){
        cambiarPregunta(-1);
    })

    document.getElementById("importItem").addEventListener("click", function(){
        let input = '<div id="fileDropZone" ondrop="dropHandler(event);" ondragover="dragOverHandler(event);"><p id="fileDropZonep">Arrastra y suelta uno o más archivos a esta zona ...</p></div>';

        loadModalConfirmation(function() {
            if(yamlFiles){
                let i = 0;
                let eventi = 0;

                let names = [];

                let insertInterval = setInterval(() => {
                    if(i < yamlFiles.length){
                        let reader = new FileReader();
                        
                        if( i == yamlFiles.length -1 ){

                            reader.addEventListener('load', (e) => {
                                document.getElementById("fileDropZonep").innerText = "Importando " + names[eventi] + "...";
                                importarActividad(e.target.result, function() { 
                                    recargaLista("menu1");
                                    setTimeout(() => {
                                        closePopUp(); 
                                    }, 500);
                                });
                                eventi++;
                            });

                        } else {
                            reader.addEventListener('load', (e) => {
                                document.getElementById("fileDropZonep").innerText = "Importando " + names[eventi] + "...";
                                importarActividad(e.target.result, function() { recargaLista("menu1"); });
                                eventi++;
                            });
                        }

                        reader.readAsText(yamlFiles[i]);
                        names.push(yamlFiles[i].name);
                        i++;
                    } else {
                        clearInterval(insertInterval);
                    }
                }, 200);
            }

         }, true, true, input);

    });

    document.getElementById("exportItem").addEventListener("click", function(){
        let nActividad;

        nActividad = document.getElementsByClassName("mark-item")[0].id;
        nActividad = getId(nActividad);
        if(nActividad){
            postData({
                type: "search",
                query: {
                    col: ["*"],
                    tab: ["ACTIVIDAD", "PREGUNTA"],
                    condition_and: [ { "PREGUNTA.id_actividad": nActividad }, { "ACTIVIDAD.id_actividad": nActividad } ]
                }
            }).then((data) => {
                exportarActividad(data);
            })
        }
    
    });

    document.getElementById("eliminar1").addEventListener("click", function() {
        loadModalConfirmation(borrarPregunta, true , false);
    })
    document.getElementById("pageBody").addEventListener("click", actividadSeleccionada);

    loadMarkEventListeners(document.getElementById("modActivityPreview"), "item-preview", "mark-modPreview", "", true);
}

/**
 * Procedimiento que gestiona el guardado de los archivos arrastrados por el usuario
 * 
 * @param {Event} ev el evento de drag
 */
function dropHandler(ev) {
    console.log('Fichero(s) arrastrados');
  
    // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      yamlFiles = [];
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          if(file.name.match(/.*\.ya?ml/g)) //si el fichero tiene la extension yaml o yml
              yamlFiles.push(file);
        }
      }
    } else {
      // Usar la interfaz DataTransfer para acceder a el/los archivos
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        if(ev.dataTransfer.files[i].name.match(/.*\.ya?ml/g)) //si el fichero tiene la extension yaml o yml
            yamlFiles.push(ev.dataTransfer.files[i]);
      }
    }

    let fileNames = "";

    if(yamlFiles.length == 0){
        fileNames = "Asegurate de que los archivos tengan la extension <strong>.yaml</strong> o <strong>.yml</strong>";
    } else {

        for(let i = 0; i < yamlFiles.length; i++){
            fileNames += yamlFiles[i].name + "<br><br>";
        }
    }
    document.getElementById("fileDropZonep").innerHTML = fileNames;
  
    // Pasar el evento a removeDragData para limpiar
    removeDragData(ev)
  }

/**
 * Procedimiento que gestiona cuando el usuario pasa por encima de la zona de drop con archivos
 * 
 * @param {Event} ev el evento
 */
function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  document.getElementById("fileDropZone").classList.add("dragOver");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

/**
 * procedimiento que borra los archivos anadidos por el usuario en el evento de drop
 * 
 * @param {Event} ev el evento
 */
function removeDragData(ev) {
    console.log('Removing drag data');
    document.getElementById("fileDropZone").classList.remove("dragOver");
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }
  

function borrarPregunta(){
    if(isMarked("mark-item") && document.getElementsByClassName("mark-modPreview").length == 1){
        //console.log(currentPregunta, getId(document.getElementsByClassName("mark-item")[0].id));

        let id_pregunta = getId(document.getElementsByClassName("mark-modPreview")[0].lastChild.id);
        postData({
            type: "delete",
            query:{
                tab: "PREGUNTA",
                condition_and:[{"id_actividad": getId(document.getElementsByClassName("mark-item")[0].id)}, {"id_pregunta": id_pregunta}]
            }
        }).then(data => {
            if(data.errno) loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>No se ha podido borrar la pregunta seleccionada</span>");
            else {
                document.getElementById("pm"+id_pregunta).parentNode.remove();
                //Volvemos a cargar la preview de las preguntas
                cargarPreviewPreguntas(getId(document.getElementsByClassName("mark-item")[0].id)).then(data => {
                    if(data){
                        
                        document.getElementById("modActivityPreview").firstChild.classList.add("mark-modPreview");
                        loadMarkEventListeners(document.getElementById("modActivityPreview"), "item-preview", "mark-modPreview", function() {
                            cargarPregunta(getId(document.getElementsByClassName("mark-item")[0].id), getId(document.getElementsByClassName("mark-modPreview")[0].childNodes[1].id));
                        }, true);

                        document.getElementById("status").innerHTML = "Se ha <span class='incorrecto'>borrado</span> la pregunta " + id_pregunta + " en la actividad " + getId(document.getElementsByClassName("mark-item")[0].id);
                        if(!document.getElementById("status").classList.contains("statusOpacity")){
                            setTimeout(() => {
                                document.getElementById("status").innerHTML = "";
                                document.getElementById("status").classList.remove("statusOpacity");
                            }, 3200);
                        }
                        if(!document.getElementById("status").classList.contains("statusOpacity")) document.getElementById("status").classList.add("statusOpacity");
                    }
                });
            }
        });
    }
}

/* -- CAMBIAR ACTIVIDAD */
function cambiarActividad(){
    currentPregunta = 1;
    loaded = false;
    if(isMarked("mark-item")){
        let idActividad = getId(document.getElementsByClassName("mark-item")[0].id);
        document.getElementById("act-code").innerText = document.getElementsByClassName("mark-item")[0].getAttribute("data-codigo");
        //console.log(document.getElementsByClassName("mark-page")[0].innerText.trim().toLowerCase() + " <-- MENU ACTUAL")
        
        //correciones
        if(idActividad){
            searchDoneActivities(1,idActividad);
        }

        //actividad modificar
        cargarPregunta(idActividad, currentPregunta).then(resolve => {
            if(resolve){
                cargarPreviewPreguntas(idActividad).then(data => {
                    if(data){
                        document.getElementById("modActivityPreview").firstChild.classList.add("mark-modPreview");
                        //document.getElementById("pm1").parentNode.classList.add("mark-modPreview");
                        loadMarkEventListeners(document.getElementById("modActivityPreview"), "item-preview", "mark-modPreview", function() {
                            cargarPregunta(getId(document.getElementsByClassName("mark-item")[0].id), getId(document.getElementsByClassName("mark-modPreview")[0].childNodes[1].id));
                        }, true);
                    }
                });
            }
        });

        cargarGrupos(idActividad).then(
            resolve =>{
                if(resolve) cargarGruposActividad(idActividad).then(
                    resolve => {
                        if(resolve) {

                            document.getElementById("left").replaceWith(document.getElementById("left").cloneNode(true));
                            document.getElementById("right").replaceWith(document.getElementById("right").cloneNode(true));

                            document.getElementById("left").addEventListener("click", () => {
                                if(isMarked("mark-item-3")) 
                                    quitarActividadGrupo(
                                        idActividad, 
                                        getId(document.getElementsByClassName("mark-item-3")[0].id)
                                    )
                            });
                            document.getElementById("right").addEventListener("click", () => {
                                if(isMarked("mark-item-2"))
                                    anadirActividadGrupo(
                                        idActividad,
                                        getId(document.getElementsByClassName("mark-item-2")[0].id)
                                    )
                            })
                        }
                    }
                )
            }
        )

        /*
        let isLoaded = setInterval(() => {
            if(loaded) {

                clearInterval(isLoaded)
            }
        }, 100);*/
    }
}

//cambiar por async
async function cargarPreviewPreguntas(idActividad){
    return new Promise(resolve => {
        postData({
            type: "search",
            query:{
                tab:["PREGUNTA"],
                col:["*"],
                condition_and:[{"id_actividad": idActividad}]
            }
        }).then( data => {
            document.getElementById("modActivityPreview").innerHTML = "";
            for(let i = 0; i < data.length; i++){
                document.getElementById("modActivityPreview").appendChild(createItemPreview(i+1, data[i].id_pregunta));
            }
            //document.getElementById("modActivityPreview").firstChild.classList.add("mark-modPreview");
            return (data.errno) ? resolve(false) : resolve(true);
        })
    }) 

}

function createItemPreview(id, idPregunta) {
    let parent = document.createElement("div");
    parent.setAttribute("class", "item-preview");

    let idIndex = document.createElement("div");
    idIndex.setAttribute("class", "flex-column center item-p-r");

    let innerText = document.createElement("span");
    innerText.setAttribute("class", "t-yusei t-mini");
    innerText.innerText = id;

    idIndex.appendChild(innerText);

    let responseCheck = document.createElement("div");
    responseCheck.setAttribute("class", "item-p-r");
    responseCheck.id = "pm" + idPregunta;

    parent.appendChild(idIndex);
    parent.appendChild(responseCheck);

    return parent;
}

async function cargarPregunta(idActividad, idPregunta){
    /* Buscas la pregunta con sus datos */
    //console.log(idActividad, idPregunta);
    return new Promise(resolve => {
        postData({
            type: "search",
            query:{
                tab:["PREGUNTA"],
                col:["*"],
                condition_and:[{"id_actividad": idActividad}, {"id_pregunta": idPregunta}]
            }
        }).then(pregunta => {
            if(pregunta.errno) {
                loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>Error en el sistema " + pregunta.errno +"</span>");
                resolve(false);
            } else {
                let tipoP = "";
                if(pregunta.length == 0) tipoP = "respuestaCorta";
                else tipoP = pregunta[0].tipo;
                document.getElementById('tipoPregunta').value = tipoP;
                postData({
                    type: "profesor",
                    id: tipoP,
                },"/htmlPregunta").then((data) =>{
                    //console.log(JSON.stringify(data) + "<-- data de la plantilla")
                    
                    /* cargas la plantilla */
                    if(data.errno) {
                        loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>Error en el sistema " + data.errno +"</span>");
                        resolve(false);
                    } else {
                        document.getElementById("tiposrespuesta").innerHTML = data.plantilla;
                        if(tipoP == "respuestaArrastrarVacio"){
                            document.getElementsByClassName("arrastrar")[0].addEventListener("focusout", () => {
                                loadTargets(document.getElementsByClassName("arrastrar")[0]);
                            });
                            document.getElementById("saveArrastrarText").addEventListener("click", blockDocument);
                        } else if(tipoP != "respuestaCorta") document.getElementById("anadirRespuesta").addEventListener("click", addanswer);
                        document.getElementById("tipoPregunta").value = tipoP;
            
                        /* Pones los datos si es que hay */
                        if(pregunta.length != 0){
                            let respuestas = "";
                            //console.log(JSON.stringify(pregunta) + "<-- pregunta cambiarActividad");
                            //console.log(pregunta);
                            if(tipoP == "respuestaArrastrarVacio"){
                                let items = pregunta[0].enunciado.split(" ");
                                let respuestas = JSON.parse(pregunta[0].respuestas);
                                let text = "";
                                let ids = 0;
                                for(let i = 0; i < items.length; i++){
                                    if(items[i] == "#"){
                                        if(items.length >= i+1){
                                            if(respuestas.opciones != undefined) text += "<span class='results' id="+ (ids+1) +">" + respuestas.opciones[ids].opcion + "</span> ";
                                        }
                                        ids++;
                                    } else {
                                        text += "<span>" + items[i] + "</span> ";
                                    }
                                }

                                document.getElementById("enunciado1").innerHTML = text;
                                if(text != "") {
                                    document.getElementById("enunciado1").contentEditable = false;
                                    document.getElementById("saveArrastrarText").firstChild.innerText = "Editar";
                                    loadTargets(document.getElementsByClassName("arrastrar")[0]);
                                }


                            } else {
                                document.getElementById("timerText").innerHTML = pregunta[0].tiempo;
                                document.getElementById("idEnunciado").innerHTML = pregunta[0].enunciado;

                                respuestas = JSON.parse(pregunta[0].respuestas);
                                if(tipoP == "respuestaOperacionesMatematicas" || tipoP == "respuestaEscoger" || tipoP == "respuestaMultiopcion" || tipoP == "respuestaRelacionar"){
                                    document.getElementById("listActivities").firstChild.innerHTML = "";
                                    document.getElementById("listActivities").firstChild.appendChild(createAddButton());
                                } else if(tipoP != "respuestaCorta"){
                                    document.getElementById("listActivities").innerHTML = "";
                                    document.getElementById("listActivities").appendChild(createAddButton());
                                }
                                //console.log(respuestas[0]);
                                /* Aqui el numero de respuestas que hay sobre las cuales iteras*/
                                let numeroDeRespuestas = getAnswerResLength(tipoP, respuestas);
                
                                /* Aqui va el como quieres cargar los datos osea el value = res */
                                for(let idRespuesta = 0; idRespuesta < numeroDeRespuestas; idRespuesta++){
                                    if(tipoP != "respuestaCorta") addanswer();
                                    //TODO Cargar enunciado
                                    llenarRespuestas(tipoP, respuestas, idRespuesta);
                                }
                            }
 
                        }
                        currentPregunta = idPregunta;
                        resolve(true);
                    }
                    //console.log(idPregunta);
                })
            }
        })
    })
}

function llenarRespuestas(tipoP, respuestas, idRespuesta){
    switch(tipoP){
        case "respuestaOperacionesMatematicas":
            document.getElementById("idRespuesta"+ (idRespuesta+1) + "-0").value = respuestas[idRespuesta].enunciado;
            document.getElementById("idRespuesta"+ (idRespuesta+1) + "-1").value = respuestas[idRespuesta].resultado;
        break;
        case "respuestaRelacionar":
            document.getElementById("idRespuesta"+ (idRespuesta+1) + "-0").value = respuestas.izq[idRespuesta].enunciado;
            document.getElementById("idRespuesta"+ (idRespuesta+1) + "-1").value = respuestas.der[idRespuesta].enunciado;    
        break;
        case "respuestaCorta":
            document.getElementById("idRespuesta").value = respuestas.respuesta;
        break;
        case "respuestaOrdenacion":
            document.getElementById("idRespuesta" + (idRespuesta+1)).value = respuestas[idRespuesta].resultado;
        break;
        case "respuestaEscoger":
            document.getElementById("idRespuesta" + (idRespuesta+1)).value = respuestas[idRespuesta].enunciado;
            if(respuestas[idRespuesta].seleccionado == true){
                document.getElementById("idRespuesta" + (idRespuesta+1)).parentElement.classList.add("mark-itemresp");
            }
        break;
        case "respuestaMultiopcion":
            /* hacer que dependiendo de selecionado se carge el markitem de esa etiqueta */
            document.getElementById("idRespuesta" + (idRespuesta+1)).value = respuestas[idRespuesta].enunciado;
            if(respuestas[idRespuesta].seleccionado == true){
                document.getElementById("idRespuesta" + (idRespuesta+1)).parentElement.classList.add("mark-itemresp");
            }
        break;
    }
}

function getAnswerResLength(tipoPregunta, respuestas){
    let numeroTotal = 0;
    switch (tipoPregunta) {
        case "respuestaCorta":
            numeroTotal = 1;
            break;
        case "respuestaOperacionesMatematicas":
            numeroTotal = respuestas.length;
            break;
        case "respuestaRelacionar":
            numeroTotal = respuestas.izq.length;
            break;
        case "respuestaOrdenacion":
            numeroTotal = respuestas.length;
            break;
        case "respuestaEscoger":
            numeroTotal = respuestas.length;
            break;
        case "respuestaMultiopcion":
            numeroTotal = respuestas.length;
            break;
    }

    return numeroTotal;
}

function createAddButton(){
    let button = document.createElement("button");
    button.id = "anadirRespuesta";
    button.setAttribute("class", "buttonMini buttonAdd");
    let icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-folder-plus");
    button.appendChild(icon);
    button.addEventListener("click", addanswer);

    let parent = document.createElement("div");
    parent.setAttribute("class", "flex-row center wrap");
    parent.appendChild(button);
    return parent;
}

/* CAMBIAR PREGUNTA */

function cambiarPregunta(next){
    if(isMarked("mark-item") && document.getElementsByClassName("mark-modPreview").length == 1){
        next = parseInt(next);

        let current = parseInt(document.getElementsByClassName("mark-modPreview")[0].firstChild.firstChild.innerText) - 1;
        if((next < 0 && current == 0) || current + next > document.getElementById("modActivityPreview").childNodes.length - 1) next = 0;
        current += next;

        document.getElementsByClassName("mark-modPreview")[0].classList.remove("mark-modPreview");
        document.getElementById("modActivityPreview").childNodes[current].classList.add("mark-modPreview");

        let idActividad = getId(document.getElementsByClassName("mark-item")[0].id);
        let idPregunta = getId(document.getElementsByClassName("mark-modPreview")[0].lastChild.id);
        


        cargarPregunta(idActividad, idPregunta);
    }
}

/* -- SEARCHS --*/
//SEARCH GENERAL BASICO
function hacersearch(nombre,callback) {
    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: [nombre]
        }
    }).then(
        data => {
            callback(data);
        }
    )
}

/* --CREACIONS DE TARJETA-- */
//Creacion Tarjeta
function crearTarjeta(id,nombre, codigo) {

    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    
    tarjeta.setAttribute("class", "flex-row item-user");
    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-row center");
    span.setAttribute("class", "t-yusei t-m t-bold");

    div.appendChild(span);
    span.innerText = nombre;

    tarjeta.appendChild(i1);
    tarjeta.appendChild(div);
    tarjeta.id = id;

    if(codigo)
        tarjeta.setAttribute("data-codigo", codigo);

    return tarjeta;
}

/* --COMPROBACIONES-- */
function comprobarActividad(param, callback) {
    let texto = "";
    if (param) {
        texto = {
            tab: ["ACTIVIDAD"],
            col: ["*"],
            condition_and: [{
                "nombre_actividad": param
            }]
        }
        postData({
            type: "search",
            query: texto
        }).then(
            data => {
                callback(data)
            }
        )
    } else {
        document.getElementById("pError").innerHTML = "NO PUEDES CREAR UNA ACTIVIDAD VACÍA";
    }
}

function comprobarPregunta(param, callback) {
    let texto
    if (param) {
        texto = {
            tab: ["PREGUNTA"],
            col: ["*"],
            condition_and: [
                {"id_actividad": param}
            ]
        }
        postData({
            type: "search",
            query: texto
        }).then(
            data => {
                callback(data)
            }
        )
    } else {
        document.getElementById("pError").innerHTML = "NO PUEDES CREAR UNA PREGUNTA VACÍA";
    }
}

/* --CREACION DE OBJETOS-- */
//Creacion Actividades
function crearActividad() {
    let nActividad = document.getElementById("nActividad").value;
    comprobarActividad(nActividad, function (data) {
        let text = "";
        if (data.length < 1) {
            
            postData({},"/generateCode").then((data) => {
                console.log(data);
                postData({
                    type: "insert",
                    query: {
                        tab: "ACTIVIDAD",
                        col: [null, nActividad, data.code]
                    }

                }).then(data =>{
                    if(!data.errno) {
                        text = "<span class='t-yusei t-b'>OK!</span>";
                        console.log(nActividad);
                        postData({
                            type: "search",
                            query: {
                                tab: ["ACTIVIDAD"],
                                col: ["id_actividad"],
                                condition_and: [{ "nombre_actividad": nActividad }]
                            }
                        }).then(data =>{
                            if(!data.errno){
                                nActividad = data[0].id_actividad;
                                let answer = null;
                                postData({
                                    type: "respuestaCorta",
                                }, "/plantilla-respuesta").then((data) => {
                                    answer = data.plantilla;
                                    console.log(answer);
                                    
                                    comprobarPregunta(nActividad, function (data) {
                                        let ides = 1;
                                        postData({
                                            type: "insert",
                                            query: {
                                                tab: "PREGUNTA",
                                                col: [ides, nActividad,"",null,"respuestaCorta",JSON.stringify(answer),"60"]
                                            }
                                        }).then(data => {
                                            console.log(data);    
                                            updateModalText(text);
                                            recargaLista("menu1");
                                        })
                                    });



                                });
                            }
                            
                        })  
                    }
                    else {
                        text = "<span class='t-yusei t-b'>No se ha podido crear la actividad " + data.errno + "</span>";
                        updateModalText(text);
                    }
                })

                      
            })
            
        } else {
            //console.log("No Puedes");
            text = "<span class='t-yusei t-b'>No se ha podido realizar la acción, no hay datos.</span>";
            updateModalText(text);
        }
        
    });
}

function llenarGuardarPregunta(ntipo, answer) {
    if(ntipo == "respuestaCorta"){
        answer.respuesta = document.getElementById("idRespuesta").value;
    }
    else if(ntipo == "respuestaEscoger"){
        for(let i = 0; i < document.querySelectorAll('.multiopcion').length;i++){
            //console.log(document.querySelectorAll('.multiopcion').length)
            if(i == 0){
                answer[0].enunciado = document.getElementById("idRespuesta1").value;
                //falta if de true o false atraves de enunciado
                let papa = document.getElementById("idRespuesta1").parentElement;
                if(papa.classList.contains("mark-itemresp") == true){
                    answer[0].seleccionado = true;
                }
                else{
                    answer[0].seleccionado = false;
                }
            }
            else{
                let papa = document.getElementById("idRespuesta"+(i+1)).parentElement;
                let selecto = false;
                if(papa.classList.contains("mark-itemresp") == true){
                    selecto = true;
                }
                else{
                    selecto = false;
                }
                answer.push({enunciado: document.getElementById("idRespuesta"+(i+1)).value, seleccionado: selecto});
            }
        }
    }
    else if(ntipo == "respuestaMultiopcion"){
        for(let i = 0; i < document.querySelectorAll('.multiopcion').length;i++){
            //console.log(document.querySelectorAll('.multiopcion').length)
            let selecto = document.getElementsByClassName("mark-itemresp")[0].id;
            if(i == 0){
                answer[0].enunciado = document.getElementById("idRespuesta1").value;
                //falta if de true o false atraves de enunciado
                let papa = document.getElementById("idRespuesta1").parentElement;
                if(papa.classList.contains("mark-itemresp") == true){
                    answer[0].seleccionado = true;
                }
                else{
                    answer[0].seleccionado = false;
                }
            }
            else{
                let papa = document.getElementById("idRespuesta"+(i+1)).parentElement;
                if(papa.classList.contains("mark-itemresp") == true){
                    selecto = true;
                }
                else{
                    selecto = false;
                }
                answer.push({enunciado: document.getElementById("idRespuesta"+(i+1)).value, seleccionado: selecto});
            }
        }
        //answer = RESPUESTA_OPERACIONESMATEMATICAS;
    }
    else if(ntipo == "respuestaOperacionesMatematicas"){
        let items = document.getElementsByClassName('multiopcion');
        for(let i = 0; i < items.length; i++){
            let enunciat = document.getElementById('idRespuesta'+ (i+1) +'-0').value
            let respuesta = document.getElementById('idRespuesta'+ (i+1) +'-1').value;
            
            if(i == 0){
                answer[0].enunciado = enunciat;
                answer[0].resultado = respuesta;
            } else {
                answer.push({enunciado: enunciat, resultado: respuesta})
            }
        }
        
        //console.log(document.getElementsByClassName('multiopcion'));
        //answer = RESPUESTA_MULTIOPCION;
    }
    else if(ntipo == "respuestaOrdenacion"){
        let items = document.getElementById('listActivities').childNodes;
        answer = [];
        for(let i = 0; i < items.length - 1; i++){
            answer.push({resultado : document.getElementById("idRespuesta" + (i+1)).value});
        }
        //answer = RESPUESTA_ARRASTRARVACIO;
    }
    else if(ntipo == "respuestaArrastrarVacio"){
        //getArrastrarText().replaceAll("#", "").replaceAll("  ", " ")
        answer.opciones = getArrastrarOpciones();
        answer.rel = document.getElementById("enunciado1").innerText.replaceAll("   ", " ").replaceAll("  ", " ").trim();
        console.log(answer);
        //answer = RESPUESTA_RELACIONAR;
    }
    else if(ntipo == "respuestaRelacionar"){
        let items = document.getElementById('listActivities').firstChild.childNodes;

        for(let z = 0; z < items.length - 1; z++){
            let link1 = document.getElementById('idRespuesta'+ (z+1) + "-0").value;
            let link2 = document.getElementById('idRespuesta'+ (z+1) + "-1").value;
            if(link1 == undefined) link1 = "";
            if(link2 == undefined) link2 = "";
            if(z == 0){
                answer.izq[0].enunciado = link1; 
                answer.der[0].enunciado = link2;
                //answer.rel.push({i: z, d: z});
            } else {
                answer.izq.push({ enunciado: link1 })
                answer.der.push({enunciado: link2})
            }
            answer.rel.push({i: z, d: z})
        }
        console.log(answer);
        //answer = RESPUESTA_MAPACONCEPTUAL;
    }
    else if(ntipo == "respuestasMapaConceptual"){
        for(let i = 0; i < document.querySelectorAll('.multiopcion').length;i++){
            //console.log(document.querySelectorAll('.multiopcion').length)
            if(i == 0){
                answer[0].enunciado = document.getElementById("idRespuesta1").value;
            }
            else{
                answer.push({enunciado: document.getElementById("idRespuesta"+(i+1)).value});
            }
        }
        //answer = RESPUESTA_ORDENACION;
    }

    return answer;
}

function getArrastrarOpciones(){
    let items = document.getElementsByClassName("results");
    let opciones = [];
    for(let index = 0; index < items.length; index++){   
        opciones.push({opcion: items[index].innerText.replaceAll(" ", "")});  
    }
    return opciones;
}

function getArrastrarText(){
    let items = document.getElementById("enunciado1").childNodes;
    let stringText = "";
    for(let index = 0; index < items.length; index++){
        if(items[index].tagName == "SPAN"){
            if(items[index].id == undefined || items[index].id == "") stringText += items[index].innerText;
            else {
                stringText += "# "; 
            }    
        }
    }
    return stringText;
}

async function crearPregunta() {
    return new Promise(resolve => {
        if(isMarked("mark-item")){
            let ntipo = document.getElementById("tipoPregunta").value;
            let timer = document.getElementById("timerText");
            let nEnunciado = "";

            if(ntipo == "respuestaArrastrarVacio"){
                nEnunciado = getArrastrarText();
            } else {
                nEnunciado = document.getElementById("idEnunciado").value ;
            }

            console.log(nEnunciado)
            let nActividad = document.getElementsByClassName("mark-item")[0].id;
            nActividad = getId(nActividad);
            
            let answer = null;
            postData({
                type: ntipo,
            }, "/plantilla-respuesta").then(
                (data) => {
                    if(data.errno){
                        loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>Error a la hora de sacar la plantilla " + data.errno + "</span>");
                        resolve(false);
                    } else {
                        answer = data.plantilla;
                        //console.log(JSON.stringify(data) + "<-- DATA (crearPregunta:postData)")
                        //console.log(JSON.stringify(data.plantilla) + "<-- PLANTILLA (crearPregunta:postData, data.plantilla)")

                        answer = llenarGuardarPregunta(ntipo, answer);

                        comprobarPregunta(nActividad, function (data) {
                            //console.log(JSON.stringify(data) + " <-- DATA (comprobarPregunta) ")
                            //ID Pregunta en caso de que sea insert

                            let ides = 1;
                            if(data.length != 0){
                                ides = data[data.length - 1].id_pregunta + 1;
                            }
                            
                            //Miramos si hay que hacer uno nuevo o no, cuando le das al boton de añadir pagina te crea la pregunta mirando si hay algo seleccionado o no
                            let idPreview = 0;
                            let status = "";
                            if(document.getElementsByClassName("mark-modPreview").length == 0){
                                idPreview = document.getElementById("modActivityPreview").childNodes.length + 1;
                                status = "Se ha generado una <span class='correcto'>nueva pregunta</span> en la actividad " + nActividad + ".";
                            } else {
                                idPreview = document.getElementsByClassName("mark-modPreview")[0].firstChild.firstChild.innerText;
                                status = "Se ha <span class='modificado'>guardado</span> la pregunta " + idPreview +" en la actividad " + nActividad + ".";
                            }
                            //console.log(idPreview + " - " + document.getElementById("modActivityPreview").childNodes.length)
                            //En los dos casos hay que implementar mapa conceptual
                            if(idPreview <= document.getElementById("modActivityPreview").childNodes.length) {
                                //UPDATE
                                let idPregunta = getId(document.getElementsByClassName("mark-modPreview")[0].lastChild.id);
                                postData({
                                    type: "update",
                                    query: {
                                        tab: "PREGUNTA",
                                        col: [{enunciado : nEnunciado},{url_imagen: null},{tipo: ntipo},{respuestas: JSON.stringify(answer)},{tiempo:timer.textContent}],
                                        condition_and:[{id_pregunta: idPregunta}, {id_actividad: getId(document.getElementsByClassName("mark-item")[0].id)}]
                                    }
                                }).then(data => {
                                    if(data.errno) {
                                        console.log(data);
                                        loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>Error a la hora de guardar la pregunta" + data.errno + "</span>");
                                        resolve(false);
                                    } else {
                                        document.getElementById("status").innerHTML = status;
                                        if(!document.getElementById("status").classList.contains("statusOpacity")){
                                            setTimeout(() => {
                                                document.getElementById("status").innerHTML = "";
                                                document.getElementById("status").classList.remove("statusOpacity");
                                            }, 3200);
                                        }
                                        if(!document.getElementById("status").classList.contains("statusOpacity")) document.getElementById("status").classList.add("statusOpacity");

                                        resolve(true);
                                    }
                                });

                            } else {
                                //INSERT
                                postData({
                                    type: "insert",
                                    query: {
                                        tab: "PREGUNTA",
                                        col: [ides, nActividad,nEnunciado,null,ntipo,JSON.stringify(answer),timer.textContent]
                                    }
                                }).then(data => {
                                    if(data.errno) {
                                        console.log(data);
                                        loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>Error a la hora de guardar la pregunta" + data.errno + "</span>");
                                        resolve(false);
                                    } else {
                                        document.getElementById("status").innerHTML = status;
                                        if(!document.getElementById("status").classList.contains("statusOpacity")){
                                            setTimeout(() => {
                                                document.getElementById("status").innerHTML = "";
                                                document.getElementById("status").classList.remove("statusOpacity");
                                            }, 3200);
                                        }
                                        if(!document.getElementById("status").classList.contains("statusOpacity")) document.getElementById("status").classList.add("statusOpacity");

                                        resolve(true);
                                    }
                                });
                            }

                            
                        });
                    }

                    //console.log(JSON.parse(JSON.stringify(answer)))
                }
            )
        }
    }) 
}

function actividadSeleccionada(){
    if(!isMarked("mark-item")) loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>No hay ninguna actividad seleccionada</span>");
}
function selectorACT(){
    if(!isMarked("mark-itemresp")) loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center'>No hay ninguna respuesta correcta seleccionada</span>");
}
/* --SELECIONES-- */
function mostrar_datos(data){
    let objeto = JSON.parse(data[0].respuestas);
    //console.log(objeto)
    document.getElementById("studentResponse").innerHTML = objeto.respuesta;
}

/* --DELETES-- */
function deleteActividad() {
    //FALTA UN IF DE SI HAY ALUMNOS NO PUEDES BORRAR
    let nActividad = document.getElementsByClassName("mark-item")[0].id;
    nActividad = getId(nActividad);
    //console.log(nActividad);
    if (nActividad) {
        //console.log(nActividad)
        postData({
            type: "delete",
            query: {
                tab: "ACTIVIDAD",
                condition_and: [{
                    id_actividad: nActividad
                }]
            }
        }).then( data => {
            if(data.errno){
                updateModalText("<span class='t-yusei t-b t-center'>Error a la hora de borrar la actividad. Codigo error: " + data.errno + ".</span>");
            } else {
                updateModalText("<span class='t-yusei t-b'>OK!</span>");
                recargaLista("menu1");
                document.getElementById("act-code").innerText = "-";
            }

        });
    } else  updateModalText("<span class='t-yusei t-b'>ERROR, NO PUEDES BORRAR UNA ACTIVIDAD INEXISTENTE</span>");
}


/* --RECARGA LISTAS-- */
function recargaLista(menu) {
    switch (menu) {
        case "menu1":
            hacersearch("ACTIVIDAD",function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjeta("ta"+data[i].id_actividad,data[i].nombre_actividad, data[i].codigo));
                }
                loadMarkEventListeners(document.getElementById("menu1"), "item-user", "mark-item", cambiarActividad, true);
                //loadMarkEventListeners("listActivities", "wrap", "mark-itemresp", "");
            })
            break;
        case "menu2":
            hacersearch("GRUPOS",function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjeta("tg"+data[i].id_grupo,data[i].nombre_grupo));
                }
                loadMarkEventListeners(document.getElementById("menu2"), "item-user", "mark-item-2", "");
            })
            break;
            /*
        case "menu3":
            buscarGrupo(id_grupo,function (data) {
                console.log(data)
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    console.log(data)
                    document.getElementById(menu).appendChild(crearTarjeta("tg"+data[i].id_grupo,data[i].nombre_grupo));
                }
                loadMarkEventListeners("menu2", "item-user", "mark-item-2", "");
            })
            break;
            */
    }
}

var select = document.getElementById('tipoPregunta');
var tipoP = "";
select.addEventListener('change', function(e){
    var tipoP = document.getElementById('tipoPregunta').value;
    postData({
        type: "profesor",
        id: tipoP,
    },"/htmlPregunta").then((data) =>{
            document.getElementById("tiposrespuesta").innerHTML = data.plantilla;
            if(tipoP == "respuestaArrastrarVacio"){
                document.getElementsByClassName("arrastrar")[0].addEventListener("focusout", function(){
                    loadTargets(document.getElementsByClassName("arrastrar")[0]);
                });
                
                document.getElementById("saveArrastrarText").addEventListener("click", blockDocument);
            } else if(tipoP != "respuestaCorta"){
                if(tipoP == "respuestaEscoger"){
                    loadMarkEventListeners(document.getElementById("listActivities").firstChild, "multiopcion", "mark-itemresp", "");
                    let items = document.getElementById("listActivities").firstChild.childNodes;
                    
                    items.forEach(element => {
                        if(element.childNodes[2] != undefined) 
                            element.childNodes[2].addEventListener("click", (e) => {
                                delAnswer(e, true, tipoP)
                            })
                    })
                }
                else if(tipoP == "respuestaMultiopcion"){
                    loadMarkEventListeners(document.getElementById("listActivities").firstChild, "multiopcion", "mark-itemresp", "","3");
                    let items = document.getElementById("listActivities").firstChild.childNodes;
                    
                    items.forEach(element => {
                        if(element.childNodes[2] != undefined) 
                            element.childNodes[2].addEventListener("click", (e) => {
                                delAnswer(e, true, tipoP)
                            })
                    })
                }
                else if(tipoP == "respuestasMapaConceptual"){
                    document.getElementById("imagen").onchange = function(e) {
                        let imagen = e.target.files[0];
                        let cadena = new FileReader();
                        cadena.onloadend = function() {
                            postData({ base64 : cadena.result}, '/imagen').then((data) => {
                                document.getElementById("foto").innerHTML = "<img id="+data.id+" class='fotoejer' src='"+data.url+"'>";
                                //document.getElementsByClassName("fotoejer").addEventListener("click",fotico)
                            })
                        }
                        cadena.readAsDataURL(imagen);
                    }
                }
                else if(tipoP == "respuestaOperacionesMatematicas"){
                    let items = document.getElementById("listActivities").firstChild.childNodes;
                    
                    items.forEach(element => {
                        if(element.childNodes[4] != undefined) 
                            element.childNodes[4].addEventListener("click", (e) => {
                                delAnswer(e, true, tipoP)
                            })
                    })
                }
                else if(tipoP == "respuestaOrdenacion"){
                    let items = document.getElementById("listActivities").childNodes;
                    
                    items.forEach(element => {
                        if(element.childNodes[2] != undefined) 
                            element.childNodes[2].addEventListener("click", (e) => {
                                delAnswer(e, true, tipoP)
                            })
                    })
                }
                else if(tipoP == "respuestaRelacionar"){
                    let items = document.getElementById("listActivities").firstChild.childNodes;
                    
                    items.forEach(elements => {
                        let elItems = elements.childNodes;
                        elItems.forEach(element => {
                            if(element.childNodes[2] != undefined) 
                            element.childNodes[2].addEventListener("click", (e) => {
                                delAnswer(e, false, tipoP)
                            })
                        })
                    })
                }
                document.getElementById("anadirRespuesta").addEventListener("click", addanswer)
            };
    })
});

/* function fotico(e){
    console.log(e);
} */