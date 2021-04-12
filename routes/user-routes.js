const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');

const userController = require('../controllers/user-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:uid', userController.getUserById);

router.post(
  '/signup',
  fileUpload('uploads/images/userIcon').single('icon'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  userController.signup
);

router.post('/login', multer().none(), userController.login);

module.exports = router;