var currentGrupo;
var currentActividad;
window.onload = function () {
    /*   IDIOMAS   */
    populate("es");

    let cerrar = document.getElementsByClassName("recarga");
    for (let i = 0; i < cerrar.length; i++) {
        cerrar[i].addEventListener("click", function () {
            recargaLista("menu1")
        })
    }
    recargaLista("menu1")
    recargaLista("menu2");
    recargaLista("menu3",1);
    document.getElementById("regActividad").addEventListener("click", crearActividad);
    document.getElementById("borrarActividad").addEventListener("click", deleteActividad);
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

function buscarGrupo(id_grupo,callback) {
    postData({
        type: "search",
        query:{
            col: ["*"],
            tab: ["GRUPOS","GRUPO_TIENE_ACTIVIDAD","ACTIVIDAD"],
            condition_and: [{"ACTIVIDAD.id_actividad": "GRUPO_TIENE_ACTIVIDAD.id_actividad"},{"GRUPOS.id_grupo": "GRUPO_TIENE_ACTIVIDAD.id_grupo"}]
        }
    }).then(data => {
        console.log(data)
        callback(data)
    })
}

/* --CREACIONS DE TARJETA-- */
//Creacion Tarjeta
function crearTarjeta(nombre_actividad) {

    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    let i2 = document.createElement("i");

    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-column center");
    span.innerText = nombre_actividad;
    i2.setAttribute("class", "icon-responseActivity");

    tarjeta.appendChild(i1);
    tarjeta.appendChild(div);
    tarjeta.appendChild(span);
    tarjeta.appendChild(i2);

    tarjeta.setAttribute("class", "flex-row space-between item-activity");
    /*tarjeta.addEventListener("click", seleccionar);
    for (let i = 0; i < tarjeta.childNodes.length; i++) {
        tarjeta.childNodes[i].addEventListener("click", e => e.stopPropagation())
    }
    tarjeta.addEventListener("click", borrarSelect);
    tarjeta.addEventListener("click", modifySelect);*/

    return tarjeta;
}

function crearTarjetaGrupo(nombre_grupo) {
    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    let i2 = document.createElement("i");

    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-column center");

    span.innerText = nombre_grupo

    i2.setAttribute("class", "icon-responseActivity");

    tarjeta.appendChild(i1);
    tarjeta.appendChild(div);
    tarjeta.appendChild(span);
    tarjeta.appendChild(i2);


    tarjeta.setAttribute("class", "flex-row space-between item-activity");
    
    /*tarjeta.addEventListener("click", seleccionarUsuario);
    document.getElementById("right").addEventListener("click", clickFlechaDer);
    document.getElementById("left").addEventListener("click", clickFlechaIz);
    for (let i = 0; i < tarjeta.childNodes.length; i++) {
        tarjeta.childNodes[i].addEventListener("click", e => e.stopPropagation())
    }*/

    return tarjeta;
}


/* --COMPROBACIONES-- */
function comprobarActividad(param, callback) {
    let texto
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
        document.getElementById("pError").innerHTML = "NO PUEDES CREAR UN GRUPO VACÍO";
    }
}

/* --CREACION DE OBJETOS-- */
//Creacion Actividades
function crearActividad() {
    let nActividad = document.getElementById("nActividad").value;
    comprobarActividad(nActividad, function (data) {
        console.log(data.length)
        if (data.length < 1) {
            console.log("Puedes")
            postData({
                type: "insert",
                query: {
                    tab: "ACTIVIDAD",
                    col: [null, nActividad]
                }
            })
            document.getElementById("pError").innerText = "OK!";
        } else {
            console.log("No Puedes");
            document.getElementById("pError").innerText = "NO SE HA PODIDO REALIZAR LA ACCIÓN!";
        }
    });
}

