const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  owner:{type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  name: { type: String, required: true },
  district: {type: String, required: true},
  address: { type: String, required: true},
  contact: { type: String, required: true},
  about: { type: String},
  coverPhoto: { type: String },
  menu: {type: [String]},
  pictures: {type: [String]},
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  average : {type: Number, required: true}
});

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurant', restaurantSchema);