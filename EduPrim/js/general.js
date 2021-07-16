/*
    Llama a esta funcion si quieres tener un modal de confirmación,
    le pasas por parametro la función que quieres hacer despues del modal
    y en caso de que el usuario confirme la ejecutara.

    RECORDAR QUE PARA EVITAR QUE UN FORM SE ENVIE AUTOMATICAMENTE ES NECESARIO EL:
    !!!!!!!!!!!!!! event.preventDefault() !!!!!!!!!!!!!!
*/
if(document.getElementById("closePopUp") != undefined) document.getElementById("closePopUp").addEventListener("click", closePopUp);
if(document.getElementById("goBack") != undefined) document.getElementById("goBack").addEventListener("click", goBack);
//if(document.getElementById("logOut") != undefined) document.getElementById("logOut").addEventListener("click", logOut);

/* vuelve hacia atras en el historial de la ventana */
function goBack(){
    window.history.back();
}

/* destruye la session */
function logOut(){
    window.location.href = "/logOut";
}

/**
 * @param {function} fun Funcion que se llamara luego de confirmar la accion
 * @param {boolean} cancel Si es necesario tener boton de cancelar o no
 * @param {boolean} waitForAnswer Si es necesario esperar a una respuesta no cerrara el modal para que se pueda actualizar
 * mas facilmente a traves de la funcion updateModalText
 * @param {String} texto Texto que se quiera introducir, si no quieres poner nada esta el por defecto
 */
function loadModalConfirmation(fun, cancel, waitForAnswer, texto){
    let text = (texto == undefined) ? "<span class='t-yusei t-b t-center has-text' data-text='general-modalConfirm'></span>" : texto;
    let buttons =        
    "<button id='confirmAction' class='flex-row center button t-fre'>"+
            "<span class='has-text' data-text='general-aceptar'>ACEPTAR</span>" +
    "</button>";

    if(cancel){
        buttons += 
        "<button id='cancelAction' class='flex-row center button t-fre'>" +
                "<span class='has-text' data-text='general-cancelar'>CANCELAR</span>" +
        "</button>";
    } 

    let modalConfirmation = 
    "<div id='popUpText' class='flex-column center'>" + text + "</div>" +
    "<div class='flex-row center'>" + buttons + "</div>";

    document.getElementById("popUpContent").innerHTML = modalConfirmation;
    tryPopulatingElement(document.getElementById("popUpText").childNodes[0]);
    tryPopulatingElement(document.getElementById("confirmAction").childNodes[0]);
    if(cancel)
        tryPopulatingElement(document.getElementById("cancelAction").childNodes[0]);

    if(waitForAnswer){
        console.log("esperamos respuesta");
        document.getElementById("confirmAction").addEventListener("click",function(){
            if(isFunction(fun))fun.call();
        });
    } else {
        document.getElementById("confirmAction").addEventListener("click",function(){
            closePopUp();
            if(isFunction(fun))fun.call();
        });
    }

    if(cancel) {
        document.getElementById("cancelAction").addEventListener("click", function(){
            closePopUp();
        });
    }

    //console.log(document.getElementById("popUp").style.display);
    document.getElementById("popUp").style.display = "block";
}

/* Actualiza el texto del modal*/
function updateModalText(texto){
    document.getElementById("popUpText").innerHTML = texto;
    console.log("intento 1");
    document.getElementById("confirmAction").remove();
    document.getElementById("cancelAction").innerHTML = "<span class='has-text' data-text='general-aceptar'>ACEPTAR</span>";
    document.getElementById("cancelAction").style.backgroundColor = "#66ff99";
    
    tryPopulatingElement(document.getElementById("cancelAction").childNodes[0]);
    tryPopulatingElement(document.getElementById("popUpText").childNodes[0]);
}

/* devuelve si es de tipo function o no */
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/* te cierra el pop up*/
function closePopUp(){
    document.getElementById("popUp").style.display = "none";
}

/* Genera la tarjeta del item */
function crearItem(id_tarjeta, nombre) {
    let tarjeta = document.createElement("div");
    let i1 = document.createElement("i");
    let div = document.createElement("div");
    let span = document.createElement("span");
    
    tarjeta.setAttribute("class", "flex-row item-user");
    i1.setAttribute("class", "icon-activity");
    div.setAttribute("class", "flex-row center");
    span.setAttribute("class", "texto t-s");

    div.appendChild(span);
    span.innerText = nombre;

    tarjeta.appendChild(i1);
    tarjeta.appendChild(div);
    tarjeta.id = id_tarjeta;

    return tarjeta;

    
}

function loadMarkEventListeners(menu, selector, marker, fun, exception){
    let items = menu.childNodes;
    for(let i = 0; i < items.length; i++){
        if(items[i].classList){
            if(items[i].classList.contains(selector)){
                items[i].addEventListener("click", function(){
                    markItem(marker, items[i], fun, exception);
                });
            }
        }
    }
}
/**
 * Passa por parametro la clase que actua como marcador en una lista, si no hay nada saldra un popUp de error y te devolvera
 * si esta o no.
 * @param {String} marker marcador que se usa para verificar que hay algo marcado
 */
function isMarked(marker){
    let markItem = (document.getElementsByClassName(marker).length == 1);
    return markItem;
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
        if(isFunction(fun))fun.call();
    }
}

/* Hace un substring a la ID para sacar su valor */
function getId(id){
    return parseInt(id.substring(2, id.length));
}
