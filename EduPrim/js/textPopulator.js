/**
 * Este script deberá incluirse siempre para poder dar soporte multiidioma a la aplicacion
 * 
 * Para poder utilizar este script tambien se necesitara client_connector.js
 * 
 * Para mas informacion de como utilizar este script ver la wiki del git
 * 
 * @version 1.3
 *   Control de idioma para un solo elemento del html
 * 
 * @version 1.2
 *   Control del idioma del usuario
 * 
 * @version 1.1
 *   Cambios pequenos para poder usar el nuevo conector a la BBDD
 * 
 * @version 1.0
 *   Se aceptan textos dentro de etiquetas y placeholders
 */

/**
 * Procedimiento que guarda la lengua en la que el usuario utilizara la aplicacion
 * 
 * @param {String} lang 
 */
 function saveLang(lang){
    postData({
        type: "set",
        data: {
            "lang": lang
        }
    }, "/session").then(() => {
        populate(lang);
    })
}

/**
 * Procedimiento que inicializara la pagina en el idioma guardado por el usuario o en su defecto castellano
 */
function tryPopulating(){
    postData({
        type: "get",
        data: {
            "lang": true
        }
    }, "/session").then((data) => {
        if(!data.value){
            postData({
                type: "set",
                data: {
                    "lang": "es"
                }
            }, "/session").then(() => {
                populate("es");
            })
        } else {
            populate(data.value);
        }
    });
}

/**
 * Procedimiento que intentara colocar texto en el elemento html pasado
 * 
 * @param {Element} element el elemento al que se le quiere poner texto
 */
function tryPopulatingElement(element){
    postData({
        type: "get",
        data: {
            "lang": true
        }
    }, "/session").then((data) => {
        if(!data.value){
            postData({
                type: "set",
                data: {
                    "lang": "es"
                }
            }, "/session").then(() => {
                if(element.classList.contains("has-text")){
                    populateText([element], "es");
                }
                if(element.classList.contains("has-placeholder")){
                    populatePlaceholder([element], "es");
                }
            })
        } else {
            if(element.classList.contains("has-text")){
                populateText([element], data.value);
            }
            if(element.classList.contains("has-placeholder")){
                populatePlaceholder([element], data.value);
            }
        }
    });
}

 /**
  * Procedimiento que deberá ser llamada en window.onload para inicializar el texto del documento html
  * 
  * @param {String} lang el idioma (es | cat | en)
  */
function populate(lang){
    populatePlaceholder(document.getElementsByClassName("has-placeholder"), lang);
    populateText(document.getElementsByClassName("has-text"), lang);
}

/**
 * Procedimiento con el que se escribe el texto necesario del documento
 * 
 * @param {Element[]} elements los elementos donde escribir
 * @param {String} language el idioma
 */
function populateText(elements, language){
    for(let i = 0; i < elements.length; i++){
        let textId = elements[i].getAttribute("data-text");
        postData({type:"text", query:{id:textId, lang:language}}).then((data) => {
            elements[i].innerText = data[0][Object.keys(data[0])[0]];
        });
    }
}

/**
 * Procedimiento con el que se escriben los placeholders necesarios del documento
 * 
 * @param {Element[]} elements los elementos donde escribir
 * @param {String} language el idioma
 */
function populatePlaceholder(elements, language){
    for(let i = 0; i < elements.length; i++){
        let textId = elements[i].getAttribute("data-placeholder");
        postData({type:"text", query:{id:textId, lang:language}}).then((data) => {
            elements[i].setAttribute("placeholder", data[0][Object.keys(data[0])[0]]);
        });
    }
}
