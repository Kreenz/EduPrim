function loadStats(menu, groupId, acitivtyId, studentId) {
    return new Promise(resolve => {
      let query = {}
      if(menu == "grupo"){
        /* ESTADISTICAS DEL GRUPO */
        query = {
          col: ["*"],
          tab: ["ACTIVIDAD", "GRUPO_TIENE_ACTIVIDAD", "ENTREGA", "ENTREGA_ALUMNO_ACTIVIDAD", "PREGUNTA_ALUMNO", "PREGUNTA"],
          condition_and: [
            {"GRUPO_TIENE_ACTIVIDAD.id_actividad": "ACTIVIDAD.id_actividad", is_identifier: true}, 
            {"GRUPO_TIENE_ACTIVIDAD.id_grupo" : groupId}, 
            {"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad" : "GRUPO_TIENE_ACTIVIDAD.id_actividad",  is_identifier: true},
            {"ENTREGA.id_entrega": "ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true},
            {"PREGUNTA_ALUMNO.id_entrega":"ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true},
            {"PREGUNTA.id_pregunta":"PREGUNTA_ALUMNO.id_pregunta",  is_identifier: true}]
          //SELECT * FROM actividad, grupo_tiene_actividad WHERE grupo_tiene_actividad.id_actividad = actividad.id_actividad AND grupo_tiene_actividad.id_grupo = 1;
        }
      }
    
      if(menu == "actividad"){
        /* ESTADISTICAS DE LA ACTIVIDAD */
        /* ESTADSITICAS QUE SE PUEDEN HACER:
        1 - Total de personas que han hecho la actividad
        2 - Porcentaje de fallo por pregunta
        3 - Porcentaje de acierto por pregunta 
        4 - Media de la actividad 
        5 - Nota mas comun de la actividad */
        query = {
          col: ["PREGUNTA_ALUMNO.*"],
          tab: ["ENTREGA", "ENTREGA_ALUMNO_ACTIVIDAD", "PREGUNTA_ALUMNO"],
          condition_and: [
            {"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad": acitivtyId},
            {"ENTREGA.id_entrega": "ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true},
            {"PREGUNTA_ALUMNO.id_entrega":"ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true}],
            order_by: {col: ["PREGUNTA_ALUMNO.id_entrega"], type: "ASC"}
          //SELECT * FROM actividad, grupo_tiene_actividad WHERE grupo_tiene_actividad.id_actividad = actividad.id_actividad AND grupo_tiene_actividad.id_grupo = 1;
        }
      } 
    
      if(menu == "usuario"){
        /* ESTADISTICAS DE USUARIO 
        1 - Preguntas correctas 
        2 - Preguntas incorrectas
        3 - Total de aciertos
        4 - Puntuacion total */
        query = {
            
          col: ["PREGUNTA_ALUMNO.*"],
          tab: ["ENTREGA", "ENTREGA_ALUMNO_ACTIVIDAD", "PREGUNTA_ALUMNO"],
          condition_and: [
            {"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad" : acitivtyId},
            {"ENTREGA_ALUMNO_ACTIVIDAD.id_usuario": studentId},
            {"ENTREGA.id_entrega": "ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true},
            {"PREGUNTA_ALUMNO.id_entrega":"ENTREGA_ALUMNO_ACTIVIDAD.id_entrega",  is_identifier: true}]
          //SELECT * FROM actividad, grupo_tiene_actividad WHERE grupo_tiene_actividad.id_actividad = actividad.id_actividad AND grupo_tiene_actividad.id_grupo = 1;
        }
      }
    
      postData({
        type: "search",
        query: query
      }).then(data => {
        if(data.errno) resolve(false);
        else {
          query = {
            col: ["PREGUNTA.*"],
            tab: ["PREGUNTA"],
            condition_and:[
              {"id_actividad": acitivtyId}
            ],
            order_by: {col: ["PREGUNTA.id_actividad"], type: "ASC"}
          }
      
          postData({
            type: "search",
            query: query
          }).then(pregunta => {
            //Preguntas maximas que hay en la actividad
  
            if(pregunta.errno) resolve(false)
            else {
              let max = pregunta.length - 1;
              let init = 0;
              //Todas las respuestas de los usuarios
              let usuarios = [];
              if(data.length > 0){
                
                let usuario = {id_entrega: "", aciertos: 0, respuestas:[]}

                for(let i = 0; i < data.length; i++){
                  
                  if(init > max){
                    usuarios.push(usuario);
                    usuario = {id_entrega: "", aciertos: 0, respuestas:[]}
                    init = 0;
                  }

                  usuario.id_entrega = data[i].id_entrega;
                  let correcto = true;
                  let resAl = "";
                  if(JSON.parse(data[i].respuestas) instanceof Array) {
                    let pregRes = "";
                    resAl = JSON.parse(data[i].respuestas);
                    pregRes = JSON.parse(pregunta[init].respuestas);
                    console.log(pregRes);
                    for(let i = 0; i < resAl.length; i++){
                      Object.keys(resAl[i]).forEach(key =>  {
                        if(resAl[i][key] != pregRes[i][key]) correcto = false;
                      })
                    }
                  } else {
                    resAl = JSON.parse(data[i].respuestas);
                    pregRes = JSON.parse(pregunta[init].respuestas);
                    Object.keys(resAl).forEach(key => {
                      switch(data[i].tipo){
                        case "respuestaRelacionar":
                          if(resAl[key].length == 0 || resAl[key].length != pregRes[key].length)
                            correcto = false;

                          for(let i_part = 0; i_part < resAl[key].length; i_part++){
                            Object.keys(resAl[key][i_part]).forEach(sideKey => {
                              if(resAl[key][i_part][sideKey] != pregRes[key][i_part][sideKey]) correcto = false;
                            })
                          }

                          break;
                        case "respuestaArrastrarVacio":
                          if(resAl[key] instanceof Array) {
                            for(let i_part = 0; i_part < resAl[key].length; i_part++){
                              Object.keys(resAl[key][i_part]).forEach(sideKey => {
                                if(resAl[key][i_part][sideKey] != pregRes[key][i_part][sideKey]) correcto = false;
                              })
                            }
                          } else if(resAl[key] != pregRes[key]) correcto = false;
                          
                          break; 
                        case "respuestaCorta":
                          if(resAl[key].toLowerCase() != pregRes[key].toLowerCase()) correcto = false;
                          break;
                      }
                      
                    })
                  }
                  
                  let res = {num: init+1, respuesta: correcto}
                  usuario.respuestas.push(res);
                  usuario.aciertos += (correcto) ? 1 : 0;
                  init++
                };
                usuarios.push(usuario);

                console.log(usuarios)
                resolve(usuarios)
              }
              
              resolve(false);
            }
            //console.log(data);
            //console.log(pregunta)
      
          })
        }
  
      });
    })
  }
  
  function loadDropboxList(menu){
    return new Promise(resolve => {
      let query = "";
      if(menu == "grupo"){
        query = {
          col: ["*"],
          tab: ["GRUPOS"]
        }

      } else if (menu == "actividad") {
        query = {
          col: ["ACTIVIDAD.*"],
          tab: ["ACTIVIDAD"]
          //SELECT * FROM actividad, grupo_tiene_actividad WHERE grupo_tiene_actividad.id_actividad = actividad.id_actividad AND grupo_tiene_actividad.id_grupo = 1;
        }
        document.getElementById("activityList").innerHTML = "";
      } else if(menu == "usuario" && isSelected(document.getElementById("activityList"))) {
        query = {
          col: ["USUARIOS.*"],
          tab: ["ENTREGA","ENTREGA_ALUMNO_ACTIVIDAD","USUARIOS"],
          condition_and: [{"ENTREGA.id_entrega": "ENTREGA_ALUMNO_ACTIVIDAD.id_entrega", is_identifier: true},{"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad": getId(document.getElementById("activityList").value)}, {"USUARIOS.id_usuario": "ENTREGA_ALUMNO_ACTIVIDAD.id_usuario", is_identifier: true}]
        }
  
        document.getElementById("studentList").innerHTML = "";
      }
    
      if(query != ""){
        postData({
          type: "search",
          query: query
        }).then(data => {
          if(!data.errno){
            if(menu == "grupo"){
              for(let i = 0; i < data.length; i++){
                let opt = document.createElement("option");
                opt.value = "gl" + data[i].id_grupo;
                opt.innerText = data[i].nombre_grupo;
              }
            } else if(menu == "actividad"){
              for(let i = 0; i < data.length; i++){
                let opt = document.createElement("option");
                opt.value = "al" + data[i].id_actividad;
                opt.innerText = data[i].nombre_actividad;
                document.getElementById("activityList").appendChild(opt);
              }
            } else if(menu == "usuario"){
              for(let i = 0; i < data.length; i++){
                let opt = document.createElement("option");
                opt.value = "sl" + data[i].id_usuario;
                opt.innerText = data[i].nombre_completo;
                document.getElementById("studentList").appendChild(opt);
              }
            }
  
            resolve(true);
          } else resolve(false);
  
        })
      } else {
        resolve(false);
      }
    })
    
  }
  
  function isSelected(dropbox){
    return dropbox.length > 1 || dropbox[0].value != "placeholder";
  }