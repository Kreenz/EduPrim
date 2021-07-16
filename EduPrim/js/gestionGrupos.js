var currentGrupo; //CURRENT SELECTED GRUPO
var currentUsuario;

window.onload = function () {
    /*  IDIOMAS     */
    tryPopulating();

    let cerrar = document.getElementsByClassName("recarga");
    for (let i = 0; i < cerrar.length; i++) {
        cerrar[i].addEventListener("click", function () {
            recargaLista("menu1")
        })
    }
    recargaLista("menu1");
    recargaLista("menu2");

    document.getElementById("addItem").addEventListener("click", function () {
        let input = "<p class='head-row  t-yusei t-m t-bold'>Escribe el nombre del grupo a añadir:</p><input id='nGrupo'><p id='pError'></p>";
        loadModalConfirmation(crearGrupo, true, true, input);
    });

    document.getElementById("right").addEventListener("click", clickFlechaDer);
    document.getElementById("left").addEventListener("click", clickFlechaIz);
    
    document.getElementById("removeItem").addEventListener("click", function () {
        if(currentGrupo) 
            loadModalConfirmation(deleteGrupoSel,true, true);
        else 
        loadModalConfirmation(null,false,false,"<h1 class=' t-yusei t-m t-bold has-text' data-text=''general-errSeleccion'>PRIMERO, SELECCIONA UN GRUPO</h1>");
    });

    document.getElementById("modifyItem").addEventListener("click",function(){
        if (currentGrupo) 
            loadModalConfirmation(updateGrupoSel,true,true,"<p seleccionaGrupo class='head-row t-yusei t-m t-bold has-text' data-text>Escribe el nombre del grupo a cambiar:</p><input id='nGrupo'><p id='pError'></p>" );
        else 
            loadModalConfirmation(null,false,false,"<h1 class='seleccionaGrupo t-yusei t-m t-bold has-text' data-text=''general-errSeleccion'>PRIMERO, SELECCIONA UN GRUPO</h1>");
      

    });

    document.getElementById("search").addEventListener("keyup", (e) => {
        let val = document.getElementById("search").value;
        let listaActividades = document.getElementsByClassName("list-items")[0].childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].tagName == "DIV"){
                if(listaActividades[i].innerText.toLowerCase().includes(val.toLowerCase())) listaActividades[i].style.display = "flex";
                else listaActividades[i].style.display = "none";
            }
        }
    })

    document.getElementById("searchStudent").addEventListener("keyup", (e) => {
        let val = document.getElementById("searchStudent").value;
        let listaActividades = document.getElementsByClassName("listMenu")[0].childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].tagName == "DIV"){
                if(listaActividades[i].innerText.toLowerCase().includes(val.toLowerCase())) listaActividades[i].style.display = "flex";
                else listaActividades[i].style.display = "none";
            }
        }
    })

    document.getElementById("searchGroup").addEventListener("keyup", (e) => {
        let val = document.getElementById("searchGroup").value;
        let listaActividades = document.getElementsByClassName("listMenu")[1].childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].tagName == "DIV"){
                if(listaActividades[i].innerText.toLowerCase().includes(val.toLowerCase())) listaActividades[i].style.display = "flex";
                else listaActividades[i].style.display = "none";
            }
        }
    })
}

    document.getElementById("search").addEventListener("keyup", (e) => {
        let val = document.getElementById("search").value;
        let listaActividades = document.getElementsByClassName("list-items")[0].childNodes;
        for(let i = 0; i < listaActividades.length; i++){
            if(listaActividades[i].tagName == "DIV"){
                if(listaActividades[i].innerText.toLowerCase().includes(val.toLowerCase())) listaActividades[i].style.display = "flex";
                else listaActividades[i].style.display = "none";
            }
        }
    })

function crearTarjeta(nombre_grupo) {
    let tarjeta = document.createElement("div");
    let div0 = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");

    div0.setAttribute("class","flex-row center");
    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-column space-between");
    span.setAttribute("class","t-yusei t-m t-bold");
    span.innerText = nombre_grupo;


    div.appendChild(span);
    div0.appendChild(div);



    tarjeta.appendChild(i1)
    tarjeta.appendChild(div0);
    tarjeta.setAttribute("class", "flex-row item-user");
    tarjeta.addEventListener("click", function (event) {
        //seleccionar(event);
    });



    return tarjeta;


}

