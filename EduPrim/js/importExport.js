/**
 * Procedimiento para importar una actividad a partir de un yaml
 * 
 * @param {String} act texto del archivo con los datos a importar
 * @param {Function} callback funcion a ejecutar cuando acabe la insercion de la actividad
 */
function importarActividad(act, callback) {
    let yaml;
    let id_actividad;
    postData({
        type: "parse",
        data: act
    }, "/yaml").then((data) => {
        yaml = data.data;
        
        postData({
            type: "search",
            query: {
                tab: ["ACTIVIDAD"],
                col: ["id_actividad"],
                order_by: { col: ["id_actividad"], type: "DESC"},
                limit: 1
            }
        }).then((data) => {
            id_actividad = data[0].id_actividad + 1;


            postData({}, "/generateCode").then((data) => {
                postData({
                    type: "insert",
                    query: {
                        tab: "ACTIVIDAD",
                        col: [ id_actividad, yaml.nombre_actividad, data.code ]
                    }
                }).then(() => {
                    insertPreguntas(id_actividad, yaml.preguntas, 0, callback);
                });
            });

        });
        
    });
}

function insertPreguntas(id_actividad, preguntas, veces, callback){
    postData({
        type: "insert",
        query: {
            tab: "PREGUNTA",
            col: [veces + 1, id_actividad, preguntas[veces].enunciado, preguntas[veces].url_imagen, preguntas[veces].tipo, JSON.stringify(preguntas[veces].respuestas), preguntas[veces].tiempo]
        }
    }).then((data) => {
        if(veces < (preguntas.length - 1))
            insertPreguntas(id_actividad, preguntas, veces + 1, callback);
        else
            callback();
    })
}

/**
 * Procedimiento para exportar una actividad a formato yml
 * 
 * @param {Object[]} act Array con los objetos pregunta de una actividad
 */
function exportarActividad(act){
    let file = {};

    file["nombre_actividad"] = act[0].nombre_actividad;
    file["preguntas"] = [];

    for(let i = 0; i < act.length; i++){
        file.preguntas[i] = {};
        file.preguntas[i]["enunciado"] = act[i].enunciado;
        file.preguntas[i]["url_imagen"] = act[i].url_imagen;
        file.preguntas[i]["tipo"] = act[i].tipo;
        file.preguntas[i]["tiempo"] = Number.parseInt(act[i].tiempo);
        file.preguntas[i]["respuestas"] = JSON.parse(act[i].respuestas);
    }

    postData({
        type: "stringify",
        data: file
    }, "/yaml").then((data) => {
        downloadData(data.data, file.nombre_actividad + ".yaml");
    })
}

/**
 * Procedimiento para descargar un archivo con los datos pasados
 * 
 * @param {String} data informacion dentro del archivo
 * @param {String} name nombre y extension del archivo
 */
function downloadData(data, name) {
    let link = document.createElement("a");

    data = encodeURIComponent(data);

    link.download = name;
    link.href = "data:text/plain," + data;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}