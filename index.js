const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post("/crear-tarjeta", upload.any(), async (req, res) => {
  try {
    const form = new FormData();
    for (const key in req.body) form.append(key, req.body[key]);
    for (const file of req.files) form.append(file.fieldname, file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await fetch(
      "https://idgonow-production.up.railway.app/api/v1/db/data/v1/mjtul7m1klgri2j/tarjetas_presentacion",
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
    console.error("Error en proxy:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy escuchando en puerto ${PORT}`));
