const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const commentController = require('../controllers/comment-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.use(checkAuth);

router.post(
  '/add/:rid',
  fileUpload('uploads/images/comment').fields([{name: 'pictures'}]),
  [
    check('score')
      .isIn([1, 2, 3, 4, 5])
  ],
  commentController.createComment
);

module.exports = router;