
window.onload = () => {

    tryPopulating();

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

    document.getElementById("registrarse").addEventListener("click", function(event){
        event.preventDefault();
        let modificar = false;
        let items = document.getElementsByClassName("mark-item");
        for(let i = 0; i < items.length; i++){
            if(items[i].classList.contains("mark-item")) {
                modificar = true;
            }
        }
        checkData(modificar);
    });
    
    document.getElementById("addItem").addEventListener("click", addItem);
    document.getElementById("deleteItem").addEventListener("click", deleteItem);
    
    document.getElementById("grupo").addEventListener("click", function(e){
        e.preventDefault();
        if(document.getElementById("textoId").innerText == "REGISTRARSE") loadModalConfirmation(redirectToGrupos, true, false, "<span class='t-yusei has-text' data-text='general-warnGoGroup'>Esta seguro que desea ir a grupos? El usuario actual no se registrara.</span>");
        else redirectToGrupos();
    });
    
    document.getElementById("tipoCuenta").addEventListener("change", function(e){
        let tipo = document.getElementById("tipoCuenta").value;
        searchUsers(tipo);
    })
    
    searchUsers();
}


function redirectToGrupos(){
    window.location.href = "?type=html&page=gestionGrupos";
}


/**
 * Comprueba si hay algun campo vacio o no encajan las passwords
 * @param {boolean} modificar Boolean que se le pasa para saber si se tiene que hacer update o create (update = true)
 */
function checkData(modificar){
    let updated = document.getElementById("textoId").innerText;
    let formulario = document.forms["registrar"];
    let user = formulario.elements["nombre"].value + " " + formulario.elements["apellidos"].value;
    let password = formulario.elements["password"].value;
    let checkPass = formulario.elements["confirmPassword"].value;
    let type = formulario.elements["tipoCuenta"].value;
    let grupo = formulario.elements["grupo"].value;
    let check = true;

    if(password == "" && updated == "REGISTRARSE"){
        check = false;
        formulario.elements["password"].style.border = "2px solid red";
    } else {
        formulario.elements["password"].style.border = "2px solid #565656";
    }

    if(password != checkPass && updated == "REGISTRARSE"){
        check = false;
        formulario.elements["confirmPassword"].style.border = "2px solid red";
        formulario.elements["confirmPassword"].style.color = "red";
    } else {
        formulario.elements["confirmPassword"].style.border = "2px solid #565656";
    }
    
    if( (formulario.elements["nombre"].value).trim() == ""){ // || (formulario.elements["apellidos"].value).trim() == ""
        check = false;
        if((formulario.elements["nombre"].value).trim() == "") formulario.elements["nombre"].style.border = "2px solid red";
        //if((formulario.elements["apellidos"].value).trim() == "") formulario.elements["apellidos"].style.border = "2px solid red";
    } else {
        formulario.elements["nombre"].style.border = "2px solid #565656";
        formulario.elements["apellidos"].style.border = "2px solid #565656";
    }

    if(check){
        formulario.elements["password"].style.border = "2px solid #66ff99";
        formulario.elements["confirmPassword"].style.border = "2px solid #66ff99";
        formulario.elements["nombre"].style.border = "2px solid #66ff99";
        formulario.elements["apellidos"].style.border = "2px solid #66ff99";
        loadModalConfirmation(function(){
            gatherData(modificar);
        }, true, true);
    }

}

/**
 * Recoge los datos que hay en el formulario y los pasa en los updates
 * @param {boolean} update  Boolean que se le pasa para saber si se tiene que hacer update o create (update = true)
 */
function gatherData(update){
    let formulario = document.forms["registrar"];
    if(document.getElementsByClassName("mark-item")[0] != undefined) formulario.elements["userid"].value = (document.getElementsByClassName("mark-item")[0] == undefined) ? 0 : document.getElementsByClassName("mark-item")[0].id;
    if(document.getElementsByClassName("mark-item")[0] != undefined) formulario.action = "/updateUsuario";
    formulario.submit();
    /*let id_user = "";
    if(update) id_user = document.getElementsByClassName("mark-item")[0].id;
    let user = formulario.elements["nombre"].value + " " + formulario.elements["apellidos"].value;
    let password = formulario.elements["password"].value;
    let type = formulario.elements["tipoCuenta"].value;
    let grupo = formulario.elements["grupo"].value;

    //TODO Hay que poner que este pensado el grupo, besos a quien le toque despues
    if(update) updateUser(id_user, user, password, type);
    else createUser(user,password,type);*/
}

/**
 * Crea el usuario con los datos pasados por parametro
 * @param {String} user Nombre del usuario completo 
 * @param {String} password Contrasñea del usuario
 * @param {String} type Tipo de cuenta del usuario
 */

