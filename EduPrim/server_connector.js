/**
 * Conector SQL con las operaciones CRUD basicas
 * 
 * @version 1.3.1
 *   Fix negate
 * 
 * @version 1.3
 *   Ahora se haceptan condiciones negadas
 * 
 * @version 1.2.1
 *   Fix inserts
 * 
 * @version 1.2
 *   Ahora se aceptan columnas como ALUMNO.*
 * 
 * @version 1.1.2
 *   Bug fix al hacer ORDER BY
 * 
 * @version 1.1.1
 *   Diferenciacion entre un valor y un identificador a la hora de hacer comparaciones
 * 
 * @version 1.1
 *   Reestructuracion de la forma en la que se accede a la BBDD, ahora se accede de forma segura ademas, evitando inyecciones SQL
 *   para mas info de lo anterior: https://github.com/mysqljs/mysql#escaping-query-values
 *   para mas info de como usar este conector: https://git.copernic.cat/jaimez.clavero.oscar/m14-prueba/wikis/documentacion/ConsultasSQL
 * 
 * @version 1.0
 *   version basica del conector con la opcion de hacer SELECT, UPDATE, INSERT y DELETE
 */

const { json } = require('body-parser');
const { createPool } = require('mysql');    //npm install mysql

const mysql_config = require('./mysql-config.json');
const pool = createPool({
  host: mysql_config.host,
  user: mysql_config.user,
  password: mysql_config.password,
  database: mysql_config.database,
  connectionLimit: mysql_config.connectionLimit,
});


/**
 * Estructura del objeto query:
 * data_select:{
 *   col: ["col1", "col2", "col3"],
 *   tab: ["tab1", "tab2", "tab3"],
 *   condition_like: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
 *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
 *   condition_or: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
 *   order_by: {col: ["col1", "col2"], type: "ASC"},
 *   limit: 10
 * }
 * 
 * data_insert:{
 *   col: ["col1", "col2", "col3"],
 *   tab: "tab1"
 * }
 * 
 * data_update:{
 *   tab: "tab1",
 *   col: [{col1: "data1"}, {col2: 2}, {col3: "data3"}],
 *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
 *   condition_or: [{col: "data1"}, {col2: "data2"}, {col3: "data3"}]
 * }
 * 
 * data_delete:{
 *   tab: "tab1",
 *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
 *   condition_or: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}]
 * }
 * 
 * 
 * data_text:{
 *   lang: "es",
 *   id: "login-password"
 * }
 */

exports.search = (data, callback) => {
  /*
    * data_select:{
      *   col: ["col1", "col2", "col3"],
      *   tab: ["tab1", "tab2", "tab3"],
      *   condition_like: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
      *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
      *   condition_or: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
      *   order_by: {col: ["col1", "col2"], type: "ASC"},
      *   limit: 10
      * }
  */

  let query = "SELECT " + escapeArray(data.col, false).join(",") +
    " FROM " + escapeArray(data.tab, false).join(",");

  if (data.condition_and || data.condition_or || data.condition_like) {
    query += " WHERE";
  }

  if(data.condition_like){
    query += " (" + escapeCondition(data.condition_like, "AND", true) + ")";
  }

  if(data.condition_like && data.condition_and){
    query += " AND";
  }

  if (data.condition_and) {
    query += " (" + escapeCondition(data.condition_and, "AND", false) + ")";
  }

  if (data.condition_and && data.condition_or) {
    query += " AND";
  } else if(data.condition_or && data.condition_like && !data.condition_and){
    query += " AND";
  }

  if (data.condition_or) {
    query += " (" + escapeCondition(data.condition_or, "OR", false) + ")";
  }

  if (data.order_by) {
    query += " ORDER BY " + escapeArray(data.order_by.col, false) + " " + (data.order_by.type == "ASC" ? "ASC" : "DESC");
  }

  if (data.limit) {
    query += " LIMIT " + pool.escape(data.limit);
  }

  pool.query(query, (err, result, fields) => {
    return err ? callback(err) : callback(result);
  });
}



exports.update = (data, callback) => {
  /*
   * data_update:{
   *   tab: "tab1",
   *   col: [{col1: "data1"}, {col2: 2}, {col3: "data3"}],
   *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
   *   condition_or: [{col: "data1"}, {col2: "data2"}, {col3: "data3"}]
   * }
   */
  query = "UPDATE " + pool.escapeId(data.tab) + " SET " + escapeCondition(data.col, ",");

  if (data.condition_and || data.condition_or) {
    query += " WHERE";
  }

  if (data.condition_and) {
    query += " (" + escapeCondition(data.condition_and, "AND", false) + ")";
  }

  if (data.condition_and && data.condition_or) {
    query += " AND";
  }

  if (data.condition_or) {
    query += " (" + escapeCondition(data.condition_or, "OR", false) + ")";
  }

  pool.query(query, (err, result, fields) => {
    return err ? callback(err) : callback(result);
  });
}




exports.insert = (data, callback) => {
  /*
  * data_insert:{
  *   col: ["col1", "col2", "col3"],
  *   tab: "tab1"
  * }
  */

  query = "INSERT INTO " + pool.escapeId(data.tab) + " VALUES (" + escapeArrayData(data.col, true) + ")";

  pool.query(query, (err, result, fields) => {
    return err ? callback(err) : callback(result);
  });
}

exports.delete = (data, callback) => {
  /*
  * data_delete:{
  *   tab: "tab1",
  *   condition_and: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}],
  *   condition_or: [{col1: "data1"}, {col2: "data2"}, {col3: "data3"}]
  * }
  */

  query = "DELETE FROM " + pool.escapeId(data.tab);

  if (data.condition_and || data.condition_or) {
    query += " WHERE";
  }

  if (data.condition_and) {
    query += " (" + escapeCondition(data.condition_and, "AND", false) + ")";
  }

  if (data.condition_and && data.condition_or) {
    query += " AND";
  }

  if (data.condition_or) {
    query += " (" + escapeCondition(data.condition_or, "OR", false) + ")";
  }

  pool.query(query, (err, result, fields) => {
    return err ? callback(err) : callback(result);
  });
}

exports.text = (data, callback) => {
  /*
  * data_text:{
  *   lang: "es",
  *   id: "login-password"
  * }
  */
  let query = "SELECT" + pool.escapeId(data.lang) + " FROM TEXTOS WHERE identificador = " + pool.escape(data.id);

  pool.query(query, (err, result, fields) => {
    return err ? callback(err) : callback(result);
  });
}


function escapeArray(arr, normal) {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i] !== "*"){
      if (!arr[i].match(/\w*.\*$/g)) {
        arr[i] = normal ? pool.escape(arr[i]) : pool.escapeId(arr[i]);
      } else {
        let aux = arr[i].split(".");
        arr[i] = pool.escapeId(aux[0]) + "." + aux[1];
      }
    }
  }

  return arr;
}

function escapeArrayData(arr, normal) {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i] !== "*"){
        arr[i] = normal ? pool.escape(arr[i]) : pool.escapeId(arr[i]);
      }
  }

  return arr;
}

function escapeCondition(arr, type, like) {
  let data = "";

  for (let i = 0; i < arr.length; i++) {
    let aux_keys = Object.keys(arr[i]);

    data +=
    (arr[i].negate ? "NOT " : "") + pool.escapeId(aux_keys[0]) + 
     (like ? " LIKE " : " = ") + (!arr[i].is_identifier ? pool.escape(arr[i][aux_keys[0]]) : pool.escapeId(arr[i][aux_keys[0]]))
     + (i < arr.length - 1 ? " " + type + " " : "");
  }
  return data;
}