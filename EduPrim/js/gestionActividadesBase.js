document.getElementById("menuItem1").addEventListener("click", moveToGrupos);
document.getElementById("menuItem2").addEventListener("click", moveToCorrecciones);
document.getElementById("menuItem3").addEventListener("click", moveToActividades);

function moveToGrupos(){
    hidePages();
    document.getElementById("pageBody1").style.display = "flex";
    document.getElementById("menuItem1").classList.add("mark-page");
}

function moveToCorrecciones(){
    hidePages();
    document.getElementById("pageBody2").style.display = "flex";
    document.getElementById("menuItem2").classList.add("mark-page");
}

function moveToActividades(){
    hidePages();
    document.getElementById("pageBody3").style.display = "flex";
    document.getElementById("menuItem3").classList.add("mark-page");
}

function hidePages(){
    let pages = document.getElementsByClassName("pages");
    for(let i = 0; i < pages.length; i++){
        pages[i].style.display = "none";
    }
    document.getElementsByClassName("mark-page")[0].classList.remove("mark-page");
}

/* TODO sacar la ID del prefijo */
function getId(id){
    return id.substring(2,id.length);
}

/* Carga los eventos de la lista que ha devuelto el search */


/* Añadir posibles respuestas a la pregunta */

let abecedario = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
//    "respuestaMultiopcion": "<div class='flex-row center flex-start wrap fW enunciado'><div class='flex-column center'><textarea id='idEnunciado'>Enunciado</textarea></div></div><div id='listActivities' class='flex-row center flex-start wrap fW'><div class='flex-column center'><div class='flex-row center multiopcion'><span class='header-start'>A.</span><textarea id='idRespuesta1' class='maximoarea maximoheigth'></textarea><button id='idDelete' class='buttonMini buttonDelete'><i class='fas fa-trash-alt'></i></button></div><div class='flex-row center multiopcion'><span class='header-start'>B.</span><textarea id='idRespuesta2' class='maximoarea maximoheigth'></textarea><button id='idDelete' class='buttonMini buttonDelete'><i class='fas fa-trash-alt'></i></button></div><div class='flex-row center multiopcion'><span class='header-start'>C.</span><textarea id='idRespuesta3' class='maximoarea maximoheigth'></textarea><button id='idDelete' class='buttonMini buttonDelete'><i class='fas fa-trash-alt'></i></button></div><div class='flex-row center multiopcion'><button id='anadirRespuesta' class='buttonMini buttonAdd'><i class='fas fa-folder-plus'></i></button></div></div></div>",
function addanswer(){
    //console.log(tipoP)
    let boton = document.getElementById("listActivities");
    let hijo = boton.firstElementChild;
    let tipo = document.getElementById("anadirRespuesta").parentNode;
    let ante = document.getElementById("anadirRespuesta").lastChild;
    let multi =document.querySelectorAll('.multiopcion');
    let ultimot = "";
    let letra = "";
    let entrada = false;
    if(multi.length == 0){
        letra = "A";
        entrada = true;
    } else {
        ultimot = multi[multi.length -1].firstElementChild;
        letra = ultimot.textContent.split(".");
    }

    for(let n = 0; n < abecedario.length;n++){
        if(letra[0] == abecedario[n]){
            letra = abecedario[n+1];
            if(entrada) letra = abecedario[n];
            break;
        }
    }
    let tipoP = document.getElementById("tipoPregunta").value;
    if(tipoP == "respuestaEscoger" || tipoP == "respuestaMultiopcion"){
        let m1 =  document.createElement("div");
        m1.setAttribute("class","flex-row center multiopcion");
        hijo.insertBefore(m1,tipo);
        let m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode(letra+"."));
        m1.appendChild(m2);
        let m3 = document.createElement("textarea");
        m3.setAttribute("id","idRespuesta"+(multi.length+1));
        m1.appendChild(m3);
        let m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        m1.appendChild(m4);
        m4.addEventListener("click", e => {
            delAnswer(e, true, tipoP)
        })
        let m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);
        if(tipoP == "respuestaEscoger"){
            m1.addEventListener("click",function(){markItem("mark-itemresp", m1,"","")});
        }
        if(tipoP == "respuestaMultiopcion"){
            m1.addEventListener("click",function(){markItem("mark-itemresp", m1,"","3")});
        }
    }
    else if(tipoP == "respuestaOperacionesMatematicas"){
        let m1 =  document.createElement("div");
        m1.setAttribute("class","flex-row center multiopcion");
        hijo.insertBefore(m1,tipo);
        let m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode(letra+"."));
        m1.appendChild(m2);
        let m3 = document.createElement("input");
        m3.setAttribute("id","idRespuesta"+(multi.length+1)+"-0");
        m3.setAttribute("class", "item-m");
        m1.appendChild(m3);
        m3 = document.createElement("p");
        m3.setAttribute("class", "t-m t-yusei m-r1 m-l1");
        m3.appendChild(document.createTextNode("="));
        m1.appendChild(m3);
        m3 = document.createElement("input");
        m3.setAttribute("id","idRespuesta"+(multi.length+1)+"-1");
        m3.setAttribute("class", "item-ms")
        m1.appendChild(m3);
        let m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        m4.addEventListener("click", e => {
            delAnswer(e, true, tipoP);
        })
        m1.appendChild(m4);
        let m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);
    }
    else if(tipoP == "respuestaOrdenacion"){
        let m1 =  document.createElement("div");
        m1.setAttribute("class","flex-row center multiopcion");
        boton.insertBefore(m1,tipo);
        let m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode((multi.length+1)+"."));
        m1.appendChild(m2);
        let m3 = document.createElement("textarea");
        m3.setAttribute("id","idRespuesta"+(multi.length+1));
        m3.setAttribute("id","idRespuesta"+(multi.length+1));
        m1.appendChild(m3);
        let m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        let letraNumero = (tipoP == "respuestasMapaConceptual");
        m4.addEventListener("click", e =>{
            delAnswer(e, letraNumero, tipoP);
        })
        m1.appendChild(m4);
        let m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);
    }
    else if(tipoP == "respuestasMapaConceptual"){
        let m1 =  document.createElement("div");
        m1.setAttribute("class","flex-row center multiopcion");
        boton.insertBefore(m1,tipo);
        let m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode(letra+"."));
        m1.appendChild(m2);
        let m3 = document.createElement("textarea");
        m3.setAttribute("id","idRespuesta"+(multi.length+1));
        m3.setAttribute("id","idRespuesta"+(multi.length+1));
        m1.appendChild(m3);
        let m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        let letraNumero = (tipoP == "respuestasMapaConceptual");
        m4.addEventListener("click", e =>{
            delAnswer(e, letraNumero, tipoP);
        })
        m1.appendChild(m4);
        let m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);
    }
    else if(tipoP == "respuestaRelacionar"){
        let m1 =  document.createElement("div");
        m1.setAttribute("class","flex-row");
        let m11 = document.createElement("div");
        m11.setAttribute("class","flex-row center multiopcion");
        let m12 = document.createElement("div");
        m12.setAttribute("class","flex-row center multiopcion");
        m1.appendChild(m11);
        m1.appendChild(m12);
        hijo.insertBefore(m1,tipo);

        let m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode(((multi.length/2)+1)+"."));
        m11.appendChild(m2);
        let m3 = document.createElement("textarea");
        m3.setAttribute("id","idRespuesta"+((multi.length/2)+1)+"-0");
        m11.appendChild(m3);
        let m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        m11.appendChild(m4);
        m4.addEventListener("click", e => {
            delAnswer(e, false, tipoP)
        })
        let m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);

        m2 = document.createElement("span");
        m2.setAttribute("class","header-start");
        m2.appendChild(document.createTextNode(((multi.length/2)+1)+"."));
        m12.appendChild(m2);
        m3 = document.createElement("textarea");
        m3.setAttribute("id","idRespuesta"+((multi.length/2)+1)+"-1");
        m12.appendChild(m3);
        m4 = document.createElement("button");
        m4.setAttribute("id","idDelete");
        m4.setAttribute("class","buttonMini buttonDelete");
        //m12.appendChild(m4);
        //m4.addEventListener("click", e => {
        //    delAnswer(e, true, tipoP)
        //})
        m5 = document.createElement("i");
        m5.setAttribute("class","fas fa-trash-alt");
        m5.setAttribute("aria-hidden","true");
        m4.appendChild(m5);
    }
    else{
        alert("no puede")
    }
}

