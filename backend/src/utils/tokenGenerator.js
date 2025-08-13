/**
 * Genera un token numérico de 5 dígitos para recuperación de contraseña
 * @returns {string} Token de 5 dígitos
 */
const generarTokenRecuperacion = () => {
  // Genera un número aleatorio entre 10000 y 99999 (5 dígitos)
  const token = Math.floor(10000 + Math.random() * 90000).toString();
  return token;
};

/**
 * Valida que un token sea válido (5 dígitos numéricos)
 * @param {string} token - Token a validar
 * @returns {boolean} True si el token es válido
 */
const validarToken = (token) => {
  // Verifica que sea exactamente 5 caracteres y solo números
  const regex = /^\d{5}$/;
  return regex.test(token);
};

module.exports = {
  generarTokenRecuperacion,
  validarToken
}; 