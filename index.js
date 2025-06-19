const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer();

app.post("/crear-tarjeta", upload.any(), async (req, res) => {
  try {
    const form = new FormData();

    // Recolectar todos los campos de texto
    for (const field in req.body) {
      form.append(field, req.body[field]);
    }

    // Recolectar todos los archivos enviados
    for (const file of req.files) {
      form.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    // Enviar a NocoDB
    const response = await fetch(
      "https://idgonow.up.railway.app/api/v1/db/data/v1/pg9x94vtxgric6p/tarjetas_presentacion",
      {
        method: "POST",
        headers: {
          "xc-token": "HzyX5A2ycuqlDhV2uyiQ-12UhN_DM0uO4Bfxe7hy",
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error("❌ Error en proxy crear-tarjeta:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/leer-tarjeta", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "ID no proporcionado" });

  try {
    const response = await fetch(
      `https://idgonow.up.railway.app/api/v1/db/data/v1/pg9x94vtxgric6p/tarjetas_presentacion/${id}`,
      {
        headers: {
          "xc-token": "HzyX5A2ycuqlDhV2uyiQ-12UhN_DM0uO4Bfxe7hy"
        }
      }
    );
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error("❌ Error al leer tarjeta:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy escuchando en puerto ${PORT}`));