/**
 * Pasas el evento que le hace trigger + si hay que eliminar letra o numero. True para letra false para numero
 * @param {Object} e 
 * @param {boolean} tipo 
 */

function delAnswer(e, tipo, tipoPregunta){
    let item = e.currentTarget.parentNode;
    //letra - numero en TEXTO(no ID)
    let itemIndice = item.firstElementChild.innerText;
    //ID de la respuesta
    let itemId = item.childNodes[1].id;

    if(tipo){
        let indexLetra = getLetraIndex(itemIndice);
        let itemId = item.childNodes[1].id.split("-")[0];
        //Para el tipo de pregunta
        let extra = "";
        itemId = itemId.substring(11,itemId.length);
        item.remove();
        let items = [];
        if(tipoPregunta == "respuestasMapaConceptual") items = document.getElementById("listActivities").childNodes;
        else items = document.getElementById("listActivities").childNodes[0].childNodes;
        for(let i = 0; i < items.length - 1; i++){
            let letraItem = items[i].childNodes[0].innerText; 
            letraItem = letraItem.substring(0, letraItem.length - 1);
            extra = "";
            /* Sacamos el indice de la letra para compararlo con el anterior si es mayor se tiene que modificar*/
            indexLetraItem = getLetraIndex(letraItem);
            
            if(indexLetraItem > indexLetra) {
                items[i].childNodes[0].innerText = abecedario[indexLetra] + ".";
                indexLetra++;
                /* Cambiar ID hay que hacer un switch con los tipos de casos */
                if(tipoPregunta == "respuestaOperacionesMatematicas") {
                    items[i].childNodes[3].id = "idRespuesta" + itemId + extra;
                    extra = "-0";
                }
                items[i].childNodes[1].id = "idRespuesta" + itemId + extra;
                
                itemId++;
            }
        }
    } else {
        //Para el tipo de numeros
        itemIndice = parseInt(itemIndice);
        let items = document.getElementById("listActivities").childNodes;

        if(tipoPregunta == "respuestaRelacionar"){
            items = items[0].childNodes;
            item.parentNode.remove();
        } else item.remove();

        for(let i = 0; i < items.length - 1; i++){
            let numeroItem = items[i].childNodes[0].innerText;
            numeroItem = parseInt(numeroItem.substring(0, numeroItem.length - 1));
            if(tipoPregunta == "respuestaRelacionar") {
                numeroItem = items[i].childNodes[0].childNodes[0].innerText
                numeroItem = parseInt(numeroItem.substring(0, numeroItem.length - 1));
            }
            if(numeroItem > itemIndice) {
                if(tipoPregunta == "respuestaRelacionar"){
                    items[i].childNodes[0].firstChild.innerText = itemIndice + ".";
                    items[i].childNodes[0].childNodes[1].id = "idRespuesta" + itemIndice + "-0";
                    
                    items[i].childNodes[1].firstChild.innerText = itemIndice + ".";
                    items[i].childNodes[1].childNodes[1].id = "idRespuesta" + itemIndice + "-1";
                } else {
                    items[i].childNodes[0].innerText = itemIndice + "."; 
                    items[i].childNodes[1].id = "idRespuesta" + parseInt(itemIndice);    
                }
                itemIndice++;
            }
        }
    }
}

/**
 * Sacas el indice de la letra
 * @param {String} letra 
 */
function getLetraIndex(letra){
    for(let n = 0; n < abecedario.length;n++){
        if(letra[0] == abecedario[n]) return n;
    }
}