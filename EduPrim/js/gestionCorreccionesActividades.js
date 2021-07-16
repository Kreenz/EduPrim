//loadMarkEventListeners(document.getElementById("menu-preview"), "item-preview", "mark-preview", "", true);
//loadMarkEventListeners(document.getElementById("list-items2"), "item-user", "mark-item2", "");

var DataProfressor;
var DataAlumno;
var Datantipo;
var DataEnun;

/* busca la lista de entregas de los usuarios de un grupo */
function searchDoneActivities(id_classroom, id_activity){
    //de momento classroom no se usa, luego ya veremos como lo hacemos
    postData({    
        /* BUSCA LAS ACTIVIDADES HECHAS POR LOS USUARIOS PERTENECIENTES A LA ID DE CLASE Y LA ACTIVIDAD */    
        /*  DEVOLVER nombre_actividad  */
        type: "search",
        query:{
            col:["*"],
            tab:["ENTREGA","ENTREGA_ALUMNO_ACTIVIDAD","GRUPO_TIENE_ACTIVIDAD","USUARIOS"],
            condition_and: [
                {"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad": id_activity},
                //{"GRUPO_TIENE_ACTIVIDAD.id_grupo": id_classroom},
                {"ENTREGA_ALUMNO_ACTIVIDAD.id_entrega": "ENTREGA.id_entrega",  is_identifier: true},
                {"GRUPO_TIENE_ACTIVIDAD.id_actividad": id_activity},
                {"USUARIOS.id_usuario": "ENTREGA_ALUMNO_ACTIVIDAD.id_usuario",  is_identifier: true},
                {"USUARIOS.tipo":"ALU"}]
            }
    }).then(
            data =>{
                //console.log(data)
                if(data.fatal)loadModalConfirmation("", true, false, "Error con la peticion al servidor " + data.errno);
                else {
                    document.getElementById("menu-preview").innerHTML = "";
                    document.getElementsByClassName("list-items2")[0].innerHTML = "";
                    data.forEach(function(element){
                        userItem = crearItem(element.id_entrega, element.nombre_completo);
                        userItem.addEventListener("click", function(event){
                            markItem("mark-item33", event.currentTarget,loadActivity(element.id_entrega));
                        });
                        document.getElementsByClassName("list-items2")[0].appendChild(userItem);
                    });
                }
            }
    );
}

/* Carga la actividad actual en el menu-preview y posteriormente carga la primera pregunta */
function loadActivity(id_entrega){
    let id_actividad = getId(document.getElementsByClassName("mark-item")[0].id);
    //console.log("ID actividad LOAD: "+id_actividad)
    postData({    
        /* AQUI VA CONSULTA CON LA ID_ENTREGA TE DEVUELVE UN SET DE RESPUESTAS DEL ALUMNO */    
        type: "search",
        query: {
            col: ["*"],
            tab: ["ENTREGA_ALUMNO_ACTIVIDAD","PREGUNTA_ALUMNO"],
            //ALOMEJOR PETA EL TEMA DE ( EN EL WHERE Y AND )
            condition_and: [
                {"PREGUNTA_ALUMNO.id_entrega": id_entrega},
                {"ENTREGA_ALUMNO_ACTIVIDAD.id_actividad":id_actividad},
                {"ENTREGA_ALUMNO_ACTIVIDAD.id_entrega": id_entrega}]
        }
        })
    .then( 
        data =>{
            document.getElementById("menu-preview").innerHTML = "";
            for(let i = 0; i < data.length; i++){
                //TODO Generar si hay respuesta o no en los inputs de abajo, 
                let itemPreview = createItemSubMenu(data[i].id_pregunta, i);
                document.getElementById("menu-preview").appendChild(itemPreview);
            }
            
            
            if(isMarked("mark-item33")){
                //cargarPreviewsACT(data,0);
                loadMarkEventListeners(document.getElementById("menu-preview"), "item-preview", "mark-modPreview33", function() {
                    let idEntrega = document.getElementsByClassName("mark-item33")[0].id;
                    let idPregunta = getId(document.getElementsByClassName("mark-modPreview33")[0].id);
                    let idActividad = getId(document.getElementsByClassName("mark-item")[0].id);
                    cargarPreguntaEntrega(idEntrega, idPregunta).then(data =>{
                        cleanUp();
                        cargarPreviewsACT(data,0);
                        cargarPreguntaEntregaProfesor(idActividad, idPregunta,data);
                    });
                }, true);
                document.getElementById("menu-preview").firstChild.classList.add("mark-modPreview33");
                cambiarPreguntaACT(0);
            }else{
                document.getElementById("menu-preview").innerHTML = "";
                document.getElementById("studentResponse").innerHTML = "";
                document.getElementById("nombrePregunta").innerHTML = "NOMBRE PREGUNTA";
                document.getElementById("incorrect").setAttribute("checked","");
            }
            
        }
    );

}

