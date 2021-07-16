DROP DATABASE IF EXISTS EduPrim;
CREATE DATABASE EduPrim;
USE EduPrim;
#Creación Tablas

CREATE TABLE USUARIOS(
	id_usuario INT NOT NULL AUTO_INCREMENT,
	nombre_completo TEXT NOT NULL,
	contrasena VARCHAR(20) NOT NULL,
	tipo VARCHAR(10),
	PRIMARY KEY(id_usuario)
);

CREATE TABLE ALUMNO(
	id_usuario INT NOT NULL AUTO_INCREMENT,
	nombre_completo TEXT NOT NULL,
	contrasena VARCHAR(20) NOT NULL,
	tipo VARCHAR(10),
	PRIMARY KEY(id_usuario)
);

CREATE TABLE GRUPOS(
   id_grupo INT NOT NULL AUTO_INCREMENT,
   nombre_grupo VARCHAR(20) NOT NULL,
   PRIMARY KEY (id_grupo)
);

CREATE TABLE ACTIVIDAD(
	id_actividad INT NOT NULL AUTO_INCREMENT,
    nombre_actividad VARCHAR(30),
    PRIMARY KEY(id_actividad)
);

CREATE TABLE ENTREGA(
	id_entrega INT NOT NULL AUTO_INCREMENT,
	fecha_entrega DATE,
    PRIMARY KEY(id_entrega)
);

CREATE TABLE PREGUNTA(
	id_pregunta INT NOT NULL,
    id_actividad INT NOT NULL,
    enunciado VARCHAR(60) NOT NULL,
    url_imagen varchar(60),
	FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id_actividad),
	PRIMARY KEY(id_pregunta,id_actividad)
);

/* RELACIONARIAS */

CREATE TABLE USUARIO_PERTENECE_GRUPO(
	id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
	FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_grupo) REFERENCES GRUPOS(id_grupo) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_usuario, id_grupo)
   
);

CREATE TABLE GRUPO_TIENE_ACTIVIDAD(
	id_actividad INT NOT NULL,
    id_grupo INT NOT NULL,
	FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id_actividad),
	FOREIGN KEY (id_grupo) REFERENCES GRUPOS(id_grupo),
    PRIMARY KEY(id_actividad, id_grupo)
);

CREATE TABLE ESTADISTICA_ALUMNO_ACTIVIDAD(
	id_entrega INT NOT NULL,
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
	FOREIGN KEY (id_entrega) REFERENCES ENTREGA(id_entrega),
	FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario),
    FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id_actividad),
    PRIMARY KEY(id_entrega,id_usuario,id_actividad)
);


/* HIJAS  DE PREGUNTA: */

CREATE TABLE RESPUESTA_CORTA(
id_respuesta INT NOT NULL AUTO_INCREMENT,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
texto TEXT,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

CREATE TABLE RESPUESTA_ESCOGER(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
es_correcta BOOLEAN,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

CREATE TABLE RESPUESTA_LISTADO_OPERACIONES(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
operacion FLOAT,
respuesta FLOAT,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

CREATE TABLE RESPUESTA_RELACIONAR(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
id_respuesta_relacion INT NOT NULL,
id_pregunta_relacion INT NOT NULL,
id_actividad_relacion INT NOT NULL,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad,id_respuesta_relacion,id_pregunta_relacion,id_actividad_relacion)
);

CREATE TABLE RESPUESTA_ARRASTRAR_VACIO(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
posicion FLOAT,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

CREATE TABLE RESPUESTA_ORDENACION(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
posicion FLOAT,
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

CREATE TABLE RESPUESTA_MAPA_CONCEPTUAL(
id_respuesta INT NOT NULL,
id_pregunta INT NOT NULL,
id_actividad INT NOT NULL,
posicionX FLOAT,
posicionY FLOAT,
url_imagen VARCHAR(60),
FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta),
FOREIGN KEY (id_actividad) REFERENCES PREGUNTA(id_actividad),
PRIMARY KEY(id_respuesta,id_pregunta,id_actividad)
);

#ALUMNO------------------------------------

CREATE TABLE PREGUNTA_ALUMNO(
	id_pregunta_alumno INT NOT NULL AUTO_INCREMENT,
    id_entrega INT NOT NULL,
    FOREIGN KEY (id_entrega) REFERENCES ENTREGA(id_entrega),
	PRIMARY KEY(id_pregunta_alumno,id_entrega)
);

CREATE TABLE RESPUESTA_MAPA_CONCEPTUAL_ALUNNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
posicionX FLOAT,
posicionY FLOAT,
url_imagen VARCHAR(60),
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_entrega)
);

CREATE TABLE RESPUESTA_CORTA_ALUMNO(
id_respuesta INT NOT NULL AUTO_INCREMENT,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
texto TEXT,
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_entrega)
);

CREATE TABLE RESPUESTA_ORDENACION_ALUMNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
posicion FLOAT,
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_entrega)
);

CREATE TABLE RESPUESTA_ESCOGER_ALUMNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
es_correcta BOOLEAN,
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_pregunta_alumno,id_entrega,id_respuesta)
);

CREATE TABLE RESPUESTA_ARRASTRAR_VACIO_ALUMNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
posicon BOOLEAN,
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_entrega)
);

CREATE TABLE RESPUESTA_LISTADO_OPERACIONES_ALUMNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_entrega INT NOT NULL,
operacion FLOAT,
respuesta FLOAT,
FOREIGN KEY (id_entrega) REFERENCES PREGUNTA_ALUMNO(id_entrega),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_entrega)
);

# TODO: Revisar
/*
CREATE TABLE RESPUESTA_RELACIONAR_ALUMNO(
id_respuesta INT NOT NULL,
id_pregunta_alumno INT NOT NULL,
id_estadistica INT NOT NULL,
id_respuesta_relacion INT NOT NULL,
id_pregunta_alumno_relacion INT NOT NULL,
id_estadistica_relacion INT NOT NULL,
FOREIGN KEY (id_estadistica) REFERENCES PREGUNTA_ALUMNO(id_estadistica),
FOREIGN KEY (id_pregunta_alumno) REFERENCES PREGUNTA_ALUMNO(id_pregunta_alumno),
PRIMARY KEY(id_respuesta,id_pregunta_alumno,id_estadistica,id_respuesta_relacion,id_pregunta_alumno_relacion,id_estadistica_relacion)
);
*/

CREATE TABLE TEXTOS(
id_texto INT NOT NULL AUTO_INCREMENT,
identificador MEDIUMTEXT,
es MEDIUMTEXT,
cat MEDIUMTEXT,
en MEDIUMTEXT,
PRIMARY KEY(id_texto)
);

DROP USER IF EXISTS 'eduprim'@'%';
CREATE USER 'eduprim'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'eduprim'@'%';
FLUSH PRIVILEGES;
