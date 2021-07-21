const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Creating a Schema for new User
const usersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter a Display Name'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  }, 
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  }
});

// Hashing the password before saving to database
usersSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.pre('updateOne', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Login method for a user
usersSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email});
  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("email not registered");
}

const users = mongoose.model("users", usersSchema);

module.exports = users;
