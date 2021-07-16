function anadirActividadGrupo(idActividad, idGrupo){
    postData({
        type: "insert",
        query: {
            tab: "GRUPO_TIENE_ACTIVIDAD",
            col: [idActividad, idGrupo]
        }
    }).then(data =>{
        if(!data.errno){
            cargarGrupos(idActividad).then(
                resolve => {
                    if(resolve) cargarGruposActividad(idActividad);
                }
            )
        } else 
            loadModalConfirmation(
                "", 
                false, 
                false, 
                "<span class='t-yusei t-b t-center'>Error a la hora de guardar la actividad("+ idActividad +") en el Grupo("+ idGrupo +")." + data.errno + "</span>"
            );
    })
}

function quitarActividadGrupo(idActividad, idGrupo){
    postData({
        type: "delete",
        query: {
            tab: "GRUPO_TIENE_ACTIVIDAD",
            condition_and: [
                {id_actividad: idActividad},
                {id_grupo: idGrupo}
            ]
        }
    }).then(data =>{
        if(!data.errno){
            cargarGrupos(idActividad).then(
                resolve => {
                    if(resolve) cargarGruposActividad(idActividad);
                }
            )
        } else 
            loadModalConfirmation(
                "", 
                false, 
                false, 
                "<span class='t-yusei t-b t-center'>Error a la hora de borrar la actividad("+ idActividad +") del Grupo("+ idGrupo +")." + data.errno + "</span>"
            );

    })
}

async function cargarGruposActividad(idActividad){
    return new Promise(resolve => {
        postData({
            type: "search",
            query:{
                tab:["GRUPOS", "GRUPO_TIENE_ACTIVIDAD"],
                col:["GRUPOS.*"],
                condition_and:[{"GRUPO_TIENE_ACTIVIDAD.id_actividad": idActividad}, {"GRUPOS.id_grupo": "GRUPO_TIENE_ACTIVIDAD.id_grupo", is_identifier: true}]
            }
        }).then( data => {
            
            if(!data.errno){
                document.getElementById("menu3").innerHTML = "";
                data.forEach(element => {
                    document.getElementById("menu3").appendChild(crearTarjeta("ga"+element.id_grupo,element.nombre_grupo, ""));
                });
    
                loadMarkEventListeners(document.getElementById("menu3"), "item-user", "mark-item-3", "", true);
                resolve(true);
            } else resolve(false);
        })
        
    })
}

//SELECT `GRUPOS`.* FROM `GRUPOS`,`GRUPO_TIENE_ACTIVIDAD` WHERE (`GRUPO_TIENE_ACTIVIDAD`.`id_actividad` NOT = '2' AND `GRUPOS`.`id_grupo` = `GRUPO_TIENE_ACTIVIDAD`.`id_grupo`);

async function cargarGrupos(idActividad){
    return new Promise(resolve => {
        postData({
            type: "search",
            query:{
                tab:["GRUPOS"],
                col:["*"]
            }
        }).then( grupos => {
            if(!grupos.errno){
                postData({
                    type: "search",
                    query:{
                        tab:["GRUPO_TIENE_ACTIVIDAD"],
                        col:["*"],
                        condition_and:[{"GRUPO_TIENE_ACTIVIDAD.id_actividad": idActividad}]
                    }
                }).then( data => {
                    if(!data.errno){
                        
                        document.getElementById("menu2").innerHTML = "";
                        for(let i_grupo = 0; i_grupo < grupos.length; i_grupo++){
                            let esta = false;
                            for(let i_grupo_actividad = 0; i_grupo_actividad < data.length; i_grupo_actividad++){
                                if(data[i_grupo_actividad].id_grupo == grupos[i_grupo].id_grupo) esta = true;
                                if(esta)break;
                            }
                            if(!esta) document.getElementById("menu2").appendChild(crearTarjeta("gs"+grupos[i_grupo].id_grupo, grupos[i_grupo].nombre_grupo, ""));
                        }

                        loadMarkEventListeners(document.getElementById("menu2"), "item-user", "mark-item-2", "", true);
                        resolve(true);
                    } else resolve(false)
                })
            } else resolve(false);
        })
    })
}