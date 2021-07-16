use EduPrim;

/* Prepara una actividad para un usuario que pertenezca a un grupo */
DELETE FROM PREGUNTA;
DELETE FROM GRUPO_TIENE_ACTIVIDAD;
DELETE FROM PREGUNTA_ALUMNO;
DELETE FROM ENTREGA_ALUMNO_ACTIVIDAD;
DELETE FROM ACTIVIDAD;
DELETE FROM USUARIO_PERTENECE_GRUPO;

INSERT INTO GRUPOS VALUES (1, "grupo1");  # Por si acaso no existe
INSERT INTO USUARIO_PERTENECE_GRUPO VALUES (1, 1); #id_usuario, id_grupo


## Respuesta Escojer ##
INSERT INTO ACTIVIDAD VALUES (1, "Actividad Escoger", "AAAAA");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (1, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 1, 'Sinonimo de persona', NULL, 'respuestaEscoger', '[{"enunciado": "individuo", "seleccionado": true},{"enunciado": "caja", "seleccionado": false},{"enunciado": "manzana", "seleccionado": false}]', 100);
INSERT INTO PREGUNTA VALUES (2, 1, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);


## Operaciones Matematicas #############
INSERT INTO ACTIVIDAD VALUES (2, "Actividad Op Matematicas", "BBBBB");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (2, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 2, 'mates', NULL, 'respuestaOperacionesMatematicas', '[{"enunciado": "2 + 2","resultado": 4}, {"enunciado": "3 + 2","resultado": 5}, {"enunciado": "5 * 2","resultado": 10}, {"enunciado": "7 - 5","resultado": 2}]', 100);
INSERT INTO PREGUNTA VALUES (2, 2, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);


## Respuesta Relacionar #############
INSERT INTO ACTIVIDAD VALUES (3, "Actividad Respuesta Relacionar", "CCCCC");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (3, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 3, 'Que animal tiene zarpas', NULL, 'respuestaRelacionar', '{"izq": [{"enunciado": "en1"},{"enunciado": "en2"},{"enunciado": "en3"},{"enunciado": "en4"},{"enunciado": "en5"},{"enunciado": "en6"},{"enunciado": "en7"},{"enunciado": "en8"},{"enunciado": "en9"}], "der": [{"enunciado": "re1"},{"enunciado": "re2"},{"enunciado": "re3"},{"enunciado": "re4"},{"enunciado": "re5"},{"enunciado": "re6"},{"enunciado": "re7"},{"enunciado": "re8"},{"enunciado": "re9"}], "rel": []}', 100);
INSERT INTO PREGUNTA VALUES (2, 3, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);


## Respuesta Corta #############
INSERT INTO ACTIVIDAD VALUES (4, "Actividad Respuesta Corta", "DDDDD");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (4, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 4, 'Escribe sinonimos de Ave', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);
INSERT INTO PREGUNTA VALUES (2, 4, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);


## Respuesta Mapa Conceptual ############
INSERT INTO ACTIVIDAD VALUES (5, "Mapa Conceptual (No funcional)", "EEEEE");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (5, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 5, 'El Mapa', NULL, 'respuestasMapaConceptual', '[{"enunciado": "URL","cordenada": {"x":"25","y":"25"}},{"enunciado": "URL","cordenada": {"x":"40","y":"25"}}]', 100);


## Arrastrar a Vacio ##
INSERT INTO ACTIVIDAD VALUES (6, "Actividad Arrastrar Vacío", "FFFFF");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (6, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 6, 'Texto # Ejemplo # numero', NULL, 'respuestaArrastrarVacio', '{"opciones":[{ "opcion": "del" },{"opcion": "ejemplo"}], "rel":"Texto del Ejemplo ejemplo numero"}', 100);
INSERT INTO PREGUNTA VALUES (2, 6, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);


## Ordenacion ##
INSERT INTO ACTIVIDAD VALUES (7, "Actividad Ordenacion", "GGGGG");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (7, 1); #id_actividad, id_grupo

INSERT INTO pregunta VALUES(1,7,"Los leones son carnivoros",NULL, "respuestaOrdenacion", '{"respuesta": "Los leones son carnivoros"}', 100);

INSERT INTO PREGUNTA VALUES (2, 7, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);



## multiopcion ##
INSERT INTO ACTIVIDAD VALUES (8, "Actividad Multiopcion", "HHHHH");
INSERT INTO GRUPO_TIENE_ACTIVIDAD VALUES (8, 1); #id_actividad, id_grupo

INSERT INTO PREGUNTA VALUES (1, 8, 'Que animal es mamifero? ', NULL, 'respuestaMultiopcion', '[{"enunciado": "Ornitorrinco","seleccionado":true},{"enunciado": "Hipopotamo","seleccionado": true},{"enunciado": "Gaviota","seleccionado": false},{"enunciado": "Atun","seleccionado": false}]', 100);
INSERT INTO PREGUNTA VALUES (2, 8, 'Placeholder para probar guardado', NULL, 'respuestaCorta', '{ "respuesta": "" }', 100);

SELECT * FROM PREGUNTA WHERE PREGUNTA.ID_PREGUNTA = 2 AND PREGUNTA.ID_ACTIVIDAD = 10;
SELECT * FROM PREGUNTA WHERE PREGUNTA.ID_PREGUNTA = 1 AND PREGUNTA.ID_ACTIVIDAD = 6;

