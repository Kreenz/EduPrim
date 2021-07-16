/**
 * Este script deberá incluirse siempre que se quiera acceder a la BBDD o se quiera hacer una peticion POST al servidor
 * 
 * Para utilizar la funcion postData deberemos hacer lo siguiente:
 * 
 * postData(parametros)             <- Primero llamamos a la funcion pasandole los parametros necesarios
 *  .then(                          <- Usamos .then para establecer lo que ocurrira despues de que la funcion devuelva algo
 *      data => {                   <- usamos data como parametro que devuelve postData
 *          console.log(data);      <- Utilizamos la respuesta del servidor como necesitemos, en este caso solo hacemos un console.log para ver el objeto entero
 *      }
 *  );
 * 
 * @version 1.1 Se pueden hacer peticiones que no sean sql especificando una url
 * 
 * @version 1.0 Se pueden hacer consultas a la BBDD a traves de una peticion POST al servidor. Las consultas devuelven un JSON
 */


/**
 * Funcion con la que se hará una peticion POST al servidor
 * @param {Object} data Objeto con los parametros POST que pasaremos al servidor. e.g. { type: "search", query: { col: "*", tab: "USUARIOS"} }
 * @returns {Object} Objeto con la respuesta del servidor a nuestra peticion
 */
async function postData(data = {}, force_url) {
    let url = (force_url) ? force_url : '/'; //la peticion se hara a la raiz del servidor

    //enviamos la peticion y esperamos que fetch nos devuelva el resultado del servidor
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) //Convertimos el Objeto con los parametros en un objeto JSON valido
    });
    return response.json(); // Devolvemos la respuesta del servidor como un Object
}
