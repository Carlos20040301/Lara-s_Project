const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Categoria = require('../modelos/Categoria');

// Middleware Multer con destino dinámico según la categoría
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const categoriaId = req.body.categoria_id;
      const categoria = await require('../modelos/Categoria').findByPk(categoriaId);

      if (!categoria) {
        return cb(new Error('Categoría inválida'));
      }

      const folderName = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
      const dir = path.join(__dirname, '../../uploads/productos', folderName);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
