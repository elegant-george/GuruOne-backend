const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const restaurantController = require('../controllers/restaurant-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:district', restaurantController.getRestaurantsByDistrict);
router.get('/:district/:rid', restaurantController.getRestaurantsById);
router.use(checkAuth);

router.post(
  '/add',
  fileUpload('uploads/images/restaurant').fields([{name: 'coverPhoto'}, {name: 'menu'}, {name: 'pictures'}]),
  [
    check('name')
      .not()
      .isEmpty(),
    check('contact')
      .not()
      .isEmpty(),
    check('address')
      .not()
      .isEmpty(),
  ],
  restaurantController.createRestaurant
);

module.exports = router;