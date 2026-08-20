const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const designationController = require('../controllers/designationController');

const router = express.Router();

router.use(verifyToken);

router.get('/', designationController.list);

router.post(
  '/',
  authorizeRoles('admin', 'hr'),
  [body('title').trim().notEmpty().withMessage('Designation title is required')],
  validate,
  designationController.create
);

router.put(
  '/:id',
  authorizeRoles('admin', 'hr'),
  [body('title').trim().notEmpty().withMessage('Designation title is required')],
  validate,
  designationController.update
);

router.delete('/:id', authorizeRoles('admin'), designationController.remove);

module.exports = router;