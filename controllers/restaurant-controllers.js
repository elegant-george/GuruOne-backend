const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

const getRestaurantsByDistrict = async (req, res, next) => {
  const district = req.params.district;
  let restaurants;
  try {
    restaurants = await Restaurant.find({district: district});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong',
      500
    );
    return next(error);
  }

  res.json({ restaurants: restaurants.map(restaurant => restaurant.toObject({ getters: true })) });
};


const getRestaurantsById = async (req, res, next) => {
  const rid = req.params.rid;
  let restaurant;
  try {
    restaurant = await Restaurant.findById(rid).populate({path:'comments',
                                                          populate: {path: 'author', select: ["icon", "name"]}});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong',
      500
    );
    return next(error);
  }

  if (!restaurant) {
    return next(
      new HttpError('Could not find restaurant for the provided restaurant id.', 404)
    );
  }

  res.json({restaurant: restaurant.toObject({getters: true})});
};


const createRestaurant = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  let coverPhoto;
  if (req.files.coverPhoto) {
     coverPhoto = req.files.coverPhoto.map(i => i.path)[0];
  }

  let menu;
  if (req.files.menu) {
    menu = req.files.menu.map(i => i.path);
  };

  let pictures;
  if (req.files.pictures) {
    pictures = req.files.pictures.map(i => i.path);
  };

  const owner = req.userData.userId;

  const { name, district, address, contact, about } = req.body;

  const createdRestaurant = new Restaurant({
    owner, name, district, address, contact,
    about, coverPhoto, menu, pictures,
    average: -1
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating restaurant failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdRestaurant.save({ session: sess }).catch(err => console.log(err));
    user.restaurants.push(createdRestaurant);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating restaurant failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ restaurant: createdRestaurant });
};

exports.getRestaurantsByDistrict = getRestaurantsByDistrict;
exports.getRestaurantsById = getRestaurantsById;
exports.createRestaurant = createRestaurant;