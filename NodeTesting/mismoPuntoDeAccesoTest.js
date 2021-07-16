const express = require('express'); //npm install express
const app = express();
const port = 8080; //puerto 8080 de momento
var path = require('path');


app.get('*', (req, res) => {
  console.log("path: " + req.path)
  console.log("params: " + req.query);

  if(req.path == '/')
    res.sendFile(path.join(__dirname + '/index.html'));
  else
    res.sendFile(path.join(__dirname + req.path));
})

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})