function saveCurrent2(){
    let respuestitas;
    if(document.getElementById("incorrect").checked){
        respuestitas = DataAlumno;
    }
    else if(document.getElementById("correct").checked){
        respuestitas = DataProfressor;
    }
    let idEntrega = document.getElementsByClassName("mark-item33")[0].id;
    let idPregunta = getId(document.getElementsByClassName("mark-modPreview33")[0].id);
    postData({
        type: "update",
        query: {
            tab: "PREGUNTA_ALUMNO",
            col:[{id_pregunta:idPregunta},{id_entrega:idEntrega},{enunciado:DataEnun},{puntuacion:0},{tipo:Datantipo},{respuestas:respuestitas}],
            condition_and:[{id_pregunta: idPregunta}, {id_entrega: idEntrega}]
        }
    }).then(data => {
        loadModalConfirmation("",true,false,"Se ha guardado correctamente");
        cambiarPreguntaACT(idPregunta);
    })
}

document.getElementById("guardarActividad").addEventListener("click",function(){
    saveCurrent2();
})

/* Limpiar los datos actuales */
function cleanUp(){
    document.getElementById("studentResponse").innerHTML = "";
}

/* Tarjetita para el menu de la actividad */
function createItemSubMenu(id_pregunta, i){
    let tarjeta = document.createElement("div");
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let span = document.createElement("span"); 

    tarjeta.setAttribute("class", "item-preview");
    div1.setAttribute("class", "flex-column center item-p-r");
    span.setAttribute("class", "texto t-mini");
    span.innerText = i + 1;
    div1.appendChild(span);
    

    tarjeta.appendChild(div1);

    tarjeta.id = "pe" + id_pregunta;


    return tarjeta;
}

function cambiarPreguntaACT(next){
    if(isMarked("mark-item33")){
        document.getElementById("incorrect").setAttribute("checked","");
        next = parseInt(next);

        let current = parseInt(document.getElementsByClassName("mark-modPreview33")[0].innerText) - 1;
        if(current == undefined) current = 0;
        if((next < 0 && current == 0) || current + next > document.getElementById("menu-preview").childNodes.length - 1) next = 0;
        current += next;

        //console.log(current);
        //falta bloquear que no se pueda subir mas del limite o bajar mas del limite
        document.getElementsByClassName("mark-modPreview33")[0].classList.remove("mark-modPreview33");
        document.getElementById("menu-preview").childNodes[current].classList.add("mark-modPreview33");

        let idActividad = getId(document.getElementsByClassName("mark-item")[0].id);
        let idEntrega = document.getElementsByClassName("mark-item33")[0].id;
        let idPregunta = current + 1;
        
        cargarPreguntaEntrega(idEntrega, idPregunta).then(data => {
            cleanUp();
            cargarPreviewsACT(data,0);
            cargarPreguntaEntregaProfesor(idActividad, idPregunta,data);
        });
    }
}

function cargarPreguntaEntrega(idEntrega, idPregunta){
    return new Promise( resolve => {
        postData({    
            type: "search",
            query:{
                col:["*"],
                tab:["PREGUNTA_ALUMNO"],
                condition_and: [
                    {"PREGUNTA_ALUMNO.id_entrega": idEntrega},
                    {"PREGUNTA_ALUMNO.id_pregunta": idPregunta},
                ]
            }
        }).then(
                data =>{
                    if(data.errno) {
                        loadModalConfirmation("", true, false, "Error con la peticion al servidor " + data.errno);
                        resolve(false);
                    } else {
                        resolve(data);
                    }
                }
        );
    })
}

