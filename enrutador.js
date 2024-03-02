const express = require("express");
const fs = require("fs");
const path = require("path");
const datos = require("./datos.js");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get("/", (req, res) => {
  const pagina = fs.readFileSync("index.html", "utf8");
  res.send(pagina);
});

router.delete("/citas/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = datos.findIndex((dato) => dato.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  datos.splice(index, 1);
  res.status(200).json({ message: "Evento eliminado" });
});

router.put("/citas/:id", (req, res) => {
  const id = Number(req.params.id);

  const cita = datos.find((dato) => dato.id === id);
  if (!cita) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  cita.titulo = req.body.titulo;
  cita.fecha = req.body.fecha;
  cita.descripcion = req.body.descripcion;
  cita.invitados = req.body.invitados;
  res.status(200).json(cita);
});

router.get("/citas", (req, res) => {
  const titulo = req.query.titulo;
  const cita = datos.find((dato) => dato.titulo === titulo);
  if (cita) {
    const html = fs.readFileSync(path.resolve("citas.html"), "utf8");
    const citas = html
      .replace("{titulo}", cita.titulo)
      .replace("{fecha}", cita.fecha)
      .replace("{descripcion}", cita.descripcion)
      .replace("{invitados}", cita.invitados);
    res.send(citas);
  } else {
    const html = fs.readFileSync(path.resolve("citas.html"), "utf8");
    const citas = html
      .replace("{titulo}", "No existe esa cita")
    res.send(citas);
  }
});

router.post("/citas", (req, res) => {
  const { titulo, fecha, descripcion, invitados } = req.body;
  const id = datos.length - 1 + 1;
  const cita = {
    id,
    titulo,
    fecha,
    descripcion,
    invitados,
  };
  datos.push(cita);

  const pagina = fs.readFileSync(path.resolve("citas.html"), "utf8");
  const citas = pagina
    .replace("{titulo}", cita.titulo)
    .replace("{fecha}", cita.fecha)
    .replace("{descripcion}", cita.descripcion)
    .replace("{invitados}", cita.invitados);
  res.send(citas);
});

module.exports = router;
