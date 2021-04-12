const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Comment = require('../models/comment');


const createComment = async (req, res, next) => {

  const restaurantId = req.params.rid;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const author = req.userData.userId;

  const { description, score } = req.body;

  let pictures;
  if (req.files.pictures) {
    pictures = req.files.pictures.map(i => i.location);
  };

  const createdComment = new Comment({
    author: author, restaurant: restaurantId, score, description, pictures
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating comment failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  let restaurant;
  try {
    restaurant = await Restaurant.findById(restaurantId);
  } catch (err) {
    const error = new HttpError(
      'Creating comment failed, please try again.',
      500
    );
    return next(error);
  }

  if (!restaurant) {
    const error = new HttpError('Could not find restaurant for provided id.', 404);
    return next(error);
  }

  user.average = (user.average * user.comments.length + parseInt(score)) / (user.comments.length + 1);
  restaurant.average = (restaurant.average * restaurant.comments.length + parseInt(score)) / (restaurant.comments.length + 1);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess }).catch(err => console.log(err));
    user.comments.push(createdComment);
    await user.save({ session: sess });
    restaurant.comments.push(createdComment);
    await restaurant.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating restaurant failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ comment: createdComment });
};


exports.createComment = createComment;