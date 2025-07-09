const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const sharp  = require('sharp');


const carpetaDestino = path.join(__dirname, '..', '..', 'uploads', 'joyas');
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}


const storage = multer.memoryStorage();

const tiposPermitidos = /jpg|jpeg|png/;
const fileFilter = (req, file, cb) => {
  const valido = tiposPermitidos.test(path.extname(file.originalname).toLowerCase()) &&
                 tiposPermitidos.test(file.mimetype);
  valido ? cb(null, true) : cb(new Error('Solo se permiten imágenes JPG o PNG'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

const procesarImagen = async (req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);

  if (!req.file) return next(); // No llegó archivo

  try {
    const nombreFinal = `joya_${Date.now()}.jpg`;
    const rutaSalida = path.join(carpetaDestino, nombreFinal);

    await sharp(req.file.buffer)
      .resize(600)
      .jpeg({ quality: 80 })
      .toFile(rutaSalida);

    req.nombreImagen = path.join('uploads', 'joyas', nombreFinal);
    next();
  } catch (e) {
    next(e);
  }
};
module.exports = { upload, procesarImagen };
