const express = require("express");
const ruter = require("./enrutador.js");

const app = express();
app.use(ruter);

app.listen(3000, () => {
  console.log(`Servidor en puerto 3000`);
});