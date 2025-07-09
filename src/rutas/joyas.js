const express   = require('express');
const router    = express.Router();
const { upload, procesarImagen } = require('../intermediarios/multer'); 
const joyascontrolador = require('../controladores/joyascontrolador');
const passport  = require('passport');

// Listar todas las joyas
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.listarJoyas
);

// Crear joya (con imagen opcional)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('imagen'),
  procesarImagen,
  joyascontrolador.crearJoya
);


// Obtener joya por ID
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.obtenerJoyaPorId   
);

// Actualizar joya por ID
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.actualizarJoya
);

// Actualizar solo la imagen de la joya
router.put(
  '/:id/imagen',
  passport.authenticate('jwt', { session: false }),
  upload.single('imagen'),
  procesarImagen,
  joyascontrolador.actualizarImagenJoya
);

// Eliminar joya por ID
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.eliminarJoya
);


module.exports = router;