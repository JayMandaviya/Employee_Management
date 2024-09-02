const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authenticateJWT,basicAuthMiddleware } = require('../middlewares/authMiddleware');

router.post('/employees', authenticate, employeeController.createEmployee);
router.get('/employees/:id', authenticateJWT, employeeController.getEmployee);
router.put('/employees/:id', authenticateJWT, employeeController.updateEmployee);
router.delete('/employees/:id', authenticateJWT, employeeController.deleteEmployee);
router.get('/employees', authenticateJWT, employeeController.listEmployees);
router.get('/employeeListByAdmin', basicAuthMiddleware, employeeController.employeeListByAdmin);

router.post('/login', employeeController.login);


module.exports = router;
