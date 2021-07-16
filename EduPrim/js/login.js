window.onload = function(){

    tryPopulating();

    document.getElementById("es").addEventListener("click", function() {
        saveLang("es");
    });
    
    document.getElementById("cat").addEventListener("click", function() {
        saveLang("cat");
    });
    
    document.getElementById("en").addEventListener("click", function() {
        saveLang("en");
    });

    document.getElementById("submitCodigo").addEventListener("click", function() {
        let codigo = document.getElementById("codigo").value;
        let id_actividad;

        postData(
            {
                type: "search",
                query: {
                    col: ["*"],
                    tab: ["ACTIVIDAD"],
                    condition_and: [{"codigo": codigo}]
                }
            }
        ).then((data) => {
            if(data.length > 0){
                id_actividad = data[0].id_actividad;
                
                postData({
                    username: "anonimo"
                }, "/auth").then((data) => {                    
                    postData({
                        type: "set",
                        data: {
                            "doing_activity": id_actividad
                        }
                    }, "/session").then((data) => {
                        window.location.href = "?type=html&page=actividadAlumno";
                    });
                    
                });

                
            }
        })

    });

    document.getElementById("eyeIcon").addEventListener("click", (e) => {
        if(e.target.parentNode.childNodes[1].type == "text") {
            e.target.parentNode.childNodes[1].type = "password";
            e.target.setAttribute("class", "fas fa-eye t-b")
        } else {
            e.target.parentNode.childNodes[1].type = "text";
            e.target.setAttribute("class", "fas fa-eye-slash t-b")
        }
    })

}