function cargarPreguntaEntregaProfesor(idActividad, idPregunta,data){
    //return new Promise( resolve => {
        postData({    
            type: "search",
            query:{
                col:["*"],
                tab:["PREGUNTA"],
                condition_and: [
                    {"PREGUNTA.id_actividad": idActividad},
                    {"PREGUNTA.id_pregunta": idPregunta},
                ]
            }
        }).then(
                pregunta =>{
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
                            for(let i = 0; i < resAl.length; i++){
                            Object.keys(resAl[i]).forEach(key =>  {
                                if(resAl[i][key] != pregRes[i][key]) correcto = false;
                            })
                            }
                        } else {
                            resAl = JSON.parse(data[i].respuestas);
                            pregRes = JSON.parse(pregunta[init].respuestas);
                            Object.keys(resAl).forEach(key => {
                            if(resAl[key] != pregRes[key]) correcto = false;
                            })
                        }
                        
                        let res = {num: init+1, respuesta: correcto}
                        usuario.respuestas.push(res);
                        usuario.aciertos += (correcto) ? 1 : 0;
                        init++
                        };
                        usuarios.push(usuario);
                        
                        if(usuarios[0].aciertos = 1){
                            document.getElementById("incorrect").setAttribute("checked","");
                            DataAlumno = data[0].respuestas;
                            DataProfressor= pregunta[0].respuestas;
                            Datantipo = data[0].tipo;
                            DataEnun = data[0].enunciado;
                        }
                        else{
                            document.getElementById("incorrect").setAttribute("checked","");
                            DataAlumno = data[0].respuestas;
                            DataProfressor= pregunta[0].respuestas;
                            Datantipo = data[0].tipo;
                            DataEnun = data[0].enunciado;
                        }
                    }
                }  
        );
    //})
}

function cargarPreviewsACT(data,posicion){
    let ruta = document.getElementById("studentResponse");
    let ejers = JSON.parse(data[posicion].respuestas);
    let plant;
    document.getElementById("nombrePregunta").innerHTML = data[posicion].enunciado;
    console.log(JSON.parse(data[posicion].respuestas));
    switch(data[posicion].tipo){
        case "respuestaOperacionesMatematicas":
            for(let i=0;i < ejers.length;i++){
                plant = document.createElement("div");
                plant.setAttribute("id","ruta"+i);
                plant.appendChild(document.createElement("p").appendChild(document.createTextNode(ejers[i].enunciado+" = "+ ejers[i].resultado)));
                ruta.appendChild(plant);
            }
        break;
        case "respuestaRelacionar":
                let arra1 = ejers.izq;
                let arra2 = ejers.der;
                let rela = ejers.rel;
                for(let j=0;j < rela.length;j++){
                    plant = document.createElement("div");
                    plant.setAttribute("id","ruta"+j);
                    plant.appendChild(document.createElement("p").appendChild(document.createTextNode(arra1[rela[j].i].enunciado+" - "+arra2[rela[j].d].enunciado)));
                    ruta.appendChild(plant);
                }
        break;
        case "respuestaArrastrarVacio":
            plant = document.createElement("p");
            plant.setAttribute("id","ruta0");
            plant.appendChild(document.createTextNode(ejers.rel))
            ruta.appendChild(plant);
        break;
        case "respuestaCorta":
            plant = document.createElement("p");
            plant.setAttribute("id","ruta0");
            plant.appendChild(document.createTextNode(ejers.respuesta))
            ruta.appendChild(plant);
        break;
        case "respuestaOrdenacion":
            plant = document.createElement("div");
            plant.setAttribute("id","ruta0");
            let txt = document.createElement("p");
            for(let i=0;i < ejers.length;i++){
                txt.appendChild(document.createTextNode(ejers[i].resultado+" "));
            }
            plant.appendChild(txt);
            ruta.appendChild(plant);
        break;
        case "respuestaEscoger": case "respuestaMultiopcion":
            for(let i=0;i < ejers.length;i++){
                plant = document.createElement("div");
                plant.setAttribute("id","ruta"+i);
                let evalua;
                if(ejers[i].seleccionado) evalua = "Seleccionado";
                else evalua = "No Seleccionado";
                plant.appendChild(document.createElement("p").appendChild(document.createTextNode(ejers[i].enunciado+" - "+evalua)));
                ruta.appendChild(plant);
            }
        break;
    }

}