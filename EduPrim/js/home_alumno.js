var currentActivity;

window.onload = function () {

    document.getElementById("search").addEventListener("keyup", (e) => {
        let listaActividades = document.getElementById("act-list").childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].innerText.toLowerCase().includes(document.getElementById("search").value.toLowerCase())) listaActividades[i].style.display = "flex";
            else listaActividades[i].style.display = "none"
        }
    })

    document.getElementById("btn-resultados").addEventListener("click", () => {
        postData({
            id_usuario: true,
            nombre_completo: false,
            tipo: false
        }, "/current_user").then((data) => {
            if(!data.errno){
                loadStats("usuario",0, document.getElementsByClassName("mark-item")[0].getAttribute("data-id"), data.data.id_usuario).then(data =>{
                    if(data){
                        document.getElementById("preview-target").innerHTML = "";
                        let head = document.createElement("h2");
                        let text = document.createElement("span");
                        text.setAttribute("class", "t-yusei t-b");
                        head.setAttribute("class", "t-yusei t-b");
                        head.innerText = document.getElementsByClassName("mark-item")[0].childNodes[1].firstChild.innerText;
                        let container = document.createElement("div");
                        container.setAttribute("class", "flex-row center space-around fW");

                        for(let i = 0; i < data[0].respuestas.length; i++){
                            let res = document.createElement("div");
                            let inTxt = document.createElement("span");
                            res.setAttribute("class", "flex-column center resContainer");
                            res.classList.add((data[0].respuestas[i].respuesta) ? "green" : "red");
                            inTxt.innerText = data[0].respuestas[i].num;
                            inTxt.setAttribute("class", "t-yusei t-m")
                            res.appendChild(inTxt);

                            container.appendChild(res);
                        }

                        document.getElementById("preview-target").appendChild(head);
                        text.innerHTML = "<span class='has-text' data-text='general-aciertos'>ACIERTOS</span>: " + data[0].aciertos + "/" + data[0].respuestas.length + ".";
                        document.getElementById("preview-target").appendChild(text);
                        tryPopulatingElement(text.childNodes[0]);
                        document.getElementById("preview-target").appendChild(container);
                        if(data[0].respuestas.length == 0) {
                            let noHayDatos = document.createElement("span");
                            noHayDatos.setAttribute("class", "t-yusei t-b has-text");
                            noHayDatos.setAttribute("data-text", "general-nodata");
                            document.getElementById("preview-target").appendChild(noHayDatos);
                            tryPopulatingElement(noHayDatos);
                        }
                    }
                });
            }
        })

    })

    postData({
        nombre_completo: true
    }, "/current_user").then((data) => {
        if(data.data.nombre_completo === "anonimo"){
            document.getElementById("f-logout").submit();
        }
    })

    tryPopulating();

    loadActividades();

    document.getElementById("btn-responder-codigo").addEventListener("click", function () {
        let codigo = document.getElementById("codigo").value;

        postData(
            {
                type: "search",
                query: {
                    col: ["*"],
                    tab: ["ACTIVIDAD"],
                    condition_and: [{"codigo": codigo}]
                }
            }
        ).then((data) => {

            if(data.length > 0){

                postData({
                    type: "set",
                    data: {
                        "doing_activity": data[0].id_actividad
                    }
                }, "/session").then((data) => {
                    window.location.href = "?type=html&page=actividadAlumno";
                });
            }
        })

    });

    document.getElementById("btn-responder-seleccion").addEventListener("click", function () {
        if (currentActivity) {

            postData({
                type: "set",
                data: {
                    "doing_activity": currentActivity.getAttribute("data-id")
                }
            }, "/session").then((data) => {
                console.log(currentActivity.getAttribute("data-id"));
                window.location.href = "?type=html&page=actividadAlumno";
            });

        }
    });
}

function loadActividades() {
    let list = document.getElementById("act-list");

    list.innerHTML = ""; //limpiamos la lista

    //SELECT * FROM usuario_pertenece_grupo a, grupo_tiene_actividad b, actividad c 
    //  WHERE a.id_usuario = 1 AND a.id_grupo = b.id_grupo AND c.id_actividad = b.id_actividad;
    postData({
        id_usuario: true
    }, "/current_user").then(
        (data) => {
            postData({
                type: "search",
                query: {
                    col: ["*"],
                    tab: ["USUARIO_PERTENECE_GRUPO", "GRUPO_TIENE_ACTIVIDAD", "ACTIVIDAD"],
                    condition_and: [
                        { "USUARIO_PERTENECE_GRUPO.id_usuario": data.data.id_usuario },
                        { "USUARIO_PERTENECE_GRUPO.id_grupo": "GRUPO_TIENE_ACTIVIDAD.id_grupo", is_identifier: true },
                        { "GRUPO_TIENE_ACTIVIDAD.id_actividad": "ACTIVIDAD.id_actividad", is_identifier: true }
                    ]
                }
            }
            ).then((data) => {
                initCard(list, data);
            });
        }
    )
}


