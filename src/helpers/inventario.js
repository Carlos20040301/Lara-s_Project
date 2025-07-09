const Inventario = require('../modelos/inventario');
const Joya       = require('../modelos/joya');

/**
 * Registra un movimiento y actualiza el stock acumulado
  @param {string} joyaId   
  @param {'compra'|'venta'|'ajuste'} tipo
  @param {number} cantidad 
  @param {string} nota     
 */
exports.movimiento = async ({ joyaId, tipo, cantidad, nota='' }) => {
  if (cantidad <= 0) throw new Error('La cantidad debe ser > 0');

  // 1. registrar línea de inventario
  await Inventario.create({ joya: joyaId, tipo, cantidad, nota });

  // 2. delta a aplicar
  const delta = tipo === 'venta' ? -cantidad : cantidad; // compra/ajuste suma
  const joya = await Joya.findByIdAndUpdate(
    joyaId,
    { $inc: { stock: delta } },
    { new: true, runValidators: true }
  );

  if (!joya) throw new Error('Joya no encontrada');

  // 3. si el stock quedó negativo, revertimos y avisamos
  if (joya.stock < 0) {
    await Joya.findByIdAndUpdate(joyaId, { $inc: { stock: -delta } });
    throw new Error('Stock insuficiente');
  }

  return joya; // devuelve joya actualizada
};
