var data_preguntas;     // Desde aqui se trabajan los datos de la actividad en curso 
                        // (data_preguntas[indice_pregunta].respuestas = objeto respuesta dependiendo de data_preguntas[indice_pregunta].tipo)
var id_entrega;

var data_respuestas;

var __done;

function accederActividad(id_alumno, id_actividad, callback) {
    let fecha_actual = getPreparedDate();

    data_respuestas = [];
    __done = [];

    postData({
        type: "search",
        query: {
            col: ["*"],
            tab: ["ENTREGA_ALUMNO_ACTIVIDAD"],
            condition_and: [{ "id_usuario": id_alumno }, { "id_actividad": id_actividad }]
        }
    }).then((data) => {
        if (data.length == 0) {
            postData({
                type: "insert",
                query: {
                    tab: "ENTREGA",
                    col: [null, fecha_actual]
                }
            }).then((data) => {
                postData({
                    type: "search",
                    query: {
                        tab: ["ENTREGA"],
                        col: ["*"],
                        order_by: { col: ["id_entrega"], type: "DESC" },
                        limit: 1
                    }
                }).then((data) => {
                    id_entrega = data[0].id_entrega;
                    postData({
                        type: "insert",
                        query: {
                            tab: "ENTREGA_ALUMNO_ACTIVIDAD",
                            col: [id_entrega, id_alumno, id_actividad]
                        }
                    }).then((data) => {
                        initPreguntas(id_actividad, callback);
                    });
                });
            })
        } else {
            id_entrega = data[0].id_entrega;
            postData({
                type: "update",
                query:{
                    tab: "ENTREGA",
                    col: [{"fecha_entrega": fecha_actual}],
                    condition_and: [{"id_entrega": id_entrega}]
                }
            }).then((data) => {
                postData({
                    type: "delete",
                    query: {
                        tab: "PREGUNTA_ALUMNO",
                        condition_and: [{"id_entrega": id_entrega}]
                    }
                }).then((data) => {
                    initPreguntas(id_actividad, callback);
                })
            })
        }
    });
}

function initPreguntas(id_actividad, callback) {

    postData({
        type: "search",
        query: {
            tab: ["PREGUNTA"],
            col: ["*"],
            condition_and: [{"id_actividad": id_actividad}],
            order_by: {col: ["id_pregunta"], type: "ASC"}
        }
    }).then((data) => {
        data_preguntas = data;
        callback();
        for(let i = 0; i < data_preguntas.length; i++){
            postData({
                type: data_preguntas[i].tipo
            }, "/plantilla-respuesta").then(data => {
                
                data_respuestas[i] = JSON.parse(data_preguntas[i].respuestas);
                data_preguntas[i].respuestas = data.plantilla;

                postData({
                    type: "insert",
                    query: {
                        tab: "PREGUNTA_ALUMNO",
                        col: [
                            data_preguntas[i].id_pregunta,
                            id_entrega,
                            data_preguntas[i].enunciado,
                            0,
                            data_preguntas[i].tipo,
                            JSON.stringify(data.plantilla)
                        ]
                    }
                }).then(()=> {__done.push(true)})

                //.then(() => { savePregunta(0); }) //testing
            })
        }
    });

}

function savePregunta(index_pregunta){
    
    postData({
        type: "update",
        query: {
            tab: "PREGUNTA_ALUMNO",
            col: [{"respuestas": JSON.stringify(data_preguntas[index_pregunta].respuestas)}],
            condition_and: [{"id_entrega": id_entrega}, {"id_pregunta": data_preguntas[index_pregunta].id_pregunta}]
        }
    }).then((data) => { 
        //console.log(data);
    //    readPregunta(index_pregunta)
     })
}

function getPreparedDate(){
    let a = new Date();
    let d,m,y;

    d = a.getDate();
    m = a.getMonth() + 1;
    y = a.getFullYear();

    return y + "-" + (m < 10 ? "0"+m : m) + "-" + (d < 10 ? "0"+d : d);
}

/*
function readPregunta(index_pregunta){
    postData({
        type: "search",
        query: {
            tab: ["PREGUNTA_ALUMNO"],
            col: ["*"],
            condition_and: [{"id_entrega": id_entrega}, {"id_pregunta": data_preguntas[index_pregunta].id_pregunta}]
        }
    }).then((data) => {
        let test = JSON.parse(data[0].respuestas);
        test.respuesta = "uwu";
    })
}
*/