/*
    Llama a esta funcion si quieres tener un modal de confirmación,
    le pasas por parametro la función que quieres hacer despues del modal
    y en caso de que el usuario confirme la ejecutara.

    RECORDAR QUE PARA EVITAR QUE UN FORM SE ENVIE AUTOMATICAMENTE ES NECESARIO EL:
    !!!!!!!!!!!!!! event.preventDefault() !!!!!!!!!!!!!!
*/
document.getElementById("closePopUp").addEventListener("click", closePopUp);
document.getElementById("goBack").addEventListener("click", goBack);

/* vuelve hacia atras en el historial de la ventana */
function goBack(){
    window.history.back();
}

/**
 * @param {function} fun Funcion que se llamara luego de confirmar la accion
 * @param {boolean} cancel Si es necesario tener boton de cancelar o no
 * @param {boolean} waitForAnswer Si es necesario esperar a una respuesta no cerrara el modal para que se pueda actualizar
 * mas facilmente a traves de la funcion updateModalText
 * @param {String} texto Texto que se quiera introducir, si no quieres poner nada esta el por defecto
 */
function loadModalConfirmation(fun, cancel, waitForAnswer, texto){
    console.log(texto);
    let text = (texto == undefined) ? "ESTA SEGURO QUE DESEA HACER LA ACCIÓN?" : texto;
    let buttons =        
    "<button id='confirmAction' class='flex-row center button t-fre'>"+
            "<span class='has-text'>ACEPTAR</span>" +
    "</button>";

    if(cancel){
        buttons += 
        "<button id='cancelAction' class='flex-row center button t-fre'>" +
                "<span class='has-text'>CANCELAR</span>" +
        "</button>";
    } 

    let modalConfirmation = 
    "<span id='popUpText' class='t-cha t-m t-center'>" + text + "</span>" +
    "<div class='flex-row center'>" + buttons + "</div>";

    document.getElementById("popUpContent").innerHTML = modalConfirmation;
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

    console.log(document.getElementById("popUp").style.display);
    document.getElementById("popUp").style.display = "block";
}

/* Actualiza el texto del modal*/
function updateModalText(texto){
    document.getElementById("popUpText").innerText = texto;
    console.log("intento 1");
    document.getElementById("confirmAction").remove();
    document.getElementById("cancelAction").innerHTML = "<span class='has-text'>ACEPTAR</span>";
    document.getElementById("cancelAction").style.backgroundColor = "#66ff99";
}

/* devuelve si es de tipo function o no */
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/* te cierra el pop up*/
function closePopUp(){
    document.getElementById("popUp").style.display = "none";
}