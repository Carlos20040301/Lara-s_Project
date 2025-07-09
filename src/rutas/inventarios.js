const router      = require('express').Router();
const passport    = require('passport');
const Inventario  = require('../modelos/inventario');
const joya        = require('../modelos/joya');


router.get(
  '/',
  passport.authenticate('jwt', { session:false }),
  async (req,res)=>{
    const filtro = req.query.joya ? { joya: req.query.joya } : {};
    const movimientos = await Inventario.find(filtro).sort({ fecha:-1 });
    res.json(movimientos);
  }
);


router.post(
  '/',
  passport.authenticate('jwt', { session:false }),
  async (req,res)=>{
    try{
      const { joya: joyaId, tipo, cantidad, nota='' } = req.body;
      const nuevo = await Inventario.create({ joya: joyaId, tipo, cantidad, nota });
      res.status(201).json(nuevo);
    }catch(e){
      res.status(500).json({ msj:'Error al registrar movimiento' });
    }
  }
);
router.get(
  '/joya/:id',
  passport.authenticate('jwt', { session:false }),
  async (req,res)=>{
    try{
      const joyaId = req.params.id;
      const joyaEncontrada = await joya.findById(joyaId);
      if (!joyaEncontrada) {
        return res.status(404).json({ msj: 'Joya no encontrada' });
      }
      const movimientos = await Inventario.find({ joya: joyaId }).sort({ fecha:-1 });
      res.json(movimientos);
    }catch(e){
      res.status(500).json({ msj:'Error al obtener movimientos de la joya' });
    }
  }
);router.put(
  '/:id',
  passport.authenticate('jwt', { session:false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, cantidad, nota } = req.body;

      const mov = await Inventario.findById(id);
      if (!mov) return res.status(404).json({ msj: 'Movimiento no encontrado' });

      // Joyas con id personalizado 
      const j = await joya.findById(mov.joya);
      if (!j) return res.status(404).json({ msj: 'Joya no encontrada' });

      
      const signo = t => (['entrada', 'compra'].includes(t) ? 1 : -1);
      const deltaOriginal = signo(mov.tipo) * mov.cantidad;

      const nuevoTipo      = tipo      ?? mov.tipo;
      const nuevaCantidad  = cantidad  ?? mov.cantidad;
      const deltaNuevo     = signo(nuevoTipo) * nuevaCantidad;
      

      const ajuste = deltaNuevo - deltaOriginal;
      if (j.stock + ajuste < 0)
        return res.status(400).json({ msj: 'Stock insuficiente para esta modificación' });
     

      
      j.stock += ajuste;
      await j.save();

      mov.tipo     = nuevoTipo;
      mov.cantidad = nuevaCantidad;
      if (nota !== undefined) mov.nota = nota;
      await mov.save();

      res.json({ msj:'Movimiento actualizado', mov, stockActual: j.stock });
    } catch (e) {
      console.error(e);
      res.status(500).json({ msj:'Error al actualizar movimiento' });
    }
  }
);


router.delete(
  '/:id',
  passport.authenticate('jwt', { session:false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const mov = await Inventario.findById(id);
      if (!mov) return res.status(404).json({ msj: 'Movimiento no encontrado' });

      const j = await joya.findById(mov.joya);
      if (!j) return res.status(404).json({ msj: 'Joya no encontrada' });

    
      const signo = t => (['entrada', 'compra'].includes(t) ? 1 : -1);
      const delta = -signo(mov.tipo) * mov.cantidad;   // signo opuesto
      if (j.stock + delta < 0)
        return res.status(400).json({ msj:'Stock quedaría negativo; no se puede borrar' });

      j.stock += delta;
      await j.save();
      await mov.deleteOne();

      res.json({ msj:'Movimiento eliminado', stockActual: j.stock });
    } catch (e) {
      console.error(e);
      res.status(500).json({ msj:'Error al eliminar movimiento' });
    }
  }
);

module.exports = router;
