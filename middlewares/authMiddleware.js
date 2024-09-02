const jwt = require('jsonwebtoken');
const basicAuth = require('basic-auth');
require('dotenv').config();

const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASS;

const authenticate = (req, res, next) => {
  const credentials = basicAuth(req);

  if (credentials && credentials.name == process.env.ADMIN_USER && credentials.pass == process.env.ADMIN_PASS) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};  

const basicAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).set('WWW-Authenticate', 'Basic realm="Employee Management API"').json({ message: 'Authentication required' });
  }

  const [scheme, credentials] = authHeader.split(' ');
  if (scheme != 'Basic' || !credentials) {
    return res.status(401).json({ message: 'Invalid authentication scheme' });
  }

  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

  if (username == adminUser && password == adminPassword) {
    return next();
  }

  return res.status(401).set('WWW-Authenticate', 'Basic realm="Employee Management API"').json({ message: 'Invalid credentials' });
};



module.exports = { authenticate, authenticateJWT,basicAuthMiddleware };
