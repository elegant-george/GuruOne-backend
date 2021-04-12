const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  icon: { type: String },
  comments: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Comment' }],
  restaurants: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Restaurant' }],
  average : {type: Number, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);