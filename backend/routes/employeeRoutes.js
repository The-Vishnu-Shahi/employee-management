const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.use(verifyToken);

router.get('/', employeeController.list);
router.get('/:id', employeeController.getOne);

router.post('/',authorizeRoles('admin', 'hr'),
[
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
  ], validate, employeeController.create);

  router.put('/:id', authorizeRoles('admin', 'hr'),  [body('email').optional().isEmail().withMessage('A valid email is required')], validate, employeeController.update);

  router.delete('/:id', authorizeRoles('admin'), employeeController.remove);

  module.exports = router;