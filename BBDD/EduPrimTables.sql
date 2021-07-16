DROP DATABASE IF EXISTS EduPrim;
CREATE DATABASE EduPrim;
USE EduPrim;
#Creación Tablas

CREATE TABLE USUARIOS(
		id_usuario INT NOT NULL AUTO_INCREMENT,
		nombre_completo TEXT NOT NULL,
		contrasena VARCHAR(60) NOT NULL,
		tipo VARCHAR(10),
		PRIMARY KEY(id_usuario)
);

CREATE TABLE GRUPOS(
	   id_grupo INT NOT NULL AUTO_INCREMENT,
	   nombre_grupo TEXT NOT NULL,
	   PRIMARY KEY (id_grupo)
);

CREATE TABLE ACTIVIDAD(
		id_actividad INT NOT NULL AUTO_INCREMENT,
		nombre_actividad TEXT,
		codigo VARCHAR(5),
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
		enunciado TEXT NOT NULL,
		url_imagen TEXT,
		tipo varchar(100) NOT NULL,
		respuestas MEDIUMTEXT,
        tiempo varchar(50),
		FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id_actividad) ON DELETE CASCADE,
		PRIMARY KEY(id_pregunta,id_actividad)
);

CREATE TABLE PREGUNTA_ALUMNO(
		id_pregunta INT NOT NULL,
		id_entrega INT NOT NULL,
		enunciado TEXT NOT NULL,
		puntuacion INT,
		tipo varchar(100) NOT NULL,
		respuestas MEDIUMTEXT,
		FOREIGN KEY (id_entrega) REFERENCES ENTREGA(id_entrega),
		PRIMARY KEY(id_pregunta,id_entrega)
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

CREATE TABLE ENTREGA_ALUMNO_ACTIVIDAD(
		id_entrega INT NOT NULL,
		id_usuario INT NOT NULL,
		id_actividad INT NOT NULL,
		FOREIGN KEY (id_entrega) REFERENCES ENTREGA(id_entrega),
		FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario),
		FOREIGN KEY (id_actividad) REFERENCES ACTIVIDAD(id_actividad),
		PRIMARY KEY(id_entrega,id_usuario,id_actividad)
);

/* Multiidioma */

CREATE TABLE TEXTOS(
		id_texto INT NOT NULL AUTO_INCREMENT,
		identificador MEDIUMTEXT,
		es MEDIUMTEXT,
		cat MEDIUMTEXT,
		en MEDIUMTEXT,
		PRIMARY KEY(id_texto)
);

/* usuario */

DROP USER IF EXISTS 'eduprim'@'%';
CREATE USER 'eduprim'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'eduprim'@'%';
FLUSH PRIVILEGES;


/* default users */

INSERT INTO USUARIOS VALUES(1,"admin","$2b$10$qGGUT6aKgByqxlwxl/Tyk.idpWLqWdq8LEynwGZpxTdd9WIwXMvgq","ADM");
INSERT INTO USUARIOS VALUES(2,"anonimo","$2b$10$qGGUT6aKgByqxlwxl/Tyk.idpWLqWdq8LEynwGZpxTdd9WIwXMvgq","ALU");
