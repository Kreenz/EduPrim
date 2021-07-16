/**
 * ---SERVIDOR BASADO EN NODE.JS---
 *   --EN PROCESO DE DESARROLLO--
 * 
 * Requisitos:
 *   npm install express
 *   npm install express-session
 *   npm install mysql
 *   npm install bcryptjs
 *   npm install js-yaml
 *   archivo mysql-config.json con los datos de la base de datos, e.g.:
 *      {
 *        "host": "localhost",
 *        "user": "",
 *        "password": "",
 *        "database": "eduPrim"
 *      }
 * 
 * @version 1.13.3
 *   Fix usuario sin apellido
 * 
 * @version 1.13.2
 *   Fix Vagrant cambiando la dependencia bcrypt por bcryptjs
 * 
 * @version 1.13.1
 *   Gestion del anonimo en auth y logout
 * 
 * @version 1.13
 *   Generacion de codigos para las actividades
 * 
 * @version 1.12
 *   Gestion de YAML
 * 
 * @version 1.11.2
 *   Fix ruta de las imagenes
 * 
 * @version 1.11.1
 *   Fix tamaño maximo de los json + aceptar cualquier extension en las imagenes
 * 
 * @version 1.11
 *  Re-direccionamiento en base al rol del usuario y en caso de no existir alguna pagina 
 * 
 * @version 1.10
 *   Ya se pueden subir imagenes al servidor para que las hostee
 * 
 * @version 1.9
 *   Generacion de nombre aleatorio de anonimos
 * 
 * @version 1.8
 *   Posibilidad de pedir el HTML de las preguntas y respuestas de actividades a través de POST
 * 
 * @version 1.7
 *   Posibilidad de devolver una plantilla de un objeto respuesta
 * 
 * @version 1.6
 *   Añadido encriptacion de contraseñas + login encriptado con bcrypt
 * 
 * @version 1.5
 *   Posibilidad de devolver los datos de inicio de sesion del cliente
 *   Posibilidad de guardar atributos de sesion
 * 
 * @version 1.4.1
 *   Cambios necesarios para usar el nuevo conector a la BBDD
 * 
 * @version 1.4
 *   Añadido sistema de logIn en el servidor 
 *   TODO Añadir control de permisos a las urls
 * 
 * @version 1.3
 *   Se ha añadido soporte multiidioma para la aplicacion
 * 
 * @version 1.2.1
 *   Se han corregido errores por los cuales no se podian hacer peticiones POST al servidor
 * 
 * @version 1.2
 *   Se ha cambiado la estructura en relacion al acceso a la BBDD:
 *     Se ha generado un modulo con el que se hace la conexion a la BBDD
 *     Ahora las consultas se hacen desde una peticion POST
 * 
 * @version 1.1
 *   Ahora se procesa un nuevo type: sql, este tipo necesita otro parametro llamado query con la consulta sql
 *   Ademas, se muestran todas las IPs en las que esta escuchando el servidor al encenderlo
 * 
 * @version 1.0 
 *   Se procesan requests de recursos especificos (.html, .js, .css...) y recursos diversos (res)
 *     Los recursos especificos se ubican dentro de una carpeta con el nombre de la extension. e.g. html/example.html
 *     Los recursos diversos se ubican dentro de la carpeta res (o dentro de una subcarpeta), y pueden tener cualquier extension
 *   Se procesa mostrar una pagina por defecto en caso de que falten parametros, dependiendo de el tipo de usuario se muestra una cosa u otra
 */

//const { query } = require('express');
const express = require('express');         //npm install express
//No lo pongas en constante que se tiene que poder modificar
var session = require('express-session');  //npm install express-session

const bcrypt =  require('bcryptjs');  
const salt = 10;

const app = express();
const port = 8080; //puerto 8080 de momento

const yaml = require('js-yaml');

const bbdd = require('./server_connector');
const rPlantilla = require('./plantilla-respuesta.json');
const path = require('path');
const { networkInterfaces, type } = require('os');
const fs = require('fs');
const { nextTick } = require('process');
const { response } = require('express');