/* --SELECIONES-- */
/*
function seleccionar(param) {
    let pulsado = param.target;
    if (currentGrupo) {
        currentGrupo.setAttribute("class", "flex-row space-between item-activity");
        let txt = document.getElementById("menu3");
        txt.innerHTML = "";
    }
    currentGrupo = pulsado;
    if (pulsado) {
        pulsado.setAttribute("class", "flex-row space-between item-activity bordePulsado");
        alumnosGrupo(currentGrupo.childNodes[2].innerText, function (data) {
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].id_usuario)
                obtenerNombre(data[i].id_usuario, function (data) {
                    let nombre = data
                    console.log(nombre)
                    document.getElementById("menu3").appendChild(crearTarjetaUsuario(nombre));
                })
            }
        })
    }
}

function clickFlechaDer() {
    let txt = currentUsuario.childNodes[2];
    let txt2 = currentGrupo.childNodes[2];
    let id_usuario;
    let id_grupo;
    console.log(txt.innerText)
    buscarIdUserPorNombre(txt.innerText, function (data) {
        id_usuario = data.id_usuario;
        console.log(id_usuario)
        buscarIdGrupoPorNombre(txt2.innerText, function (data) {
            id_grupo = data.id_grupo;
            console.log(id_grupo)
            anadirUsuariosGrupo(id_usuario, id_grupo);
            //RECARGAR LISTA PARA QUE AL AÑADIR UN USUARIO AL GRUPO SE IMPRIMA (Y TAMBIÉN NO CREÉ DUPLICADOS)
            recargaLista("menu3",id_grupo);
        });
    });
}

function clickFlechaIz() {
    //CORREGIR LA SELECCIÓN DE USUARIO (SOLO PUEDES QUITAR DEL 3 MENU)
    let txt = currentUsuario.childNodes[2];
    let txt2 = currentGrupo.childNodes[2];
    let id_usuario;
    let id_grupo;
    console.log(txt.innerText)
    buscarIdUserPorNombre(txt.innerText, function (data) {
        id_usuario = data.id_usuario;
        console.log(id_usuario)
        buscarIdGrupoPorNombre(txt2.innerText, function (data) {
            id_grupo = data.id_grupo;
            console.log(id_grupo);
            eliminarUsuarioGrupo(id_usuario, id_grupo);
            recargaLista("menu3");
        });
    });
}



function borrarSelect() {
    if (currentGrupo) {
        document.getElementById("removeItem").setAttribute("data-target", "#confirmar");
        console.log(currentGrupo)
        document.getElementById("borrarGrupoSel").addEventListener("click", deleteGrupoSel);
    }
}

function modifySelect() {
    if (currentGrupo) {
        document.getElementById("modifyItem").setAttribute("data-target", "#updateSel");
        document.getElementById("updateGrupoSel").addEventListener("click", updateGrupoSel);
    }
}
*/

/* --DELETES-- */
function deleteActividad() {
    //FALTA UN IF DE SI HAY ALUMNOS NO PUEDES BORRAR
    let nActividad = document.getElementById("nActividad2").value;
    if (nActividad) {
        console.log(nActividad)
        postData({
            type: "delete",
            query: {
                tab: "ACTIVIDAD",
                condition_and: [{
                    nombre_actividad : nActividad
                }]
            }
        })
        document.getElementById("bError").innerText = "OK!";
    } else document.getElementById("bError").innerText = "ERROR, NO PUEDES BORRAR UNA ACTIVIDAD INEXISTENTE";
}

/* --RECARGA LISTAS-- */
function recargaLista(menu,id_grupo) {
    switch (menu) {
        case "menu1":
            hacersearch("ACTIVIDAD",function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjeta(data[i].nombre_actividad));
                }
            })
            break;
        case "menu2":
            hacersearch("GRUPOS",function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjetaGrupo(data[i].nombre_grupo));
                }
            })
            break;
        case "menu3":
            console.log(id_grupo);
            buscarGrupo(id_grupo,function (data) {
                console.log(data)
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    console.log(data)
                    document.getElementById(menu).appendChild(crearTarjetaGrupo(data[i].nombre_completo));
                }
            })
            break;
    }
}