function createUser(user, password, type){
    searchUsers();
    postData({type:"insert", tab: "USUARIOS(id_usuario,nombre_completo,contrasena,tipo)", col: "(null,'"+ user +"','"+ password +"', '"+ type +"')"})
    .then(
        data =>{
            if(data.fatal)updateModalText("<span class='has-text' data-text='general-errConnection'>Error con la conexión al servidor </span>"+ data.errno);
            else {
                updateModalText("<span class='has-text' data-text='listaUsuarios-usuarioCreado'>Se ha creado correctamente el usuario.</span>");
                searchUsers();
                cleanUpForm();
            }
        }
    );
}

/**
 * Actualiza el usuario con los datos correspondientes, utiliza el id user para ver que usuario es
 * @param {String} id_user 
 * @param {String} user 
 * @param {String} password 
 * @param {String} type 
 */

function updateUser(id_user, user, password, type){
    postData({
        type:"update",
        query:{
            tab:"USUARIOS",
            col:[{nombre_completo: user}, {contrasena: password}, {tipo: type}],
            condition_and: [{id_usuario: id_user}]
        }
    }).then(
        data => {
            if(data.fatal) updateModalText("<span class='has-text' data-text='general-errConnection'>Error con la conexión al servidor </span>"+ data.errno);
            else{
                updateModalText("<span class='has-text' data-text='general-actualizado'>Se ha actualizado correctamente</span>");
                cleanUpForm();
                searchUsers();
            }
        }
    )
    
}

/**
 * Borra el usuario de la base de datos en funcion de la id
 * @param {String} id_user 
 */
function deleteUser(id_user){
    postData({
            type:"delete",
            query:{
                tab:["USUARIOS"],
                condition_and: [{id_usuario: id_user}]
            }
        }).then(
        data => {
            updateModalText("Se ha borrado el usuario con exito");
            searchUsers();
            changeButton("REGISTRARSE")
            cleanUpForm();
        }
    );
}

//4.1 CREACIÓN GRUPOS   

/**
 * Funcion que limpia el formulario
 */
function cleanUpForm(){
    let formulario = document.forms["registrar"];
    formulario.elements["nombre"].value = "";
    formulario.elements["apellidos"].value = "";
    formulario.elements["password"].value = "";
    formulario.elements["confirmPassword"].value = "";
    formulario.elements["password"].style.border = "2px solid #565656";
    formulario.elements["confirmPassword"].style.border = "2px solid #565656";
    formulario.elements["nombre"].style.border = "2px solid #565656";
    formulario.elements["apellidos"].style.border = "2px solid #565656";
}

/**
 * Funcion que comprueba al hacer click en delete si hay algo seleccionado
 */
function deleteItem(){
    let items = document.getElementsByClassName("mark-item");
    if(items.length == 1){
        loadModalConfirmation(function(){
            deleteUser(items[0].id);    
        }, true, true);
    } else {
        let text = "";
        if(items.length < 1) text = "<span class='has-text' data-text='general-errNoUserSelected'>No hay un usuario seleccionado</span>";
        else text = "<span class='has-text' data-text='general-tooManyUsers'>Demasiados usuarios seleccionados</span>";
        loadModalConfirmation("", true, false, text);
    }
}

/**
 * Funcion que limpia el formulario y el/los items seleccionados en caso de que haya alguno
 */
function addItem(){
    cleanUpForm();
    changeButton("REGISTRARSE");
    let items = document.getElementsByClassName("item-user");
    for(let i = 0; i < items.length; i++){
        if(items[i] != event.currentTarget && items[i].classList.contains("mark-item")){
            items[i].classList.remove("mark-item");
        };
    }
}

function changeButton(text){
    let el = document.getElementById("textoId");
    el.innerHTML = text;
    tryPopulatingElement(el.childNodes[0]);
}

/**
 * Busca el usuario en la base de datos y carga sus datos
 * @param {String} id_user 
 * 
 */
function loadData(id_user){
    if(id_user == ""){
        cleanUpForm();
    } else {
        changeButton("<span class='has-text' data-text='general-save'>GUARDAR</span>");
        postData({
            type:"search",
            query:{
                col:["*"],
                tab:["USUARIOS"],
                condition_and: [{id_usuario: id_user}]
            }
        })
        .then(
            data =>{
                if(data.fatal)loadModalConfirmation("", true, false, "<span class='has-text' data-text='general-errConnection'>Error con la conexión al servidor </span>" + data.errno);
                else{
                    if(data.length > 1) {
                        loadModalConfirmation("", true, false, "<span class'has-text' data-text='listaUsuarios-errUsuarioDuplicado'>Se han encontrado multiples usuarios con la misma ID</span>");
                    } else {
                        let formulario = document.forms["registrar"];
                        formulario.elements["nombre"].value = (data[0].nombre_completo).split(" ")[0];
                        formulario.elements["apellidos"].value = ((data[0].nombre_completo).split(" ")[1]) ? (data[0].nombre_completo).split(" ")[1]: "";
                        if(data[0].tipo == "ADM") formulario.elements["tipoCuenta"].selectedIndex = 2;
                        else if(data[0].tipo == "PRF") formulario.elements["tipoCuenta"].selectedIndex = 0;
                        else formulario.elements["tipoCuenta"].selectedIndex = 1;

                        //TODO Grupos va aqui hay que hacer joins y prefiero que primero funcione casi todo
                    }
                }
            }
        );
    }
}

