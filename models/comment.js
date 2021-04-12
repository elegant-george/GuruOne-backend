const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author:{ type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  restaurant:{ type: mongoose.Types.ObjectId, required: true, ref: 'Restaurant'},
  score: {type: Number, required: true},
  description: { type: String},
  pictures: {type: [String]},
});

commentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Comment', commentSchema);