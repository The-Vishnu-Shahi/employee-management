const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

router.use(verifyToken);

router.get('/', departmentController.list);

router.post(
  '/',
  authorizeRoles('admin', 'hr'),
  [body('name').trim().notEmpty().withMessage('Department name is required')],
  validate,
  departmentController.create
);

router.put(
  '/:id',
  authorizeRoles('admin', 'hr'),
  [body('name').trim().notEmpty().withMessage('Department name is required')],
  validate,
  departmentController.update
);

router.delete('/:id', authorizeRoles('admin'), departmentController.remove);

module.exports = router;