const respuesta = require('./respuestaAlumno.json');
const pregunta = require('./preguntaProfesor.json');
const anonimo = require('./nombresAnonimos.json');

//TODO log in a .log file
const GET_CONSOLE_LOG = false;
const POST_CONSOLE_LOG = false;
const IMG_TIME_LOG = false;

function getIpAdresses() {
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    return results;
}

app.use(express.urlencoded());
app.use(express.json({limit:'50mb'}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//TODO Optimizar los search, seguro que se pueden hacer juntitos y pensarlo mejor gracias (HAY QUE TESTEARLO)
app.post('/updateUsuario' , function(req, res){
    let user = (req.body.nombre + " " + req.body.apellidos);
    let userid = req.body.userid;
    let pass = req.body.password;
    let tipoCuenta = req.body.tipoCuenta;
    req.session.success = false;
    let query = {
        tab: "USUARIOS",
        col: [{nombre_completo: user}, {tipo: tipoCuenta}],
        condition_and: [{id_usuario: userid}]
    }
    bbdd["update"](query, data => {
        if(!data.errno){
            req.session.success = true;
            if(!pass) res.redirect('/?type=html&page=listaUsuarios');

        } else {
            console.log(data);
            console.log(user + " - " + tipoCuenta + " - " + userid);
        }
        
    });

    if(pass){
        bcrypt.genSalt(salt, (err, salt) => {
            bcrypt.hash(pass, salt, (err, hash) => {
                let passUpdate = {
                    tab: "USUARIOS",
                    col: [{contrasena: hash}],
                    condition_and: [{id_usuario: userid}]
                }
                bbdd["update"](passUpdate, data => {
                    if(!data.errno){
                        req.session.success = true;
                    } else {
                        console.log(data)
                        console.log(user + " - " + tipoCuenta + " - " + userid);
                    };
                    res.redirect('/?type=html&page=listaUsuarios'); 
                });
            })
        })
    }
});

//TODO AMPLIACION -> REGISTRAR EN MULTIPLES GRUPOS HAY QUE CAMBIAR TAMBIEN EL HTML Y EL JS DE LA PAGINA PERTENECIENTE
app.post('/register', function (req, res) {
    let user = (req.body.nombre + (req.body.apellidos ?  " " + req.body.apellidos : ""));
    let pass = req.body.password;
    let tipoCuenta = req.body.tipoCuenta;
    let grupo = req.body.grupo;
    req.session.success = false;
    bcrypt.genSalt(salt, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
            let query =
            {
                tab: "USUARIOS", 
                col: [null, user, hash, tipoCuenta]
            }
            bbdd["insert"](query, data => {
                if(!data.errno){

                }
                res.redirect('/?type=html&page=listaUsuarios');
            })
        });
    });


});

app.post('/auth', function (req, res) {
    let user = req.body.username;
    let pass = req.body.password;

    if(user === "anonimo")
        pass = "a";

    if (user && pass) {
        let query =
        {
            col: ["*"],
            tab: ["USUARIOS"],
            condition_and: [{ nombre_completo: user }]
        }
        bbdd["search"](query, data => {
            if (data.length > 0) {
                bcrypt.compare(pass, data[0].contrasena, function(err, success) {
                    if(success){
                        req.session.loggedin = true;
                        req.session.username = user;
                        req.session.usert = (data[0].tipo).toLowerCase();
                        req.session.userid = data[0].id_usuario;
                    }
                    if(user === "anonimo")
                        res.send({msg: "logeado como anonimo"})
                    else
                        res.redirect('/');  
                });

            }
        });
    } else res.redirect('/');
})

app.post('/logout', function (req, res) {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        req.session.username = undefined;
        req.session.usert = undefined;
        req.session.userid = undefined;
    }
    res.redirect('/');
})

app.post("/current_user", function (req, res) {
    let data = {};

    if (req.body.id_usuario) {
        data["id_usuario"] = req.session.userid;
    }

    if (req.body.nombre_completo) {
        data["nombre_completo"] = req.session.username;
    }

    if (req.body.tipo) {
        data["tipo"] = req.session.usert;
    }

    res.send({
        data
    });

})