function crearTarjetaUsuario(nombre_usuario) {
    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    let div0 = document.createElement("div");

    div0.setAttribute("class","flex-row center");
    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-column space-between");
    span.setAttribute("class", "t-yusei t-m t-bold");
    span.innerText = nombre_usuario;

    div.appendChild(span);
    div0.appendChild(div);

    tarjeta.appendChild(i1)
    tarjeta.appendChild(div0);


    tarjeta.setAttribute("class", "flex-row item-user");
    tarjeta.addEventListener("click", function (event) {
        seleccionarUsuario(event);
    });


    return tarjeta;


}


function seleccionar(param) {
    let pulsado = document.getElementsByClassName("mark-item")[0];
    console.log(pulsado)
    if (currentGrupo) {
        console.log("ENTRA EN GRUPO")
      //  currentGrupo.removeAttribute("class");
       // currentGrupo.setAttribute("class", "flex-row space-between");
        let txt = document.getElementById("menu3");
        txt.innerHTML = "";


    }
    let hijo = pulsado.lastElementChild;
    currentGrupo = hijo
    console.log(hijo)
    console.log(pulsado)
    if (pulsado) {
        console.log("ENTRA EN PULSADO")
       // pulsado.classList.add("mark-item");

        buscarIdGrupoPorNombre(currentGrupo.childNodes[0].innerText, function (data) {
            console.log(data.id_grupo);
            recargaLista("menu3", data.id_grupo)
        })


    }
}

function seleccionarUsuario(param) {
    let pulsado = param.currentTarget;
    console.log(param)
    if (currentUsuario) {
        currentUsuario.setAttribute("class", "flex-row space-between item-user");

    }
    currentUsuario = pulsado;
    console.log(pulsado)
    if (pulsado) {
        pulsado.setAttribute("class", "flex-row space-between item-user bordePulsado");
        //console.log(currentUsuario.childNodes[2])
        pulsado.classList.add("mark-item");

    }

}

function clickFlechaDer() {
    let txt = currentUsuario.childNodes[1];
    let txt2 = currentGrupo.childNodes[0];
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


        });
    });

}

function clickFlechaIz() {

    let txt = currentUsuario.childNodes[1];
    let txt2 = currentGrupo.childNodes[0];
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
        });

    });


}


//4.1 CREACIÓN GRUPOS

function crearGrupo() {
    let nGrupo = document.getElementById("nGrupo").value;

    comprobarGrupo(nGrupo, function (data) {
        console.log(data.length)
        if (data.length < 1) {
            console.log("Puedes")
            postData({
                type: "insert",
                query: {
                    tab: "GRUPOS",
                    col: [null, nGrupo]
                }
            }).then(data =>{
                updateModalText("<p class=' t-yusei t-b'>OK!</p>");
                recargaLista("menu1");
            })
        } else {
            updateModalText("<p class='msg-errorModal t-yusei t-b'>NO SE HA PODIDO REALIZAR LA ACCIÓN!</p>");

            console.log("No Puedes");
            //  document.getElementById("pError").innerText = "NO SE HA PODIDO REALIZAR LA ACCIÓN!";
        }
    });
}

//4.2 DELETES
function deleteGrupoSel() {
        console.log(currentGrupo.childNodes[0].innerText)
        postData({
            type: "delete",
            query: {
                tab: "GRUPOS",
                condition_and: [{
                    nombre_grupo: currentGrupo.childNodes[0].innerText
                }]
            }
        }).then(data =>{
            updateModalText("<p class='t-yusei t-b'>OK!</p>");
            recargaLista("menu1");
            document.getElementById("menu3").innerHTML = "";
            console.log("CurrentSel:"+currentGrupo);
            currentGrupo = null;


        })
 
}

//4.2 UPDATES
function updateGrupoSel() {
    let nGrupo = document.getElementById("nGrupo").value
    comprobarGrupo(nGrupo, function (data) {
        console.log(data.length)
        if (data.length < 1) {
            console.log("Puedes")
            postData({
                type: "update",
                query: {
                    tab: "GRUPOS",
                    col: [{
                        nombre_grupo: nGrupo
                    }],
                    condition_and: [{
                        nombre_grupo: currentGrupo.childNodes[0].innerText
                    }]
                }
            }).then(data =>{
                updateModalText("<p class=' t-yusei t-b'>OK!</p>");
                recargaLista("menu1");
            })
            
        } else 
            updateModalText("<p class='msg-errorModal  t-yusei t-b'>NO SE HA PODIDO REALIZAR LA ACCIÓN!</p>");
    })
}