async function cargarPreguntas(idActividad){
    /* Buscas la pregunta con sus datos */
    //console.log(idActividad, idPregunta);
    return new Promise(resolve => {
        postData({
            type: "search",
            query:{
                tab:["PREGUNTA"],
                col:["*"],
                condition_and:[{"id_actividad": idActividad}]
            }
        }).then(pregunta => {
            if(pregunta.errno) {
                loadModalConfirmation("", false, false, "<span class='t-yusei t-b t-center has-text' data-text='general-errSistema'>Error en el sistema " + pregunta.errno +"</span>");
                resolve(false);
            } else {
                resolve(pregunta);
            }
        })
    })
}

function initCard(list, data) {
    for (let i = 0; i < data.length; i++) {
        makeCard(list, data[i].id_actividad, data[i].nombre_actividad, "ACTIVIDAD " + data[i].id_actividad);
    }

    loadMarkEventListeners("act-list", "item-activity", "mark-item",
        function () {
            currentActivity = document.getElementsByClassName("mark-item")[0];
            if(currentActivity){
                let idActividad = currentActivity.getAttribute("data-id");
                document.getElementById("preview-target").innerHTML = "";
                cargarPreguntas(idActividad).then(preguntas => {
                    let header = document.createElement("h2");
                    let listContainer = document.createElement("div");
                    let ol = document.createElement("ol");
                    
                    header.setAttribute("class", "t-yusei t-b");
                    listContainer.setAttribute("class", "fW overflowbro");


                    header.innerText = currentActivity.childNodes[1].firstChild.innerText;
                    for(let i = 0; i < preguntas.length; i++){
                        let li = document.createElement("li");
                        li.innerText = preguntas[i].enunciado;
                        li.setAttribute("class", "t-yusei t-m")
                        ol.appendChild(li);
                    }
                    
                    listContainer.appendChild(ol);
                    document.getElementById("preview-target").appendChild(header);
                    document.getElementById("preview-target").appendChild(listContainer);

                })
            } else {
                document.getElementById("preview-target").innerHTML = '<span class="t-yusei t-b has-text" data-text="homeAlumno-noActividad"></span>';
                tryPopulatingElement(document.getElementById("preview-target").childNodes[0]);
            }
                

            
        });
}

function makeCard(parent, id, nombre, descripcion) {
    /*
    <div class="flex-row space-between item-activity">
        <i class="icon-activity"></i>
        <div class="flex-column center">
            <span>Nombre del ej</span>
            <span>descripcion corta</span>
        </div>
        <i class="icon-responseActivity"></i>
    </div>
    */

    let container = document.createElement("div");
    let lefti = document.createElement("i");
    let righti = document.createElement("i");
    let data = document.createElement("div");
    let sn = document.createElement("span");
    sn.setAttribute("class", "t-yusei t-m");

    container.setAttribute("class", "flex-row space-between item-activity");
    lefti.setAttribute("class", "icon-activity");
    data.setAttribute("class", "flex-column center");
    sn.innerText = nombre.toUpperCase();
    righti.setAttribute("class", "icon-responseActivity");

    data.appendChild(sn);

    container.appendChild(lefti);
    container.appendChild(data);
    container.appendChild(righti);

    container.setAttribute("data-id", id);

    parent.appendChild(container);
}


function loadMarkEventListeners(idMenu, selector, marker, fun, exception) {
    let menu = document.getElementById(idMenu);
    let items = menu.childNodes;
    for (let i = 0; i < items.length; i++) {
        if (items[i].classList) {
            if (items[i].classList.contains(selector)) {
                items[i].addEventListener("click", function () {
                    markItem(marker, items[i], fun, exception);
                });
            }
        }
    }

}

/* Marca el item seleccionada o la desmarca en funcion de la clase, se permiten opciones especiales de desmarque */
function markItem(selector, item, fun, exception){
    if(exception == "3"){
        if(!item.classList.contains(selector))  item.classList.add(selector);
        else if(item.classList.contains(selector)){
            item.classList.remove(selector)
        }
    }
    else{
        if(document.getElementsByClassName(selector)[0]){
            let oldItem = document.getElementsByClassName(selector)[0];
            if(oldItem != item)oldItem.classList.remove(selector);
        }
        if(!item.classList.contains(selector))  item.classList.add(selector);
        else if(!exception) item.classList.remove(selector);
        fun();
    }
}