app.post('/session', (req, res) => {
    const type = req.body.type;
    const data = req.body.data;
    let sesn = req.session;

    if(!sesn.data){
        sesn.data = {};
    }

    if (data) {
        let param = Object.keys(data)[0];
        switch (type) {
            case "get":
                res.send({value: sesn.data[param]});
                break;
            case "set":
                sesn.data[param] = data[param];
                res.send({value: "done"});
                break;
        }
    }

})

app.post('/plantilla-respuesta', (req, res) => {
    const type = req.body.type;
    let data;

    if(type){
        if(rPlantilla[type]){
            data = rPlantilla[type];
        }
        else{   
            data = {err: `Type [${type}] doesn't exist`};
        }
    } else {
        data = {err: "No type specified"};
    }

    res.send({plantilla: data});
});

app.post('/htmlPregunta', (req, res) =>{
    const type = req.body.type;
    const id = req.body.id; 
    let data;
    if(type){
        switch (type){
            case 'profesor':
                if(id){
                    data = {
                        plantilla: pregunta[id],
                    }; 
                }
                break;
            case 'alumno':
                if(id){
                    data = {
                        plantilla: respuesta[id],
                    }; 
                }
                break;
                
            default:
                data = {err: "Error, type not found"};
                break;     
        }
    }
    else if(!type){
        data = {err:  "Error, type not defined"};
    }

    if(!data.plantilla){
        data = {err: "Error, html not found"};
    }
    res.send(data);
});

app.post('/nombreanonimo', (req,res) => {
    let data;
    let pos = Math.floor(Math.random() * (anonimo.length));
    let sesn = req.session;

    if(!sesn.anonimo){
        data = {
            nombre : anonimo[pos],
        };
        sesn.anonimo = anonimo[pos];
    }
    else{
        data = {
            nombre : sesn.anonimo,
        };
    }
    
    res.send(data);
});

app.post('/imagen', (req, res) => {
    const LETTERS = ['a','b','c','d','f','g','k','t','q','w','x','h','r'];
    
    let b64 = req.body.base64;
    let id = req.body.id;
    
    let exists;
    let time = Date.now();

    b64 = b64.replace(/^data:image\/.*;base64,/, "");
    if(!id){
        id = "";
        do{
            for(let i = 0; i < 15; i++){
                id += LETTERS[Number.parseInt(Math.random() * LETTERS.length)];
            }
            exists = fs.existsSync(__dirname + "/res/actividad/" + id + ".png"); //en el caso de que se repita un valor
        } while(exists);
    }
    //ya tenemos el id a partir de aqui
    let buffer = Buffer.from(b64, "base64");
    fs.writeFileSync(__dirname + "/res/actividad/" + id + ".png", buffer, "base64");
    res.send({
        id: id,
        url: "?type=res&file=" + id + ".png&dir=actividad/"
    });
})

app.post('/yaml', (req, res) => {
    const type = req.body.type;
    const file = req.body.data;

    let data;

    switch(type){
        case 'parse':
            data = yaml.load(file);
            break;
        case 'stringify':
            data = yaml.dump(file);
            break;
    }

    res.send({data: data});
})

app.post('/generateCode', (req, res) => {
    let base = "TRWAGMYFPDXBNJZSQVHLCKE";

    function generateActCode(){
        let out = "";
    
        for(let i = 0; i < 5; i++)
            out += base[Number.parseInt(Math.random() * base.length)];
    
        bbdd.search(
            {
                col: ["*"],
                tab: ["ACTIVIDAD"],
                condition_and: [{ codigo: out }]
            },
            (data) => {
                if(data.length > 0)
                    generateActCode();
                else
                    res.send({code: out});
            }
        );
    }

    generateActCode();
})

