const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Crear tarjeta
app.post("/crear-tarjeta", upload.fields([
  { name: "Foto_perfil", maxCount: 1 },
  { name: "Logo_empresa", maxCount: 1 }
]), async (req, res) => {
  try {
    const form = new FormData();

    // Campos de texto
    Object.entries(req.body).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Archivos adjuntos
    if (req.files?.Foto_perfil?.[0]) {
      form.append("Foto_perfil", req.files.Foto_perfil[0].buffer, {
        filename: req.files.Foto_perfil[0].originalname,
        contentType: req.files.Foto_perfil[0].mimetype
      });
    }

    if (req.files?.Logo_empresa?.[0]) {
      form.append("Logo_empresa", req.files.Logo_empresa[0].buffer, {
        filename: req.files.Logo_empresa[0].originalname,
        contentType: req.files.Logo_empresa[0].mimetype
      });
    }

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
    console.error("❌ Error al crear tarjeta:", err);
    res.status(500).json({ error: err.message });
  }
});

// Leer tarjeta por ID
app.get("/leer-tarjeta", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: "ID no proporcionado" });
  }

  try {
    const response = await fetch(
      `https://idgonow.up.railway.app/api/v1/db/data/v1/pg9x94vtxgric6p/tarjetas_presentacion/${id}`,
      {
        headers: {
          "xc-token": "HzyX5A2ycuqlDhV2uyiQ-12UhN_DM0uO4Bfxe7hy",
        },
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
app.listen(PORT, () => {
  console.log(`✅ Proxy escuchando en puerto ${PORT}`);
});


