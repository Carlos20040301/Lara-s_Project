const express = require('express');
const router = express.Router();
const joyascontrolador = require('../controladores/joyascontrolador');
const joya = require('../modelos/joya');
const passport = require('passport');

// Ruta para obtener todas las joyas
router.get('/', joyascontrolador.listarJoyas);
// Ruta para crear una nueva joya
router.post('/', joyascontrolador.crearJoya);
// Ruta para obtener una joya por ID
router.get('/:id', joyascontrolador.obtenerJoyaPorId);
// Ruta para actualizar una joya por ID
router.put('/:id', joyascontrolador.actualizarJoya);
// Ruta para eliminar una joya por ID
router.delete('/:id', joyascontrolador.eliminarJoya);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.crearJoya
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.listarJoyas
);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.obtenerJoyaPorId
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.actualizarJoya
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  joyascontrolador.eliminarJoya
);

module.exports = router;