app.post('/', (req, res) => {
    const type = req.body.type;
    const query = req.body.query;

    if (POST_CONSOLE_LOG) {
        console.log("------------------------------------------------------------");
        console.log("Client " + req.hostname + " POST requests");
        console.log("path: " + req.path);
        console.log("------------------------------------------------------------");
        if (type)
            console.log("type: " + type);
        if (query)
            console.log("query: ");
        console.log(query);

        console.log("body:");
        console.log(req.body);

        console.log("------------------------------------------------------------\n\n");
    }

    if (type) {
        bbdd[type](query, data => {
            res.send(data);
        });
    }

});




app.get('*', (req, res) => {
    const type = req.query.type;      //tipo de archivo que pedimos al servidor
    const page = req.query.page;      //nombre de la pagina que pedimos, no se usa para recursos varios (imagenes, sonido, etc);
    const file = req.query.file;      //nombre del archivo y extension del mismo, estos siempre estaran dentro de la carpeta 'res'
    const dir = req.query.dir         //directorio opcional para acceder a recursos que esten en una carpeta dentro de res -> e.g. alumno/imagenes/ <- importante el slash final
    const usert = req.session.usert;    //tipo de usuario logeado (adm, pro, alu)
    const userid = req.query.userid;  //id del usuario, en el caso que este logueado
    let finalPath;
    if (GET_CONSOLE_LOG) {
        console.log("------------------------------------------------------------");
        console.log("Client " + req.hostname + " requests");
        console.log("path: " + req.path);
        console.log("------------------------------------------------------------");
        if (type)
            console.log("Type: " + type);
        if (page)
            console.log("Page: " + page);
        if (file)
            console.log("File: " + file);
        if (dir)
            console.log("Dir: " + dir);
        if (usert)
            console.log("User Type: " + usert);
        if (userid)
            console.log("UserId: " + userid);
        console.log("------------------------------------------------------------\n\n");
    }

    if (req.path == '/') {
        if (type == undefined || (page == undefined && file == undefined)) { //si no se especifica totalmente que queremos un archivo devolvemos la pagina base segun el tipo de usuario (default: login)
            //pagina raiz dependiendo del tipo del usuario
            if (req.session.loggedin) {
                if (usert == 'adm') finalPath = (path.join(__dirname + '/html/home_admin.html'));
                if (usert == 'prf') finalPath = (path.join(__dirname + '/html/home_profesor.html'));
                if (usert == 'alu') finalPath = (path.join(__dirname + '/html/home_alumno.html'));
            } else finalPath = (path.join(__dirname + '/html/login.html'));
        } else {
            if (type == "res") {
                finalPath = (path.join(__dirname + '/' + type + '/' + (dir == undefined ? "" : dir) + file));
            } else {
                finalPath = (path.join(__dirname + '/' + type + '/' + page + '.' + type));
            }
        }
        
        if(fs.existsSync(finalPath) || type != 'html'){
            if(type == 'html') finalPath = grantAccess(usert, page);
            res.sendFile(finalPath);
        } else {
            res.sendFile(path.join(__dirname + "/html/error.html"));
        }
        

    }
    //En principio NO permitiremos el acceso a no ser que se acceda con parametros
    //else {
    //    res.sendFile(path.join(__dirname + req.path));
    //}
})

function grantAccess(usert, page){
    let authpage = path.join(__dirname + "/html/error.html");
    if(page == "home_profesor" || page == "gestionActividades" || page == "estadisticas") {
        //profe
        if(usert == "prf")  authpage = path.join(__dirname + "/html/" + page + ".html");  
    } else if(page == "home_admin") {
        //admin
        if(usert == "adm") authpage = path.join(__dirname + "/html/" + page + ".html");
    } else if(page == "gestionGrupos" || page == "listaUsuarios"){
        //admin & profe
        if(usert == "prf" || usert == "adm") authpage = path.join(__dirname + "/html/" + page + ".html");
    } else {
        //alumno & admin & profe
        authpage = path.join(__dirname + "/html/" + page + ".html");
    }

    return authpage;
}

app.listen(port, () => {
    let ips = getIpAdresses();

    for (let prop in ips) {
        if (Object.prototype.hasOwnProperty.call(ips, prop)) {
            console.log(`Running at http://${ips[prop]}:${port}`);
        }
    }

})