//4.3 AÑADIR USUARIO A GRUPO

function anadirUsuariosGrupo(param1, param2) {

    postData({
        type: "insert",
        query: {
            tab: "USUARIO_PERTENECE_GRUPO",
            col: [param1, param2]
        }
    }).then(
        data => {
            recargaLista("menu3", param2);
        }
    )

}

function alumnosGrupo(param, callback) {
    postData({
        type: "search",
        query: {
            tab: ["USUARIO_PERTENECE_GRUPO", "GRUPOS"],
            col: ["*"],
            condition_and: [{
                "GRUPOS.id_grupo": param
            }, {
                "USUARIO_PERTENECE_GRUPO.id_grupo": "GRUPOS.id_grupo"
            }]
        }
    }).then(
        data =>
        callback(data)

    )
}

//4.4 ELIMINAR USUARIO DE UN GRUPO
function eliminarUsuarioGrupo(param1, param2) {
    postData({
        type: "delete",
        query: {
            tab: "USUARIO_PERTENECE_GRUPO",
            condition_and: [{
                id_usuario: param1
            }, {
                id_grupo: param2
            }]
        }
    }).then(data => recargaLista("menu3", param2))
}


//SEARCH GRUPOS
function buscarGrupos(callback) {
    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: ["GRUPOS"]
        }
    }).then(
        data => {
            callback(data);

        }
    )
}

function buscarUsuario(callback) {
    postData({
            type: "search",
            query: {
                col: ["*"],
                tab: ["USUARIOS"],
            }
        })
        .then(
            data => {
                callback(data);
            }
        )
}

function buscarIdUserPorNombre(param, callback) {
    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: ["USUARIOS"],
            condition_and: [{
                nombre_completo: param
            }]

        }
    }).then(
        data => callback(data[0])
    )
}

function buscarIdGrupoPorNombre(param, callback) {
    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: ["GRUPOS"],
            condition_and: [{
                nombre_grupo: param
            }]
        }

    }).then(data => callback(data[0]))
}



function comprobarGrupo(param, callback) {
    let texto
    if (param) {
        texto = {
            tab: ["GRUPOS"],
            col: ["*"],
            condition_and: [{
                "nombre_grupo": param
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


/* ERROR */
function buscarUsuarioGrupo(id_grupo, callback) {
    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: ["USUARIOS", "USUARIO_PERTENECE_GRUPO", "GRUPOS"],
            condition_and: [{
                    "USUARIOS.id_usuario": "USUARIO_PERTENECE_GRUPO.id_usuario",
                    is_identifier: true
                },
                {
                    "GRUPOS.id_grupo": "USUARIO_PERTENECE_GRUPO.id_grupo",
                    is_identifier: true
                },
                {
                    "GRUPOS.id_grupo": id_grupo
                }
            ]
        }
    }).then(data => {
        //console.log(data)
        callback(data)
    })
}



function recargaLista(menu, id_grupo) {
    switch (menu) {
        case "menu1":
            buscarGrupos(function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjeta(data[i].nombre_grupo));
                }
                loadMarkEventListeners(document.getElementById("menu1"), "item-user", "mark-item", (event) => {
                    console.log(event)
                    seleccionar(event);
                }, true);
            })

            break;
        case "menu2":
            buscarUsuario(function (data) {
                document.getElementById(menu).innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    if(data[i].nombre_completo != "anonimo")
                        document.getElementById(menu).appendChild(crearTarjetaUsuario(data[i].nombre_completo));
                }
            })
            break;
        case "menu3":
            console.log("entra menu3");
            buscarUsuarioGrupo(id_grupo, function (data) {
                console.log("entra menu3 buscar");
                document.getElementById(menu).innerHTML = "";
                console.log(data)
                for (let i = 0; i < data.length; i++) {
                    document.getElementById(menu).appendChild(crearTarjetaUsuario(data[i].nombre_completo));
                }
            })
            break;
    }


}