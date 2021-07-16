const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({extended : true}));

app.use(cookieParser('mi secreto'));
app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,passport,done){
    if(username === "oscar" && password === "12345678")
        return done(null,{id: 1, name:"oscar"});

    done(null, false);
}));

passport.serializeUser(function(user,done){
    done(null,user,id);
}

passport.deserializeUser(function(id,done){
    done(null, {id: 1, name:"oscar"})
})




app.set('view engine', 'ejs');

app.get("/", (req,res)=>{
    // si ya iniciamos mostra bienvenida

    // si no hemos iniciado sesion vamos a redireccionar a /login
})

app.get ("/login", (req,res)=>{
    // mostrar el formulario de login 
    res.render("login");
})

app.post ("/login", (req,res)=>{
    // Recibir credenciales e iniciar sesión

})

app.listen(8080,()=> console.log("Server activado"));