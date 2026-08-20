const express = require('express');
const rateLimit = require('express-rate-limit');
const {body} = require('express-validator');

const validate = require('../middleware/validate');
const authController = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    limit: 20,
    message: {message: 'Too many attempts , Try again later'},
});

router.post('/register', authLimiter,   [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'hr', 'employee']).withMessage('Invalid role'),
  ], validate , authController.register);


  router.post('/login', authLimiter,  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ], validate , authController.login)

  module.exports = router;