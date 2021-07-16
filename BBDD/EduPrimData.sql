/*   USE  */
USE EduPrim;

DELETE FROM TEXTOS;

/* Textos */
	/* GENERAL */
		INSERT INTO TEXTOS VALUES(NULL, "general-buscar", "BUSCAR", "CERCAR", "SEARCH");
		INSERT INTO TEXTOS VALUES(NULL, "general-codigo", "CÓDIGO", "CODI", "CODE");
		INSERT INTO TEXTOS VALUES(NULL, "general-logOut", "CERRAR SESSIÓN", "TANCAR SESSIÓ", "LOG OUT");
		INSERT INTO TEXTOS VALUES(NULL, "general-aciertos", "ACIERTOS", "ENCERTS", "RIGHT GUESS");
		INSERT INTO TEXTOS VALUES(NULL, "general-nodata", "No hay datos disponibles", "No hi ha dades disponibles", "No data available");
		INSERT INTO TEXTOS VALUES(NULL, "general-errSistema", "Error en el sistema", "Error al sistema", "Error in the system");
		INSERT INTO TEXTOS VALUES(NULL, "general-errConnection", "Error con la conexión al servidor", "Error amb la connexió al servidor", "Error connecting with the server");
		INSERT INTO TEXTOS VALUES(NULL, "general-modalConfirm", "¿ESTA SEGURO QUE DESEA REALIZAR LA ACCIÓN?", "ESTÀ VOSTÈ SEGUR QUE DESITJA REALITZAR L'ACCIÓ?", "ARE YOU SURE YOU WANT TO TAKE THE ACTION?");
		INSERT INTO TEXTOS VALUES(NULL, "general-aceptar", "ACEPTAR", "ACCEPTAR", "ACCEPT");
		INSERT INTO TEXTOS VALUES(NULL, "general-cancelar", "CANCELAR", "CANCEL·LAR", "CANCEL");
		INSERT INTO TEXTOS VALUES(NULL, "general-errNoUserSelected", "No hay un usuario seleccionado","No hi ha cap usuari sel·leccionat","There is no user selected");
		INSERT INTO TEXTOS VALUES(NULL, "general-deletedUser", "Se ha borrado el usuario con exito", "S'ha esborrat l'usuari amb éxit", "The user has been deleted");
		INSERT INTO TEXTOS VALUES(NULL, "general-warnGoGroup", "Esta seguro que desea ir a grupos? El usuario actual no se registrara.", "Está segur que vol anar a grups? L'usuari actual no és registrarà", "Are you sure you want to go to Groups? The current user won't be registered");
		INSERT INTO TEXTOS VALUES(NULL, "general-actualizado", "Se ha actualizado correctamente", "S'ha actualitzat correctament","Updated successfully");
		INSERT INTO TEXTOS VALUES(NULL, "general-tooManyUsers", "Demasiados usuarios seleccionados", "Massa usuaris sel·leccionats","Too much users selected");
		INSERT INTO TEXTOS VALUES(NULL, "general-noResults", "No se han encontrado resultados","No s'han trobat resultats","No results found");
		INSERT INTO TEXTOS VALUES(NULL, "general-save", "GUARDAR","GUARDAR","SAVE");
		INSERT INTO TEXTOS VALUES(NULL, "general-register", "REGISTRARSE","REGISTRAR-SE","REGISTER");

	/* LOGIN */
		INSERT INTO TEXTOS VALUES(NULL, "login-usuario", "USUARIO", "USUARI", "USER");
		INSERT INTO TEXTOS VALUES(NULL, "login-contrasena", "CONTRASEÑA", "CONTRASENYA", "PASSWORD");
		INSERT INTO TEXTOS VALUES(NULL, "login-iniciasesion", "Inicia Sesión", "Inicia Sessió", "Log In");
		INSERT INTO TEXTOS VALUES(NULL, "login-invitado", "Entrar Como Invitado", "Entrar com a invitat", "Log as guest");
		INSERT INTO TEXTOS VALUES(NULL, "login-idioma", "Idioma", "Llenguatge", "Language");
        
	/* GESTION GRUPOS */
		INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-anadir","AÑADIR","AFEGIR","ADD");
        INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-borrar","BORRAR","ESBORRAR","DELETE");
        INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-update","MODIFICAR","MODIFICAR","MODIFY");
        INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-buscador","buscador","cercar","search");
        INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-spanTodosAlumnos","TODOS LOS USUARIOS", "TOTS ELS USUARIS","ALL THE USERS");
        INSERT INTO TEXTOS VALUES(NULL,"gestionGrupo-spanAlumnoGrupo","USUARIOS DEL GRUPO","USUARIS DEL GRUP","USERS FROM A GROUP");

	/* HOME PROFESOR */
		INSERT INTO TEXTOS VALUES(NULL, "homeProfesor-act", "ACTIVIDADES", "ACTIVITATS", "ACTIVITIES");
		INSERT INTO TEXTOS VALUES(NULL, "homeProfesor-regUser", "REGISTRAR USUARIOS", "REGISTRAR USUARIS", "USER REGISTRATION");
		INSERT INTO TEXTOS VALUES(NULL, "homeProfesor-grupos", "GRUPOS", "GRUPS", "GROUPS");
		INSERT INTO TEXTOS VALUES(NULL, "homeProfesor-estad", "ESTADÍSTICAS", "ESTADÍSTIQUES", "STATISTICS");

	/* LISTA USUARIOS */
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-buscador","buscador","cercar","search");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-anadir","AÑADIR","AFEGIR","ADD");
        INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-borrar","BORRAR","ESBORRAR","DELETE");
        INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-update","MODIFICAR","MODIFICAR","MODIFY");
		
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-nombre","NOMBRE","NOM","NAME");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-apellido","APELLIDOS","COGNOMS","SURNAME");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-pass","CONTRASEÑA","CONTRASENYA","PASSWORD");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-repass","REPITE LA CONTRASEÑA","REPETEIX LA CONTRASENYA","REPEAT THE PASSWORD");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-tipo","TIPO DE USUARIO","TIPUS D'USUARI","USER TYPE");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-grupo","GRUPO","GRUP","GROUP");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-cgrupo","CAMBIAR GRUPO","CANVIAR GRUP","CHANGE GROUP");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-regist","REGISTRAR","REGISTRAR","REGISTER");

		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-filtros","Filtros","Filtres","Filters");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-tipoCuenta","Tipo de cuenta","Tipus de Compte","Account type");

		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-todos","Filtros","Filtres","Filters");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-alu","Alumno","Alumne","Student");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-pro","Profesor","Professor","Teacher");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-adm","Administrador","Administrador","Administrator");

		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-usuarioCreado", "Se ha creado correctamente el usuario", "S'ha creat correctament l'usuari", "The user has been created succesfully");
		INSERT INTO TEXTOS VALUES(NULL, "listaUsuarios-errUsuarioDuplicado", "Se han encontrado multiples usuarios con la misma ID", "S'ha trobat múltiples usuaris amb la mateixa ID", "There is already a user with that ID");

	/* HOME ALUMNO */
		INSERT INTO TEXTOS VALUES(NULL, "homeAlumno-responderActividad", "RESPONDER ACTIVIDAD", "RESPONDRE ACTIVITAT", "ANSWER ACTIVITY");
		INSERT INTO TEXTOS VALUES(NULL, "homeAlumno-resultados", "RESULTADOS", "RESULTATS", "RESULTS");
		INSERT INTO TEXTOS VALUES(NULL, "homeAlumno-noActividad", "NO SE HA SELECCIONADO NINGUNA ACTIVIDAD", "NO S'HA SEL·LECCIONAT CAP ACTIVITAT", "NO ACTIVITY HAS BEEN SELECTED");
	
	/* ACTIVIDAD ALUMNO */
		INSERT INTO TEXTOS VALUES(NULL, "actividadAlumno-modal", "¿Seguro que quieres acabar la actividad?", "Segur que vols acabar l'activitat?", "Are you sure you want to finish the activity?");
		INSERT INTO TEXTOS VALUES(NULL, "actividadAlumno-aceptar", "Aceptar", "Acceptar", "Accept");
		INSERT INTO TEXTOS VALUES(NULL, "actividadAlumno-cancelar", "Cancelar", "Cancel·lar", "Cancel");
		INSERT INTO TEXTOS VALUES(NULL, "actividadAlumno-terminar", "TERMINAR", "ACABAR", "FINISH");
		INSERT INTO TEXTOS VALUES(NULL, "actividadAlumno-espera", "Espera por favor", "Espera si us plau", "Wait please");

