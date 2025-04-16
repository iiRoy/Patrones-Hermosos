const jwt = require('jsonwebtoken');

// Middleware para autenticar token JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica token con tu clave secreta
    const decoded = jwt.verify(token, 'mi_clave_secreta');

    // Agrega info decodificada al request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// Opcional: Middleware para validar roles
// Middleware para verificar que el usuario tenga un rol permitido
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos suficientes' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