/**
 * Pasa por parametro los datos del evento actual, actualiza la interfaz y luego llama a loadData en caso que sea necesario
 * @param {Object} event 
 */
function markItem(event){
    if(!event.currentTarget.classList.contains("mark-item")){
        event.currentTarget.classList.add("mark-item");
        loadData(event.currentTarget.id);
    }
    else {
        event.currentTarget.classList.remove("mark-item");
        cleanUpForm();
        changeButton("<span class='has-text' data-text='general-register'>REGISTRARSE</span>");
    }
    let items = document.getElementsByClassName("item-user");
    for(let i = 0; i < items.length; i++){
        if(items[i] != event.currentTarget && items[i].classList.contains("mark-item")){
            items[i].classList.remove("mark-item");
        };
    }
}



/**
 * Funcion que busca en base al nombre del input, en caso de estar vacio devuelve todos
 * @param {String} grupo 
 * @param {String} tipo 
 */
function searchUsers(tipo){
    let type = !(tipo == undefined);
    if(tipo == "todos") type = false;
    let userItem = "";

    let userItems = document.getElementsByClassName("item-user");
    while(userItems.length > 0){
        userItems[0].parentNode.removeChild(userItems[0]);
    }

    let text = (document.getElementById("search").value != "");
    //TODO Hay que actualizar 
    let texto = text ? document.getElementById("search").value + "%" : "%";
    if(type){
        postData({        
            type: "search",
            query: {
                col: ["*"],
                tab: ["USUARIOS"], 
                condition_like: [{nombre_completo: texto}],
                condition_and: [{tipo:tipo}]
            }
            })
        .then(
                data =>{
                    if(data.fatal)loadModalConfirmation("", true, false, "<span class='has-text' data-text='general-errConnection'>Error con la conexión al servidor </span>" + data.errno);
                    else if(data.length == 0) loadModalConfirmation("", true, false, "<span class='has-text' data-text='general-noResults'>No se han encontrado resultados</span>");
                    else{
                        data.forEach(function(element){
                            if(element.nombre_completo != "anonimo"){
                                userItem = crearTarjeta(element.id_usuario, element.nombre_completo);
                                userItem.addEventListener("click", function(event){
                                    markItem(event);
                                });
        
                                document.getElementsByClassName("list-items")[0].appendChild(userItem);
                                //document.getElementsByClassName("list-items")[0].appendChild(crearTarjeta(element.id_usuario, element.nombre_completo));
                                //document.getElementsByClassName("list-items")[0].appendChild(crearTarjeta(element.id_usuario, element.nombre_completo));
                            }
                        });
                        cleanUpForm();
                    }
                }
        );
    } else {
        postData({        
            type: "search",
            query: {
                col: ["*"],
                tab: ["USUARIOS"], 
                condition_like: [{nombre_completo: texto}]
            }
            })
        .then(
                data =>{
                    if(data.fatal)loadModalConfirmation("", true, false, "<span class='has-text' data-text='general-errConnection'>Error con la conexión al servidor </span>" + data.errno);
                    else if(data.length == 0) loadModalConfirmation("", true, false, "<span class='has-text' data-text='general-noResults'>No se han encontrado resultados</span>");
                    else{
                        data.forEach(function(element){
                            if(element.nombre_completo != "anonimo"){
                                userItem = crearTarjeta(element.id_usuario, element.nombre_completo);
                                userItem.addEventListener("click", function(event){
                                    markItem(event);
                                });
                                
                                document.getElementsByClassName("list-items")[0].appendChild(userItem);
                                //document.getElementsByClassName("list-items")[0].appendChild(crearTarjeta(element.id_usuario, element.nombre_completo));
                                //document.getElementsByClassName("list-items")[0].appendChild(crearTarjeta(element.id_usuario, element.nombre_completo));
                            }
                        });
                        cleanUpForm();
                    }
                }
        );
    }


}

/**
 * Funcion que crea una tarjeta html
 * @param {String} id_tarjeta 
 * @param {String} nombre 
 */
function crearTarjeta(id_tarjeta, nombre) {
    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    
    tarjeta.setAttribute("class", "flex-row item-user");
    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-row center");
    span.setAttribute("class", "t-yusei t-m");

    div.appendChild(span);
    span.innerText = nombre;

    tarjeta.appendChild(i1);
    tarjeta.appendChild(div);
    tarjeta.id = id_tarjeta;

    return tarjeta;
}